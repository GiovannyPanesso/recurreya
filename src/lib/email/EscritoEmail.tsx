import * as React from "react";

interface EscritoEmailProps {
  nombreCompleto: string;
  numeroExpediente: string;
  fechaLimite: string;
  organismo: string;
  documentoUrl: string;
}

const instruccionesPorOrganismo: Record<string, string> = {
  dgt: `1. 💻 Sede electrónica (recomendado)
   sede.dgt.gob.es → Trámites → Recursos y alegaciones
   Necesitas: DNI electrónico o Cl@ve PIN

2. 📮 Correo certificado
   Jefatura Provincial de Tráfico de tu provincia
   (Guarda el resguardo como justificante)`,

  ayuntamiento: `1. 💻 Sede electrónica (recomendado)
   www.madrid.es/multas → Registro electrónico
   Necesitas: DNI electrónico o Cl@ve PIN

2. 📮 Correo certificado
   Área de Gobierno de Movilidad
   Plaza de la Villa 4, 28005 Madrid
   (Guarda el resguardo como justificante)

3. 🏢 En persona
   Oficinas de atención al ciudadano Línea Madrid
   Lunes a viernes 9:00 - 14:00`,

  ccaa: `1. 🏢 Registro del organismo
   Presenta en el registro del organismo que emitió la multa
   o en su sede electrónica si dispone de ella

2. 📮 Correo certificado
   Envía a la dirección del organismo emisor
   indicada en la notificación
   (Guarda el resguardo como justificante)`,
};

export function EscritoEmail({
  nombreCompleto,
  numeroExpediente,
  fechaLimite,
  organismo,
  documentoUrl,
}: EscritoEmailProps) {
  const instrucciones =
    instruccionesPorOrganismo[organismo] ?? instruccionesPorOrganismo.ccaa;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          margin: 0,
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#0d1530",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}>
              Recurre<span style={{ color: "#3b82f6" }}>Ya</span>
            </h1>
            <p
              style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: "14px" }}
            >
              Tu escrito de recurso está listo
            </p>
          </div>

          {/* Contenido */}
          <div style={{ padding: "30px" }}>
            <p style={{ fontSize: "16px", color: "#1a1a1a" }}>
              Hola <strong>{nombreCompleto}</strong>,
            </p>
            <p style={{ color: "#444", lineHeight: "1.6" }}>
              Tu escrito de recurso para el expediente{" "}
              <strong>{numeroExpediente}</strong> está listo. Puedes descargarlo
              haciendo clic en el botón de abajo.
            </p>

            {/* Botón descarga */}
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <a
                href={documentoUrl}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "inline-block",
                }}
              >
                ⬇️ Descargar PDF
              </a>
            </div>

            {/* Plazo */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <p style={{ margin: 0, color: "#92400e", fontWeight: "bold" }}>
                ⏰ Tienes hasta el {fechaLimite} para presentarlo
              </p>
            </div>

            {/* Instrucciones */}
            <h3 style={{ color: "#1a1a1a", marginBottom: "12px" }}>
              📋 Cómo presentarlo:
            </h3>
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                padding: "16px",
                whiteSpace: "pre-line",
                fontSize: "14px",
                color: "#444",
                lineHeight: "1.8",
              }}
            >
              {instrucciones}
            </div>

            {/* Aviso legal */}
            <p
              style={{
                marginTop: "30px",
                fontSize: "12px",
                color: "#94a3b8",
                lineHeight: "1.6",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "16px",
              }}
            >
              RecurreYa — Te ayudamos a defenderte.
              <br />
              No somos abogados. No garantizamos el resultado.
              <br />
              El enlace de descarga expira en 7 días.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
