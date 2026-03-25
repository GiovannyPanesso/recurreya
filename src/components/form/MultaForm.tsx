"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  multaSchema,
  stepValidationFields,
  MultaSchemaType,
} from "@/lib/validations/multa";
import { StepIndicator } from "./StepIndicator";
import { Step1Entrada } from "./steps/Step1Entrada";
import { Step2Notificacion } from "./steps/Step2Notificacion";
import { Step3Multa } from "./steps/Step3Multa";
import { Step4Detalles } from "./steps/Step4Detalles";
import { Step5Importe } from "./steps/Step5Importe";
import { Step6Datos } from "./steps/Step6Datos";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const TOTAL_STEPS = 6;

// Datos de prueba para desarrollo
const DEV_DATA: Partial<MultaSchemaType> = {
  ya_pagada: false,
  modo_entrada: "manual",
  numero_expediente: "ZBE-2026-045231",
  fecha_hecho: "2026-03-10T09:15",
  fecha_notificacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  tipo_notificacion: "correo_certificado",
  es_primera_notificacion: true,
  tipo_multa: "zbe_madrid",
  zona_zbe: "zbedep_distrito_centro",
  matricula: "1234ABC",
  marca_modelo: "Seat Ibiza",
  color_vehiculo: "Blanco",
  lugar_infraccion: "Calle Mayor 10, Madrid",
  articulo_infringido: "76.A LSV",
  tipo_via: "urbana",
  organismo_emisor: "ayuntamiento",
  clasificacion_ambiental: "A",
  empadronado_madrid_antes_2022: true,
  matricula_coincide: true,
  medio_prueba: "camara_ocr",
  importe_multa: 200,
  puntos_sancion: 0,
  via_ejecutiva: false,
  nombre_completo: "Juan García López",
  dni: "12345678A",
  direccion: "Calle Mayor 10, 1ºA, 28001 Madrid",
  email: "juan.garcia@email.com",
  acepto_privacidad: true,
  acepto_tratamiento_datos: true,
  acepto_no_abogados: true,
};

export function MultaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MultaSchemaType>({
    resolver: zodResolver(multaSchema),
    mode: "onChange",
    defaultValues: {
      puntos_sancion: 0,
    },
  });

  const yaPagada = form.watch("ya_pagada");

  // Rellenar datos de prueba (solo en desarrollo)
  const fillDevData = () => {
    Object.entries(DEV_DATA).forEach(([key, value]) => {
      form.setValue(key as keyof MultaSchemaType, value as never);
    });
  };

  // Validar campos del step actual antes de avanzar
  const handleNext = async () => {
    const fields = stepValidationFields[currentStep];
    const isValid = fields.length === 0 || (await form.trigger(fields));

    if (!isValid) return;

    // Bloquear si ya pagó
    if (currentStep === 1 && yaPagada === true) return;

    // Bloquear si el plazo ha caducado (Step 2)
    if (currentStep === 2) {
      const fechaNotificacion = form.getValues("fecha_notificacion");
      if (fechaNotificacion) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const diasRestantes =
          20 - differenceInDays(hoy, parseISO(fechaNotificacion));
        if (diasRestantes <= 0) return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: MultaSchemaType) => {
    setIsSubmitting(true);
    try {
      // 1. Guardar multa en Supabase
      const res = await fetch("/api/multas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar el expediente");
      }

      const { id } = await res.json();

      // 2. Redirigir a la pantalla de análisis
      window.location.href = `/multa/analisis?id=${id}`;
    } catch (error) {
      console.error(error);
      alert("Error al procesar tu expediente. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Entrada form={form} />;
      case 2:
        return <Step2Notificacion form={form} />;
      case 3:
        return <Step3Multa form={form} />;
      case 4:
        return <Step4Detalles form={form} />;
      case 5:
        return <Step5Importe form={form} />;
      case 6:
        return <Step6Datos form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 p-6 sm:p-8">
      <StepIndicator currentStep={currentStep} />

      {/* Botón de datos de prueba — solo en desarrollo */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6">
          <button
            type="button"
            onClick={fillDevData}
            className="w-full rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 py-2 text-xs text-amber-400 transition hover:bg-amber-500/10"
          >
            ⚡ Rellenar datos de prueba
          </button>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {renderStep()}

        {/* Navegación */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <ChevronLeft size={16} />
              Atrás
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && yaPagada === true) ||
                (currentStep === 2 &&
                  (() => {
                    const fecha = form.getValues("fecha_notificacion");
                    if (!fecha) return false;
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    return 20 - differenceInDays(hoy, parseISO(fecha)) <= 0;
                  })())
              }
            >
              Continuar
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  Analizar mi multa gratis
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
