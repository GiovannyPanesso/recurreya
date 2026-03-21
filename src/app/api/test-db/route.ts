import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("multas").select("count").limit(1);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: "Conexión con Supabase correcta",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 },
    );
  }
}
