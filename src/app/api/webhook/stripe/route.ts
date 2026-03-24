import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const multaId = session.metadata?.multaId;

      if (multaId) {
        const supabase = createAdminClient();

        // Actualizar estado a pagado
        await supabase
          .from("multas")
          .update({ estado: "pagado" })
          .eq("id", multaId);

        console.log(`✅ Pago confirmado para multa ${multaId}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
