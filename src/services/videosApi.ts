import { supabase } from '@/utils/supabase';

const TABLE = 'videos';

/** Fila de la tabla public.videos (Supabase) */
export interface VideoRow {
  video_id: string;
  title: string;
  description: string | null;
  channel_id: string | null;
  channel_title: string | null;
  published_at: string | null;
  thumbnail_default_url: string | null;
  thumbnail_medium_url: string | null;
  thumbnail_high_url: string | null;
  live_broadcast_content: string;
  source: 'youtube_api' | 'manual';
}

/** Nombres de canal usados en la página de Videos (tabs) */
export const CHANNEL_NAMES = {
  nopala: 'PEGASO FILMS NOPALA',
  live: 'PEGASO FILMS LIVE',
} as const;

export type ChannelKey = keyof typeof CHANNEL_NAMES;

/**
 * Obtiene los videos de un canal por su nombre (channel_title).
 * Ordenados por published_at descendente.
 */
export async function fetchVideosByChannel(channelTitle: string): Promise<{
  data: VideoRow[] | null;
  error: { message: string } | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('video_id, title, description, channel_id, channel_title, published_at, thumbnail_default_url, thumbnail_medium_url, thumbnail_high_url, live_broadcast_content, source')
    .eq('channel_title', channelTitle)
    .order('published_at', { ascending: false });

  if (error) return { data: null, error };
  return { data: (data as VideoRow[]) ?? [], error: null };
}
