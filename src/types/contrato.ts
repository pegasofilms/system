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
  created_at?: string;
  updated_at?: string;
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
}
