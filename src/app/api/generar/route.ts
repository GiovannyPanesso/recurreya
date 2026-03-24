import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { EscritoPDF } from "@/lib/pdf/EscritoPDF";
import { addDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { sendEscritoEmail } from "@/lib/email/sendEmail";

const ZBE_MADRID_NORMATIVA = `
NORMATIVA ZBE MADRID — ACTUALIZADA A MARZO 2026

A) Madrid ZBE — Todo el término municipal
   - Vehículos prohibidos: clasificación ambiental A
   - Infracción GRAVE — Art. 76.z3 RDLeg 6/2015

B) ZBEDEP Distrito Centro / Plaza Elíptica
   - Infracción LEVE — Art. 23.4 y 24.4 Ordenanza

MORATORIA 2025-2026:
- Vehículos A con empadronamiento Madrid antes 1/1/2022
  deben recibir comunicación informativa, NO multa
- Si recibieron multa → nulidad del procedimiento

ARGUMENTOS POR ORDEN DE SOLIDEZ:
1. Período de aviso incumplido → nulidad
2. Error OCR en matrícula → nulidad
3. Clasificación ambiental incorrecta → nulidad
4. Falta de señalización ZBE → defecto de forma
5. Sin certificado del dispositivo → solicitar
6. Defecto de notificación → caducidad
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
4. Si no hay argumentos sólidos, redacta un escrito honesto con los argumentos disponibles
5. Los argumentos débiles o incorrectos restan credibilidad al recurso completo
6. Prioriza siempre los argumentos más sólidos sobre los más numerosos
7. El escrito debe ser formal, profesional y directamente presentable ante la Administración`;

const ESCRITO_PROMPT = `${SYSTEM_PROMPT}

Redacta un escrito de recurso de reposición formal y completo basándote en el expediente y el análisis previo.

REGLAS OBLIGATORIAS:

1. MÁRGENES DE ERROR (multas de velocidad):
   - Radar fijo: resta 5 km/h o 5% (el mayor)
   - Radar móvil: resta 7 km/h o 7% (el mayor)
   - Si velocidad corregida ≤ límite → multa nula, indicarlo expresamente
   - Si tolerancia_aplicada=true: no afirmes que no se aplicó tolerancia.
     En su lugar alega que no queda acreditado en el expediente si la
     velocidad notificada es bruta o ya corregida → principio in dubio pro reo

2. CERTIFICADO METROLÓGICO:
   Si el medio de prueba es radar o cámara → solicitar siempre el
   certificado de verificación metrológica vigente en la fecha de infracción

3. ARTÍCULO INFRINGIDO:
   - Si articulo_infringido está presente → NO alegues defecto de tipificación
   - En su lugar, verifica que el artículo corresponde con los hechos descritos
   - Si no corresponde → alega indefensión (Art. 35 Ley 39/2015)

4. CARGA DE LA PRUEBA:
   La Administración debe acreditar:
   - Que la medición es correcta y el margen fue aplicado
   - Que el equipo estaba calibrado y con certificado vigente
   - Que la identificación del vehículo es inequívoca
   Alega siempre este principio como fundamento complementario

5. NOTIFICACIÓN:
   Si fue bajo el limpiaparabrisas → alegar defecto de notificación,
   el plazo de 20 días podría no haber comenzado

6. ORGANISMO:
   - DGT → recurso ante Director Provincial de Tráfico
   - Ayuntamiento → alegaciones ante órgano instructor municipal
   - CCAA → adaptar normativa autonómica

NORMATIVA QUE APLICAS:
- Ley de Seguridad Vial (RDLeg 6/2015)
- Reglamento General de Circulación (RD 1428/2003)
- Ley 39/2015 de Procedimiento Administrativo Común
- Normativa metrológica de cinemómetros
- Constitución Española (Art. 24 — derecho a la defensa)
- Constitución Española (Art. 25 — principio de tipicidad)

ESTRUCTURA OBLIGATORIA DEL ESCRITO:
1. Encabezado formal con datos del expediente y órgano destinatario
2. Identificación del recurrente (nombre, DNI, domicilio)
3. Antecedentes de hecho (numerados)
4. Fundamentos de derecho (numerados, con artículos concretos)
5. Solicitud expresa de anulación o archivo
6. Otrosí (solicitud de diligencias si procede)
7. Lugar, fecha y firma

Devuelve ÚNICAMENTE el texto del escrito, sin markdown, sin explicaciones.
El texto debe estar listo para presentar directamente ante la Administración.`;

async function generateWithGroq(
  expediente: string,
  resumenInterno: string,
): Promise<string> {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `${ESCRITO_PROMPT}\n\nEXPEDIENTE:\n${expediente}\n\nANÁLISIS PREVIO:\n${resumenInterno}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}

async function generateWithAnthropic(
  expediente: string,
  resumenInterno: string,
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${ESCRITO_PROMPT}\n\nEXPEDIENTE:\n${expediente}\n\nANÁLISIS PREVIO:\n${resumenInterno}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function POST(req: NextRequest) {
  try {
    const { multaId } = await req.json();

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

    if (multa.estado !== "pagado") {
      return NextResponse.json(
        { error: "El pago no ha sido confirmado" },
        { status: 403 },
      );
    }

    if (multa.documento_url) {
      return NextResponse.json({ documentoUrl: multa.documento_url });
    }

    const expediente = JSON.stringify(
      {
        tipo_multa: multa.tipo_multa,
        fecha_hecho: multa.fecha_hecho,
        fecha_notificacion: multa.fecha_notificacion,
        tipo_notificacion: multa.tipo_notificacion,
        lugar_infraccion: multa.lugar_infraccion,
        organismo_emisor: multa.organismo_emisor,
        matricula: multa.matricula,
        marca_modelo: multa.marca_modelo,
        velocidad_detectada: multa.velocidad_detectada,
        velocidad_limite: multa.velocidad_limite,
        tipo_radar: multa.tipo_radar,
        zona_zbe: multa.zona_zbe,
        clasificacion_ambiental: multa.clasificacion_ambiental,
        empadronado_madrid_antes_2022: multa.empadronado_madrid_antes_2022,
        matricula_coincide: multa.matricula_coincide,
        medio_prueba: multa.medio_prueba,
        numero_serie_aparato: multa.numero_serie_aparato,
        importe_multa: multa.importe_multa,
        puntos_sancion: multa.puntos_sancion,
        nombre_completo: multa.nombre_completo,
        dni: multa.dni,
        direccion: multa.direccion,
        numero_expediente: multa.numero_expediente,
        articulo_infringido: multa.articulo_infringido,
        tolerancia_aplicada: multa.tolerancia_aplicada,
      },
      null,
      2,
    );

    const expedienteConNormativa =
      multa.tipo_multa === "zbe_madrid"
        ? `${expediente}\n\nNORMATIVA APLICABLE:\n${ZBE_MADRID_NORMATIVA}`
        : expediente;

    const provider = process.env.AI_PROVIDER ?? "groq";
    let escritoTexto: string;

    if (provider === "anthropic") {
      escritoTexto = await generateWithAnthropic(
        expedienteConNormativa,
        multa.resumen_interno ?? "",
      );
    } else {
      escritoTexto = await generateWithGroq(
        expedienteConNormativa,
        multa.resumen_interno ?? "",
      );
    }

    const fechaLimite = format(
      addDays(parseISO(multa.fecha_notificacion), 20),
      "d 'de' MMMM 'de' yyyy",
      { locale: es },
    );

    const organismoTexto: Record<string, string> = {
      dgt: "Dirección General de Tráfico — Jefatura Provincial",
      ayuntamiento: "Departamento de Instrucción de Multas — Ayuntamiento",
      ccaa: "Organismo competente de la Comunidad Autónoma",
    };

    const pdfBuffer = await renderToBuffer(
      React.createElement(EscritoPDF, {
        escrito: escritoTexto,
        nombreCompleto: multa.nombre_completo,
        dni: multa.dni,
        direccion: multa.direccion,
        numeroExpediente: multa.numero_expediente,
        fechaLimite,
        organismo:
          organismoTexto[multa.organismo_emisor] ?? multa.organismo_emisor,
      }) as unknown as React.ReactElement<Record<string, unknown>>,
    );

    const fileName = `recurso_${multa.numero_expediente.replace(/\//g, "-")}_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: signedUrl } = await supabase.storage
      .from("documentos")
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);

    const documentoUrl = signedUrl?.signedUrl ?? "";

    await supabase
      .from("multas")
      .update({
        estado: "documento_generado",
        documento_url: documentoUrl,
      })
      .eq("id", multaId);

    try {
      await sendEscritoEmail({
        to: multa.email,
        nombreCompleto: multa.nombre_completo,
        numeroExpediente: multa.numero_expediente,
        fechaLimite,
        organismo: multa.organismo_emisor,
        documentoUrl,
      });
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
    }

    return NextResponse.json({ documentoUrl });
  } catch (error) {
    console.error("Error generando escrito:", error);
    return NextResponse.json(
      { error: "Error al generar el escrito" },
      { status: 500 },
    );
  }
}
