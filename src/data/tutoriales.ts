/** Listado de tutoriales para la página Admin > Tutoriales */

export interface TutorialItem {
  id: string;
  titulo: string;
  icon: string;
}

export const TUTORIALES: TutorialItem[] = [
  { id: 'cambiar-contrasena-starlink', titulo: 'Cambiar contraseña de Starlink', icon: 'fa-solid fa-satellite-dish' },
  { id: 'evento-facebook', titulo: 'Cómo hacer un evento en Facebook', icon: 'fa-brands fa-facebook' },
  { id: 'envio-youtube', titulo: 'Cómo hacer un envío en YouTube', icon: 'fa-brands fa-youtube' },
  { id: 'reel-facebook', titulo: 'Cómo publicar un Reel en Facebook', icon: 'fa-solid fa-film' },
  { id: 'short-youtube', titulo: 'Cómo subir un Short a YouTube', icon: 'fa-solid fa-mobile-screen' }
];
