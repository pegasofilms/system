import { supabase } from '@/utils/supabase';
import type { Pendiente, PendienteFormPayload } from '@/types/pendiente';

const TABLE = 'pendientes';
const DEBUG = true;

function log(msg: string, ...args: unknown[]) {
  if (DEBUG) console.log('[PendientesAPI]', msg, ...args);
}

export async function fetchPendientes(): Promise<{
  data: Pendiente[] | null;
  error: { message: string } | null;
}> {
  log('fetchPendientes → GET (select + join user)');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, user(nombre_completo, username)')
    .order('created_at', { ascending: false });

  if (error) {
    log('fetchPendientes ERROR', error);
    return { data: null, error };
  }
  log('fetchPendientes OK, filas:', (data as Pendiente[])?.length ?? 0);
  return { data: (data as Pendiente[]) || [], error: null };
}

export async function createPendiente(
  payload: PendienteFormPayload & { user_id: number }
): Promise<{ data: Pendiente | null; error: { message: string } | null }> {
  log('createPendiente → POST (insert)', { user_id: payload.user_id, titulo: payload.titulo });
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: payload.user_id,
      titulo: payload.titulo,
      descripcion: payload.descripcion ?? null,
      realizado: payload.realizado ?? false
    })
    .select()
    .single();

  if (error) {
    log('createPendiente ERROR', error);
    return { data: null, error };
  }
  log('createPendiente OK', (data as Pendiente)?.id);
  return { data: data as Pendiente, error: null };
}

export async function updatePendiente(
  id: number,
  payload: Partial<PendienteFormPayload>
): Promise<{ data: Pendiente | null; error: { message: string } | null }> {
  const idNum = Number(id);
  log('updatePendiente → PATCH id=', idNum);
  const updateObj: Record<string, unknown> = {};
  if (payload.titulo !== undefined) updateObj.titulo = payload.titulo;
  if (payload.descripcion !== undefined) updateObj.descripcion = payload.descripcion;
  if (payload.realizado !== undefined) updateObj.realizado = payload.realizado;

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateObj)
    .eq('id', idNum)
    .select()
    .maybeSingle();

  if (error) {
    log('updatePendiente ERROR', error);
    return { data: null, error };
  }
  if (data == null) {
    log('updatePendiente: 0 filas actualizadas');
    return {
      data: null,
      error: { message: 'No se encontró el pendiente o no tienes permiso para actualizarlo.' }
    };
  }
  log('updatePendiente OK', (data as Pendiente)?.id);
  return { data: data as Pendiente, error: null };
}

export async function deletePendiente(id: number): Promise<{ error: { message: string } | null }> {
  const idNum = Number(id);
  log('deletePendiente → DELETE id=', idNum);
  const { data, error } = await supabase.from(TABLE).delete().eq('id', idNum).select('id');

  if (error) {
    log('deletePendiente ERROR', error);
    return { error };
  }
  const deleted = (data as { id: number }[] | null) ?? [];
  if (deleted.length === 0) {
    log('deletePendiente: 0 filas eliminadas');
    return {
      error: {
        message:
          'No se eliminó ningún registro. Revisa las políticas RLS en Supabase para la tabla pendientes.'
      }
    };
  }
  log('deletePendiente OK');
  return { error: null };
}
