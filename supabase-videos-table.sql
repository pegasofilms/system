-- ============================================
-- TABLA VIDEOS - PEGASO FILMS (YouTube / manual)
-- ============================================
-- Estructura basada en YouTube Data API v3 (search/list).
-- Permite insertar desde la API o manualmente.
-- URL del video: https://www.youtube.com/watch?v=<video_id>
--
-- Cómo ejecutar en Supabase:
-- 1. Dashboard Supabase → SQL Editor → New query
-- 2. Pega este archivo y ejecuta (Run).
-- Si ya tienes supabase-schema.sql, la función update_updated_at_column
-- ya existe; si no, la creamos aquí.
-- ============================================

-- Función para updated_at (omitir si ya la tienes en supabase-schema.sql)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.videos (
    -- Identificador de YouTube (obligatorio para construir la URL)
    video_id TEXT PRIMARY KEY,

    -- Contenido
    title TEXT NOT NULL,
    description TEXT,

    -- Canal
    channel_id TEXT,
    channel_title TEXT,

    -- Fechas (API: publishedAt / publishTime)
    published_at TIMESTAMPTZ,

    -- Estado de transmisión (API: liveBroadcastContent: none | live | upcoming)
    live_broadcast_content TEXT DEFAULT 'none',

    -- Origen del registro (para distinguir API vs manual)
    source TEXT DEFAULT 'youtube_api' CHECK (source IN ('youtube_api', 'manual')),

    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON public.videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_videos_source ON public.videos(source);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- Comentarios en columnas
COMMENT ON TABLE public.videos IS 'Videos de YouTube: desde API o inserción manual. URL = https://www.youtube.com/watch?v=video_id';
COMMENT ON COLUMN public.videos.video_id IS 'ID del video en YouTube; se usa en la URL del video';
COMMENT ON COLUMN public.videos.source IS 'youtube_api = desde API; manual = agregado a mano';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura pública (para mostrar en web), inserción y actualización para anon/authenticated (API + manual)
CREATE POLICY "Permitir lectura pública de videos"
ON public.videos
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserción de videos (API o manual)"
ON public.videos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualización de videos"
ON public.videos
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir eliminación de videos"
ON public.videos
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- EJEMPLO: insertar el video del JSON que enviaste
-- ============================================
/*
INSERT INTO public.videos (
    video_id,
    title,
    description,
    channel_id,
    channel_title,
    published_at,
    live_broadcast_content,
    source
) VALUES (
    'kW9BbvF8jOM',
    'ASi SE FESTEJO LA BODA DE ORO DE LA SRA. CLAUDIA Y EL SR. JORGE EN SANTOS REYES NOPALA',
    '',
    'UCY3VBLakqvCKCaHKTtv-oyQ',
    'PEGASO FILMS LIVE',
    '2026-02-20T22:06:21Z'::timestamptz,
    'none',
    'youtube_api'
)
ON CONFLICT (video_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    channel_id = EXCLUDED.channel_id,
    channel_title = EXCLUDED.channel_title,
    published_at = EXCLUDED.published_at,
    live_broadcast_content = EXCLUDED.live_broadcast_content,
    updated_at = NOW();
*/

-- ============================================
-- EJEMPLO: inserción manual (solo lo mínimo)
-- ============================================
/*
INSERT INTO public.videos (video_id, title, channel_title, source)
VALUES ('abc123xyz', 'Mi video manual', 'PEGASO FILMS LIVE', 'manual')
ON CONFLICT (video_id) DO NOTHING;
*/
