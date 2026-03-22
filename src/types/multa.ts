export type TipoMulta =
  | "velocidad_radar"
  | "semaforo_rojo"
  | "estacionamiento"
  | "movil_cinturon"
  | "zbe_madrid";

export type TipoNotificacion =
  | "en_mano"
  | "bajo_limpiaparabrisas"
  | "correo_certificado"
  | "dev_sede_electronica";

export type TipoVia = "urbana" | "interurbana";

export type OrganismoEmisor = "dgt" | "ayuntamiento" | "ccaa";

export type EstadoMulta = "pendiente_pago" | "pagado" | "documento_generado";

export type ValoracionIA = "debil" | "moderada" | "solida" | "alta";

export type { MultaSchemaType as MultaFormData } from "@/lib/validations/multa";
