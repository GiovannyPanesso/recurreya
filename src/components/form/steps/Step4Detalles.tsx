"use client";

import { UseFormReturn } from "react-hook-form";
import { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
import { FormField, Input, Select } from "@/components/ui/FormField";
import { RadioGroup } from "@/components/ui/RadioGroup";

interface Props {
  form: UseFormReturn<MultaFormData>;
}

const SiNoOptions = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export function Step4Detalles({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const tipoMulta = watch("tipo_multa");

  const boolField = (field: keyof MultaFormData) => {
    const val = watch(field);
    return val === undefined ? "" : val ? "si" : "no";
  };

  const setBool = (field: keyof MultaFormData, v: string) => {
    setValue(field, v === ("si" as never), { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Detalles de la infracción
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Cuanto más detallado, mejores argumentos encontramos
        </p>
      </div>

      {/* RADAR */}
      {tipoMulta === "velocidad_radar" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Velocidad detectada (km/h)"
              required
              error={errors.velocidad_detectada?.message}
            >
              <Input
                type="number"
                {...register("velocidad_detectada", { valueAsNumber: true })}
                placeholder="Ej: 85"
                error={!!errors.velocidad_detectada}
              />
            </FormField>

            <FormField
              label="Límite de velocidad de la vía (km/h)"
              required
              error={errors.velocidad_limite?.message}
            >
              <Input
                type="number"
                {...register("velocidad_limite", { valueAsNumber: true })}
                placeholder="Ej: 80"
                error={!!errors.velocidad_limite}
              />
            </FormField>
          </div>

          <FormField
            label="Tipo de radar"
            required
            error={errors.tipo_radar?.message}
          >
            <RadioGroup
              name="tipo_radar"
              value={watch("tipo_radar") ?? ""}
              onChange={(v) =>
                setValue("tipo_radar", v as "fijo" | "movil" | "tramo", {
                  shouldValidate: true,
                })
              }
              options={[
                {
                  value: "fijo",
                  label: "Fijo",
                  description: "Margen de error: 5 km/h o 5%",
                },
                {
                  value: "movil",
                  label: "Móvil",
                  description: "Margen de error: 7 km/h o 7%",
                },
                {
                  value: "tramo",
                  label: "De tramo",
                  description: "Velocidad media entre dos puntos",
                },
              ]}
            />
          </FormField>

          <FormField label="Número del agente (si aparece en la notificación)">
            <Input {...register("numero_agente")} placeholder="Opcional" />
          </FormField>

          <FormField
            label="Artículo infringido"
            hint="Cópialo exactamente de la notificación. Ej: 76.A LSV, 91.2 LSV..."
            error={errors.articulo_infringido?.message}
          >
            <Input
              {...register("articulo_infringido")}
              placeholder="Ej: 76.A LSV"
            />
          </FormField>
          <FormField
            label="¿La notificación indica que ya se aplicó la tolerancia metrológica?"
            hint='Busca en tu notificación el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLÓGICO"'
            error={errors.tolerancia_aplicada?.message}
          >
            <RadioGroup
              name="tolerancia_aplicada"
              value={boolField("tolerancia_aplicada")}
              onChange={(v) => setBool("tolerancia_aplicada", v)}
              options={[
                {
                  value: "si",
                  label: "Sí — aparece ese texto en la notificación",
                  description: "La Administración dice que ya aplicó el margen",
                },
                {
                  value: "no",
                  label: "No — no aparece ese texto",
                  description: "No consta que se haya aplicado el margen",
                },
              ]}
            />
          </FormField>
        </>
      )}

      {/* ZBE */}
      {tipoMulta === "zbe_madrid" && (
        <>
          <FormField label="Zona ZBE" required error={errors.zona_zbe?.message}>
            <Select {...register("zona_zbe")} error={!!errors.zona_zbe}>
              <option value="">Selecciona...</option>
              <option value="zbe_general">Madrid ZBE general</option>
              <option value="zbedep_distrito_centro">
                ZBEDEP Distrito Centro
              </option>
              <option value="zbedep_plaza_eliptica">
                ZBEDEP Plaza Elíptica
              </option>
            </Select>
          </FormField>

          <FormField
            label="Clasificación ambiental del vehículo"
            required
            error={errors.clasificacion_ambiental?.message}
          >
            <RadioGroup
              name="clasificacion_ambiental"
              value={watch("clasificacion_ambiental") ?? ""}
              onChange={(v) =>
                setValue("clasificacion_ambiental", v, { shouldValidate: true })
              }
              options={[
                { value: "A", label: "Sin etiqueta (A)" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
                { value: "ECO", label: "ECO" },
                { value: "CERO", label: "CERO" },
              ]}
            />
          </FormField>

          <FormField
            label="¿El vehículo estaba empadronado en Madrid antes del 1 de enero de 2022?"
            error={errors.empadronado_madrid_antes_2022?.message}
          >
            <RadioGroup
              name="empadronado_madrid_antes_2022"
              value={boolField("empadronado_madrid_antes_2022")}
              onChange={(v) => setBool("empadronado_madrid_antes_2022", v)}
              options={[
                { value: "si", label: "Sí" },
                { value: "no", label: "No" },
              ]}
            />
          </FormField>

          <FormField
            label="¿La matrícula en la notificación coincide exactamente con la tuya?"
            required
            error={errors.matricula_coincide?.message}
          >
            <RadioGroup
              name="matricula_coincide"
              value={boolField("matricula_coincide")}
              onChange={(v) => setBool("matricula_coincide", v)}
              options={[
                { value: "si", label: "Sí, coincide" },
                { value: "no", label: "No, hay un error en la matrícula" },
              ]}
            />
          </FormField>

          <FormField
            label="Medio de detección"
            error={errors.medio_prueba?.message}
          >
            <RadioGroup
              name="medio_prueba"
              value={watch("medio_prueba") ?? ""}
              onChange={(v) =>
                setValue("medio_prueba", v, { shouldValidate: true })
              }
              options={[
                { value: "camara_ocr", label: "Cámara OCR" },
                { value: "agente", label: "Agente" },
                { value: "foto_rojo", label: "Foto-rojo" },
              ]}
            />
          </FormField>

          <FormField
            label="Artículo infringido (tal como aparece en la notificación)"
            hint="Ej: 76.A LSV — cópialo exactamente de la notificación"
            error={errors.articulo_infringido?.message}
          >
            <Input
              {...register("articulo_infringido")}
              placeholder="Ej: 76.A LSV"
            />
          </FormField>

          <FormField
            label="¿La notificación indica que ya se aplicó la tolerancia metrológica?"
            hint='Busca el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLÓGICO"'
            error={errors.tolerancia_aplicada?.message}
          >
            <RadioGroup
              name="tolerancia_aplicada"
              value={boolField("tolerancia_aplicada")}
              onChange={(v) => setBool("tolerancia_aplicada", v)}
              options={[
                { value: "no", label: "No aparece ese texto" },
                { value: "si", label: "Sí, indica que ya aplicó tolerancia" },
              ]}
            />
          </FormField>
        </>
      )}

      {/* SEMÁFORO */}
      {tipoMulta === "semaforo_rojo" && (
        <>
          <FormField label="Número de serie de la cámara (si aparece)">
            <Input
              {...register("numero_serie_aparato")}
              placeholder="Opcional"
            />
          </FormField>

          <FormField
            label="¿Se adjunta foto a la notificación?"
            error={errors.foto_adjunta?.message}
          >
            <RadioGroup
              name="foto_adjunta"
              value={boolField("foto_adjunta")}
              onChange={(v) => setBool("foto_adjunta", v)}
              options={SiNoOptions}
            />
          </FormField>

          <FormField
            label="¿La foto es nítida y se ve claramente la matrícula?"
            error={errors.foto_nitida?.message}
          >
            <RadioGroup
              name="foto_nitida"
              value={boolField("foto_nitida")}
              onChange={(v) => setBool("foto_nitida", v)}
              options={SiNoOptions}
            />
          </FormField>

          <FormField
            label="Artículo infringido (tal como aparece en la notificación)"
            hint="Ej: 76.A LSV — cópialo exactamente de la notificación"
            error={errors.articulo_infringido?.message}
          >
            <Input
              {...register("articulo_infringido")}
              placeholder="Ej: 76.A LSV"
            />
          </FormField>

          <FormField
            label="¿La notificación indica que ya se aplicó la tolerancia metrológica?"
            hint='Busca el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLÓGICO"'
            error={errors.tolerancia_aplicada?.message}
          >
            <RadioGroup
              name="tolerancia_aplicada"
              value={boolField("tolerancia_aplicada")}
              onChange={(v) => setBool("tolerancia_aplicada", v)}
              options={[
                { value: "no", label: "No aparece ese texto" },
                { value: "si", label: "Sí, indica que ya aplicó tolerancia" },
              ]}
            />
          </FormField>
        </>
      )}

      {/* ESTACIONAMIENTO */}
      {tipoMulta === "estacionamiento" && (
        <>
          <FormField
            label="¿Había señalización de prohibición visible?"
            error={errors.senalizacion_visible?.message}
          >
            <RadioGroup
              name="senalizacion_visible"
              value={boolField("senalizacion_visible")}
              onChange={(v) => setBool("senalizacion_visible", v)}
              options={[
                { value: "si", label: "Sí" },
                { value: "no", label: "No" },
              ]}
            />
          </FormField>

          <FormField label="Tiempo estacionado aproximado">
            <Input
              {...register("tiempo_estacionado")}
              placeholder="Ej: 30 minutos"
            />
          </FormField>

          <FormField
            label="Artículo infringido (tal como aparece en la notificación)"
            hint="Ej: 76.A LSV — cópialo exactamente de la notificación"
            error={errors.articulo_infringido?.message}
          >
            <Input
              {...register("articulo_infringido")}
              placeholder="Ej: 76.A LSV"
            />
          </FormField>

          <FormField
            label="¿La notificación indica que ya se aplicó la tolerancia metrológica?"
            hint='Busca el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLÓGICO"'
            error={errors.tolerancia_aplicada?.message}
          >
            <RadioGroup
              name="tolerancia_aplicada"
              value={boolField("tolerancia_aplicada")}
              onChange={(v) => setBool("tolerancia_aplicada", v)}
              options={[
                { value: "no", label: "No aparece ese texto" },
                { value: "si", label: "Sí, indica que ya aplicó tolerancia" },
              ]}
            />
          </FormField>
        </>
      )}

      {/* MÓVIL / CINTURÓN */}
      {tipoMulta === "movil_cinturon" && (
        <>
          <FormField
            label="¿Te paró el agente en el momento?"
            error={errors.parado_en_momento?.message}
          >
            <RadioGroup
              name="parado_en_momento"
              value={boolField("parado_en_momento")}
              onChange={(v) => setBool("parado_en_momento", v)}
              options={SiNoOptions}
            />
          </FormField>

          <FormField
            label="¿Había más de un agente?"
            error={errors.mas_de_un_agente?.message}
          >
            <RadioGroup
              name="mas_de_un_agente"
              value={boolField("mas_de_un_agente")}
              onChange={(v) => setBool("mas_de_un_agente", v)}
              options={SiNoOptions}
            />
          </FormField>

          <FormField
            label="¿Firmaste la denuncia en el momento?"
            error={errors.firmo_denuncia?.message}
          >
            <RadioGroup
              name="firmo_denuncia"
              value={boolField("firmo_denuncia")}
              onChange={(v) => setBool("firmo_denuncia", v)}
              options={SiNoOptions}
            />
          </FormField>
          <FormField
            label="Artículo infringido (tal como aparece en la notificación)"
            hint="Ej: 76.A LSV — cópialo exactamente de la notificación"
            error={errors.articulo_infringido?.message}
          >
            <Input
              {...register("articulo_infringido")}
              placeholder="Ej: 76.A LSV"
            />
          </FormField>

          <FormField
            label="¿La notificación indica que ya se aplicó la tolerancia metrológica?"
            hint='Busca el texto "APLICADA TOLERANCIA CONFORME A LA NORMATIVA DE CONTROL METROLÓGICO"'
            error={errors.tolerancia_aplicada?.message}
          >
            <RadioGroup
              name="tolerancia_aplicada"
              value={boolField("tolerancia_aplicada")}
              onChange={(v) => setBool("tolerancia_aplicada", v)}
              options={[
                { value: "no", label: "No aparece ese texto" },
                { value: "si", label: "Sí, indica que ya aplicó tolerancia" },
              ]}
            />
          </FormField>
        </>
      )}
    </div>
  );
}
