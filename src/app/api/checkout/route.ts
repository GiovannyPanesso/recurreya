import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { multaId } = await req.json();

    if (!multaId) {
      return NextResponse.json({ error: "multaId requerido" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verificar que la multa existe y no está ya pagada
    const { data: multa, error } = await supabase
      .from("multas")
      .select("id, email, numero_expediente, estado")
      .eq("id", multaId)
      .single();

    if (error || !multa) {
      return NextResponse.json(
        { error: "Multa no encontrada" },
        { status: 404 },
      );
    }

    if (multa.estado === "pagado" || multa.estado === "documento_generado") {
      return NextResponse.json(
        { error: "Esta multa ya ha sido pagada" },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: multa.email,
      metadata: {
        multaId: multa.id,
        numero_expediente: multa.numero_expediente,
      },
      success_url: `${appUrl}/multa/resultado?id=${multaId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/multa/analisis?id=${multaId}`,
    });

    // Guardar el session_id en Supabase
    await supabase
      .from("multas")
      .update({ stripe_session_id: session.id })
      .eq("id", multaId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 },
    );
  }
}
