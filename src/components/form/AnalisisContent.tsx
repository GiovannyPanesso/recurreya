"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Clock,
  ChevronRight,
} from "lucide-react";
import { differenceInDays, parseISO, addDays, format } from "date-fns";
import { es } from "date-fns/locale";

type Valoracion = "debil" | "moderada" | "solida" | "alta";

interface AnalisisResult {
  valoracion: Valoracion;
  num_argumentos: number;
  fecha_notificacion: string;
  importe_multa: number;
}

type ConfigItem = {
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  titulo: string;
  descripcion: (args: number) => string;
};

const CONFIG: Record<Valoracion, ConfigItem> = {
  debil: {
    icon: <ShieldAlert size={28} />,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    titulo: "Recurso muy débil",
    descripcion: () =>
      "No hemos detectado argumentos sólidos en tu expediente. Recurrir podría hacerte perder el descuento del 50% sin garantía de éxito.",
  },
  moderada: {
    icon: <AlertTriangle size={28} />,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    titulo: "Posibilidades moderadas",
    descripcion: (n) =>
      `Hemos detectado ${n} argumento que podría ser alegable en tu expediente.`,
  },
  solida: {
    icon: <ShieldCheck size={28} />,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    titulo: "Argumentos sólidos",
    descripcion: (n) =>
      `Hemos detectado ${n} argumentos legales que podrían invalidar esta multa.`,
  },
  alta: {
    icon: <ShieldCheck size={28} />,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    titulo: "Alta probabilidad de éxito",
    descripcion: () =>
      "Hemos detectado un defecto crítico en tu expediente que suele ser motivo de anulación.",
  },
};

export function AnalisisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const multaId = searchParams.get("id");

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [result, setResult] = useState<AnalisisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!multaId) {
      router.replace("/multa");
      return;
    }

    const fetchAnalisis = async () => {
      try {
        const res = await fetch("/api/analisis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ multaId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }

        const analisis = await res.json();

        const multaRes = await fetch(`/api/multas/${multaId}`);
        const multa = await multaRes.json();

        setResult({
          valoracion: analisis.valoracion,
          num_argumentos: analisis.num_argumentos,
          fecha_notificacion: multa.fecha_notificacion,
          importe_multa: multa.importe_multa,
        });
        setStatus("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado");
        setStatus("error");
      }
    };

    fetchAnalisis();
  }, [multaId, router]);

  const handlePagar = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ multaId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      alert("Error al iniciar el pago. Inténtalo de nuevo.");
    }
  };

  const handleDescarte = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="relative">
          <Loader2 size={40} className="animate-spin text-green-500" />
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: "#00c85320" }}
          />
        </div>
        <p className="font-medium text-white">Analizando tu expediente...</p>
        <p className="text-xs text-slate-500">
          Revisando argumentos legales aplicables
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-slate-400 underline"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  if (!result) return null;

  const config = CONFIG[result.valoracion];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaNotif = parseISO(result.fecha_notificacion);
  const fechaLimite = addDays(fechaNotif, 20);
  const diasRestantes = differenceInDays(fechaLimite, hoy);
  const fechaLimiteStr = format(fechaLimite, "d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  return (
    <div className="space-y-6">
      {/* Resultado */}
      <div
        className={`rounded-2xl border p-8 text-center ${config.borderColor} ${config.bgColor}`}
      >
        <div className={`mb-4 flex justify-center ${config.color}`}>
          {config.icon}
        </div>
        <h2 className={`mb-3 text-2xl font-bold ${config.color}`}>
          {config.titulo}
        </h2>
        <p className="text-slate-300">
          {config.descripcion(result.num_argumentos)}
        </p>

        {result.valoracion !== "debil" && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-sm text-slate-400">
            <Lock size={14} />
            Los detalles y el escrito completo se generan tras el pago
          </div>
        )}
      </div>

      {/* Contador de días */}
      {diasRestantes > 0 && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${
            diasRestantes <= 3
              ? "border-amber-500/30 bg-amber-500/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <Clock
            size={18}
            className={diasRestantes <= 3 ? "text-amber-400" : "text-slate-400"}
          />
          <div>
            <p
              className={`font-semibold ${diasRestantes <= 3 ? "text-amber-300" : "text-white"}`}
            >
              {diasRestantes <= 3
                ? `⚠️ Solo te quedan ${diasRestantes} días`
                : `Te quedan ${diasRestantes} días para recurrir`}
            </p>
            <p className="text-xs text-slate-500">
              Plazo límite: {fechaLimiteStr}
            </p>
          </div>
        </div>
      )}

      {/* Aviso legal */}
      <p className="text-center text-xs text-slate-600">
        ⚠️ Estimación orientativa basada en los datos de tu expediente.
        RecurreYa no es un despacho de abogados y no garantiza el resultado.
      </p>

      {/* CTAs */}
      {result.valoracion === "debil" ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <p className="text-sm text-amber-300">
              ⚠️ Tu multa:{" "}
              <span className="font-bold">{result.importe_multa}€</span> → Con
              descuento:{" "}
              <span className="font-bold">
                {(result.importe_multa / 2).toFixed(2)}€
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              ¿Seguro que quieres continuar?
            </p>
          </div>
          <button
            onClick={handlePagar}
            className="w-full rounded-xl border border-white/10 py-3 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            Entiendo, quiero el escrito igualmente — 4,99€
          </button>
          <button
            onClick={handleDescarte}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition"
            style={{ backgroundColor: "#00c853", color: "#030d08" }}
          >
            Prefiero pagar con descuento
          </button>
        </div>
      ) : (
        <button
          onClick={handlePagar}
          className="group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-white transition"
          style={{
            backgroundColor: "#00c853",
            color: "#030d08",
            boxShadow: "0 0 30px #00c85325",
          }}
        >
          Obtener mi escrito completo — 4,99€
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
}
