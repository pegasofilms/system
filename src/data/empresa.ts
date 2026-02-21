/**
 * Información centralizada de la empresa.
 * Usar este archivo en toda la app para nombre, teléfono, redes sociales, etc.
 */

export interface RedSocial {
  id: number;
  nombre: string;
  url: string;
  target: string;
  rel: string;
  clase: string;
  icono: string;
  /** Emoji opcional para mensajes (ej. WhatsApp) */
  emoji?: string;
}

export const EMPRESA = {
  /** Nombre comercial */
  nombre: 'PEGASO FILMS',

  /** Usuario principal en redes (ej. para "Síguenos @...") */
  usuarioRedes: '@PEGASOFILMSNOPALA',

  /** Teléfono con código país (sin +), para wa.me y env */
  telefono: import.meta.env.VITE_WHATSAPP_NUMBER ?? '529541829852',

  /** Teléfono formateado para mostrar (ej. 954 182 9852) */
  telefonoFormateado: '954 182 9852',

  /** Mensaje por defecto para el enlace de WhatsApp de contacto/cotización */
  whatsappMensajeCotizar: 'Hola, estoy interesado en cotizar alguna grabación.',

  /** Redes sociales: para sección "Síguenos" y para mensaje de entrega de videos */
  redesSociales: [
    { id: 1, nombre: 'YouTube', url: 'https://www.youtube.com/c/PEGASOFILMSNOPALA', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-brands fa-youtube', emoji: '🔗' },
    { id: 2, nombre: 'Live', url: 'https://www.youtube.com/@PEGASOFILMSLIVE', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-solid fa-tower-broadcast', emoji: '🔗' },
    { id: 3, nombre: 'Facebook', url: 'https://www.facebook.com/pegasofilmsnopala', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-primary', icono: 'fa-brands fa-facebook', emoji: '🔗' },
    { id: 4, nombre: 'TikTok', url: 'https://www.tiktok.com/@pegasofilms', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-dark', icono: 'fa-brands fa-tiktok', emoji: '🔗' },
    { id: 5, nombre: 'Instagram', url: 'https://www.instagram.com/pegasofilmsnopala', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-brands fa-instagram', emoji: '🔗' },
  ] as RedSocial[],

  /** Enlaces de página oficial y cotizaciones */
  enlacesPaginaOficial: 'https://pegasofilms.github.io/system',
  enlacesCotizaciones: 'https://pegasofilms.github.io/system/#/cotizar',
} as const;

/** Enlaces de YouTube (canal y live) para sección de videos */
export function getEnlacesYouTube() {
  const youtube = EMPRESA.redesSociales.find((r) => r.nombre === 'YouTube');
  const live = EMPRESA.redesSociales.find((r) => r.nombre === 'Live');
  return {
    canal: youtube?.url ?? 'https://www.youtube.com/c/PEGASOFILMSNOPALA',
    live: live?.url ?? 'https://www.youtube.com/@PEGASOFILMSLIVE'
  };
}
