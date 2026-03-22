import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("multas")
      .select(
        "fecha_notificacion, importe_multa, estado, organismo_emisor, nombre_completo, email, numero_expediente",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
