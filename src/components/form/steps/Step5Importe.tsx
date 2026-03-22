"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField, Input } from "@/components/ui/FormField";
import { RadioGroup } from "@/components/ui/RadioGroup";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

export function Step5Importe({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const viaEjecutiva = watch("via_ejecutiva");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Importe y puntos</h2>
        <p className="mt-1 text-sm text-slate-400">
          Datos económicos de la sanción
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Importe de la multa (€)"
          required
          error={errors.importe_multa?.message}
        >
          <Input
            type="number"
            step="0.01"
            {...register("importe_multa", { valueAsNumber: true })}
            placeholder="Ej: 200"
            error={!!errors.importe_multa}
          />
        </FormField>

        <FormField
          label="Puntos que retiran"
          error={errors.puntos_sancion?.message}
        >
          <Input
            type="number"
            {...register("puntos_sancion", { valueAsNumber: true })}
            placeholder="Ej: 2"
          />
        </FormField>
      </div>

      <FormField
        label="¿Ya estás en vía ejecutiva (embargo)?"
        required
        error={errors.via_ejecutiva?.message}
      >
        <RadioGroup
          name="via_ejecutiva"
          value={viaEjecutiva === undefined ? "" : viaEjecutiva ? "si" : "no"}
          onChange={(v) =>
            setValue("via_ejecutiva", v === "si", { shouldValidate: true })
          }
          options={[
            { value: "no", label: "No" },
            {
              value: "si",
              label: "Sí, ya tengo notificación de embargo",
              description:
                "El escrito irá contra el procedimiento ejecutivo, no contra la multa original",
            },
          ]}
        />
      </FormField>
    </div>
  );
}
