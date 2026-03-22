import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ZBE_MADRID_NORMATIVA = `
═══════════════════════════════════════════════════════
NORMATIVA ZBE MADRID — ACTUALIZADA A MARZO 2026
═══════════════════════════════════════════════════════

1. ESTRUCTURA DE ZONAS EN MADRID

Madrid tiene tres zonas diferenciadas:

A) Madrid ZBE — Todo el término municipal
   - Vehículos prohibidos: clasificación ambiental A
   - Excepciones: TEPMR, históricos, emergencias, FF.AA.
   - Control: cámaras OCR y foto-rojos automatizados

B) ZBEDEP Distrito Centro
   - Restricciones más severas que Madrid ZBE
   - Infracción LEVE (no grave) según Art. 23.4 Ordenanza

C) ZBEDEP Plaza Elíptica
   - Infracción LEVE (no grave) según Art. 24.4 Ordenanza

2. MORATORIA VIGENTE A 2026 — CRÍTICO

Período de aviso activo: 1 enero 2025 — 31 diciembre 2026
- Titulares de vehículos clasificación A que NO tenían
  prohibida la circulación antes del 1 enero 2025
- Durante este período: deben recibir COMUNICACIÓN
  INFORMATIVA, no multa sancionadora
- Si recibieron multa en vez de aviso → defecto
  procedimental → argumento SÓLIDO de recurso

Vehículos que SÍ se sancionan desde 1 enero 2025:
- Clasificación A sin empadronamiento/IVTM Madrid
  antes del 1 enero 2022

3. CLASIFICACIÓN AMBIENTAL

Vehículo A (sin etiqueta DGT):
- Gasolina matriculado ANTES de 2000
- Diésel matriculado ANTES de 2006

Vehículos PERMITIDOS: etiqueta B, C, ECO o CERO

4. RÉGIMEN SANCIONADOR

- Norma: Art. 76.z3 RDLeg 6/2015
- Tipo: infracción GRAVE (ZBE general) / LEVE (ZBEDEP)
- Sanción: 200€ (100€ con pronto pago)
- No resta puntos

5. ARGUMENTOS DE RECURSO ZBE (por orden de solidez)

1. PERÍODO DE AVISO: vehículo en moratoria que recibió
   multa en vez de comunicación informativa → nulidad

2. ERROR OCR: matrícula incorrecta en la notificación
   → nulidad por error en el sujeto infractor

3. CLASIFICACIÓN INCORRECTA: el vehículo tiene etiqueta
   B, C, ECO o CERO pero fue sancionado → nulidad

4. FALTA DE SEÑALIZACIÓN: acceso sin señalización ZBE
   visible → defecto de forma alegable

5. FALTA DE CERTIFICADO DEL DISPOSITIVO: no consta
   verificación de la cámara OCR → solicitar en recurso

6. DEFECTO DE NOTIFICACIÓN: notificación incorrecta
   o fuera de plazo → caducidad del procedimiento

7. EXCEPCIÓN NO RECONOCIDA: TEPMR, histórico,
   emergencias dado de alta pero sancionado → nulidad

6. PREGUNTAS CLAVE A DETECTAR

P1: ¿Clasificación ambiental? Si no es A → multa errónea
P2: ¿Zona exacta? → cambia grave vs leve
P3: ¿Empadronado Madrid antes 1 enero 2022?
    → Si sí y recibió multa en 2025-2026 → argumento sólido
P4: ¿Matrícula coincide exactamente? → error OCR → nulidad
P5: ¿Había señalización visible? → defecto de forma
P6: ¿Consta certificado cámara OCR? → si no → solicitarlo

7. ÓRGANO COMPETENTE

Área de Gobierno de Movilidad — Ayuntamiento de Madrid
(NO es competencia de la DGT)
`;

const ANALYSIS_PROMPT = `Eres un abogado especialista en derecho administrativo sancionador de tráfico en España con 15 años de experiencia.

Analiza el expediente y devuelve ÚNICAMENTE este JSON, sin texto adicional, sin markdown:
{
  "valoracion": "debil|moderada|solida|alta",
  "num_argumentos": 0,
  "resumen_interno": "descripción técnica para generar el escrito después"
}

CRITERIOS DE VALORACIÓN:
- "debil": No hay argumentos reales. La multa parece correcta en forma y fondo.
- "moderada": 1 argumento alegable pero no definitivo.
- "solida": 2 o más argumentos con base legal clara.
- "alta": Defecto crítico que suele ser motivo de anulación (error en matrícula, notificación defectuosa, radar sin certificado vigente, velocidad dentro del margen de error).

ARGUMENTOS QUE DEBES BUSCAR:
1. Multas de velocidad: ¿La velocidad corregida (restando margen de error) supera realmente el límite?
   - Radar fijo: resta 5 km/h o 5% (el mayor)
   - Radar móvil: resta 7 km/h o 7% (el mayor)
2. ¿El certificado metrológico del radar está vigente en la fecha de la infracción?
3. ¿Hubo defecto de notificación? (bajo limpiaparabrisas = plazo no iniciado)
4. ¿El artículo infringido corresponde con los hechos descritos?
5. ¿Hay error en la matrícula?
6. ZBE: ¿La clasificación ambiental impide realmente la circulación en esa zona?

Sé honesto: si no hay argumentos reales, devuelve "debil". No inventes argumentos.`;

async function analyzeWithAnthropic(expedienteJson: string): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\nEXPEDIENTE:\n${expedienteJson}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

async function analyzeWithGemini(expedienteJson: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    `${ANALYSIS_PROMPT}\n\nEXPEDIENTE:\n${expedienteJson}`,
  );
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { multaId } = body;

    if (!multaId) {
      return NextResponse.json({ error: "multaId requerido" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Obtener la multa de Supabase
    const { data: multa, error } = await supabase
      .from("multas")
      .select("*")
      .eq("id", multaId)
      .single();

    if (error || !multa) {
      return NextResponse.json(
        { error: "Multa no encontrada" },
        { status: 404 },
      );
    }

    // Preparar el expediente para la IA (sin datos personales)
    const expediente = {
      tipo_multa: multa.tipo_multa,
      fecha_hecho: multa.fecha_hecho,
      fecha_notificacion: multa.fecha_notificacion,
      tipo_notificacion: multa.tipo_notificacion,
      es_primera_notificacion: multa.es_primera_notificacion,
      lugar_infraccion: multa.lugar_infraccion,
      tipo_via: multa.tipo_via,
      organismo_emisor: multa.organismo_emisor,
      matricula: multa.matricula,
      velocidad_detectada: multa.velocidad_detectada,
      velocidad_limite: multa.velocidad_limite,
      tipo_radar: multa.tipo_radar,
      numero_agente: multa.numero_agente,
      zona_zbe: multa.zona_zbe,
      clasificacion_ambiental: multa.clasificacion_ambiental,
      empadronado_madrid_antes_2022: multa.empadronado_madrid_antes_2022,
      matricula_coincide: multa.matricula_coincide,
      medio_prueba: multa.medio_prueba,
      numero_serie_aparato: multa.numero_serie_aparato,
      importe_multa: multa.importe_multa,
      puntos_sancion: multa.puntos_sancion,
      articulo_infringido: multa.articulo_infringido,
    };

    const expedienteJson = JSON.stringify(expediente, null, 2);
    const expedienteConNormativa =
      expediente.tipo_multa === "zbe_madrid"
        ? `${expedienteJson}\n\nNORMATIVA APLICABLE:\n${ZBE_MADRID_NORMATIVA}`
        : expedienteJson;

    const provider = process.env.AI_PROVIDER ?? "gemini";
    let rawText: string;

    if (provider === "anthropic") {
      rawText = await analyzeWithAnthropic(expedienteConNormativa);
    } else {
      rawText = await analyzeWithGemini(expedienteConNormativa);
    }

    // Parsear respuesta
    const clean = rawText.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Guardar resultado en Supabase
    await supabase
      .from("multas")
      .update({
        valoracion_ia: result.valoracion,
        num_argumentos: result.num_argumentos,
        resumen_interno: result.resumen_interno,
        estado: "analizado",
      })
      .eq("id", multaId);

    return NextResponse.json({
      valoracion: result.valoracion,
      num_argumentos: result.num_argumentos,
    });
  } catch (error) {
    console.error("Error en análisis:", error);
    return NextResponse.json(
      { error: "Error al analizar el expediente" },
      { status: 500 },
    );
  }
}
