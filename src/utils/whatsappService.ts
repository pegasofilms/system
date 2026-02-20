/** Utilidades para notificaciones por WhatsApp (enlace wa.me con resumen del contrato). */

export interface Contrato {
  id: number;
  tipo_evento: string;
  fecha_evento: string;
  hora_evento?: string;
  lugar?: string;
  descripcion?: string;
  paquete?: string;
  precio?: number;
  contratante: string;
  telefono: string;
  padrinos?: string;
  padres?: string;
  festejado?: string;
  notas?: string;
}

/** Número WhatsApp Pegaso (código país sin +). Para enlace wa.me */
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '529541829852';

/**
 * Genera el texto corto del contrato para WhatsApp (sin HTML)
 */
function formatContratoForWhatsApp(contrato: Contrato): string {
  const fecha = new Date(contrato.fecha_evento).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  let msg = `*Nueva solicitud - PEGASO FILMS*\n\n`;
  msg += `📌 ${contrato.tipo_evento}\n`;
  msg += `📅 ${fecha}${contrato.hora_evento ? ` · ${contrato.hora_evento}` : ''}\n`;
  if (contrato.lugar) msg += `📍 ${contrato.lugar}\n`;
  msg += `\n👤 ${contrato.contratante}\n`;
  msg += `📱 ${contrato.telefono}\n`;
  if (contrato.paquete) msg += `Paquete: ${contrato.paquete}\n`;
  if (contrato.precio) msg += `Presupuesto: $${contrato.precio}\n`;
  if (contrato.festejado) msg += `Festejado: ${contrato.festejado}\n`;
  if (contrato.descripcion) msg += `\n${contrato.descripcion}\n`;
  msg += `\n_(ID: ${contrato.id})_`;
  return msg;
}

/**
 * Devuelve el enlace de WhatsApp (wa.me) con el resumen del contrato ya escrito.
 * El cliente puede abrirlo y pulsar "Enviar" para notificar a Pegaso Films.
 */
export function getWhatsAppNotificationUrl(contrato: Contrato): string {
  const text = formatContratoForWhatsApp(contrato);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Mensaje para cotización (solo tipo de evento, lugar, paquete). Sin datos personales.
 * Opción "cotización personalizada por WhatsApp" desde el formulario de cotizar.
 */
export function getWhatsAppCotizacionUrl(datos: {
  tipo_evento: string;
  lugar?: string;
  paquete?: string;
  horas_grabacion?: string;
  horas_envivo?: string;
  otro_servicio?: string;
  precioEstimado?: string;
}): string {
  let msg = `*Solicitud de cotización - PEGASO FILMS*\n\n`;
  msg += `📌 Tipo: ${datos.tipo_evento}\n`;
  if (datos.lugar) msg += `📍 Municipio: ${datos.lugar}\n`;
  if (datos.otro_servicio) {
    const nombre = datos.otro_servicio.split('|')[0];
    msg += `📋 Servicio: ${nombre}\n`;
  } else if (datos.paquete) {
    msg += `📦 Paquete: ${datos.paquete}\n`;
  }
  if (datos.horas_grabacion) {
    const horas = datos.horas_grabacion === 'mas' ? 'Más de 12 horas' : `${datos.horas_grabacion} hora(s)`;
    msg += `⏱ Horas de grabación: ${horas}\n`;
  }
  if (datos.horas_envivo && datos.horas_envivo !== '0') {
    const horas = datos.horas_envivo === 'mas' ? 'Más de 12 horas' : `${datos.horas_envivo} hora(s)`;
    msg += `📡 Horas en vivo: ${horas}\n`;
  }
  if (datos.precioEstimado) {
    msg += `\n💰 ${datos.precioEstimado}\n`;
  }
  msg += `\n_Quisiera confirmar precio real. Este total es solo una estimación._`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * Formatea teléfono para wa.me: solo dígitos, código país México 52 si falta.
 */
function formatPhoneForWhatsApp(telefono: string): string {
  const digits = (telefono || '').replace(/\D/g, '');
  if (digits.length === 10) return '52' + digits;
  if (digits.length === 12 && digits.startsWith('52')) return digits;
  return digits || '';
}

/**
 * Genera el enlace de WhatsApp para enviar al CLIENTE la entrega de videos.
 * Abre wa.me con el número del cliente y mensaje de agradecimiento + enlaces.
 */
export function getWhatsAppEntregaVideosUrl(contrato: {
  contratante?: string | null;
  telefono?: string | null;
  tipo_evento?: string;
  enlaces_videos?: string | null;
}): string | null {
  const telefono = formatPhoneForWhatsApp(contrato.telefono || '');
  if (!telefono) return null;

  const enlaces = (contrato.enlaces_videos || '')
    .split(/[,\s]+/)
    .filter((u: string) => u.trim());

  let msg = `*PEGASO FILMS* 🎬\n\n`;
  msg += `Hola${contrato.contratante ? ` ${contrato.contratante.trim().split(/\s+/)[0]}` : ''},\n\n`;
  msg += `Gracias por confiar en nosotros para *${contrato.tipo_evento || 'tu evento'}*.\n\n`;
  msg += `Te compartimos los enlaces de tus videos:\n\n`;
  enlaces.forEach((url, i) => {
    msg += `${i + 1}. ${url.trim()}\n`;
  });
  msg += `\n_Es un gusto haber compartido este momento contigo._\n`;
  msg += `— Pegaso Films`;

  return `https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`;
}
