import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    // Obtener IP para consentimiento RGPD
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { data, error } = await supabase
      .from("multas")
      .insert({
        // Notificación
        numero_expediente: body.numero_expediente,
        fecha_hecho: body.fecha_hecho,
        fecha_notificacion: body.fecha_notificacion,
        tipo_notificacion: body.tipo_notificacion,
        es_primera_notificacion: body.es_primera_notificacion,
        ya_pagada: body.ya_pagada,

        // Vehículo
        matricula: body.matricula,
        marca_modelo: body.marca_modelo,
        color_vehiculo: body.color_vehiculo,
        lugar_infraccion: body.lugar_infraccion,
        tipo_via: body.tipo_via,
        organismo_emisor: body.organismo_emisor,

        // Infracción
        tipo_multa: body.tipo_multa,
        importe_multa: body.importe_multa,
        puntos_sancion: body.puntos_sancion ?? 0,
        articulo_infringido: body.articulo_infringido,
        tolerancia_aplicada: body.tolerancia_aplicada,

        // Campos específicos
        velocidad_detectada: body.velocidad_detectada,
        velocidad_limite: body.velocidad_limite,
        tipo_radar: body.tipo_radar,
        numero_agente: body.numero_agente,
        zona_zbe: body.zona_zbe,
        clasificacion_ambiental: body.clasificacion_ambiental,
        empadronado_madrid_antes_2022: body.empadronado_madrid_antes_2022,
        matricula_coincide: body.matricula_coincide,
        medio_prueba: body.medio_prueba,
        numero_serie_aparato: body.numero_serie_aparato,

        // Conductor
        nombre_completo: body.nombre_completo,
        dni: body.dni,
        direccion: body.direccion,
        email: body.email,

        // Consentimientos
        acepto_privacidad: body.acepto_privacidad,
        acepto_tratamiento_datos: body.acepto_tratamiento_datos,
        acepto_no_abogados: body.acepto_no_abogados,
        ip_consentimiento: ip,
        fecha_consentimiento: new Date().toISOString(),

        estado: "pendiente_analisis",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error guardando multa:", error);
    return NextResponse.json(
      { error: "Error al guardar el expediente" },
      { status: 500 },
    );
  }
}
