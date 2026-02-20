/** Listado de tipos de evento (cotización y contratos) */
export const TIPOS_EVENTO = [
  'Boda',
  'Bautizo',
  'Cumpleaños',
  'XV Años',
  'Clausura',
  'Calenda y convite',
  'Jaripeo',
  'Baile',
  'Concierto',
  'Videoclip',
  'Videos comerciales',
  'Otro'
] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];
