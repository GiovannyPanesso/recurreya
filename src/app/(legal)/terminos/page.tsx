export default function TerminosPage() {
  return (
    <div className="space-y-8 text-slate-300">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Términos y Condiciones
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Última actualización: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          1. Objeto del servicio
        </h2>
        <p>
          RecurreYa ofrece un servicio de redacción asistida por IA para la
          elaboración de escritos de recurso de multas de tráfico en España, por
          un precio único de <strong className="text-white">4,99€</strong> por
          expediente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          2. Condiciones de uso
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            El usuario declara que los datos proporcionados son verídicos y
            corresponden a una multa real recibida a su nombre.
          </li>
          <li>
            El servicio está disponible únicamente para multas de tráfico
            emitidas en España.
          </li>
          <li>El usuario debe ser mayor de edad para contratar el servicio.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          3. Pago y reembolsos
        </h2>
        <p>
          El pago de 4,99€ es único y no reembolsable una vez generado el
          documento. El análisis previo es siempre gratuito — el cargo solo se
          produce cuando el usuario decide continuar y completar el pago.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Limitación de responsabilidad
        </h2>
        <p>
          RecurreYa no garantiza el éxito del recurso. La herramienta genera
          escritos basados en la información aportada por el usuario. La
          decisión final corresponde al órgano administrativo competente.
        </p>
        <p>
          RecurreYa no se hace responsable de los perjuicios derivados de datos
          incorrectos aportados por el usuario, plazos vencidos o decisiones
          administrativas desfavorables.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Modificaciones</h2>
        <p>
          RecurreYa se reserva el derecho a modificar estos términos. Los
          cambios se comunicarán en esta página con la fecha de actualización.
        </p>
      </section>
    </div>
  );
}
