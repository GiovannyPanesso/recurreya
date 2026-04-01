import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

const EXTRACTION_PROMPT = `Eres un asistente especializado en analizar notificaciones de multas de tráfico españolas.
Analiza la imagen o documento y extrae todos los datos que puedas identificar.

Devuelve ÚNICAMENTE un JSON válido con esta estructura (omite los campos que no puedas identificar):
{
  "numero_expediente": "string",
  "fecha_hecho": "YYYY-MM-DDTHH:mm",
  "fecha_notificacion": "YYYY-MM-DD",
  "tipo_notificacion": "en_mano|bajo_limpiaparabrisas|correo_certificado|dev_sede_electronica",
  "tipo_multa": "velocidad_radar|semaforo_rojo|estacionamiento|movil_cinturon|zbe_madrid",
  "matricula": "string",
  "marca_modelo": "string",
  "color_vehiculo": "string",
  "lugar_infraccion": "string",
  "tipo_via": "urbana|interurbana",
  "organismo_emisor": "dgt|ayuntamiento|ccaa",
  "municipio_emisor": "municipio del Ayuntamiento que emite la multa (NO el municipio del domicilio del titular). Ej: Madrid, Barcelona, Fuenlabrada...",
  "velocidad_detectada": number,
  "velocidad_limite": number,
  "tipo_radar": "fijo|movil|tramo",
  "numero_agente": "string",
  "zona_zbe": "zbe_general|zbedep_distrito_centro|zbedep_plaza_eliptica",
  "clasificacion_ambiental": "A|B|C|ECO|CERO",
  "medio_prueba": "camara_ocr|agente|foto_rojo",
  "tolerancia_aplicada": true/false (busca el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLOGICO" — si aparece devuelve true, si no aparece devuelve false),
  "articulo_infringido": "artículo infringido tal como aparece en la notificación (ej: 76.A LSV)",
  "numero_serie_aparato": "string",
  "importe_multa": number,
  "puntos_sancion": number,
  "nombre_completo": "string",
  "dni": "string",
  "direccion": "string"
}

No incluyas markdown, no incluyas texto adicional. Solo el JSON.`;

async function extractWithAnthropic(fileBuffer: Buffer, mimeType: string) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const base64 = fileBuffer.toString("base64");

  // Para PDF usamos document, para imágenes usamos image
  const contentBlock =
    mimeType === "application/pdf"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mimeType as "image/jpeg" | "image/png" | "image/webp",
            data: base64,
          },
        };

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [contentBlock, { type: "text", text: EXTRACTION_PROMPT }],
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Espera un momento." },
        { status: 429 },
      );
    }
    // Validación de origen
    const origin = req.headers.get("origin");
    const allowedOrigins = [
      "http://localhost:3000",
      "https://recurreya.vercel.app",
      "https://recurreya.es",
      "https://www.recurreya.es",
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 },
      );
    }

    // Validar tipo
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 },
      );
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo supera los 10MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const rawText = await extractWithAnthropic(buffer, file.type);

    // Limpiar y parsear JSON
    const clean = rawText.replace(/```json|```/g, "").trim();
    const extracted = JSON.parse(clean);

    return NextResponse.json(extracted);
  } catch (error) {
    console.error("Error en extracción:", error);
    return NextResponse.json(
      {
        error:
          "No se pudieron extraer los datos. Introduce los datos manualmente.",
      },
      { status: 500 },
    );
  }
}
