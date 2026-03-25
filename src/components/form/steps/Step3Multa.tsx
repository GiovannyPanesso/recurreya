"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField, Input, Select } from "@/components/ui/FormField";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { MunicipioSelect } from "@/components/ui/MunicipioSelect";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

export function Step3Multa({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const tipoMulta = watch("tipo_multa");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Tipo de multa y vehículo
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Cuéntanos qué tipo de infracción es
        </p>
      </div>
      <FormField
        label="¿Qué tipo de multa es?"
        required
        error={errors.tipo_multa?.message}
      >
        <RadioGroup
          name="tipo_multa"
          value={tipoMulta ?? ""}
          onChange={(v) =>
            setValue("tipo_multa", v as MultaFormData["tipo_multa"], {
              shouldValidate: true,
            })
          }
          options={[
            { value: "velocidad_radar", label: "📸 Velocidad por radar" },
            { value: "semaforo_rojo", label: "🚦 Semáforo en rojo" },
            { value: "estacionamiento", label: "🅿️ Estacionamiento indebido" },
            { value: "movil_cinturon", label: "📱 Uso del móvil / cinturón" },
            { value: "zbe_madrid", label: "🌿 ZBE Madrid" },
          ]}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Matrícula" required error={errors.matricula?.message}>
          <Input
            {...register("matricula")}
            placeholder="Ej: 1234ABC"
            error={!!errors.matricula}
          />
        </FormField>

        <FormField label="Marca y modelo" error={errors.marca_modelo?.message}>
          <Input {...register("marca_modelo")} placeholder="Ej: Seat Ibiza" />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Color del vehículo"
          error={errors.color_vehiculo?.message}
        >
          <Input {...register("color_vehiculo")} placeholder="Ej: Blanco" />
        </FormField>

        <FormField
          label="Tipo de vía"
          required
          error={errors.tipo_via?.message}
        >
          <Select {...register("tipo_via")} error={!!errors.tipo_via}>
            <option value="">Selecciona...</option>
            <option value="urbana">Urbana</option>
            <option value="interurbana">Interurbana</option>
          </Select>
        </FormField>
      </div>
      <FormField
        label="Lugar exacto de la infracción"
        required
        error={errors.lugar_infraccion?.message}
      >
        <Input
          {...register("lugar_infraccion")}
          placeholder="Ej: Calle Mayor 10, Madrid"
          error={!!errors.lugar_infraccion}
        />
      </FormField>
      <FormField
        label="Organismo que emite la multa"
        required
        error={errors.organismo_emisor?.message}
      >
        <RadioGroup
          name="organismo_emisor"
          value={watch("organismo_emisor") ?? ""}
          onChange={(v) =>
            setValue(
              "organismo_emisor",
              v as MultaFormData["organismo_emisor"],
              {
                shouldValidate: true,
              },
            )
          }
          options={[
            { value: "dgt", label: "DGT" },
            { value: "ayuntamiento", label: "Ayuntamiento" },
            { value: "ccaa", label: "Comunidad Autónoma" },
          ]}
        />
      </FormField>
      {watch("organismo_emisor") === "ayuntamiento" && (
        <FormField
          label="¿Qué Ayuntamiento emitió la multa?"
          required
          error={errors.municipio_emisor?.message}
          hint="El municipio donde ocurrió la infracción, no donde vives tú"
        >
          <MunicipioSelect
            value={watch("municipio_emisor") ?? ""}
            onChange={(v) =>
              setValue("municipio_emisor", v, { shouldValidate: true })
            }
            error={!!errors.municipio_emisor}
          />
        </FormField>
      )}
    </div>
  );
}
