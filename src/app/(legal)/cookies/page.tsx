export default function CookiesPage() {
  return (
    <div className="space-y-8 text-slate-300">
      <div>
        <h1 className="text-3xl font-bold text-white">Política de Cookies</h1>
        <p className="mt-2 text-sm text-slate-500">
          Última actualización: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          1. ¿Qué son las cookies?
        </h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu
          dispositivo cuando visitas un sitio web.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          2. Cookies que usamos
        </h2>
        <p>
          RecurreYa usa únicamente cookies técnicas estrictamente necesarias
          para el funcionamiento del servicio:
        </p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-white">Cookie</th>
                <th className="px-4 py-3 text-left text-white">Finalidad</th>
                <th className="px-4 py-3 text-left text-white">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3">__stripe_mid</td>
                <td className="px-4 py-3">Prevención de fraude en pagos</td>
                <td className="px-4 py-3">1 año</td>
              </tr>
              <tr>
                <td className="px-4 py-3">__stripe_sid</td>
                <td className="px-4 py-3">Sesión de pago segura</td>
                <td className="px-4 py-3">30 minutos</td>
              </tr>
              <tr>
                <td className="px-4 py-3">sb-*</td>
                <td className="px-4 py-3">Sesión técnica de la aplicación</td>
                <td className="px-4 py-3">Sesión</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          3. Cookies de terceros
        </h2>
        <p>
          No usamos cookies de seguimiento, analytics ni publicidad. Stripe
          puede instalar sus propias cookies técnicas durante el proceso de
          pago, necesarias para garantizar la seguridad de la transacción.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Cómo desactivar las cookies
        </h2>
        <p>
          Puedes configurar tu navegador para bloquear las cookies, aunque esto
          puede impedir el correcto funcionamiento del proceso de pago. Consulta
          la ayuda de tu navegador para más información.
        </p>
      </section>
    </div>
  );
}
