import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { EscritoPDF } from "@/lib/pdf/EscritoPDF";
import { addDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";

const ESCRITO_PROMPT = `Eres un abogado especialista en derecho administrativo sancionador de tráfico en España con 15 años de experiencia.
Redacta un escrito de recurso de reposición formal y completo basándote en el expediente y el análisis previo.

REGLAS OBLIGATORIAS:

1. MÁRGENES DE ERROR (multas de velocidad):
   - Radar fijo → resta 5 km/h o 5% (el mayor)
   - Radar móvil → resta 7 km/h o 7% (el mayor)
   - Si velocidad corregida ≤ límite → multa nula, indicarlo expresamente

2. CERTIFICADO METROLÓGICO:
   Si el medio de prueba es radar → incluir siempre párrafo solicitando
   certificado de verificación metrológica vigente en la fecha de la infracción

3. DEFECTOS DE FORMA:
   Verificar que el artículo citado corresponde con los hechos.
   Si no coincide → alegar indefensión (Art. 35 Ley 39/2015)

4. NOTIFICACIÓN:
   Si fue bajo el limpiaparabrisas → alegar defecto de notificación,
   el plazo de 20 días podría no haber comenzado

5. ORGANISMO:
   - DGT → recurso ante Director Provincial de Tráfico
   - Ayuntamiento → alegaciones ante órgano instructor municipal
   - CCAA → adaptar normativa autonómica

NORMATIVA QUE APLICAS:
- Ley de Seguridad Vial (RDLeg 6/2015)
- Reglamento General de Circulación (RD 1428/2003)
- Ley 39/2015 de Procedimiento Administrativo Común
- Normativa metrológica de cinemómetros

ESTRUCTURA DEL ESCRITO:
1. Encabezado formal con datos del expediente
2. Identificación del recurrente
3. Hechos
4. Fundamentos de derecho (citando artículos concretos)
5. Solicitud expresa de anulación
6. Otrosí si procede

Devuelve ÚNICAMENTE el texto del escrito, sin markdown, sin explicaciones adicionales.
El texto debe estar listo para copiar en un documento oficial.`;

async function generateWithAnthropic(
  expediente: string,
  resumenInterno: string,
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
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

async function generateWithGemini(
  expediente: string,
  resumenInterno: string,
): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    `${ESCRITO_PROMPT}\n\nEXPEDIENTE:\n${expediente}\n\nANÁLISIS PREVIO:\n${resumenInterno}`,
  );
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { multaId } = await req.json();

    if (!multaId) {
      return NextResponse.json({ error: "multaId requerido" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Obtener la multa
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

    // Verificar que está pagada
    if (multa.estado !== "pagado") {
      return NextResponse.json(
        { error: "El pago no ha sido confirmado" },
        { status: 403 },
      );
    }

    // Si ya tiene documento generado, devolver la URL existente
    if (multa.documento_url) {
      return NextResponse.json({ documentoUrl: multa.documento_url });
    }

    // Preparar expediente para la IA
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
        medio_prueba: multa.medio_prueba,
        numero_serie_aparato: multa.numero_serie_aparato,
        importe_multa: multa.importe_multa,
        puntos_sancion: multa.puntos_sancion,
        nombre_completo: multa.nombre_completo,
        dni: multa.dni,
        direccion: multa.direccion,
        numero_expediente: multa.numero_expediente,
      },
      null,
      2,
    );

    // Generar escrito con IA
    const provider = process.env.AI_PROVIDER ?? "gemini";
    let escritoTexto: string;

    if (provider === "anthropic") {
      escritoTexto = await generateWithAnthropic(
        expediente,
        multa.resumen_interno ?? "",
      );
    } else {
      escritoTexto = await generateWithGemini(
        expediente,
        multa.resumen_interno ?? "",
      );
    }

    // Calcular fecha límite
    const fechaLimite = format(
      addDays(parseISO(multa.fecha_notificacion), 20),
      "d 'de' MMMM 'de' yyyy",
      { locale: es },
    );

    // Mapear organismo a texto legible
    const organismoTexto: Record<string, string> = {
      dgt: "Dirección General de Tráfico — Jefatura Provincial",
      ayuntamiento: `Departamento de Instrucción de Multas — Ayuntamiento`,
      ccaa: "Organismo competente de la Comunidad Autónoma",
    };

    // Cambiar la llamada a renderToBuffer
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

    // Subir PDF a Supabase Storage
    const fileName = `recurso_${multa.numero_expediente.replace(/\//g, "-")}_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Obtener URL firmada (válida 7 días)
    const { data: signedUrl } = await supabase.storage
      .from("documentos")
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);

    const documentoUrl = signedUrl?.signedUrl ?? "";

    // Actualizar multa con URL del documento
    await supabase
      .from("multas")
      .update({
        estado: "documento_generado",
        documento_url: documentoUrl,
      })
      .eq("id", multaId);

    return NextResponse.json({ documentoUrl });
  } catch (error) {
    console.error("Error generando escrito:", error);
    return NextResponse.json(
      { error: "Error al generar el escrito" },
      { status: 500 },
    );
  }
}
