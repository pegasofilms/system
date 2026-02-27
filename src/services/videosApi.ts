import { supabase } from '@/utils/supabase';

const TABLE = 'videos';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY ?? '';
const YOUTUBE_SEARCH_BASE = 'https://www.googleapis.com/youtube/v3/search';

/** Item de la respuesta de YouTube search/list (items[]) */
interface YouTubeSearchItem {
  kind?: string;
  id?: { kind?: string; videoId?: string };
  snippet?: {
    publishedAt?: string;
    publishTime?: string;
    channelId?: string;
    channelTitle?: string;
    title?: string;
    description?: string;
    liveBroadcastContent?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
      high?: { url?: string };
    };
  };
}

/** Respuesta de una página de YouTube search/list */
interface YouTubeSearchListResponse {
  nextPageToken?: string;
  items?: YouTubeSearchItem[];
}

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
  privado: 'PRIVADO',
} as const;

export type ChannelKey = keyof typeof CHANNEL_NAMES;

/** IDs de canal desde env (para sincronización) */
const CHANNEL_IDS: Record<ChannelKey, string> = {
  nopala: import.meta.env.VITE_YOUTUBE_CHANNEL_PEGASO_FILMS ?? '',
  live: import.meta.env.VITE_YOUTUBE_CHANNEL_PEGASO_LIVE ?? '',
  privado: '',
};

function mapItemToRow(item: YouTubeSearchItem, channelTitle: string): VideoRow | null {
  const videoId = item.id?.videoId;
  const kind = item.id?.kind;
  if (!videoId || kind !== 'youtube#video') return null;

  const s = item.snippet ?? {};
  const th = s.thumbnails ?? {};
  return {
    video_id: videoId,
    title: s.title ?? '',
    description: s.description ?? null,
    channel_id: s.channelId ?? null,
    channel_title: channelTitle,
    published_at: s.publishedAt ?? s.publishTime ?? null,
    thumbnail_default_url: th.default?.url ?? null,
    thumbnail_medium_url: th.medium?.url ?? null,
    thumbnail_high_url: th.high?.url ?? null,
    live_broadcast_content: s.liveBroadcastContent ?? 'none',
    source: 'youtube_api',
  };
}

/**
 * Obtiene todos los ítems de búsqueda de un canal desde YouTube API (paginado).
 */
async function fetchAllYouTubeItems(channelId: string): Promise<{ items: YouTubeSearchItem[]; error: { message: string } | null }> {
  if (!YOUTUBE_API_KEY || !channelId) {
    return { items: [], error: { message: 'Faltan VITE_YOUTUBE_API_KEY o VITE_YOUTUBE_CHANNEL_* en .env' } };
  }
  const allItems: YouTubeSearchItem[] = [];
  let pageToken: string | undefined;

  try {
    do {
      const params = new URLSearchParams({
        key: YOUTUBE_API_KEY,
        channelId,
        part: 'snippet,id',
        order: 'date',
        maxResults: '50',
      });
      if (pageToken) params.set('pageToken', pageToken);

      const res = await fetch(`${YOUTUBE_SEARCH_BASE}?${params.toString()}`);
      if (!res.ok) {
        const errText = await res.text();
        return { items: [], error: { message: `YouTube API: ${res.status} ${errText.slice(0, 200)}` } };
      }

      const json = (await res.json()) as YouTubeSearchListResponse;
      if (json.items?.length) allItems.push(...json.items);
      pageToken = json.nextPageToken;
    } while (pageToken);

    return { items: allItems, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { items: [], error: { message } };
  }
}

/**
 * Sincroniza videos de ambos canales con la BD: consulta YouTube y hace upsert
 * de todos los videos (solo youtube#video). Los que ya existen se actualizan; los nuevos se insertan.
 */
export async function syncVideosFromYouTube(): Promise<{
  upserted: number;
  error: { message: string } | null;
}> {
  const byVideoId = new Map<string, VideoRow>();

  const syncKeys = ['nopala', 'live'] as ChannelKey[];
  const configured = syncKeys.filter((k) => Boolean(CHANNEL_IDS[k]));
  if (configured.length === 0) {
    return {
      upserted: 0,
      error: {
        message:
          'No hay canales configurados para sincronización. Revisa que existan VITE_YOUTUBE_CHANNEL_PEGASO_FILMS y/o VITE_YOUTUBE_CHANNEL_PEGASO_LIVE en el entorno donde se construye/despliega la app (en producción Vite “hornea” las variables en build).',
      },
    };
  }

  for (const key of syncKeys) {
    const channelId = CHANNEL_IDS[key];
    const channelTitle = CHANNEL_NAMES[key];
    if (!channelId) continue;

    const { items, error: fetchErr } = await fetchAllYouTubeItems(channelId);
    if (fetchErr) return { upserted: 0, error: fetchErr };

    for (const item of items) {
      const row = mapItemToRow(item, channelTitle);
      if (row) byVideoId.set(row.video_id, row);
    }
  }

  const rows = Array.from(byVideoId.values());
  if (rows.length === 0) return { upserted: 0, error: null };

  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'video_id' });
  if (error) return { upserted: 0, error };
  return { upserted: rows.length, error: null };
}

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
