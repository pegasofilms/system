import type { Contrato, PadrinoEntry, VideoEntry } from '@/types/contrato';

export function formatDate(date: string): string {
  if (!date) return 'N/A';
  return new Date(date + 'T00:00:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(time: string | null): string {
  if (!time) return 'N/A';
  return (time + '').substring(0, 5);
}

export function formatDateTime(dateTime: string | undefined): string {
  if (!dateTime) return 'N/A';
  return new Date(dateTime).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatCurrency(amount: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export function formatEstado(estado: string): string {
  const map: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_proceso: 'En Proceso',
    completado: 'Completado',
    cancelado: 'Cancelado'
  };
  return map[estado] || estado;
}

export function getEstadoBadgeClass(estado: string): string {
  const map: Record<string, string> = {
    pendiente: 'badge bg-warning',
    confirmado: 'badge bg-success',
    en_proceso: 'badge bg-info',
    completado: 'badge bg-primary',
    cancelado: 'badge bg-danger'
  };
  return map[estado] || 'badge bg-secondary';
}

export function parseEnlaces(enlaces: string | null): string[] {
  if (!enlaces) return [];
  return enlaces.split(/[,\s]+/).filter((e: string) => e.trim() !== '');
}

/** Parsea el campo enlaces_videos (JSON o texto legacy) a lista nombre + url */
export function parseVideosEnlaces(json: string | null): VideoEntry[] {
  if (!json || !String(json).trim()) return [];
  const s = String(json).trim();
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s) as unknown;
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((x): x is VideoEntry => x != null && typeof x === 'object' && 'url' in x)
        .map((x) => ({
          nombre: String((x as VideoEntry).nombre ?? '').trim(),
          url: String((x as VideoEntry).url ?? '').trim()
        }))
        .filter((v) => v.url !== '');
    } catch {
      return parseEnlaces(s).map((url, i) => ({ nombre: `Video ${i + 1}`, url }));
    }
  }
  return parseEnlaces(s).map((url, i) => ({ nombre: `Video ${i + 1}`, url }));
}

/** Parsea el campo padrinos (JSON o texto legacy) a lista de entradas */
export function parsePadrinos(json: string | null): PadrinoEntry[] {
  if (!json || !String(json).trim()) return [];
  const s = String(json).trim();
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s) as unknown;
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((x): x is PadrinoEntry => x != null && typeof x === 'object' && 'nombre' in x)
        .map((x) => ({
          deQue: String((x as PadrinoEntry).deQue ?? '').trim(),
          nombre: String((x as PadrinoEntry).nombre ?? '').trim()
        }))
        .filter((p) => p.deQue !== '' || p.nombre !== '');
    } catch {
      return [{ deQue: '', nombre: s }];
    }
  }
  return [{ deQue: '', nombre: s }];
}

/** Convierte padrinos (JSON) a líneas para mostrar en vista: "DE QUÉ: NOMBRE" en mayúsculas */
export function formatPadrinosForDisplay(json: string | null): string[] {
  return parsePadrinos(json).map(
    (p) =>
      (p.deQue ? `${p.deQue}: ${p.nombre}` : p.nombre || '—').trim().toUpperCase() || '—'
  );
}

/** Convierte un contrato en una versión para vista con textos en mayúsculas */
export function contratoToDisplayUpper(c: Contrato | null): Contrato | null {
  if (!c) return null;
  const u = (s: string | null | undefined) =>
    s != null && String(s).trim() !== '' ? String(s).trim().toUpperCase() : '—';
  return {
    ...c,
    tipo_evento: u(c.tipo_evento),
    lugar: u(c.lugar),
    descripcion: u(c.descripcion),
    paquete: u(c.paquete),
    estado: u(formatEstado(c.estado)),
    notas: u(c.notas),
    contratante: u(c.contratante),
    telefono: u(c.telefono),
    padrinos: c.padrinos,
    padres: u(c.padres),
    festejado: u(c.festejado),
  };
}
