/** Un padrino/madrina: de qué (ej. anillos, lazo) y nombre */
export interface PadrinoEntry {
  deQue: string;
  nombre: string;
}

/** Un video: nombre (ej. intro, comida, baile) y URL */
export interface VideoEntry {
  nombre: string;
  url: string;
}

/** Detalle de cotización/servicio (guardado en JSON en contratos.cotizacion) */
export interface CotizacionData {
  paquete?: string | null;
  horas_grabacion?: number | null;
  horas_transmision?: number | null;
  dias_grabacion?: number | null;
  plataforma_transmision?: 'facebook' | 'youtube' | null;
  subir_video?: boolean;
  modalidad_video?: 'privado' | 'publico' | null;
  entregar_memoria?: boolean;
}

/** Contrato tal como viene de Supabase */
export interface Contrato {
  id: number;
  user_id: number;
  tipo_evento: string;
  fecha_evento: string;
  hora_evento: string | null;
  lugar: string | null;
  descripcion: string | null;
  paquete: string | null;
  precio: number | null;
  anticipo: number | null;
  estado: string;
  notas: string | null;
  contratante: string | null;
  telefono: string | null;
  padrinos: string | null;
  padres: string | null;
  festejado: string | null;
  enlaces_videos: string | null;
  memoria_entregada: boolean;
  cotizacion?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Estado reactivo del formulario de contrato (para secciones del ContratoFormModal) */
export interface ContratoFormState {
  tipo_evento: string;
  fecha_evento: string;
  hora_evento: string;
  lugar: string;
  contratante: string;
  telefono: string;
  paquete: string;
  precio: number | null;
  anticipo: number | null;
  estado: string;
  memoria_entregada: boolean;
  padrinosLista: PadrinoEntry[];
  padres: string;
  festejado: string;
  videosLista: VideoEntry[];
  descripcion: string;
  notas: string;
  cotizacion: CotizacionData & {
    horas_grabacion: number | null;
    horas_transmision: number | null;
    dias_grabacion: number | null;
  };
  _id: number | null;
}

/** Payload para crear o actualizar (sin id en crear, sin user_id en update) */
export interface ContratoFormPayload {
  tipo_evento: string;
  fecha_evento: string;
  hora_evento?: string | null;
  lugar?: string | null;
  contratante?: string | null;
  telefono?: string | null;
  paquete?: string | null;
  precio?: number | null;
  anticipo?: number | null;
  estado: string;
  memoria_entregada: boolean;
  padrinos?: string | null;
  padres?: string | null;
  festejado?: string | null;
  enlaces_videos?: string | null;
  descripcion?: string | null;
  notas?: string | null;
  cotizacion?: string | null;
}
