/** Listado de tipos de evento (cotización y contratos) */
export const TIPOS_EVENTO = [
  'Boda',
  'Bautizo',
  'Cumpleaños',
  'XV Años',
  'Clausura',
  'Calenda y convite',
  'Jaripeo',
  'Baile',
  'Concierto',
  'Videoclip',
  'Videos comerciales',
  'Otro'
] as const;

export const BODA = 'Boda';
export const BAUTIZO = 'Bautizo';
export const CUMPLEAÑOS = 'Cumpleaños';
export const XV_AÑOS = 'XV Años';
export const CLAUSURA = 'Clausura';
export const CALENDA_Y_CONVITE = 'Calenda y convite';
export const JARIPEO = 'Jaripeo';
export const BAILE = 'Baile';
export const CONCIERTO = 'Concierto';
export const VIDEOCLEP = 'Videoclip';
export const VIDEOS_COMERCIALES = 'Videos comerciales';
export const OTRO = 'Otro';

export type TipoEvento = (typeof TIPOS_EVENTO)[number];

/**
 * Hashtags sugeridos por tipo de evento para redes sociales.
 * Cada tipo tiene varios # que pueden hacerse variables/editables.
 */
export const HASHTAGS_POR_TIPO_EVENTO: Record<string, string[]> = {
  'Boda': ['Boda', 'Bodas', 'Matrimonio', 'BodaEnVivo', 'VideoBoda', 'fiesta', 'oaxaca', 'tradiciones', 'costumbres'],
  'Bautizo': ['Bautizo', 'Bautizos', 'Familia', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Cumpleaños': ['Cumpleaños', 'Cumple', 'Fiesta', 'Celebración', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'XV Años': ['XVAños', 'XV', 'Quinceaños', 'Quince', 'FiestaXV', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Clausura': ['Clausura', 'Graduación', 'Egresados', 'Generación', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Calenda y convite': ['Calenda', 'Convite', 'Tradición', 'Oaxaca', 'CalendaOaxaqueña', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Jaripeo': ['Jaripeo', 'Charro', 'Tradición', 'Charreada', 'EnVivo', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Baile': ['Baile', 'Bailes', 'Fiesta', 'Evento', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Concierto': ['Concierto', 'Música', 'Live', 'EnVivo', 'ConciertoEnVivo', 'envivo', 'tradiciones', 'costumbres'],
  'Videoclip': ['Videoclip', 'Video', 'Producción', 'VideoMusical', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Videos comerciales': ['VideoComercial', 'Comercial', 'Producción', 'Publicidad', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Otro': ['Evento', 'PegasoFilms', 'Video', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
};

/**
 * Descripciones optimizadas para redes sociales (minúsculas; se aplica mayúscula inicial).
 * Placeholder {festejados} se reemplaza por el nombre del festejado o "los festejados".
 */
export const DESCRIPCION_INTRO_POR_TIPO: Record<string, string> = {
  'Boda':
    'Un día, una historia y un amor para siempre. En esta ocasión acompañamos a {festejados}. PEGASO FILMS siempre capturando los momentos más especiales.',

  'Bautizo':
    'Un momento lleno de fe, familia y alegría. PEGASO FILMS capturando recuerdos que duran toda la vida.',

  'Cumpleaños':
    'Así se celebra un año más de vida. Acompañamos a {festejados} en su cumpleaños. PEGASO FILMS donde la fiesta se vuelve un recuerdo que perdura.',

  'XV Años':
    'Una Fecha soñada que se vive solo una vez. Acompañamos a {festejados} en sus XV años. PEGASO FILMS contando historias inolvidables.',

  'Clausura':
    'El esfuerzo valió la pena y aquí quedó para siempre. PEGASO FILMS documentando metas alcanzadas.',

  'Calenda y convite':
    'Tradición, música y color que se sienten desde casa. PEGASO FILMS mostrando lo mejor de nuestra cultura.',

  'Jaripeo':
    'Adrenalina, emoción y pura acción en la arena. PEGASO FILMS llevando la emoción hasta tu pantalla.',

  'Baile':
    'Así se vive una gran noche de baile. Sus amigos de PEGASO FILMS realizamos las mejores transmisiónes y grabaciones para que nadie se lo pierda. presente donde está el ambiente.',

  'Concierto':
    'Luces, música y energía en cada canción. PEGASO FILMS conectando escenarios con el público.',

  'Videoclip':
    'cada toma cuenta una historia. realizamos la grabación de este videoclip con estilo y calidad. PEGASO FILMS impulsando talento audiovisual.',

  'Videos comerciales':
    'Una idea bien contada vende más. PEGASO FILMS creando contenido que conecta.',

  'Otro':
    'Cada evento tiene su historia y aquí quedó registrada. PEGASO FILMS llevando tus eventos a otro nivel.',
};

/**
 * Devuelve hashtags dinámicos según el tipo de evento (con #).
 * Si el tipo no está en el mapa, genera uno a partir del nombre (sin espacios).
 * No incluye #PegasoFilms; añadirlo al final en la sugerencia de redes.
 */
export function getHashtagsParaTipoEvento(tipoEvento: string): string[] {
  const tipo = (tipoEvento || '').trim();
  if (!tipo) return [];
  const hashtags = HASHTAGS_POR_TIPO_EVENTO[tipo];
  if (hashtags && hashtags.length > 0) {
    return hashtags.map((h) => (h.startsWith('#') ? h : '#' + h));
  }
  const fallback = tipo.replace(/\s+/g, '');
  return fallback ? ['#' + fallback] : [];
}
