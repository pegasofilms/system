import { defineComponent, h, ref } from 'vue';
import Swal from 'sweetalert2';
import { supabase } from '@/utils/supabase';

// Para desactivar temporalmente este proceso, cambia a false.
export const ENABLE_PEGASO_PRIVADO_JSON_IMPORT = true;

const TABLE = 'videos';
const CHANNEL_TITLE = 'PRIVADO';

type VideoRow = {
  video_id: string;
  title: string;
  description: string | null;
  channel_id: string | null;
  channel_title: string | null;
  published_at: string | null;
  live_broadcast_content: string;
  source: 'youtube_api' | 'manual';
};

type LocalJsonVideo = {
  videoId?: string;
  title?: string;
  description?: string;
  channelId?: string;
  timeCreatedSeconds?: string;
};

type LocalJsonPayload = { videos?: LocalJsonVideo[] };

// Importar como URL evita que Vite intente parsear el JSON como módulo.
import json1Url from '@/data/1.json?url';
import json2Url from '@/data/2.json?url';
import json3Url from '@/data/3.json?url';
import json4Url from '@/data/4.json?url';
import json5Url from '@/data/5.json?url';

function secondsToIso(sec: string | undefined): string | null {
  if (!sec) return null;
  const n = Number(sec);
  if (!Number.isFinite(n) || n <= 0) return null;
  const d = new Date(n * 1000);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function mapLocalJsonVideoToRow(v: LocalJsonVideo): VideoRow | null {
  const videoId = v.videoId?.trim();
  if (!videoId) return null;
  return {
    video_id: videoId,
    title: v.title?.trim() || '',
    description: v.description ?? null,
    channel_id: v.channelId ?? null,
    channel_title: CHANNEL_TITLE,
    published_at: secondsToIso(v.timeCreatedSeconds),
    live_broadcast_content: 'none',
    source: 'manual',
  };
}

async function loadJson(url: string): Promise<LocalJsonPayload> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar JSON (${res.status})`);
  return (await res.json()) as LocalJsonPayload;
}

async function upsertVideoRows(rows: VideoRow[]) {
  if (!rows.length) return { upserted: 0 };
  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'video_id' });
  if (error) throw new Error(error.message);
  return { upserted: rows.length };
}

export default defineComponent({
  name: 'PegasoPrivadoJsonImportButton',
  props: {
    disabled: { type: Boolean, default: false },
  },
  emits: ['done'],
  setup(props, { emit }) {
    const importing = ref(false);

    async function onClick() {
      if (!ENABLE_PEGASO_PRIVADO_JSON_IMPORT) return;
      const confirm = await Swal.fire({
        icon: 'question',
        title: 'Agregar videos desde JSON',
        text: 'Esto hará upsert de src/data/1.json a 5.json en la tabla videos (temporal). ¿Continuar?',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar',
      });
      if (!confirm.isConfirmed) return;

      importing.value = true;
      try {
        const urls = [json1Url, json2Url, json3Url, json4Url, json5Url];
        const payloads = await Promise.all(urls.map(loadJson));

        const byId = new Map<string, VideoRow>();
        for (const p of payloads) {
          for (const v of p.videos ?? []) {
            const row = mapLocalJsonVideoToRow(v);
            if (row) byId.set(row.video_id, row);
          }
        }

        const { upserted } = await upsertVideoRows(Array.from(byId.values()));
        await Swal.fire({
          icon: 'success',
          title: 'Videos agregados',
          text: upserted === 0 ? 'No se agregó ningún video.' : `Se agregaron/actualizaron ${upserted} video(s) en la BD.`,
        });
        emit('done');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await Swal.fire({ icon: 'error', title: 'Error al agregar', text: msg });
      } finally {
        importing.value = false;
      }
    }

    return () => {
      if (!ENABLE_PEGASO_PRIVADO_JSON_IMPORT) return null;
      return h(
        'button',
        {
          type: 'button',
          class: 'btn btn-outline-success me-2 mb-2',
          disabled: props.disabled || importing.value,
          onClick,
        },
        [
          importing.value
            ? h('span', { class: 'spinner-border spinner-border-sm me-2', 'aria-hidden': 'true' })
            : h('i', { class: 'fa-solid fa-file-import me-2', 'aria-hidden': 'true' }),
          'Agregar JSON a la BD',
        ]
      );
    };
  },
});

