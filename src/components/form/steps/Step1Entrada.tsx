"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField } from "@/components/ui/FormField";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { AlertTriangle, FileUp, PenLine } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

export function Step1Entrada({ form }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const yaPagada = watch("ya_pagada");
  const modoEntrada = watch("modo_entrada");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Antes de empezar</h2>
        <p className="mt-1 text-sm text-slate-400">
          Necesitamos confirmar que puedes recurrir esta multa
        </p>
      </div>

      {/* ¿Ya pagaste? */}
      <FormField
        label="¿Ya pagaste la multa con el descuento del 50%?"
        required
        error={errors.ya_pagada?.message}
      >
        <RadioGroup
          name="ya_pagada"
          value={yaPagada === undefined ? "" : yaPagada ? "si" : "no"}
          onChange={(v) =>
            setValue("ya_pagada", v === "si", { shouldValidate: true })
          }
          options={[
            { value: "no", label: "No he pagado todavía" },
            { value: "si", label: "Sí, ya la pagué con descuento" },
          ]}
        />
      </FormField>

      {/* Bloqueo si ya pagó */}
      {yaPagada === true && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="font-semibold text-red-300">
                No podemos ayudarte con esta multa
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Al pagar con el descuento del 50% renunciaste a presentar
                alegaciones. Una vez abonada, ya no es posible recurrir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modo de entrada — solo si no pagó */}
      {yaPagada === false && (
        <FormField
          label="¿Cómo quieres introducir los datos de tu multa?"
          required
          error={errors.modo_entrada?.message}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "subir_archivo",
                icon: <FileUp size={20} />,
                title: "Subir foto o PDF",
                desc: "La IA extrae los datos automáticamente",
              },
              {
                value: "manual",
                icon: <PenLine size={20} />,
                title: "Introducir manualmente",
                desc: "Rellena el formulario paso a paso",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setValue(
                    "modo_entrada",
                    option.value as "subir_archivo" | "manual",
                    {
                      shouldValidate: true,
                    },
                  )
                }
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition",
                  modoEntrada === option.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/3 text-slate-400 hover:border-white/20",
                )}
              >
                {option.icon}
                <div>
                  <p className="font-medium text-white">{option.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </FormField>
      )}
    </div>
  );
}
