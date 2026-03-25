import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  FileText,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-white">
            Recurre<span className="text-blue-500">Ya</span>
          </span>
          <Link
            href="/multa"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Analizar mi multa
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        {/* fondo gradiente */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-red-600/8 blur-[80px]" />
        </div>

        <div className="relative max-w-3xl">
          {/* badge urgencia */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <AlertTriangle size={14} />
            Tienes 20 días para recurrir desde la notificación
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Tu multa puede tener{" "}
            <span className="text-blue-400">un error legal</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
            RecurreYa analiza tu expediente y genera un escrito de recurso
            profesional en minutos.{" "}
            <span className="text-white">Solo pagas 4,99€</span> si encontramos
            argumentos.
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-400">
              ✓ Análisis gratuito · ✓ Solo pagas si recurres · ✓ 4,99€ único
              pago
            </p>
            <Link
              href="/multa"
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
            >
              Analizar mi multa gratis
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
          <ChevronRight size={20} className="rotate-90" />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Cómo funciona
          </h2>
          <p className="mb-16 text-center text-slate-400">
            De la multa al escrito en menos de 5 minutos
          </p>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: <FileText size={22} />,
                title: "Introduce tu multa",
                desc: "Sube una foto o PDF, o rellena los datos manualmente.",
              },
              {
                step: "02",
                icon: <Zap size={22} />,
                title: "Análisis gratuito",
                desc: "La IA detecta argumentos legales en tu expediente sin coste.",
              },
              {
                step: "03",
                icon: <ShieldCheck size={22} />,
                title: "Paga solo si recurres",
                desc: "Si hay argumentos y decides continuar, pagas 4,99€.",
              },
              {
                step: "04",
                icon: <Clock size={22} />,
                title: "Descarga tu escrito",
                desc: "Recibes un PDF listo para presentar con instrucciones.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/5 bg-white/3 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-500">
                    {item.step}
                  </span>
                  <div className="text-blue-400">{item.icon}</div>
                </div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ ANALIZAMOS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Tipos de multa que analizamos
          </h2>
          <p className="mb-16 text-center text-slate-400">
            Especializados en las infracciones más comunes en España
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "📸",
                title: "Velocidad por radar",
                desc: "Fijo, móvil y de tramo. Verificamos márgenes de error y certificados metrológicos.",
              },
              {
                emoji: "🚦",
                title: "Semáforo en rojo",
                desc: "Comprobamos la calidad de las fotos y la validez del aparato de detección.",
              },
              {
                emoji: "🅿️",
                title: "Estacionamiento indebido",
                desc: "Analizamos la señalización y posibles defectos de forma en la notificación.",
              },
              {
                emoji: "📱",
                title: "Móvil al volante / cinturón",
                desc: "Revisamos el procedimiento del agente y la identificación del conductor.",
              },
              {
                emoji: "🌿",
                title: "ZBE Madrid",
                desc: "Especialistas en Zona de Bajas Emisiones: Distrito Centro y Plaza Elíptica.",
              },
              {
                emoji: "📋",
                title: "Defectos de notificación",
                desc: "Detectamos errores en plazos, dirección de envío y forma de notificación.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/5 bg-white/3 p-6 transition hover:border-blue-500/20 hover:bg-white/5"
              >
                <div className="mb-3 text-2xl">{item.emoji}</div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Precio único y transparente
          </h2>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-600/5 p-10">
            <div className="mb-2 text-6xl font-bold text-white">4,99€</div>
            <div className="mb-6 text-slate-400">
              pago único · sin suscripción
            </div>
            <ul className="mb-8 space-y-3 text-left">
              {[
                "Análisis previo gratuito",
                "Escrito de recurso completo en PDF",
                "Argumentos legales personalizados",
                "Instrucciones de presentación",
                "Enviado a tu email",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/multa"
              className="block w-full rounded-xl bg-blue-600 py-4 text-center font-semibold text-white transition hover:bg-blue-500"
            >
              Empezar ahora
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Solo se cobra si decides generar el escrito. El análisis previo es
            siempre gratuito.
          </p>
        </div>
      </section>

      {/* LO QUE NO SOMOS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/5 bg-white/3 p-8">
          <h3 className="mb-6 text-center font-semibold text-white">
            Transparencia ante todo
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-500">
                Lo que somos
              </p>
              {[
                "Herramienta de redacción asistida por IA",
                "Análisis basado en normativa española vigente",
                "Escritos formales y profesionales",
              ].map((t) => (
                <div
                  key={t}
                  className="mb-2 flex items-start gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  {t}
                </div>
              ))}
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-500">
                Lo que NO somos
              </p>
              {[
                "Un despacho de abogados",
                "Garantía de éxito del recurso",
                "Asesoría jurídica personalizada",
              ].map((t) => (
                <div
                  key={t}
                  className="mb-2 flex items-start gap-2 text-sm text-slate-300"
                >
                  <XCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-lg font-bold text-white">
              Recurre<span className="text-blue-500">Ya</span>
            </span>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/privacidad" className="hover:text-slate-300">
                Privacidad
              </Link>
              <Link href="/aviso-legal" className="hover:text-slate-300">
                Aviso legal
              </Link>
              <Link href="/terminos" className="hover:text-slate-300">
                Términos
              </Link>
              <Link href="/cookies" className="hover:text-slate-300">
                Cookies
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-700">
            © {new Date().getFullYear()} RecurreYa · No somos un despacho de
            abogados · No garantizamos el resultado del recurso
          </p>
        </div>
      </footer>
    </main>
  );
}
