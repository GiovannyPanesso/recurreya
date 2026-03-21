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

export interface MultaFormData {
  // Step 1
  ya_pagada: boolean;
  modo_entrada: "subir_archivo" | "manual";

  // Step 2
  numero_expediente: string;
  fecha_hecho: string;
  fecha_notificacion: string;
  tipo_notificacion: TipoNotificacion;
  es_primera_notificacion: boolean;

  // Step 3
  tipo_multa: TipoMulta;
  matricula: string;
  marca_modelo: string;
  color_vehiculo: string;
  lugar_infraccion: string;
  tipo_via: TipoVia;
  organismo_emisor: OrganismoEmisor;

  // Step 4 — radar
  velocidad_detectada?: number;
  velocidad_limite?: number;
  tipo_radar?: "fijo" | "movil" | "tramo";
  numero_agente?: string;

  // Step 4 — ZBE
  zona_zbe?: string;
  clasificacion_ambiental?: string;
  empadronado_madrid_antes_2022?: boolean;
  matricula_coincide?: boolean;
  medio_prueba?: string;

  // Step 4 — semáforo
  numero_serie_aparato?: string;
  foto_adjunta?: boolean;
  foto_nitida?: boolean;

  // Step 4 — estacionamiento
  senalizacion_visible?: boolean;
  tiempo_estacionado?: string;

  // Step 4 — móvil/cinturón
  parado_en_momento?: boolean;
  mas_de_un_agente?: boolean;
  firmo_denuncia?: boolean;

  // Step 5
  importe_multa: number;
  puntos_sancion: number;
  via_ejecutiva: boolean;

  // Step 6
  nombre_completo: string;
  dni: string;
  direccion: string;
  email: string;
  acepto_privacidad: boolean;
  acepto_tratamiento_datos: boolean;
  acepto_no_abogados: boolean;
}
