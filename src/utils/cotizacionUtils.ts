/**
 * Utilidades y reglas de negocio para cotizaciones.
 * Centraliza viáticos, precios por tipo de evento y cálculo del precio estimado
 * para poder extender el sistema con más variables y reglas.
 */

import { PAQUETE_SOLO_GRABACION, PAQUETE_AMBOS, PAQUETE_SOLO_TRANSMISION } from '@/data/paquetes';
import { BAILE, JARIPEO, OTRO_SERVICIO, SERVICIOS_OTRO, VIDEOCLIP, VIDEOS_COMERCIALES } from '@/data/tiposEvento';

/** Datos del formulario de cotización (se puede extender con más campos). */
export interface DatosCotizacion {
  tipo_evento: string;
  lugar: string;
  paquete: string;
  horas_grabacion: string;
  horas_envivo: string;
  otro_servicio: string;
  /** 'si' = cliente recurrente, aplica 10% de descuento */
  cliente_recurrente?: string;
  /** En cuántos días se reparte la grabación (por defecto 1). Si > 2, se suma RECARGO_POR_DIA_GRABACION por día desde el 3.º */
  dias_grabacion?: string;
}

/** Resultado del cálculo: total y líneas del desglose para mostrar. */
export interface ResultadoCotizacion {
  total: number;
  desglose: string[];
}

/** Municipios con viático especial ($300). El resto usa VIATICO_DEFAULT. */
export const MUNICIPIOS_VIATICO_300 = [
  'San Gabriel Mixtepec',
  'Santa María Temaxcaltepec',
  'San Juan Lachao',
  'San Pedro Mixtepec -Dto. 22 -',
  'San Pedro Mixtepec -Dto. 26 -'
] as const;

/** Viático por defecto para municipios no listados. */
export const VIATICO_DEFAULT = 800;

/** Viático para "Otro" (fuera de lista). */
export const VIATICO_OTRO = 1500;

/** Santos Reyes Nopala. */
export const VIATICO_NOPALA = 200;

/** Precio fijo Videoclip / Videos comerciales (sin viático). */
export const PRECIO_VIDEOCLIP_COMERCIALES = 3000;

/** Recargo por hora en eventos tipo Baile o Jaripeo (implícito en tarifa mostrada, no como línea aparte). */
export const RECARGO_BAILE_JARIPEO_POR_HORA = 100;

/** Recargo por día cuando la grabación se reparte en más de 2 días ($200 por cada día desde el 3.º). */
export const RECARGO_POR_DIA_GRABACION = 200;

/**
 * Viáticos por municipio (Oaxaca).
 * Reglas: Santos Reyes Nopala $200; lista especial $300; "Otro" $1500; demás $800.
 */
export function getViatico(lugar: string): number {
  if (!lugar) return 0;
  if (lugar === 'Santos Reyes Nopala') return VIATICO_NOPALA;
  if (lugar === 'Otro') return VIATICO_OTRO;
  if (MUNICIPIOS_VIATICO_300.includes(lugar as (typeof MUNICIPIOS_VIATICO_300)[number])) return 300;
  return VIATICO_DEFAULT;
}

/**
 * Precios para tipo de evento "Otro" (clave = valor del select "nombre|precio").
 * Derivado de SERVICIOS_OTRO; solo incluye servicios con precio.
 */
export const PRECIOS_OTRO: Record<string, number> = Object.fromEntries(
  SERVICIOS_OTRO
    .filter((s): s is { nombre: string; precio: number } => s.precio != null)
    .map((s) => [`${s.nombre}|${s.precio}`, s.precio])
);

/** Grabación: 1h fijo; 2h y 3h $/h; 4–5h, 6–7h, 8+h mismas escalas que en vivo. */
export const TARIFA_GRABACION_1H = 700;
export const TARIFA_GRABACION_2H = 600;
export const TARIFA_GRABACION_3H = 600;
export const TARIFA_GRABACION_4_5H = 500;
export const TARIFA_GRABACION_6_7H = 400;
export const TARIFA_GRABACION_8_MAS = 400;

/** En vivo (solo transmisión): 1h=700, 2h=550, 3h=500, 4h=400, 5h=350, 6h+=300. */
export const TARIFA_EN_VIVO_SOLO_1H = 700;
export const TARIFA_EN_VIVO_SOLO_2H = 550;
export const TARIFA_EN_VIVO_SOLO_3H = 500;
export const TARIFA_EN_VIVO_SOLO_4H = 400;
export const TARIFA_EN_VIVO_SOLO_5H = 350;
export const TARIFA_EN_VIVO_SOLO_6_MAS = 300;

/** En vivo (paquete ambos): 1h=500, 2h=500, 3h=400, 4h=400, 5h=300, 6h+=300. */
export const TARIFA_EN_VIVO_AMBOS_1H = 500;
export const TARIFA_EN_VIVO_AMBOS_2H = 500;
export const TARIFA_EN_VIVO_AMBOS_3H = 400;
export const TARIFA_EN_VIVO_AMBOS_4H = 400;
export const TARIFA_EN_VIVO_AMBOS_5H = 300;
export const TARIFA_EN_VIVO_AMBOS_6_MAS = 300;

function getPrecioGrabacion(horas: number): { subtotal: number; precioHora: number } {
  if (horas === 1) return { subtotal: TARIFA_GRABACION_1H, precioHora: TARIFA_GRABACION_1H };
  if (horas === 2) return { subtotal: TARIFA_GRABACION_2H * 2, precioHora: TARIFA_GRABACION_2H };
  if (horas === 3) return { subtotal: TARIFA_GRABACION_3H * 3, precioHora: TARIFA_GRABACION_3H };
  if (horas >= 8) return { subtotal: TARIFA_GRABACION_8_MAS * horas, precioHora: TARIFA_GRABACION_8_MAS };
  if (horas >= 6) return { subtotal: TARIFA_GRABACION_6_7H * horas, precioHora: TARIFA_GRABACION_6_7H };
  return { subtotal: TARIFA_GRABACION_4_5H * horas, precioHora: TARIFA_GRABACION_4_5H };
}

function getPrecioEnVivo(horas: number, paquete: string): { subtotal: number; precioHora: number } {
  const esSoloTransmision = paquete === PAQUETE_SOLO_TRANSMISION;
  const tarifa1h = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_1H : TARIFA_EN_VIVO_AMBOS_1H;
  const tarifa2h = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_2H : TARIFA_EN_VIVO_AMBOS_2H;
  const tarifa3h = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_3H : TARIFA_EN_VIVO_AMBOS_3H;
  const tarifa4h = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_4H : TARIFA_EN_VIVO_AMBOS_4H;
  const tarifa5h = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_5H : TARIFA_EN_VIVO_AMBOS_5H;
  const tarifa6Mas = esSoloTransmision ? TARIFA_EN_VIVO_SOLO_6_MAS : TARIFA_EN_VIVO_AMBOS_6_MAS;

  if (horas === 1) return { subtotal: tarifa1h, precioHora: tarifa1h };
  if (horas === 2) return { subtotal: tarifa2h * 2, precioHora: tarifa2h };
  if (horas === 3) return { subtotal: tarifa3h * 3, precioHora: tarifa3h };
  if (horas === 4) return { subtotal: tarifa4h * 4, precioHora: tarifa4h };
  if (horas === 5) return { subtotal: tarifa5h * 5, precioHora: tarifa5h };
  return { subtotal: tarifa6Mas * horas, precioHora: tarifa6Mas };
}

/**
 * Calcula el precio estimado a partir de los datos del formulario.
 * Reglas: Videoclip/Videos comerciales $3000+viático; Otro = PRECIOS_OTRO;
 * Grabación: 1h=$700, 2–3h=$600/h, 4–5h=$500/h, 6+h=$400/h; Baile/Jaripeo +$100/h (implícito).
 * En vivo solo transmisión: 1h=$700, 2h=$550/h, 3h=$500/h, 4h=$400/h, 5h=$350/h, 6+h=$300/h.
 * En vivo en paquete ambos: 1–2h=$500/h, 3–4h=$400/h, 5+h=$300/h.
 */
export function calcularPrecioEstimado(datos: DatosCotizacion): ResultadoCotizacion {
  const desglose: string[] = [];
  let total = 0;
  const tipo = (datos.tipo_evento || '').trim();
  const viatico = getViatico(datos.lugar || '');

  if (tipo === VIDEOCLIP || tipo === VIDEOS_COMERCIALES) {
    total = PRECIO_VIDEOCLIP_COMERCIALES + viatico;
    desglose.push(`${tipo}: $3,000`);
    if (viatico > 0) desglose.push(`Viático (${datos.lugar}): $${viatico}`);
    const esClienteRecurrenteV = (datos.cliente_recurrente || '').toLowerCase() === 'si';
    if (esClienteRecurrenteV && total > 0) {
      const descuento = Math.round(total * 0.1);
      total -= descuento;
      desglose.push(`Descuento cliente recurrente (10%): -$${descuento.toLocaleString('es-MX')}`);
    }
    return { total, desglose };
  }

  if (tipo === OTRO_SERVICIO) {
    const sel = datos.otro_servicio || '';
    if (!sel) return { total: 0, desglose: [] };
    const precio = PRECIOS_OTRO[sel];
    const nombreServicio = sel.split('|')[0];
    if (precio !== undefined) {
      total = precio;
      desglose.push(`${nombreServicio}: $${precio.toLocaleString('es-MX')}`);
    } else {
      desglose.push(`${nombreServicio}: Consultar (sin estimado)`);
      return { total: 0, desglose };
    }
    const esClienteRecurrenteO = (datos.cliente_recurrente || '').toLowerCase() === 'si';
    if (esClienteRecurrenteO && total > 0) {
      const descuento = Math.round(total * 0.1);
      total -= descuento;
      desglose.push(`Descuento cliente recurrente (10%): -$${descuento.toLocaleString('es-MX')}`);
    }
    return { total, desglose };
  }

  const paquete = datos.paquete || '';
  const esBaileOJaripeo = tipo === BAILE || tipo === JARIPEO;

  let algunoMasDe4Horas = false;

  const hGrab = datos.horas_grabacion;
  if ((paquete === PAQUETE_SOLO_GRABACION || paquete === PAQUETE_AMBOS) && hGrab) {
    const horas = hGrab === 'mas' ? 12 : parseInt(hGrab, 10);
    if (horas > 4) algunoMasDe4Horas = true;
    const { subtotal: subtotalBase, precioHora } = getPrecioGrabacion(horas);
    const extra = esBaileOJaripeo ? RECARGO_BAILE_JARIPEO_POR_HORA : 0;
    const subtotal = subtotalBase + extra * horas;
    const precioHoraMostrar = precioHora + extra;
    desglose.push(`Grabación ($${precioHoraMostrar.toLocaleString('es-MX')}/h) − ${horas}h = $${subtotal.toLocaleString('es-MX')}`);
    total += subtotal;
  }

  const hEnvivo = datos.horas_envivo;
  if ((paquete === PAQUETE_SOLO_TRANSMISION || paquete === PAQUETE_AMBOS) && hEnvivo && hEnvivo !== '0') {
    const horas = hEnvivo === 'mas' ? 12 : parseInt(hEnvivo, 10);
    if (horas > 4) algunoMasDe4Horas = true;
    const { subtotal, precioHora } = getPrecioEnVivo(horas, paquete);
    desglose.push(`En vivo ($${precioHora.toLocaleString('es-MX')}/h) − ${horas}h = $${subtotal.toLocaleString('es-MX')}`);
    total += subtotal;
  }

  if (algunoMasDe4Horas) {
    const dias = parseInt(datos.dias_grabacion || '1', 10);
    if (dias > 1) {
      const diasExtra = dias - 1;
      const recargoDias = diasExtra * RECARGO_POR_DIA_GRABACION;
      total += recargoDias;
      desglose.push(`Días adicionales (desde 2.º día, $${RECARGO_POR_DIA_GRABACION}/día) − ${diasExtra} día(s) = $${recargoDias.toLocaleString('es-MX')}`);
    }
  }

  if (viatico > 0) {
    desglose.push(`Viático (${datos.lugar}): $${viatico.toLocaleString('es-MX')}`);
    total += viatico;
  }

  if (total === 0) return { total: 0, desglose: [] };

  const esClienteRecurrente = (datos.cliente_recurrente || '').toLowerCase() === 'si';
  if (esClienteRecurrente && total > 0) {
    const descuento = Math.round(total * 0.1);
    total -= descuento;
    desglose.push(`Descuento cliente recurrente (10%): -$${descuento.toLocaleString('es-MX')}`);
  }

  return { total, desglose };
}
