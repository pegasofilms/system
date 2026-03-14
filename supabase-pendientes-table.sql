
CREATE TABLE IF NOT EXISTS public.pendientes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    realizado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pendientes_user_id ON public.pendientes(user_id);
CREATE INDEX IF NOT EXISTS idx_pendientes_realizado ON public.pendientes(realizado);
CREATE INDEX IF NOT EXISTS idx_pendientes_created_at ON public.pendientes(created_at DESC);

CREATE TRIGGER update_pendientes_updated_at
    BEFORE UPDATE ON public.pendientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.pendientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura de pendientes"
ON public.pendientes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Permitir inserción de pendientes"
ON public.pendientes FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualización de pendientes"
ON public.pendientes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminación de pendientes"
ON public.pendientes FOR DELETE TO anon, authenticated USING (true);
