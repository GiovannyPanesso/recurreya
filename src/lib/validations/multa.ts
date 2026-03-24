import { z } from "zod";

export const multaSchema = z.object({
  // Step 1
  ya_pagada: z.boolean({ error: "Indica si ya pagaste la multa" }),
  modo_entrada: z.enum(["subir_archivo", "manual"]).optional(),

  // Step 2
  numero_expediente: z
    .string()
    .min(1, "El número de expediente es obligatorio"),
  fecha_hecho: z.string().min(1, "La fecha del hecho es obligatoria"),
  fecha_notificacion: z
    .string()
    .min(1, "La fecha de notificación es obligatoria"),
  tipo_notificacion: z.enum(
    [
      "en_mano",
      "bajo_limpiaparabrisas",
      "correo_certificado",
      "dev_sede_electronica",
    ],
    { error: "Selecciona el tipo de notificación" },
  ),
  es_primera_notificacion: z.boolean({
    error: "Indica si es la primera notificación",
  }),

  // Step 3
  tipo_multa: z.enum(
    [
      "velocidad_radar",
      "semaforo_rojo",
      "estacionamiento",
      "movil_cinturon",
      "zbe_madrid",
    ],
    { error: "Selecciona el tipo de multa" },
  ),
  matricula: z.string().min(1, "La matrícula es obligatoria"),
  marca_modelo: z.string().optional(),
  color_vehiculo: z.string().optional(),
  lugar_infraccion: z
    .string()
    .min(1, "El lugar de la infracción es obligatorio"),
  tipo_via: z.enum(["urbana", "interurbana"], {
    error: "Selecciona el tipo de vía",
  }),
  organismo_emisor: z.enum(["dgt", "ayuntamiento", "ccaa"], {
    error: "Selecciona el organismo",
  }),

  // Step 4 — opcionales según tipo
  velocidad_detectada: z.number().optional(),
  velocidad_limite: z.number().optional(),
  tipo_radar: z.enum(["fijo", "movil", "tramo"]).optional(),
  numero_agente: z.string().optional(),
  zona_zbe: z.string().optional(),
  clasificacion_ambiental: z.string().optional(),
  empadronado_madrid_antes_2022: z.boolean().optional(),
  matricula_coincide: z.boolean().optional(),
  medio_prueba: z.string().optional(),
  numero_serie_aparato: z.string().optional(),
  foto_adjunta: z.boolean().optional(),
  foto_nitida: z.boolean().optional(),
  senalizacion_visible: z.boolean().optional(),
  tiempo_estacionado: z.string().optional(),
  parado_en_momento: z.boolean().optional(),
  mas_de_un_agente: z.boolean().optional(),
  firmo_denuncia: z.boolean().optional(),
  articulo_infringido: z.string().optional(),
  tolerancia_aplicada: z.boolean().optional(),
  municipio_emisor: z.string().optional(),
  velocidad_foto: z.number().optional(),

  // Step 5
  importe_multa: z.number({ error: "El importe es obligatorio" }).positive(),
  puntos_sancion: z.number().optional(),
  via_ejecutiva: z.boolean({
    error: "Indica si estás en vía ejecutiva",
  }),

  // Step 6
  nombre_completo: z.string().min(1, "El nombre es obligatorio"),
  dni: z
    .string()
    .regex(/^\d{8}[A-Z]$/i, "El DNI debe tener 8 números y una letra"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  email: z.string().email("Introduce un email válido"),
  acepto_privacidad: z.literal(true, {
    message: "Debes aceptar la política de privacidad",
  }),
  acepto_tratamiento_datos: z.literal(true, {
    message: "Debes aceptar el tratamiento de datos",
  }),
  acepto_no_abogados: z.literal(true, { message: "Debes aceptar este aviso" }),
});

export type MultaSchemaType = z.infer<typeof multaSchema>;

// Validación por step
export const stepValidationFields: Record<number, (keyof MultaSchemaType)[]> = {
  1: ["ya_pagada"],
  2: [
    "numero_expediente",
    "fecha_hecho",
    "fecha_notificacion",
    "tipo_notificacion",
    "es_primera_notificacion",
  ],
  3: [
    "tipo_multa",
    "matricula",
    "lugar_infraccion",
    "tipo_via",
    "organismo_emisor",
  ],
  4: [],
  5: ["importe_multa", "via_ejecutiva"],
  6: [
    "nombre_completo",
    "dni",
    "direccion",
    "email",
    "acepto_privacidad",
    "acepto_tratamiento_datos",
    "acepto_no_abogados",
  ],
};
