/** Listado de tipos de evento (cotización y contratos) */
export const TIPOS_EVENTO = [
  'Cumpleaños',
  'Mayordomía',
  'Bautizo',
  'Primera Comunión',
  'Confirmación',
  'Boda',
  'Xv Años',
  'Clausura',
  'Calenda y/o convite',
  'Jaripeo',
  'Baile',
  'Presentación',
  'Concierto',
  'Evento cultural',
  'Videoclip',
  'Videos comerciales',
  'Otro tipo de evento',
  'Otro servicio'
] as const;

export const CUMPLEAÑOS = 'Cumpleaños';
export const MAYORDOMIA = 'Mayordomía';
export const BAUTIZO = 'Bautizo';
export const PRIMERA_COMUNION = 'Primera Comunión';
export const CONFIRMACION = 'Confirmación';
export const BODA = 'Boda';
export const XV_AÑOS = 'Xv Años';
export const CLAUSURA = 'Clausura';
export const CALENDA_Y_CONVITE = 'Calenda y/o convite';
export const JARIPEO = 'Jaripeo';
export const BAILE = 'Baile';
export const PRESENTACION = 'Presentación';
export const CONCIERTO = 'Concierto';
export const EVENTO_CULTURAL = 'Evento cultural';
export const VIDEOCLIP = 'Videoclip';
export const VIDEOS_COMERCIALES = 'Videos comerciales';
export const OTRO_TIPO_DE_EVENTO = 'Otro tipo de evento';
export const OTRO_SERVICIO = 'Otro servicio';

export type TipoEvento = (typeof TIPOS_EVENTO)[number];

/**
 * Servicios cuando el tipo de evento es "Otro servicio".
 * precio undefined = sin estimado (ej. Asistencia técnica).
 */
export const SERVICIOS_OTRO: { nombre: string; precio?: number }[] = [
  { nombre: 'Spots publicitario', precio: 500 },
  { nombre: 'Anuncios en nuestras plataformas', precio: 400 },
  { nombre: 'Flayers', precio: 400 },
  { nombre: 'Diseño de logos', precio: 800 },
  { nombre: 'Asistencia técnica' }
];

/**
 * Hashtags sugeridos por tipo de evento para redes sociales.
 * Cada tipo tiene varios # que pueden hacerse variables/editables.
 * Actualizado para asegurar que todos los tipos listados en TIPOS_EVENTO tengan su propio array de hashtags.
 */
export const HASHTAGS_POR_TIPO_EVENTO: Record<string, string[]> = {
  'Cumpleaños': ['Cumpleaños', 'Cumple', 'Fiesta', 'Celebración', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Mayordomía': ['Mayordomía', 'Fiesta', 'Tradición', 'Mayordomos', 'Oaxaca', 'envivo', 'tradiciones', 'costumbres', 'celebracion'],
  'Bautizo': ['Bautizo', 'Bautizos', 'Familia', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Primera Comunión': ['PrimeraComunión', 'Comunión', 'Religión', 'Familia', 'fiesta', 'tradiciones', 'costumbres'],
  'Confirmación': ['Confirmación', 'Religión', 'Fe', 'Familia', 'tradiciones', 'costumbres'],
  'Boda': ['Boda', 'Bodas', 'Matrimonio', 'BodaEnVivo', 'VideoBoda', 'fiesta', 'oaxaca', 'tradiciones', 'costumbres'],
  'Xv Años': ['XVAños', 'XV', 'Quinceaños', 'Quince', 'FiestaXV', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Clausura': ['Clausura', 'Graduación', 'Egresados', 'Generación', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Calenda y/o convite': ['Calenda', 'Convite', 'Tradición', 'Oaxaca', 'CalendaOaxaqueña', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Jaripeo': ['Jaripeo', 'Charro', 'Tradición', 'Charreada', 'EnVivo', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Baile': ['Baile', 'Bailes', 'Fiesta', 'Evento', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Presentación': ['Presentación', 'Evento', 'Talento', 'Escenario', 'envivo', 'fiesta', 'tradiciones', 'costumbres'],
  'Concierto': ['Concierto', 'Música', 'Live', 'EnVivo', 'ConciertoEnVivo', 'envivo', 'tradiciones', 'costumbres'],
  'Evento cultural': ['Cultural', 'EventoCultural', 'Tradición', 'Oaxaca', 'FiestaCultural', 'arte', 'costumbres'],
  'Videoclip': ['Videoclip', 'Video', 'Producción', 'VideoMusical', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Videos comerciales': ['VideoComercial', 'Comercial', 'Producción', 'Publicidad', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Otro tipo de evento': ['Evento', 'PegasoFilms', 'Video', 'fiesta', 'envivo', 'live', 'tradiciones', 'costumbres'],
  'Otro servicio': [],
};

/**
 * Descripciones optimizadas para redes sociales (minúsculas; se aplica mayúscula inicial).
 * Placeholder {festejados} se reemplaza por el nombre del festejado o "los festejados".
 * Se asegura que todos los tipos de TIPOS_EVENTO tengan una descripción.
 */
export const DESCRIPCION_INTRO_POR_TIPO: Record<string, string> = {
  'Cumpleaños':
    'Así se celebra un año más de vida. Acompañamos a {festejados} en su cumpleaños. PEGASO FILMS donde la fiesta se vuelve un recuerdo que perdura.',

  'Mayordomía':
    'Tradición, fe y fiesta familiar. PEGASO FILMS acompañando a {festejados} en su mayordomía y dejando recuerdos para siempre.',

  'Bautizo':
    'Un momento lleno de fe, familia y alegría. PEGASO FILMS capturando recuerdos que duran toda la vida.',

  'Primera Comunión':
    'Un día importante para {festejados} y su familia. PEGASO FILMS acompañando este paso de fe.',

  'Confirmación':
    'Celebramos la confirmación de la fe con {festejados}. PEGASO FILMS presente en los momentos más espirituales.',

  'Boda':
    'Un día, una historia y un amor para siempre. En esta ocasión acompañamos a {festejados}. PEGASO FILMS siempre capturando los momentos más especiales.',

  'Xv Años':
    'Una fecha soñada que se vive solo una vez. Acompañamos a {festejados} en sus XV años. PEGASO FILMS contando historias inolvidables.',

  'Clausura':
    'El esfuerzo valió la pena y aquí quedó para siempre. PEGASO FILMS documentando metas alcanzadas.',

  'Calenda y/o convite':
    'Tradición, música y color que se sienten desde casa. PEGASO FILMS mostrando lo mejor de nuestra cultura.',

  'Jaripeo':
    'Adrenalina, emoción y pura acción en la arena. PEGASO FILMS llevando la emoción hasta tu pantalla.',

  'Baile':
    'Así se vive una gran noche de baile. Sus amigos de PEGASO FILMS realizamos las mejores transmisiónes y grabaciones para que nadie se lo pierda. presente donde está el ambiente.',

  'Presentación':
    'El escenario es el principio de la magia. PEGASO FILMS acompañando presentaciones que dejan huella.',

  'Concierto':
    'Luces, música y energía en cada canción. PEGASO FILMS conectando escenarios con el público.',

  'Evento cultural':
    'Celebrando nuestra riqueza cultural. PEGASO FILMS documentando tradiciones y arte para el mundo.',

  'Videoclip':
    'Cada toma cuenta una historia. Realizamos la grabación de este videoclip con estilo y calidad. PEGASO FILMS impulsando talento audiovisual.',

  'Videos comerciales':
    'Una idea bien contada vende más. PEGASO FILMS creando contenido que conecta.',

  'Otro tipo de evento':
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
