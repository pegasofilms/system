import { supabase } from '@/utils/supabase';
import type { Contrato, ContratoFormPayload } from '@/types/contrato';

const TABLE = 'contratos';
const DEBUG = true; // diagnóstico: F12 → Consola verás [ContratosAPI]. En Network filtra por tu URL Supabase: insert=POST, update=PATCH, delete=DELETE.

function log(msg: string, ...args: unknown[]) {
  if (DEBUG) console.log('[ContratosAPI]', msg, ...args);
}

export async function fetchContratos(): Promise<{ data: Contrato[] | null; error: { message: string } | null }> {
  log('fetchContratos → GET (select)');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('fecha_evento', { ascending: false });

  if (error) {
    log('fetchContratos ERROR', error);
    return { data: null, error };
  }
  log('fetchContratos OK, filas:', (data as Contrato[])?.length ?? 0);
  return { data: (data as Contrato[]) || [], error: null };
}

export async function createContrato(
  payload: ContratoFormPayload & { user_id: number }
): Promise<{ data: Contrato | null; error: { message: string } | null }> {
  log('createContrato → POST (insert)', { user_id: payload.user_id, tipo_evento: payload.tipo_evento });
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: payload.user_id,
      tipo_evento: payload.tipo_evento,
      fecha_evento: payload.fecha_evento,
      hora_evento: payload.hora_evento ?? null,
      lugar: payload.lugar ?? null,
      contratante: payload.contratante ?? null,
      telefono: payload.telefono ?? null,
      paquete: payload.paquete ?? null,
      precio: payload.precio ?? null,
      anticipo: payload.anticipo ?? null,
      estado: payload.estado,
      memoria_entregada: payload.memoria_entregada,
      padrinos: payload.padrinos ?? null,
      padres: payload.padres ?? null,
      festejado: payload.festejado ?? null,
      enlaces_videos: payload.enlaces_videos ?? null,
      descripcion: payload.descripcion ?? null,
      notas: payload.notas ?? null
    })
    .select()
    .single();

  if (error) {
    log('createContrato ERROR', error);
    return { data: null, error };
  }
  log('createContrato OK', (data as Contrato)?.id);
  return { data: data as Contrato, error: null };
}

export async function updateContrato(
  id: number,
  payload: ContratoFormPayload
): Promise<{ data: Contrato | null; error: { message: string } | null }> {
  const idNum = Number(id);
  log('updateContrato → PATCH (update) id=', idNum, { tipo_evento: payload.tipo_evento });
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      tipo_evento: payload.tipo_evento,
      fecha_evento: payload.fecha_evento,
      hora_evento: payload.hora_evento ?? null,
      lugar: payload.lugar ?? null,
      contratante: payload.contratante ?? null,
      telefono: payload.telefono ?? null,
      paquete: payload.paquete ?? null,
      precio: payload.precio ?? null,
      anticipo: payload.anticipo ?? null,
      estado: payload.estado,
      memoria_entregada: payload.memoria_entregada,
      padrinos: payload.padrinos ?? null,
      padres: payload.padres ?? null,
      festejado: payload.festejado ?? null,
      enlaces_videos: payload.enlaces_videos ?? null,
      descripcion: payload.descripcion ?? null,
      notas: payload.notas ?? null
    })
    .eq('id', idNum)
    .select()
    .maybeSingle();

  if (error) {
    log('updateContrato ERROR', error);
    return { data: null, error };
  }
  // 0 filas actualizadas (ej. RLS o id inexistente) → data es null
  if (data == null) {
    log('updateContrato: 0 filas actualizadas (revisa RLS o que el id exista)');
    return {
      data: null,
      error: { message: 'No se encontró el contrato o no tienes permiso para actualizarlo.' }
    };
  }
  log('updateContrato OK', (data as Contrato)?.id);
  return { data: data as Contrato, error: null };
}

export async function deleteContrato(id: number): Promise<{ error: { message: string } | null }> {
  const idNum = Number(id);
  log('deleteContrato → DELETE id=', idNum);
  // .select() devuelve las filas eliminadas; si RLS bloquea, devuelve [] y no se borra nada
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', idNum)
    .select('id');

  if (error) {
    log('deleteContrato ERROR', error);
    return { error };
  }
  const deleted = (data as { id: number }[] | null) ?? [];
  if (deleted.length === 0) {
    log('deleteContrato: 0 filas eliminadas (RLS bloquea DELETE con clave anon)');
    return {
      error: {
        message:
          'No se eliminó ningún registro. En Supabase, Dashboard → Authentication → Policies: la política de DELETE debe permitir "anon" (o usar rol authenticated).'
        }
      };
  }
  log('deleteContrato OK');
  return { error: null };
}
