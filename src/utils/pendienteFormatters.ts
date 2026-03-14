import type { Pendiente } from '@/types/pendiente';

/**
 * Fecha y hora en que se agregó el pendiente.
 * Supabase guarda en UTC (TIMESTAMPTZ); aquí se muestra en la zona horaria local del usuario (igual que en Contratos).
 */
export function formatAgregado(createdAt: string | undefined | null): string {
  if (!createdAt) return '—';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/** Texto para mostrar "quien lo creó" */
export function formatCreador(p: Pendiente): string {
  const u = p.user;
  if (!u) return '—';
  if (u.nombre_completo?.trim()) return u.nombre_completo.trim();
  if (u.username?.trim()) return u.username.trim();
  return '—';
}

export function truncateDescripcion(str: string | null, max: number): string {
  if (!str || str.length <= max) return str || '—';
  return str.slice(0, max) + '…';
}
