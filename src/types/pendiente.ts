/** Datos del usuario creador (join desde user) */
export interface PendienteCreador {
  nombre_completo: string | null;
  username: string;
}

/** Pendiente tal como viene de Supabase (con join opcional a user) */
export interface Pendiente {
  id: number;
  user_id: number;
  titulo: string;
  descripcion: string | null;
  realizado: boolean;
  created_at?: string;
  updated_at?: string;
  /** Creado por (join con tabla user) */
  user?: PendienteCreador | null;
}

/** Payload para crear o actualizar */
export interface PendienteFormPayload {
  titulo: string;
  descripcion?: string | null;
  realizado?: boolean;
}
