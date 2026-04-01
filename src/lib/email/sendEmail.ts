import { Resend } from "resend";
import { EscritoEmail } from "./EscritoEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEscritoEmailParams {
  to: string;
  nombreCompleto: string;
  numeroExpediente: string;
  fechaLimite: string;
  organismo: string;
  documentoUrl: string;
}

export async function sendEscritoEmail(params: SendEscritoEmailParams) {
  const {
    to,
    nombreCompleto,
    numeroExpediente,
    fechaLimite,
    organismo,
    documentoUrl,
  } = params;

  const { data, error } = await resend.emails.send({
    from: "RecurreYa <noreply@recurreya.es>",
    to,
    subject: `Tu escrito de recurso listo — Exp. ${numeroExpediente}`,
    react: React.createElement(EscritoEmail, {
      nombreCompleto,
      numeroExpediente,
      fechaLimite,
      organismo,
      documentoUrl,
    }),
  });

  if (error) {
    console.error("Error enviando email:", error);
    throw error;
  }

  return data;
}
