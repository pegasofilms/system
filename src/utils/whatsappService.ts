/** Utilidades para notificaciones por WhatsApp (enlace wa.me con resumen del contrato). */

import { EMPRESA } from '@/data/empresa';
import { parseVideosEnlaces } from '@/utils/contratoFormatters';

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

/**
 * Genera el texto corto del contrato para WhatsApp (sin HTML)
 */
function formatContratoForWhatsApp(contrato: Contrato): string {
  const fecha = new Date(contrato.fecha_evento).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  let msg = `*Nueva solicitud - ${EMPRESA.nombre}*\n\n`;
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
  return `https://wa.me/${EMPRESA.telefono}?text=${encodeURIComponent(text)}`;
}

/**
 * Mensaje para cotización (solo tipo de evento, lugar, paquete). Sin datos personales.
 * Opción "cotización personalizada por WhatsApp" desde el formulario de cotizar.
 */
export function getWhatsAppCotizacionUrl(datos: {
  tipo_evento: string;
  lugar?: string;
  paquete?: string;
  descripcionPaquete?: string;
  horas_grabacion?: string;
  horas_envivo?: string;
  otro_servicio?: string;
  precioEstimado?: string;
  telefono?: string;
  isAdmin?: boolean;
}): string {
  let msg = `*Solicitud de cotización - ${EMPRESA.nombre}*\n\n`;
  msg += `📌 Tipo: ${datos.tipo_evento}\n`;
  if (datos.lugar) msg += `📍 Municipio: ${datos.lugar}\n`;
  if (datos.otro_servicio) {
    const nombre = datos.otro_servicio.split('|')[0];
    msg += `📋 Servicio: ${nombre}\n`;
  } else if (datos.paquete) {
    msg += `📦 Paquete: ${datos.paquete}\n`;
    if (datos.descripcionPaquete) {
      msg += `ℹ️ ${datos.descripcionPaquete}\n`;
    }
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
    msg += `\n${datos.precioEstimado}\n`;
  }
  // Solo agregar este mensaje si NO es admin
  if (!datos.isAdmin) {
    msg += `\n_Quisiera confirmar precio real. Este total es solo una estimación._`;
  }
  
  // Si se proporciona un teléfono, usarlo; si no, usar el de la empresa
  const telefono = datos.telefono ? formatPhoneForWhatsApp(datos.telefono) : EMPRESA.telefono;
  return `https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`;
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
 * Genera el enlace de WhatsApp para enviar la entrega de videos.
 * Si se pasa numeroDestino (ej. teléfono del usuario logueado), se usa ese número; si no, el del contrato (cliente).
 */
export function getWhatsAppEntregaVideosUrl(
  contrato: {
    contratante?: string | null;
    telefono?: string | null;
    tipo_evento?: string;
    enlaces_videos?: string | null;
  },
  numeroDestino?: string | null
): string | null {
  const telefono = formatPhoneForWhatsApp(
    numeroDestino != null && numeroDestino !== '' ? numeroDestino : (contrato.telefono || '')
  );
  if (!telefono) return null;

  const videos = parseVideosEnlaces(contrato.enlaces_videos || '');
  if (videos.length === 0) return null;

  const nombreCompleto = contrato.contratante?.trim() || '';
  const tipoEvento = contrato.tipo_evento || 'tu evento';

  let msg = `👋 ¡Hola! estimado cliente: `;
  if (nombreCompleto) {
    msg += `*${nombreCompleto}*.\n\n`;
  }
  msg += `🎬 Te hablo de parte del equipo de *${EMPRESA.nombre}* y queremos darte las gracias por habernos permitido ser parte de *${tipoEvento}*. Fue un honor capturar cada instante de ese día tan especial.\n\n`;
  msg += `🎥 Aquí tienes los enlaces de tus videos, listos para que los disfrutes cuando quieras:\n\n`;
  videos.forEach((v, i) => {
    const nombre = v.nombre || `Video ${i + 1}`;
    msg += `${i + 1}. 🎞️ *${nombre}*: ${v.url}\n`;
  });
  msg += `\n`;
  msg += `💝 Esperamos que estos recuerdos te acompañen siempre. Si en el futuro necesitas algo más, estaremos encantados de atenderte.\n\n`;
  msg += `🙏 Gracias por confiar en nosotros. Quedamos a tus órdenes.\n\n`;
  msg += `_Un cordial saludo,_\n`;
  msg += `*${EMPRESA.nombre}* \n\n`;

  msg += `📱 Te invitamos a seguirnos en nuestras redes sociales para ver más de nuestro trabajo:\n\n`;
  EMPRESA.redesSociales.forEach((red, idx) => {
    msg += `${idx + 1}. 🔗 *${red.nombre}*: ${red.url}\n`;
  });
  msg += `\n`;
  msg += `🌐 Puedes visitar nuestra *página oficial* para ver más de nuestro trabajo: ${EMPRESA.enlacesPaginaOficial}\n`;
  msg += `💰 También puedes cotizar nuestros servicios en nuestra *página de cotizaciones*: ${EMPRESA.enlacesCotizaciones}\n`;

  return `https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`;
}
