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
];

/**
 * Agencias de Santos Reyes Nopala.
 * Si se selecciona alguna en cotización, aplica viático especial.
 */
export const AGENCIAS_SANTOS_REYES_NOPALA = [
  "Arroyo Seco",
  "Cañada de los Matus",
  "Cañada las Flores",
  "Cerro Cuero",
  "Cerro de Aire",
  "Cerro Iglesia",
  "Cerro Niño",
  "Ciénega Grande",
  "El Aguacatal",
  "El Armadillo (San José Armadillo)",
  "El Cangrejo",
  "El Murciélago",
  "El Paraíso",
  "El Portillo",
  "El Salitre",
  "El Zacatal",
  "El Zanate",
  "La Matraca",
  "Pueblo Viejo",
  "San Antonio Cuixtla",
  "San José Atotonilco",
  "San Lucía Teotepec",
  "Santa Lucía Teotepec",
  "Santa María Coixtepec",
  "Santa María Magdalena Tiltepec",
  "Santiago Cuixtla",
  "Otro",
] as const;

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
