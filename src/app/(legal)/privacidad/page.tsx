export default function PrivacidadPage() {
  return (
    <div className="space-y-8 text-slate-300">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Última actualización: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          1. Responsable del tratamiento
        </h2>
        <p>
          El responsable del tratamiento de los datos personales recogidos a
          través de RecurreYa es el titular del servicio, contactable en{" "}
          <a
            href="mailto:recurreya.info@gmail.com"
            className="text-blue-400 underline"
          >
            recurreya.info@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          2. Datos que recogemos
        </h2>
        <p>
          Recogemos únicamente los datos necesarios para generar el escrito de
          recurso:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Datos identificativos: nombre completo, DNI, dirección y email
          </li>
          <li>Datos del vehículo: matrícula, marca, modelo y color</li>
          <li>
            Datos de la infracción: número de expediente, fecha, tipo de multa e
            importe
          </li>
          <li>Dirección IP en el momento de dar el consentimiento</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          3. Finalidad del tratamiento
        </h2>
        <p>
          Los datos se usan exclusivamente para generar el escrito de recurso
          personalizado. No se usan para marketing, perfilado ni entrenamiento
          de modelos de inteligencia artificial.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Base legal</h2>
        <p>
          El tratamiento se basa en el consentimiento explícito del usuario,
          otorgado mediante los checkboxes obligatorios antes del pago, de
          conformidad con el artículo 6.1.a del RGPD.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          5. Terceros que reciben datos
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-white">Supabase</strong> — almacenamiento de
            datos y documentos (servidores en la UE)
          </li>
          <li>
            <strong className="text-white">Stripe</strong> — procesamiento del
            pago (no recibe datos de la multa)
          </li>
          <li>
            <strong className="text-white">Anthropic</strong> — generación del
            escrito mediante IA (datos procesados según su política de
            privacidad)
          </li>
          <li>
            <strong className="text-white">Resend</strong> — envío del email con
            el documento
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          6. Retención de datos
        </h2>
        <p>
          Los datos se eliminan automáticamente a los 90 días desde su recogida.
          Los documentos generados se eliminan de nuestros servidores a los 7
          días. El usuario puede solicitar la eliminación anticipada enviando un
          email a{" "}
          <a
            href="mailto:recurreya.info@gmail.com"
            className="text-blue-400 underline"
          >
            recurreya.info@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          7. Derechos del usuario
        </h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión,
          portabilidad y oposición enviando un email a{" "}
          <a
            href="mailto:recurreya.info@gmail.com"
            className="text-blue-400 underline"
          >
            recurreya.info@gmail.com
          </a>
          . También puedes presentar una reclamación ante la Agencia Española de
          Protección de Datos (aepd.es).
        </p>
      </section>
    </div>
  );
}
