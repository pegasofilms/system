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
