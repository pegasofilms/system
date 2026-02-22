import type { Contrato, PadrinoEntry, VideoEntry } from '@/types/contrato';
import { DESCRIPCION_INTRO_POR_TIPO, getHashtagsParaTipoEvento } from '@/data/tiposEvento';

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

/**
 * Sugerencia de título del video: solo tipo de evento, festejado y lugar.
 */
export function sugerenciaTituloVideo(c: Contrato | null): string {
  if (!c) return '';
  const tipo = (c.tipo_evento || '').trim() || 'Evento';
  const festejado = (c.festejado || '').trim();
  const lugar = (c.lugar || '').trim();
  const linea =
    tipo + (festejado ? ' de ' + festejado : '') + (lugar ? ' - ' + lugar : '');
  return linea.toUpperCase();
}

/** Primera letra de cada oración en mayúscula; resto en minúsculas (regla gramatical). Preserva "Pegaso Films". */
function oracionesConMayusc(texto: string): string {
  const resultado = texto
    .split('. ')
    .map((s) => (s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).trim())
    .join('. ')
    .trim();
  return resultado.replace(/\bpegaso films\b/gi, 'PEGASO FILMS');
}

/**
 * Sugerencia de descripción del video: intro personalizada por tipo (reglas gramaticales),
 * padrinos en mayúsculas si existen, hashtags en minúsculas.
 */
export function sugerenciaDescripcionVideo(c: Contrato | null): string {
  if (!c) return '';
  const tipo = (c.tipo_evento || '').trim() || 'Evento';
  const festejado = (c.festejado || '').trim();
  const lugar = (c.lugar || '').trim();
  const partes: string[] = [];

  const plantilla = DESCRIPCION_INTRO_POR_TIPO[tipo] ?? DESCRIPCION_INTRO_POR_TIPO['Otro'];
  if (plantilla) {
    const introConMayusc = oracionesConMayusc(plantilla);
    const festejadosMayusc = (festejado || 'los festejados').toUpperCase();
    const intro = introConMayusc.replace(/\{festejados\}/gi, festejadosMayusc);
    partes.push(intro);
  }

  const padrinos = parsePadrinos(c.padrinos);
  if (padrinos.length > 0) {
    if (padrinos.length > 0) {
      const txtPadrinosSalto = padrinos
        .map((p) =>
          (p.deQue
            ? `${p.deQue}: ${p.nombre}`
            : p.nombre
          ).trim()
        )
        .filter(Boolean)
        .map((txt) =>
          txt
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        )
        .join('\n');
      partes.push('Padrinos:' + (txtPadrinosSalto ? '\n' + txtPadrinosSalto : ''));
    }
  }

  const hashtags = [...getHashtagsParaTipoEvento(tipo)];
  if (lugar) {
    const lugarTag = lugar.split(',')[0].trim().replace(/\s+/g, '');
    if (lugarTag) hashtags.push('#' + lugarTag.toLowerCase());
  }
  hashtags.push('#pegasofilms');
  partes.push(hashtags.map((h) => h.toLowerCase()).join(' '));

  return partes.join('\n\n');
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
