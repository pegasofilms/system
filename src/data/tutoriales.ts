/** Listado de tutoriales para la página Admin > Tutoriales */

export interface TutorialItem {
  id: string;
  titulo: string;
  icon: string;
}

export const TUTORIALES: TutorialItem[] = [
  { id: 'cambiar-contrasena-starlink', titulo: 'Cambiar contraseña de Starlink', icon: 'fa-solid fa-satellite-dish' },
];
