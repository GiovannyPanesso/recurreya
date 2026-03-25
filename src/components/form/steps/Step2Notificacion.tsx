"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField, Input } from "@/components/ui/FormField";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

export function Step2Notificacion({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const fechaNotificacion = watch("fecha_notificacion");
  const tipoNotificacion = watch("tipo_notificacion");
  const esPrimera = watch("es_primera_notificacion");

  // Calcular días restantes
  let diasRestantes: number | null = null;
  if (fechaNotificacion) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = parseISO(fechaNotificacion);
    diasRestantes = 20 - differenceInDays(hoy, fecha);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Datos de la notificación
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Información sobre cómo recibiste la multa
        </p>
      </div>

      <FormField
        label="Número de expediente"
        required
        error={errors.numero_expediente?.message}
      >
        <Input
          {...register("numero_expediente")}
          placeholder="Ej: ZBE-2026-045231"
          error={!!errors.numero_expediente}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Fecha y hora del hecho"
          required
          error={errors.fecha_hecho?.message}
        >
          <Input
            type="datetime-local"
            {...register("fecha_hecho")}
            error={!!errors.fecha_hecho}
          />
        </FormField>

        <FormField
          label="Fecha de notificación"
          required
          error={errors.fecha_notificacion?.message}
          hint="Fecha en que recibiste la multa"
        >
          <Input
            type="date"
            {...register("fecha_notificacion")}
            error={!!errors.fecha_notificacion}
          />
        </FormField>
      </div>

      {/* Contador de días restantes */}
      {diasRestantes !== null && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${
            diasRestantes <= 0
              ? "border-red-500/30 bg-red-500/10"
              : diasRestantes <= 3
                ? "border-amber-500/30 bg-amber-500/10"
                : "border-green-500/30 bg-green-500/10"
          }`}
        >
          {diasRestantes <= 3 ? (
            <AlertTriangle
              size={18}
              className={diasRestantes <= 0 ? "text-red-400" : "text-amber-400"}
            />
          ) : (
            <Clock size={18} className="text-green-400" />
          )}
          <div>
            {diasRestantes <= 0 ? (
              <p className="font-semibold text-red-300">
                El plazo de recurso ha caducado
              </p>
            ) : (
              <p
                className={`font-semibold ${
                  diasRestantes <= 3 ? "text-amber-300" : "text-green-300"
                }`}
              >
                Te quedan {diasRestantes} días para recurrir
              </p>
            )}
            <p className="text-xs text-slate-400">
              El plazo legal es de 20 días desde la notificación
            </p>
          </div>
        </div>
      )}

      <FormField
        label="Tipo de notificación"
        required
        error={errors.tipo_notificacion?.message}
      >
        <RadioGroup
          name="tipo_notificacion"
          value={tipoNotificacion ?? ""}
          onChange={(v) =>
            setValue(
              "tipo_notificacion",
              v as MultaFormData["tipo_notificacion"],
              {
                shouldValidate: true,
              },
            )
          }
          options={[
            { value: "en_mano", label: "En mano" },
            {
              value: "bajo_limpiaparabrisas",
              label: "Bajo el limpiaparabrisas",
              description:
                "Posible defecto de notificación — el plazo podría no haber comenzado",
            },
            { value: "correo_certificado", label: "Correo certificado" },
            { value: "dev_sede_electronica", label: "DEV / Sede electrónica" },
          ]}
        />
      </FormField>

      <FormField
        label="¿Es la primera notificación que recibes?"
        required
        error={errors.es_primera_notificacion?.message}
      >
        <RadioGroup
          name="es_primera_notificacion"
          value={esPrimera === undefined ? "" : esPrimera ? "si" : "no"}
          onChange={(v) =>
            setValue("es_primera_notificacion", v === "si", {
              shouldValidate: true,
            })
          }
          options={[
            { value: "si", label: "Sí, es la primera" },
            {
              value: "no",
              label: "No, ya estoy en vía ejecutiva",
              description: "El escrito irá contra el procedimiento ejecutivo",
            },
          ]}
        />
      </FormField>
    </div>
  );
}
