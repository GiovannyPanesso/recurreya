import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ZBE_MADRID_NORMATIVA = `
NORMATIVA ZBE MADRID — ACTUALIZADA A MARZO 2026

1. ESTRUCTURA DE ZONAS EN MADRID

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
- Durante este período deben recibir COMUNICACIÓN
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

5. ARGUMENTOS DE RECURSO ZBE POR ORDEN DE SOLIDEZ

1. PERÍODO DE AVISO: vehículo en moratoria que recibió
   multa en vez de comunicación informativa → nulidad
2. ERROR OCR: matrícula incorrecta → nulidad
3. CLASIFICACIÓN INCORRECTA: etiqueta B/C/ECO/CERO
   pero sancionado → nulidad
4. FALTA DE SEÑALIZACIÓN: acceso sin señalización
   ZBE visible → defecto de forma
5. FALTA DE CERTIFICADO DEL DISPOSITIVO: no consta
   verificación cámara OCR → solicitar en recurso
6. DEFECTO DE NOTIFICACIÓN: notificación incorrecta
   o fuera de plazo → caducidad
7. EXCEPCIÓN NO RECONOCIDA: TEPMR, histórico,
   emergencias dado de alta pero sancionado → nulidad

6. PREGUNTAS CLAVE

P1: ¿Clasificación ambiental? Si no es A → multa errónea
P2: ¿Zona exacta? → cambia grave vs leve
P3: ¿Empadronado Madrid antes 1 enero 2022?
    Si sí y recibió multa en 2025-2026 → argumento sólido
P4: ¿Matrícula coincide exactamente? → error OCR → nulidad
P5: ¿Había señalización visible? → defecto de forma
P6: ¿Consta certificado cámara OCR? → si no → solicitarlo

7. ÓRGANO COMPETENTE

Área de Gobierno de Movilidad — Ayuntamiento de Madrid
(NO es competencia de la DGT)
`;

const SYSTEM_PROMPT = `Eres un abogado especialista en derecho administrativo sancionador de tráfico en España con 15 años de experiencia en recursos de multas. Tienes un conocimiento exhaustivo de:

- Ley de Seguridad Vial (RDLeg 6/2015)
- Reglamento General de Circulación (RD 1428/2003)
- Ley 39/2015 de Procedimiento Administrativo Común
- Normativa metrológica de cinemómetros (ITM de Cinemómetros)
- Ordenanza de Movilidad Sostenible de Madrid (2018, modificada 2025)
- Jurisprudencia de tribunales contencioso-administrativos españoles

PRINCIPIOS IRRENUNCIABLES:
1. NUNCA inventes argumentos que no están respaldados por los datos del expediente
2. NUNCA alegues defecto de tipificación si el artículo infringido está claramente indicado
3. NUNCA alegues que no se aplicó tolerancia si el expediente indica que sí se aplicó
4. Si no hay argumentos sólidos, dilo claramente — es más honesto y profesional
5. Los argumentos débiles o incorrectos restan credibilidad al recurso completo
6. Prioriza siempre los argumentos más sólidos sobre los más numerosos`;

const ANALYSIS_PROMPT = `${SYSTEM_PROMPT}

Analiza el expediente de multa que te proporciono y devuelve ÚNICAMENTE el siguiente JSON, sin texto adicional, sin markdown, sin explicaciones:

{
  "valoracion": "debil|moderada|solida|alta",
  "num_argumentos": 0,
  "resumen_interno": "descripción técnica detallada de los argumentos encontrados para usar después en la generación del escrito"
}

CRITERIOS DE VALORACIÓN ESTRICTOS:
- "debil": No hay argumentos reales o los existentes son fácilmente rebatibles
- "moderada": 1 argumento alegable con base legal pero no definitivo
- "solida": 2 o más argumentos con base legal sólida
- "alta": Defecto crítico que suele ser motivo de anulación automática

ARGUMENTOS VÁLIDOS POR TIPO DE MULTA:

VELOCIDAD POR RADAR:
✓ Velocidad corregida (tras margen de error) ≤ límite → multa nula
  - Radar fijo: resta 5 km/h o 5% (el mayor)
  - Radar móvil: resta 7 km/h o 7% (el mayor)
  ⚠️ IMPORTANTE: Si el expediente indica tolerancia_aplicada=true,
  la Administración ya aplicó el margen. Este argumento es más débil
  pero sigue siendo alegable si no queda acreditado en el expediente.
✓ Certificado metrológico no vigente en la fecha de la infracción
✓ Defecto de notificación (bajo limpiaparabrisas)
✗ NO alegues defecto de tipificación si articulo_infringido está presente

SEMÁFORO EN ROJO:
✓ Foto no nítida o matrícula no identificable claramente
✓ Número de serie del aparato no consta → solicitar certificado
✓ Defecto de notificación

ESTACIONAMIENTO:
✓ Ausencia de señalización visible
✓ Defecto de forma en la notificación
✓ Error en la identificación del vehículo

MÓVIL / CINTURÓN:
✓ Único agente → la palabra de un solo agente puede ser insuficiente
✓ El conductor no fue identificado en el momento
✓ Denuncia no firmada → irregularidad procedimental

ZBE MADRID:
[Aplica la normativa ZBE completa proporcionada en el expediente]`;

async function analyzeWithGroq(expediente: string): Promise<string> {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 512,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\nEXPEDIENTE:\n${expediente}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}

async function analyzeWithAnthropic(expediente: string): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\nEXPEDIENTE:\n${expediente}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { multaId } = body;

    if (!multaId) {
      return NextResponse.json({ error: "multaId requerido" }, { status: 400 });
    }

    const supabase = createAdminClient();

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
      tolerancia_aplicada: multa.tolerancia_aplicada,
    };

    const expedienteJson = JSON.stringify(expediente, null, 2);
    const expedienteConNormativa =
      expediente.tipo_multa === "zbe_madrid"
        ? `${expedienteJson}\n\nNORMATIVA APLICABLE:\n${ZBE_MADRID_NORMATIVA}`
        : expedienteJson;

    const provider = process.env.AI_PROVIDER ?? "groq";
    console.log(`🔍 ANÁLISIS con: ${provider}`);
    let rawText: string;

    if (provider === "anthropic") {
      rawText = await analyzeWithAnthropic(expedienteConNormativa);
    } else {
      rawText = await analyzeWithGroq(expedienteConNormativa);
    }

    const clean = rawText.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

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
