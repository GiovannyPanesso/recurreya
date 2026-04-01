import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  FileText,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scale,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen text-white"
      style={{ backgroundColor: "#030d08" }}
    >
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ backgroundColor: "#030d0890" }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="RecurreYa"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-bold tracking-tight">
            Recurre<span style={{ color: "#00c853" }}>Ya</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              Análisis gratuito · Solo pagas si recurres
            </span>
            <Link
              href="/multa"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition"
              style={{ backgroundColor: "#00c853", color: "#030d08" }}
            >
              Analizar mi multa
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: "#00c85312" }}
          />
          <div
            className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full blur-[100px]"
            style={{ backgroundColor: "#69f0ae08" }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,200,83,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,200,83,0.15) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
            style={{
              borderColor: "#f59e0b30",
              backgroundColor: "#f59e0b08",
              color: "#f59e0b",
            }}
          >
            <AlertTriangle size={13} />
            Tienes 20 días naturales para recurrir desde la notificación
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
            Tu multa puede
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #00c853, #69f0ae)",
              }}
            >
              tener un error legal
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg text-slate-400 md:text-xl">
            La IA analiza tu expediente, detecta argumentos legales y genera un
            escrito de recurso profesional en minutos.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {[
              "Análisis siempre gratuito",
              "Solo pagas 4,99€ si recurres",
              "PDF listo para presentar",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 size={15} style={{ color: "#00c853" }} />
                {t}
              </span>
            ))}
          </div>

          <Link
            href="/multa"
            className="group inline-flex items-center gap-2 rounded-xl px-10 py-4 text-base font-semibold transition"
            style={{
              backgroundColor: "#00c853",
              color: "#030d08",
              boxShadow: "0 0 40px #00c85330",
            }}
          >
            Analizar mi multa gratis
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className="mt-4 text-xs text-slate-600">
            Sin registro · Sin suscripción · Pago único si decides recurrir
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-700">
          <ChevronRight size={20} className="rotate-90" />
        </div>
      </section>

      {/* STATS */}
      <section
        className="border-y px-6 py-16"
        style={{ borderColor: "#ffffff08", backgroundColor: "#ffffff05" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { valor: "20 días", label: "Plazo legal para recurrir" },
              { valor: "4,99€", label: "Precio único sin sorpresas" },
              { valor: "5 min", label: "Para tener tu escrito listo" },
              { valor: "100%", label: "Basado en normativa vigente" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="mb-1 text-3xl font-bold"
                  style={{ color: "#00c853" }}
                >
                  {stat.valor}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#00c853" }}
            >
              Proceso
            </p>
            <h2 className="text-4xl font-bold text-white">
              De la multa al escrito en 4 pasos
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: <FileText size={24} />,
                title: "Introduce tu multa",
                desc: "Sube una foto o PDF y extraemos los datos automáticamente, o introdúcelos manualmente.",
              },
              {
                step: "02",
                icon: <Zap size={24} />,
                title: "Análisis gratuito",
                desc: "La IA detecta argumentos legales — márgenes de error, defectos formales, notificaciones incorrectas.",
              },
              {
                step: "03",
                icon: <ShieldCheck size={24} />,
                title: "Paga solo si recurres",
                desc: "Si hay argumentos y decides continuar, pagas 4,99€. Sin compromiso previo.",
              },
              {
                step: "04",
                icon: <Clock size={24} />,
                title: "Descarga tu escrito",
                desc: "PDF profesional listo para presentar con instrucciones según el organismo emisor.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border p-6 transition"
                style={{
                  borderColor: "#ffffff08",
                  backgroundColor: "#ffffff05",
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: "#00c853" }}
                  >
                    {item.step}
                  </span>
                  <div style={{ color: "#00c853" }}>{item.icon}</div>
                </div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPOS DE MULTA */}
      <section className="px-6 py-28" style={{ backgroundColor: "#ffffff01" }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#00c853" }}
            >
              Cobertura
            </p>
            <h2 className="text-4xl font-bold text-white">
              Tipos de multa que analizamos
            </h2>
            <p className="mt-4 text-slate-400">
              Especializados en las infracciones más frecuentes en España
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "📸",
                title: "Velocidad por radar",
                desc: "Fijo, móvil y de tramo. Verificamos márgenes de error metrológicos y certificados de calibración.",
                tag: "Muy frecuente",
              },
              {
                emoji: "🚦",
                title: "Semáforo en rojo",
                desc: "Comprobamos calidad de fotos, validez del aparato y cadena de custodia.",
                tag: null,
              },
              {
                emoji: "🅿️",
                title: "Estacionamiento indebido",
                desc: "Analizamos señalización, defectos de forma y errores en la notificación.",
                tag: null,
              },
              {
                emoji: "📱",
                title: "Móvil al volante / cinturón",
                desc: "Revisamos el procedimiento del agente y la identificación del conductor.",
                tag: null,
              },
              {
                emoji: "🌿",
                title: "ZBE Madrid",
                desc: "Especialistas en Zona de Bajas Emisiones con normativa actualizada a 2026.",
                tag: "Normativa 2026",
              },
              {
                emoji: "📋",
                title: "Defectos de notificación",
                desc: "Detectamos errores en plazos y formas de notificación que invalidan el procedimiento.",
                tag: null,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl border p-6 transition duration-200 hover:border-green-500/20 hover:bg-green-500/5"
                style={{
                  borderColor: "#ffffff08",
                  backgroundColor: "#ffffff03",
                }}
              >
                {item.tag && (
                  <span
                    className="absolute right-4 top-4 rounded-full border px-2 py-0.5 text-xs"
                    style={{
                      borderColor: "#00c85330",
                      backgroundColor: "#00c85310",
                      color: "#00c853",
                    }}
                  >
                    {item.tag}
                  </span>
                )}
                <div className="mb-3 text-3xl">{item.emoji}</div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#00c853" }}
            >
              Precio
            </p>
            <h2 className="text-4xl font-bold text-white">
              Simple y transparente
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div
              className="rounded-2xl border p-8"
              style={{ borderColor: "#ffffff08", backgroundColor: "#ffffff03" }}
            >
              <div className="mb-2 text-4xl font-bold text-white">0€</div>
              <div className="mb-6 text-slate-400">Análisis previo</div>
              <ul className="space-y-3">
                {[
                  "Análisis completo de tu expediente",
                  "Detección de argumentos legales",
                  "Valoración de probabilidad de éxito",
                  "Contador de días restantes",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: "#00c853" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative rounded-2xl border p-8"
              style={{ borderColor: "#00c85330", backgroundColor: "#00c85508" }}
            >
              <div
                className="absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: "#00c853", color: "#030d08" }}
              >
                Si decides recurrir
              </div>
              <div className="mb-2 text-4xl font-bold text-white">4,99€</div>
              <div className="mb-6 text-slate-400">
                Pago único · Sin suscripción
              </div>
              <ul className="space-y-3">
                {[
                  "Escrito de recurso completo en PDF",
                  "Argumentos legales personalizados",
                  "Normativa española vigente aplicada",
                  "Instrucciones de presentación",
                  "Enviado a tu email",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: "#00c853" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/multa"
                className="mt-8 block w-full rounded-xl py-3.5 text-center font-semibold transition"
                style={{ backgroundColor: "#00c853", color: "#030d08" }}
              >
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCIA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-2xl border p-8"
            style={{ borderColor: "#ffffff08", backgroundColor: "#ffffff03" }}
          >
            <div className="mb-6 flex items-center gap-3">
              <Scale size={20} style={{ color: "#00c853" }} />
              <h3 className="font-semibold text-white">
                Transparencia ante todo
              </h3>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-400">
                  Lo que somos
                </p>
                {[
                  "Herramienta de redacción asistida por IA",
                  "Análisis basado en normativa española vigente",
                  "Escritos formales y profesionales",
                  "Argumentos personalizados por expediente",
                ].map((t) => (
                  <div
                    key={t}
                    className="mb-2 flex items-start gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0"
                      style={{ color: "#00c853" }}
                    />
                    {t}
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-400">
                  Lo que NO somos
                </p>
                {[
                  "Un despacho de abogados",
                  "Garantía de éxito del recurso",
                  "Asesoría jurídica personalizada",
                  "Sustituto de un abogado profesional",
                ].map((t) => (
                  <div
                    key={t}
                    className="mb-2 flex items-start gap-2 text-sm text-slate-300"
                  >
                    <XCircle
                      size={13}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-28 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold text-white">
            ¿Tienes una multa pendiente?
          </h2>
          <p className="mb-10 text-lg text-slate-400">
            El análisis es gratuito. Solo pagas si encuentras argumentos y
            decides recurrir.
          </p>
          <Link
            href="/multa"
            className="group inline-flex items-center gap-2 rounded-xl px-10 py-4 text-base font-semibold transition"
            style={{
              backgroundColor: "#00c853",
              color: "#030d08",
              boxShadow: "0 0 40px #00c85330",
            }}
          >
            Analizar mi multa gratis
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <p className="mt-4 text-xs text-slate-600">
            Sin registro · Sin suscripción · 4,99€ si decides recurrir
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t px-6 py-10"
        style={{ borderColor: "#ffffff08" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-lg font-bold text-white">
              Recurre<span style={{ color: "#00c853" }}>Ya</span>
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
