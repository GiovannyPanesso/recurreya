export default function AvisoLegalPage() {
  return (
    <div className="space-y-8 text-slate-300">
      <div>
        <h1 className="text-3xl font-bold text-white">Aviso Legal</h1>
        <p className="mt-2 text-sm text-slate-500">
          Última actualización: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          1. Titular del servicio
        </h2>
        <p>
          RecurreYa es un servicio de redacción asistida por inteligencia
          artificial para la elaboración de escritos de recurso de multas de
          tráfico en España.
        </p>
        <p>
          Contacto:{" "}
          <a
            href="mailto:recurreya.info@gmail.com"
            className="text-blue-400 underline"
          >
            recurreya.info@gmail.com
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          2. Naturaleza del servicio
        </h2>
        <p>
          RecurreYa es una herramienta de redacción asistida. Los escritos
          generados son documentos elaborados mediante inteligencia artificial
          basados en los datos aportados por el usuario.
        </p>
        <p>
          <strong className="text-white">
            RecurreYa no es un despacho de abogados
          </strong>{" "}
          y no presta servicios de asesoría jurídica. El uso de este servicio no
          establece una relación abogado-cliente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          3. Exención de responsabilidad
        </h2>
        <p>
          RecurreYa no garantiza el resultado del recurso. La estimación de
          probabilidad de éxito es orientativa y no constituye asesoramiento
          jurídico. El resultado final depende de la valoración del órgano
          administrativo competente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Propiedad intelectual
        </h2>
        <p>
          Los textos, diseños y código fuente de RecurreYa están protegidos por
          derechos de propiedad intelectual. Los escritos generados para el
          usuario son de su propiedad una vez descargados.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Ley aplicable</h2>
        <p>
          Este servicio se rige por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales del
          domicilio del usuario.
        </p>
      </section>
    </div>
  );
}
