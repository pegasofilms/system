/**
 * Municipios cercanos a Santos Reyes Nopala (región Costa, distrito Juquila, Oaxaca).
 * Colindantes y de la misma zona (~20). Fuente: límites INEGI / Wikipedia.
 */
const MUNICIPIOS_OAXACA = [
  'San Gabriel Mixtepec',
  'San Juan Lachao',
  'San Pedro Mixtepec -Dto. 22 -',
  'San Pedro Mixtepec -Dto. 26 -',
  'San Pedro Pochutla',
  'Santa Catarina Juquila',
  'Santa María Colotepec',
  'Santa María Huatulco',
  'Santa María Temaxcaltepec',
  'Santa María Tonameca',
  'Santos Reyes Nopala',
  'Santiago Yaitepec',
  'Villa de Tututepec de Melchor Ocampo',
  'Otro (Municipio no listado)'
];

export const MUNICIPIOS_OAXACA_URL =
  'https://gaia.inegi.org.mx/wscatgeo/v2/mgee/20';

export type Municipio = string;

/**
 * Devuelve los municipios cercanos a Santos Reyes Nopala (listado estático).
 */
export async function getMunicipiosOaxaca(): Promise<Municipio[]> {
  return [...MUNICIPIOS_OAXACA].sort((a, b) => a.localeCompare(b, 'es'));
}

export { MUNICIPIOS_OAXACA };
