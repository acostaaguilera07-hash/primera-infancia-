import { Planification, PropositoArticulado } from '../types';

export const PROPOSITOS_MEN_BASE: Array<{
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  officialText: string;
  defaultImprescindibles: string[];
}> = [
  {
    id: 'proposito-1',
    code: 'Propósito 1',
    title: 'Propósito 1: Identidad, Autonomía y Pertenencia',
    shortTitle: 'Identidad, Autonomía y Vínculos Afectivos',
    officialText: 'Las niñas y los niños construyen su identidad en relación con los otros; se sienten queridos, y valoran positivamente pertenecer a una familia, cultura y mundo.',
    defaultImprescindibles: [
      'Reconocimiento de sí mismo, autoimagen positiva y valoración de su singularidad.',
      'Identificación y expresión progresiva de emociones, sensaciones y necesidades.',
      'Construcción de hábitos de autocuidado, alimentación y bienestar corporal.',
      'Establecimiento de vínculos afectivos seguros y pactos armónicos de convivencia.'
    ]
  },
  {
    id: 'proposito-2',
    code: 'Propósito 2',
    title: 'Propósito 2: Comunicación Activa y Lenguajes',
    shortTitle: 'Comunicación Activa, Lenguajes y Expresión',
    officialText: 'Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad a través de diversos lenguajes.',
    defaultImprescindibles: [
      'Comunicación verbal y gestual espontánea para relatar vivencias, gustos y preguntas.',
      'Disfrute de la literatura infantil, oralidad, narraciones, rimas y canciones.',
      'Apropiación de lenguajes artísticos: trazo gráfico, pintura, modelado y música.',
      'Escucha atenta, diálogo afectuoso y respeto por la palabra del otro.'
    ]
  },
  {
    id: 'proposito-3',
    code: 'Propósito 3',
    title: 'Propósito 3: Indagación y Relación con el Mundo',
    shortTitle: 'Indagación, Curiosidad y Exploración del Mundo',
    officialText: 'Las niñas y los niños disfrutan de aprender; exploran y se relacionan con el mundo para comprenderlo y construirlo.',
    defaultImprescindibles: [
      'Curiosidad, asombro y formulación de preguntas sobre fenómenos del entorno.',
      'Exploración sensorial directa, manipulación de texturas y experimentación.',
      'Relaciones espaciales, temporales y nociones de pensamiento lógico-matemático.',
      'Cuidado, respeto y empatía por los seres vivos, el agua y la naturaleza.'
    ]
  },
  {
    id: 'proposito-4',
    code: 'Propósito 4',
    title: 'Propósito 4: Cuerpo, Territorio y Movimiento',
    shortTitle: 'Expresión Corporal, Territorio y Movimiento Libre',
    officialText: 'Las niñas y los niños descubren sus posibilidades corporales, se apropian de los espacios y vivencian el territorio desde el juego y el movimiento libre.',
    defaultImprescindibles: [
      'Conciencia y disfrute del esquema corporal dinámico en movimiento libre.',
      'Desplazamiento seguro y orientación en los espacios del aula, patio y territorio.',
      'Coordinación visomotriz, equilibrio y destreza en juegos psicomotores.',
      'Vivencia de saberes locales, tradiciones y juego simbólico cooperativo.'
    ]
  }
];

/**
 * Retorna la lista estructurada de Propósitos articulados con sus Imprescindibles
 * para cualquier planeación (experiencias, proyectos o contenidos).
 */
export function getArticulatedPropositos(plan: Planification): PropositoArticulado[] {
  if (plan.propositosArticulados && plan.propositosArticulados.length > 0) {
    return plan.propositosArticulados;
  }

  const learnings = plan.essentialLearnings || [];
  const topic = plan.topic || '';

  return PROPOSITOS_MEN_BASE.map((base, idx) => {
    // Si la planeación tiene aprendizajes imprescindibles registrados, articulamos de manera directa
    const directLearning = learnings[idx];
    const contextualImprescindibles: string[] = [];

    if (directLearning) {
      contextualImprescindibles.push(directLearning);
    }

    // Agregar 1 o 2 imprescindibles específicos pedagógicos vinculados a la temática y al propósito
    if (idx === 0) {
      contextualImprescindibles.push(
        `Reconocimiento de sí mismo y expresión afectuosa al explorar "${topic}".`
      );
    } else if (idx === 1) {
      contextualImprescindibles.push(
        `Expresión verbal, plástica y musical de ideas y creaciones en torno a "${topic}".`
      );
    } else if (idx === 2) {
      contextualImprescindibles.push(
        `Indagación activa, hipótesis y preguntas infantiles sobre "${topic}".`
      );
    } else {
      contextualImprescindibles.push(
        `Apropiación corporal del espacio y juego colectivo vivenciando "${topic}".`
      );
    }

    return {
      id: base.id,
      proposito: base.officialText,
      shortTitle: base.shortTitle,
      imprescindibles: Array.from(new Set(contextualImprescindibles.filter(Boolean)))
    };
  });
}
