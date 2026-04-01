"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  Download,
  AlertTriangle,
  Monitor,
  Mail,
  Building2,
} from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface MultaData {
  fecha_notificacion: string;
  organismo_emisor: string;
  nombre_completo: string;
  email: string;
  numero_expediente: string;
  estado: string;
}

interface InstruccionesProps {
  organismo: string;
}
function Instrucciones({ organismo }: InstruccionesProps) {
  if (organismo === "dgt") {
    return (
      <div className="space-y-3">
        <InstruccionItem
          icon={<Monitor size={18} />}
          titulo="Sede electrónica (recomendado)"
          descripcion="sede.dgt.gob.es → Trámites → Recursos y alegaciones"
          detalle="Necesitas: DNI electrónico o Cl@ve PIN"
        />
        <InstruccionItem
          icon={<Mail size={18} />}
          titulo="Correo certificado"
          descripcion="Jefatura Provincial de Tráfico de tu provincia"
          detalle="Guarda el resguardo como justificante"
        />
      </div>
    );
  }

  if (organismo === "ayuntamiento") {
    return (
      <div className="space-y-3">
        <InstruccionItem
          icon={<Monitor size={18} />}
          titulo="Sede electrónica (recomendado)"
          descripcion="www.madrid.es/multas → Registro electrónico"
          detalle="Necesitas: DNI electrónico o Cl@ve PIN"
        />
        <InstruccionItem
          icon={<Mail size={18} />}
          titulo="Correo certificado"
          descripcion="Área de Gobierno de Movilidad — Plaza de la Villa 4, 28005 Madrid"
          detalle="Guarda el resguardo como justificante"
        />
        <InstruccionItem
          icon={<Building2 size={18} />}
          titulo="En persona"
          descripcion="Oficinas de atención al ciudadano Línea Madrid"
          detalle="Lunes a viernes 9:00 - 14:00"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <InstruccionItem
        icon={<Building2 size={18} />}
        titulo="Registro del organismo"
        descripcion="Presenta en el registro del organismo que emitió la multa"
        detalle="O en su sede electrónica si dispone de ella"
      />
      <InstruccionItem
        icon={<Mail size={18} />}
        titulo="Correo certificado"
        descripcion="Envía a la dirección del organismo emisor indicada en la notificación"
        detalle="Guarda el resguardo como justificante"
      />
    </div>
  );
}

function InstruccionItem({
  icon,
  titulo,
  descripcion,
  detalle,
}: {
  icon: React.ReactNode;
  titulo: string;
  descripcion: string;
  detalle: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/5 bg-white/3 p-4">
      <div className="mt-0.5 shrink-0 text-green-400">{icon}</div>
      <div>
        <p className="font-medium text-white">{titulo}</p>
        <p className="mt-0.5 text-sm text-slate-300">{descripcion}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detalle}</p>
      </div>
    </div>
  );
}

export function ResultadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const multaId = searchParams.get("id");

  const [status, setStatus] = useState<
    "loading" | "generating" | "done" | "error"
  >("loading");
  const [documentoUrl, setDocumentoUrl] = useState<string | null>(null);
  const [multa, setMulta] = useState<MultaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!multaId) {
      router.replace("/multa");
      return;
    }

    const fetchAndGenerate = async () => {
      try {
        // Obtener datos de la multa
        const multaRes = await fetch(`/api/multas/${multaId}`);
        if (!multaRes.ok) throw new Error("Multa no encontrada");
        const multaData: MultaData = await multaRes.json();
        setMulta(multaData);

        // Verificar que está pagada
        if (
          multaData.estado !== "pagado" &&
          multaData.estado !== "documento_generado"
        ) {
          throw new Error("El pago no ha sido confirmado aún");
        }

        setStatus("generating");

        // Generar el escrito
        const genRes = await fetch("/api/generar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ multaId }),
        });

        if (!genRes.ok) {
          const data = await genRes.json();
          throw new Error(data.error);
        }

        const { documentoUrl: url } = await genRes.json();
        setDocumentoUrl(url);
        setStatus("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado");
        setStatus("error");
      }
    };

    fetchAndGenerate();
  }, [multaId, router]);

  if (status === "loading" || status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 size={40} className="animate-spin text-green-500" />
        <p className="text-slate-300">
          {status === "loading"
            ? "Verificando pago..."
            : "Generando tu escrito de recurso..."}
        </p>
        <p className="text-xs text-slate-600">
          {status === "generating" && "Esto puede tardar unos segundos"}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <AlertTriangle size={24} className="mx-auto mb-3 text-red-400" />
        <p className="text-red-300">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-slate-400 underline"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!multa) return null;

  const fechaLimite = format(
    addDays(parseISO(multa.fecha_notificacion), 20),
    "d 'de' MMMM 'de' yyyy",
    { locale: es },
  );

  return (
    <div className="space-y-6">
      {/* Éxito */}
      <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-green-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">
          ¡Tu escrito está listo!
        </h2>
        <p className="text-slate-400">
          Hemos redactado tu recurso de reposición formal dirigido al organismo
          emisor de la multa.
        </p>
      </div>

      {/* Descarga */}
      {documentoUrl && (
        <a
          href={documentoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-green-500"
        >
          <Download size={20} />
          Descargar PDF
        </a>
      )}

      {/* Plazo */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
        <p className="text-sm font-semibold text-amber-300">
          ⏰ Tienes hasta el {fechaLimite} para presentarlo
        </p>
      </div>

      {/* Instrucciones */}
      <div className="rounded-2xl border border-white/5 bg-white/3 p-6">
        <h3 className="mb-4 font-semibold text-white">📋 ¿Cómo presentarlo?</h3>
        <Instrucciones organismo={multa.organismo_emisor} />
      </div>

      {/* Email */}
      <p className="text-center text-sm text-slate-500">
        También te hemos enviado todo a{" "}
        <span className="text-slate-300">{multa.email}</span>
      </p>

      {/* Aviso legal */}
      <p className="text-center text-xs text-slate-600">
        RecurreYa no es un despacho de abogados y no garantiza el resultado del
        recurso. Este documento es una herramienta de redacción asistida por IA.
      </p>
    </div>
  );
}
