-- ============================================
-- SCHEMA PARA SUPABASE - PEGASO FILMS
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    nombre_completo VARCHAR(255),
    telefono VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de contratos
CREATE TABLE IF NOT EXISTS public.contratos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(100) NOT NULL, -- bodas, bautizos, cumpleaños, jaripeos, etc.
    fecha_evento DATE NOT NULL,
    hora_evento TIME,
    lugar VARCHAR(255),
    descripcion TEXT,
    paquete VARCHAR(100), -- solo transmisión, solo grabación, ambos
    precio DECIMAL(10, 2),
    anticipo DECIMAL(10, 2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmado, en_proceso, completado, cancelado
    notas TEXT,
    -- Información del contratante
    contratante VARCHAR(255), -- Nombre del contratante
    telefono VARCHAR(20), -- Número de teléfono del contratante
    -- Información de padrinos y padres
    padrinos VARCHAR(255), -- Nombre de padrinos
    padres VARCHAR(255), -- Nombre de padres
    festejado VARCHAR(255), -- Nombre del festejado
    -- Enlaces y entregas
    enlaces_videos TEXT, -- Enlaces de videos (separados por comas o JSON)
    memoria_entregada BOOLEAN DEFAULT false, -- Se entregó memoria USB
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_email ON public.user(email);
CREATE INDEX IF NOT EXISTS idx_contratos_user_id ON public.contratos(user_id);
CREATE INDEX IF NOT EXISTS idx_contratos_fecha_evento ON public.contratos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON public.contratos(estado);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON public.user
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at
    BEFORE UPDATE ON public.contratos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla user
-- Permitir lectura pública (ajusta según tus necesidades de seguridad)
CREATE POLICY "Permitir lectura pública de user"
ON public.user
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir inserción pública (para registro de usuarios)
CREATE POLICY "Permitir inserción pública de user"
ON public.user
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir actualización propia
CREATE POLICY "Permitir actualización propia de user"
ON public.user
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Políticas para la tabla contratos
-- Permitir lectura de contratos propios
CREATE POLICY "Permitir lectura de contratos propios"
ON public.contratos
FOR SELECT
TO anon, authenticated
USING (true); -- Ajusta esto según tus necesidades: auth.uid()::text = user_id::text

-- Permitir inserción de contratos
CREATE POLICY "Permitir inserción de contratos"
ON public.contratos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir actualización de contratos (anon + authenticated para que la app con clave anon pueda actualizar)
CREATE POLICY "Permitir actualización de contratos propios"
ON public.contratos
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir eliminación de contratos (anon + authenticated para que la app con clave anon pueda eliminar)
CREATE POLICY "Permitir eliminación de contratos propios"
ON public.contratos
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar usuarios de ejemplo (si no existen)
INSERT INTO public.user (username, password, email, nombre_completo, telefono)
VALUES 
    ('eugenia', 'pegaso738100', 'eugenia@pegasofilms.com', 'Eugenia Reyes', NULL),
    ('ricky', 'pegaso738100', 'ricky@pegasofilms.com', 'Ricky Peralta', NULL),
    ('antonio', 'pegaso738100', 'antonio@pegasofilms.com', 'Antonio Salinas', '9541829852')
ON CONFLICT (username) DO NOTHING;

-- Insertar contrato de ejemplo
INSERT INTO public.contratos (
    user_id,
    tipo_evento,
    fecha_evento,
    hora_evento,
    lugar,
    descripcion,
    paquete,
    precio,
    anticipo,
    estado,
    contratante,
    telefono,
    padrinos,
    padres,
    festejado,
    enlaces_videos,
    memoria_entregada
)
SELECT 
    u.id,
    'Boda',
    '2026-03-15',
    '16:00:00',
    'Salón de eventos Los Arcos',
    'Grabación completa de boda con transmisión en vivo',
    'ambos',
    15000.00,
    5000.00,
    'confirmado',
    'Juan Pérez',
    '9541234567',
    'María y José García',
    'Pedro y Ana Pérez',
    'Carlos y Laura Pérez',
    'https://youtube.com/watch?v=ejemplo1, https://youtube.com/watch?v=ejemplo2',
    false
FROM public.user u
WHERE u.username = 'eugenia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- COMENTARIOS Y NOTAS
-- ============================================
-- 
-- IMPORTANTE: Las políticas de RLS están configuradas para permitir
-- acceso público. Para producción, ajusta las políticas según tus
-- necesidades de seguridad.
--
-- Para hacer las políticas más seguras, puedes usar:
-- - auth.uid() para identificar usuarios autenticados
-- - Comparar user_id con el usuario actual
-- - Crear roles específicos
--
-- Para desactivar RLS temporalmente (solo desarrollo):
-- ALTER TABLE public.user DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contratos DISABLE ROW LEVEL SECURITY;
