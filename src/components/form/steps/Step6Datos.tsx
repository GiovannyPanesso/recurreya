"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField, Input } from "@/components/ui/FormField";
import { cn } from "@/utils/cn";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

export function Step6Datos({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Tus datos personales
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Necesarios para redactar el escrito a tu nombre
        </p>
      </div>

      <FormField
        label="Nombre completo"
        required
        error={errors.nombre_completo?.message}
      >
        <Input
          {...register("nombre_completo")}
          placeholder="Ej: Juan García López"
          error={!!errors.nombre_completo}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="DNI" required error={errors.dni?.message}>
          <Input
            {...register("dni")}
            placeholder="Ej: 12345678A"
            error={!!errors.dni}
          />
        </FormField>

        <FormField label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            placeholder="tu@email.com"
            error={!!errors.email}
          />
        </FormField>
      </div>

      <FormField
        label="Dirección completa"
        required
        error={errors.direccion?.message}
      >
        <Input
          {...register("direccion")}
          placeholder="Ej: Calle Mayor 10, 1ºA, 28001 Madrid"
          error={!!errors.direccion}
        />
      </FormField>

      {/* Checkboxes legales */}
      <div className="space-y-3 rounded-xl border border-white/10 bg-white/3 p-5">
        <p className="text-sm font-medium text-slate-300">
          Consentimientos obligatorios
        </p>

        {[
          {
            field: "acepto_privacidad" as const,
            label: (
              <>
                He leído y acepto la{" "}
                <a
                  href="/privacidad"
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  Política de Privacidad
                </a>
              </>
            ),
          },
          {
            field: "acepto_tratamiento_datos" as const,
            label:
              "Acepto el tratamiento de mis datos personales y de la infracción para la generación del escrito",
          },
          {
            field: "acepto_no_abogados" as const,
            label:
              "Entiendo que RecurreYa no es un despacho de abogados y no garantiza el resultado del recurso",
          },
        ].map(({ field, label }) => {
          const checked = watch(field);
          return (
            <label
              key={field}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition",
                checked
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-white/5 hover:border-white/10",
              )}
            >
              <input
                type="checkbox"
                checked={!!checked}
                onChange={(e) =>
                  setValue(field, e.target.checked as true, {
                    shouldValidate: true,
                  })
                }
                className="mt-0.5 h-4 w-4 accent-blue-500"
              />
              <span className="text-sm text-slate-300">{label}</span>
            </label>
          );
        })}

        {(errors.acepto_privacidad ||
          errors.acepto_tratamiento_datos ||
          errors.acepto_no_abogados) && (
          <p className="text-xs text-red-400">
            Debes aceptar todos los consentimientos para continuar
          </p>
        )}
      </div>
    </div>
  );
}
