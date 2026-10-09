import { HIGH_QUALITY_SAMPLE_IMAGES } from '../data/generatedImages';

export interface PlanImageSet {
  headerImageUrl: string;
  productImageUrl: string;
  phaseImageUrls: string[];
}

const ALL_IMAGES_ARRAY = [
  HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza,
  HIGH_QUALITY_SAMPLE_IMAGES.arteMural,
  HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo,
  HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral,
  HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor,
  HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento,
  HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin,
  HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario,
  HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma,
  HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua,
  HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras,
  HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores,
  HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques,
  HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos,
  HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura,
  HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos,
  HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera,
  HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil,
  HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas,
  HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos,
  HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo,
  HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas,
  HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia,
  HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma,
  HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia,
  HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas,
  HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender,
  HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales,
  HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical,
  HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales,
  HIGH_QUALITY_SAMPLE_IMAGES.vocalesLetras,
  HIGH_QUALITY_SAMPLE_IMAGES.conteoFiguras,
  HIGH_QUALITY_SAMPLE_IMAGES.experimentoVolcan,
  HIGH_QUALITY_SAMPLE_IMAGES.cuidadoPlaneta,
  HIGH_QUALITY_SAMPLE_IMAGES.saludHigiene,
  HIGH_QUALITY_SAMPLE_IMAGES.cuerpoHumanoEspejo,
  HIGH_QUALITY_SAMPLE_IMAGES.familiaArbol,
  HIGH_QUALITY_SAMPLE_IMAGES.profesionesComunidad,
  HIGH_QUALITY_SAMPLE_IMAGES.ecosistemaMarino,
  HIGH_QUALITY_SAMPLE_IMAGES.espacioEstrellas,
  HIGH_QUALITY_SAMPLE_IMAGES.estacionesClima,
  HIGH_QUALITY_SAMPLE_IMAGES.alimentosFrutas,
  HIGH_QUALITY_SAMPLE_IMAGES.mascotasAnimales,
  HIGH_QUALITY_SAMPLE_IMAGES.instrumentosReciclados,
  HIGH_QUALITY_SAMPLE_IMAGES.juegoLucesSombras,
  HIGH_QUALITY_SAMPLE_IMAGES.compostaAbono,
  HIGH_QUALITY_SAMPLE_IMAGES.poesiaRimas,
  HIGH_QUALITY_SAMPLE_IMAGES.yogaMeditacion,
  HIGH_QUALITY_SAMPLE_IMAGES.folclorCumbia,
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a set of 6 UNIQUE, VARIED, TOPIC-MATCHED images according to title, topic, type, and phases.
 * Guarantees no duplicate images within the same plan layout and high variety between different plans.
 */
export function getPlanImagesByTitle(
  planTitle: string,
  topic: string = '',
  expectedResult: string = '',
  planType: string = '',
  phases?: any[]
): PlanImageSet {
  let phasesText = '';
  if (phases && Array.isArray(phases)) {
    phasesText = phases.map(p => `${p.title || ''} ${p.name || ''} ${p.description || ''}`).join(' ');
  }

  const fullText = (planTitle + ' ' + topic + ' ' + expectedResult + ' ' + planType + ' ' + phasesText).toLowerCase();
  const seedHash = hashString(planTitle + topic);

  const selected = new Set<string>();

  const pickUniqueFrom = (candidates: string[], offset: number = 0): string => {
    if (!candidates || candidates.length === 0) return ALL_IMAGES_ARRAY[offset % ALL_IMAGES_ARRAY.length];
    
    const startIdx = offset % candidates.length;
    for (let i = 0; i < candidates.length; i++) {
      const idx = (startIdx + i) % candidates.length;
      const img = candidates[idx];
      if (img && !selected.has(img)) {
        selected.add(img);
        return img;
      }
    }
    // Fallback across all images starting from offset
    for (let i = 0; i < ALL_IMAGES_ARRAY.length; i++) {
      const idx = (offset + i) % ALL_IMAGES_ARRAY.length;
      const img = ALL_IMAGES_ARRAY[idx];
      if (img && !selected.has(img)) {
        selected.add(img);
        return img;
      }
    }
    return ALL_IMAGES_ARRAY[0];
  };

  // Expanded Domain Detections
  const isMusic = fullText.includes('música') || fullText.includes('ritmo') || fullText.includes('sonor') || fullText.includes('tambor') || fullText.includes('canción') || fullText.includes('sonido') || fullText.includes('baile') || fullText.includes('cintas') || fullText.includes('instrumento') || fullText.includes('orquesta') || fullText.includes('folclor') || fullText.includes('cumbia');
  const isArt = fullText.includes('arte') || fullText.includes('mural') || fullText.includes('pintura') || fullText.includes('pincel') || fullText.includes('dibujo') || fullText.includes('modelado') || fullText.includes('plastilina') || fullText.includes('arcilla') || fullText.includes('huella') || fullText.includes('manualidad') || fullText.includes('tejido') || fullText.includes('hilo');
  const isMovement = fullText.includes('movimiento') || fullText.includes('cuerpo') || fullText.includes('motor') || fullText.includes('circuito') || fullText.includes('salto') || fullText.includes('deporte') || fullText.includes('psicomotricidad') || fullText.includes('juego libre') || fullText.includes('yoga') || fullText.includes('respiración');
  const isLiterature = fullText.includes('cuento') || fullText.includes('lectura') || fullText.includes('literatura') || fullText.includes('historia') || fullText.includes('libro') || fullText.includes('teatro') || fullText.includes('sombras') || fullText.includes('máscara') || fullText.includes('títere') || fullText.includes('vocal') || fullText.includes('letra') || fullText.includes('poesía') || fullText.includes('rima') || fullText.includes('trabalengua') || fullText.includes('alfabeto');
  const isNature = fullText.includes('naturaleza') || fullText.includes('jardín') || fullText.includes('flores') || fullText.includes('bicho') || fullText.includes('lupa') || fullText.includes('detective') || fullText.includes('hoja') || fullText.includes('biodiversidad') || fullText.includes('agua') || fullText.includes('animal') || fullText.includes('planta') || fullText.includes('mascota') || fullText.includes('marino') || fullText.includes('mar') || fullText.includes('pez') || fullText.includes('acuario') || fullText.includes('clima') || fullText.includes('lluvia') || fullText.includes('estación');
  const isChagra = fullText.includes('chagra') || fullText.includes('ancestr') || fullText.includes('semilla') || fullText.includes('tierra') || fullText.includes('huerta') || fullText.includes('siembra') || fullText.includes('frasco') || fullText.includes('germinación') || fullText.includes('etno') || fullText.includes('territorio') || fullText.includes('composta') || fullText.includes('abono') || fullText.includes('reciclaje') || fullText.includes('planeta') || fullText.includes('ecolog');
  const isSocioemotional = fullText.includes('emoción') || fullText.includes('calma') || fullText.includes('diario') || fullText.includes('sentir') || fullText.includes('ley 2503') || fullText.includes('empatía') || fullText.includes('afecto') || fullText.includes('abrazo') || fullText.includes('convivencia') || fullText.includes('meditación') || fullText.includes('familia') || fullText.includes('espejo') || fullText.includes('rostro') || fullText.includes('autoconocimiento');
  const isCooking = fullText.includes('cocina') || fullText.includes('sabor') || fullText.includes('receta') || fullText.includes('alimento') || fullText.includes('comida') || fullText.includes('fruta') || fullText.includes('gastronomía') || fullText.includes('salud') || fullText.includes('higiene') || fullText.includes('jabón');
  const isLogic = fullText.includes('construcción') || fullText.includes('bloque') || fullText.includes('madera') || fullText.includes('lógica') || fullText.includes('matemátic') || fullText.includes('geometría') || fullText.includes('conteo') || fullText.includes('figura') || fullText.includes('número') || fullText.includes('experimento') || fullText.includes('volcán') || fullText.includes('espacio') || fullText.includes('estrella') || fullText.includes('planeta') || fullText.includes('luz') || fullText.includes('sombra');
  const isDemocracy = fullText.includes('feria') || fullText.includes('comunidad') || fullText.includes('voto') || fullText.includes('democracia') || fullText.includes('exposición') || fullText.includes('celebración') || fullText.includes('profesión') || fullText.includes('oficio') || fullText.includes('comunitaria');

  // 1. HEADER IMAGE
  let headerCandidates: string[] = [];
  if (isMusic) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales];
  } else if (isArt) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.arteMural, HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
  } else if (isMovement) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical];
  } else if (isLiterature) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento, HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras, HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales];
  } else if (isChagra) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral, HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera];
  } else if (isNature) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas, HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin, HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua];
  } else if (isSocioemotional) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma, HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma, HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo, HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia];
  } else if (isCooking) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral];
  } else if (isLogic) {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
  } else {
    headerCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos];
  }
  const headerImageUrl = pickUniqueFrom(headerCandidates, seedHash);

  // 2. PRODUCT IMAGE
  let productCandidates: string[] = [];
  if (isDemocracy || fullText.includes('feria') || fullText.includes('exposición') || fullText.includes('compartir')) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas];
  } else if (isMusic) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales];
  } else if (isArt) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas, HIGH_QUALITY_SAMPLE_IMAGES.arteMural, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
  } else if (isLiterature) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales, HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras, HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura];
  } else if (isChagra || isNature) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera];
  } else if (isSocioemotional) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia, HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia];
  } else if (isCooking) {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
  } else {
    productCandidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
  }
  const productImageUrl = pickUniqueFrom(productCandidates, seedHash + 1);

  // 3. PHASE / MOMENT IMAGES (4 distinct steps)
  let p1Candidates: string[] = [];
  let p2Candidates: string[] = [];
  let p3Candidates: string[] = [];
  let p4Candidates: string[] = [];

  if (isMusic) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos, HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo];
  } else if (isArt) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas, HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.arteMural, HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos, HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario, HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia];
  } else if (isMovement) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia];
  } else if (isLiterature) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas, HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento, HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras, HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento];
  } else if (isChagra) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral, HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas, HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral, HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil, HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral];
  } else if (isSocioemotional) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo, HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma, HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia, HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma, HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil, HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera];
  } else if (isCooking) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos, HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia];
  } else if (isLogic) {
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas, HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender, HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
  } else {
    // Default Nature / Mixed / General
    p1Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas, HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua, HIGH_QUALITY_SAMPLE_IMAGES.detectivesLetrasLupas];
    p2Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento, HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo, HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia];
    p3Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario, HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos];
    p4Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera, HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia, HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical];
  }

  const p1Url = pickUniqueFrom(p1Candidates, seedHash + 2);
  const p2Url = pickUniqueFrom(p2Candidates, seedHash + 3);
  const p3Url = pickUniqueFrom(p3Candidates, seedHash + 4);
  const p4Url = pickUniqueFrom(p4Candidates, seedHash + 5);
  const p5Candidates = [HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma, HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia, HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo, HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma];
  const p5Url = pickUniqueFrom(p5Candidates, seedHash + 6);

  return {
    headerImageUrl,
    productImageUrl,
    phaseImageUrls: [p1Url, p2Url, p3Url, p4Url, p5Url]
  };
}

export function getPlanThumbnail(planTitle: string, topic: string = '', planId: string = ''): string {
  const full = (planTitle + ' ' + topic).toLowerCase();
  const seed = hashString(planTitle + topic + planId);

  let matches: string[] = [];

  if (full.includes('música') || full.includes('ritmo') || full.includes('tambor') || full.includes('danza') || full.includes('cintas')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo, HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos];
  } else if (full.includes('mural') || full.includes('arte') || full.includes('pintura') || full.includes('huellas')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.arteMural, HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
  } else if (full.includes('chagra') || full.includes('ancestr') || full.includes('huerta') || full.includes('siembra')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral, HIGH_QUALITY_SAMPLE_IMAGES.siembraFrascos, HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil];
  } else if (full.includes('movimiento') || full.includes('cuerpo') || full.includes('motor') || full.includes('circuito')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor, HIGH_QUALITY_SAMPLE_IMAGES.expresionJuegoAnimales, HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos];
  } else if (full.includes('cuento') || full.includes('lectura') || full.includes('libro') || full.includes('teatro')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura, HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento, HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras, HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales];
  } else if (full.includes('emoción') || full.includes('calma') || full.includes('diario') || full.includes('sentir') || full.includes('abrazo')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma, HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma, HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia, HIGH_QUALITY_SAMPLE_IMAGES.emocionesCirculo];
  } else if (full.includes('cocina') || full.includes('sabor') || full.includes('receta')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores, HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera];
  } else if (full.includes('detective') || full.includes('lupa') || full.includes('jardín') || full.includes('agua') || full.includes('bicho')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas, HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin, HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua];
  } else if (full.includes('bloque') || full.includes('construcción') || full.includes('madera')) {
    matches = [HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques, HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender];
  } else {
    matches = [
      HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza,
      HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera,
      HIGH_QUALITY_SAMPLE_IMAGES.mesasCrearAprender,
      HIGH_QUALITY_SAMPLE_IMAGES.juegoPanuelos,
      HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia
    ];
  }

  return matches[seed % matches.length];
}
