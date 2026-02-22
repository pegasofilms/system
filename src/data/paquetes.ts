/**
 * Valores de paquete (transmisión, grabación, ambos).
 * Centralizados para mantener consistencia en Cotizar, Contratos y cotizacionUtils.
 */

export const PAQUETE_SOLO_TRANSMISION = 'Solo transmisión';
export const PAQUETE_SOLO_GRABACION = 'Solo grabación';
export const PAQUETE_AMBOS = 'Ambos (Transmisión + Grabación)';

/** Opciones para el select de paquete en Cotizar. */
export const PAQUETES: { value: string; label: string }[] = [
  { value: PAQUETE_SOLO_TRANSMISION, label: 'Solo Transmisión' },
  { value: PAQUETE_SOLO_GRABACION, label: 'Solo Grabación' },
  { value: PAQUETE_AMBOS, label: 'Ambos (Transmisión + Grabación)' }
];

/** Opciones para el select de paquete en formulario de contrato (labels cortos). */
export const PAQUETES_CONTRATO: { value: string; label: string }[] = [
  { value: PAQUETE_SOLO_TRANSMISION, label: 'Solo transmisión' },
  { value: PAQUETE_SOLO_GRABACION, label: 'Solo grabación' },
  { value: PAQUETE_AMBOS, label: 'Ambos' }
];

/** Texto informativo por paquete (p. ej. en Cotizar). */
export const PAQUETE_DESCRIPCIONES: Record<string, string> = {
  [PAQUETE_SOLO_GRABACION]:
    'El paquete grabación incluye una memoria USB con el video y subida a redes sociales (opcional).',
  [PAQUETE_SOLO_TRANSMISION]:
    'La transmisión en vivo es recomendada en Youtube ya que es la plataforma que ofrece guardado permanente y no se elimina despues de cierto tiempo como con facebook ademas que la calidad de video es mejor.',
  [PAQUETE_AMBOS]:
    'El paquete ambos incluye grabación y transmisión en vivo, además de una memoria USB con el video y subida a redes sociales (opcional). La transmisión en vivo es recomendada en Youtube ya que es la plataforma que ofrece guardado permanente y no se elimina despues de cierto tiempo como con facebook ademas que la calidad de video es mejor.'
};

/** Texto informativo: recargo por dividir la grabación en más de 2 días. */
export const TEXTO_DIAS_GRABACION =
  'Si la grabación se reparte en 2 días o más, se suma $200 MXN por cada día (logística y desplazamiento).';
