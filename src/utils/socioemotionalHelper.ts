import { Planification } from '../types';

export interface MomentoSocioemocionalDetail {
  momentoNumber: number;
  momentoName: string;
  subTitle: string;
  coreEmotion: string;
  description: string;
  socioemotionalPractices: string[];
  syncedRectoras: string;
  syncedRectorasKeys: ('exploracion' | 'juego' | 'arte' | 'literatura')[];
}

export interface RectorSocioemocionalDetail {
  activity: 'Exploración del Medio' | 'Juego' | 'Arte' | 'Literatura';
  coreEmotion: string;
  description: string;
  socioemotionalCapabilities: string[];
  syncedMomentos: string;
  syncedMomentosNumbers: number[];
}

export interface CrossSyncItem {
  momentoNumber: number;
  momentoTitle: string;
  activity: string;
  synergy: string;
}

/**
 * Obtiene los 5 aspectos socioemocionales sincronizados para los 5 momentos de la experiencia pedagógica.
 * Basado en los Lineamientos del MEN Colombia (Decreto 1411 de 2022 y Ley 2503 de Educación Socioemocional).
 */
export function getSynchronizedMomentsSocioemotional(plan: Planification): MomentoSocioemocionalDetail[] {
  const topic = plan.topic || 'la temática de indagación';

  return [
    {
      momentoNumber: 1,
      momentoName: 'Momento 1 • INDAGAR',
      subTitle: 'Escuchar, observar e indagar',
      coreEmotion: 'Acogida Afectiva, Confianza y Asombro',
      description: `Generación de un ambiente de seguridad emocional y contención afectiva donde la niña y el niño se sienten escuchados, valorados y con la confianza de manifestar curiosidad, asombro y dudas iniciales sobre "${topic}" sin temor al error o al juicio.`,
      socioemotionalPractices: [
        'Acogida cálida que transmite serenidad y confianza inicial.',
        'Validación de las emociones espontáneas (asombro, timidez, entusiasmo).',
        'Escucha activa que empodera la voz infantil y el derecho a preguntar.'
      ],
      syncedRectoras: 'Exploración del Medio (asombro sensible) y Literatura (círculos de palabra y acogida)',
      syncedRectorasKeys: ['exploracion', 'literatura']
    },
    {
      momentoNumber: 2,
      momentoName: 'Momento 2 • PROYECTAR',
      subTitle: 'Diseñar ambientes y acuerdos',
      coreEmotion: 'Convivencia, Cuidado Mutuo y Acuerdos Afectivos',
      description: `Construcción participativa de pactos de convivencia en el aula inspirados en "${topic}". Las niñas y niños aprenden a reconocer las necesidades de sus pares, respetar turnos, compartir materiales y asumir acuerdos colectivos fundamentados en la empatía y el buen trato.`,
      socioemotionalPractices: [
        'Pactos dialogados de aula para el cuidado mutuo y el respeto de turnos.',
        'Desarrollo de la empatía al comprender las preferencias de los compañeros.',
        'Autorregulación gradual de impulsos mediante acuerdos compartidos.'
      ],
      syncedRectoras: 'Juego (reglas consensuadas y roles cooperativos) y Literatura (relatos sobre el cuidado)',
      syncedRectorasKeys: ['juego', 'literatura']
    },
    {
      momentoNumber: 3,
      momentoName: 'Momento 3 • VIVIR LA EXPERIENCIA',
      subTitle: 'Acción vivencial activa',
      coreEmotion: 'Goce Vivencial, Autorregulación y Fraternidad',
      description: `Inmersión en talleres y estaciones vivenciales donde conviven el disfrute lúdico y estético alrededor de "${topic}". Se promueve la superación colectiva de pequeñas frustraciones ante retos prácticos, la cooperación fraterna y la libre expresión corporal y emocional.`,
      socioemotionalPractices: [
        'Tolerancia a la frustración y perseverancia ante pequeños obstáculos.',
        'Disfrute compartido en estaciones de trabajo libre y colaborativo.',
        'Expresión liberadora de vivencias internas sin presiones externas.'
      ],
      syncedRectoras: 'Juego (cooperación y desafío lúdico), Arte (catarsis emocional) y Exploración (asombro directo)',
      syncedRectorasKeys: ['juego', 'arte', 'exploracion']
    },
    {
      momentoNumber: 4,
      momentoName: 'Momento 4 • CONSOLIDACIÓN',
      subTitle: 'Recoger, socializar y tejer',
      coreEmotion: 'Autoestima Colectiva, Pertenencia y Gratitud',
      description: `Socialización del producto vivencial acumulado y tejido colectivo de saberes sobre "${topic}". Se afianza el sentido de pertenencia comunitaria, el orgullo legítimo por la creación propia y ajena, y el fortalecimiento del lazo socioafectivo entre la escuela y las familias.`,
      socioemotionalPractices: [
        'Reconocimiento y aplauso al esfuerzo individual y colectivo.',
        'Sentido de pertenencia al grupo y consolidación de la autoestima.',
        'Vínculo afectivo y orgullo compartido en la entrega de experiencias a las familias.'
      ],
      syncedRectoras: 'Arte (exposición comunitaria de obras) y Literatura (relato compartido del proceso)',
      syncedRectorasKeys: ['arte', 'literatura']
    },
    {
      momentoNumber: 5,
      momentoName: 'Momento 5 • VALORACIÓN',
      subTitle: 'Valorar el proceso',
      coreEmotion: 'Validación Sensible y Seguridad Autoestimativa',
      description: `Círculo dialógico y sensible de valoración cualitativa donde se reflexiona sobre cómo se sintió cada niña y niño durante la experiencia con "${topic}". Se erradican calificaciones o comparaciones dañinas, garantizando que cada infante se reconozca valioso, capaz y querido.`,
      socioemotionalPractices: [
        'Diálogo sensible sobre las emociones experimentadas durante el proceso.',
        'Fortalecimiento de la autoimagen positiva y seguridad en las propias capacidades.',
        'Escucha pedagógica respetuosa sin juicios, etiquetas ni notas cuantitativas.'
      ],
      syncedRectoras: 'Literatura (narrativa de la propia experiencia) y Arte (registro gráfico de estados de ánimo)',
      syncedRectorasKeys: ['literatura', 'arte']
    }
  ];
}

/**
 * Obtiene los 4 aspectos socioemocionales sincronizados para las 4 actividades rectoras.
 */
export function getSynchronizedRectorasSocioemotional(plan: Planification): RectorSocioemocionalDetail[] {
  const topic = plan.topic || 'la temática de indagación';

  return [
    {
      activity: 'Exploración del Medio',
      coreEmotion: 'Curiosidad sin Temor, Asombro y Conciencia Ecológica',
      description: `Al interactuar sensorialmente con "${topic}" y su entorno, la niña y el niño superan temores iniciales frente a lo desconocido, toleran la incertidumbre en sus ensayos, desarrollan curiosidad entusiasta y cultivan un profundo sentido de empatía y cuidado por los seres vivos y la naturaleza.`,
      socioemotionalCapabilities: [
        'Seguridad y audacia afectiva para tocar, explorar y preguntar.',
        'Tolerancia a la incertidumbre y resiliencia ante descubrimientos inesperados.',
        'Cuidado amoroso hacia el medio ambiente, seres vivos y espacios compartidos.'
      ],
      syncedMomentos: 'Momento 1 (Indagar • Provocación) y Momento 3 (Vivir la Experiencia • Estaciones sensoriales)',
      syncedMomentosNumbers: [1, 3]
    },
    {
      activity: 'Juego',
      coreEmotion: 'Autorregulación, Empatía y Convivencia Cooperativa',
      description: `A través del juego simbólico, de construcción y roles sobre "${topic}", las niñas y niños aprenden a ponerse en el lugar del otro (toma de perspectiva), a negociar pacíficamente discrepancias, a respetar turnos, a esperar con calma y a experimentar el gozo de la victoria compartida y la solidaridad.`,
      socioemotionalCapabilities: [
        'Autorregulación emocional y gestión constructiva de la frustración al perder o ceder.',
        'Empatía activa al asumir roles de cuidado, protección y fantasía.',
        'Resolución dialógica de conflictos lúdicos y cultivo de lazos de amistad.'
      ],
      syncedMomentos: 'Momento 2 (Proyectar • Acuerdos de juego) y Momento 3 (Vivir la Experiencia • Inmersión activa)',
      syncedMomentosNumbers: [2, 3]
    },
    {
      activity: 'Arte',
      coreEmotion: 'Catarsis, Expresión Genuina y Autoconcepto Positivo',
      description: `Mediante la pintura, el modelado, la música y el movimiento rítmico vinculados a "${topic}", las niñas y niños encuentran un canal seguro y liberador para expresar emociones que aún no logran verbalizar. Fortalecen su autoconcepto al crear con libertad, sin temor a juicios estéticos restrictivos.`,
      socioemotionalCapabilities: [
        'Canalización saludable de tensiones, temores o alegrías profundas.',
        'Autovaloración y orgullo por la originalidad de sus expresiones estéticas.',
        'Goce estético compartido y valoración respetuosa de las creaciones de los pares.'
      ],
      syncedMomentos: 'Momento 3 (Vivir la Experiencia • Creación) y Momento 4 (Consolidación • Ensamble y muestra)',
      syncedMomentosNumbers: [3, 4]
    },
    {
      activity: 'Literatura',
      coreEmotion: 'Identificación Emocional, Empatía Narrativa y Contención',
      description: `A través de cuentos, rimas, nanas y poesía infantil sobre "${topic}", los infantes ponen nombre y rostro a sus emociones al identificarse con los personajes. El círculo de la palabra brinda un refugio de serenidad, arrullo y escucha respetuosa que fortifica el vínculo socioafectivo del grupo.`,
      socioemotionalCapabilities: [
        'Vocabulario socioemocional: nombrar con claridad alegrías, miedos, celos o afectos.',
        'Empatía narrativa: comprender y conmoverse ante las vivencias de personajes y pares.',
        'Sensación de serenidad, cobijo afectivo y seguridad en la comunidad de aula.'
      ],
      syncedMomentos: 'Momento 1 (Indagar • Círculo de acogida) y Momento 5 (Valoración • Narración reflexiva)',
      syncedMomentosNumbers: [1, 5]
    }
  ];
}

/**
 * Genera la matriz cruzada de articulación socioemocional entre Momentos y Actividades Rectoras.
 */
export function getSocioemotionalCrossMatrix(plan: Planification): CrossSyncItem[] {
  return [
    {
      momentoNumber: 1,
      momentoTitle: 'Indagar (Acogida)',
      activity: 'Exploración & Literatura',
      synergy: 'La lectura provocadora y el contacto sensorial con el entorno detonan asombro y seguridad para preguntar sin inhibiciones.'
    },
    {
      momentoNumber: 2,
      momentoTitle: 'Proyectar (Pactos)',
      activity: 'Juego & Literatura',
      synergy: 'Los relatos infantiles inspiran los acuerdos de cuidado mutuo, mientras que el juego pactado enseña el respeto a los turnos y materiales.'
    },
    {
      momentoNumber: 3,
      momentoTitle: 'Vivir la Experiencia (Acción)',
      activity: 'Juego, Arte & Exploración',
      synergy: 'Las estaciones vivenciales permiten la catarsis creadora, la cooperación lúdica fraterna y la tolerancia ante retos y frustraciones prácticas.'
    },
    {
      momentoNumber: 4,
      momentoTitle: 'Consolidación (Socialización)',
      activity: 'Arte & Literatura',
      synergy: 'El mural colectivo y el relato compartido consolidan la autoestima, el sentido de pertenencia y el orgullo afectivo con las familias.'
    },
    {
      momentoNumber: 5,
      momentoTitle: 'Valoración (Seguimiento)',
      activity: 'Literatura & Diálogo Reflexivo',
      synergy: 'La palabra sensible en asamblea valida las vivencias afectivas de cada niña/niño, construyendo autoimagen positiva sin notas numéricas.'
    }
  ];
}
