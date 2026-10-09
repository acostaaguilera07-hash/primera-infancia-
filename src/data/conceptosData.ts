import { AgeRange, DimensionType, Planification, RectorActivityDetail } from '../types';

export function convertConceptToPlan(unit: ConceptPlanUnit): Planification {
  const categoryProductMap: Record<string, string> = {
    'Pensamiento Matemático': `Instalación tridimensional, circuito de retos numéricos y juego de piso colectivo sobre "${unit.conceptName}".`,
    'Comunicación': `Libro gigante colectivo de telas, mini-teatro de títeres/sombras y asamblea de diálogo sobre "${unit.conceptName}".`,
    'Exploración del Medio': `Museo de hallazgos y descubrimientos del territorio, terrario/huerto vivo e instalación sensorial sobre "${unit.conceptName}".`,
    'Arte': `Galería de expresión plástica, esculturas en material reutilizable e instalación lumínica/sensorial sobre "${unit.conceptName}".`,
    'Juego': `Festival de roles dramáticos, carnaval vivencial de la comunidad y muestra de escenarios simbólicos sobre "${unit.conceptName}".`
  };

  const dynamicExpectedResult = categoryProductMap[unit.category] || unit.creativeConsolidation.description || `Producción creativa y vivencial colectiva sobre "${unit.conceptName}".`;

  return {
    id: `plan-concept-${unit.id}`,
    type: 'contenido',
    ageRange: unit.ageRange,
    selectedDimensions: unit.dimensions,
    topic: unit.conceptName,
    title: `PLANEACIÓN DE CONTENIDO: ${unit.conceptName.toUpperCase()}`,
    duration: '1 a 2 semanas',
    targetAudience: 'Grupo de Primera Infancia y Comunidad Educativa',
    relationalAxis: 'Relación con el mundo, los lenguajes y la naturaleza',
    theExperience: unit.guidingQuestion,
    problematizingQuestion: unit.guidingQuestion,
    justification: unit.justification,
    generalObjective: `Potenciar el desarrollo del pensamiento, la indagación y la expresión respecto al contenido de "${unit.conceptName}" en niños de ${unit.ageRange}, integrando la vivencia sensorial y el juego.`,
    essentialLearnings: unit.aprendizajesImprescindibles,
    capacitiesToDevelop: unit.evaluativeDescriptors,
    expectedResult: dynamicExpectedResult,
    phases: [
      {
        phaseNumber: 1,
        name: 'Momento 1: Indagar (Provocación Sensorial y Acogida)',
        timeframe: 'Momento 1',
        milestone: 'Inspiración Sensorial',
        title: unit.sensoryProvocation.title,
        description: unit.sensoryProvocation.description,
        strategiesAndVoices: [
          `Uso de materiales: ${unit.sensoryProvocation.materials.join(', ')}`,
          'Provocación sensorial directa en el aula',
          'Apertura de preguntas infantiles'
        ],
        svgType: 'nature'
      },
      {
        phaseNumber: 2,
        name: 'Momento 2: Proyectar (Acuerdos y Organización)',
        timeframe: 'Momento 2',
        milestone: 'Construcción Activa del Saber',
        title: unit.guidedExploration.title,
        description: unit.guidedExploration.description,
        strategiesAndVoices: [
          `Estaciones de trabajo con: ${unit.guidedExploration.materials.join(', ')}`,
          'Experimentación directa y trabajo en pequeños grupos',
          'Mediación pedagógica de conceptos'
        ],
        svgType: 'wind'
      },
      {
        phaseNumber: 3,
        name: 'Momento 3: Vivir la Experiencia (Exploración Activa)',
        timeframe: 'Momento 3',
        milestone: 'Vivencia Lúdica y Manipulación',
        title: `Vivencia de ${unit.conceptName}`,
        description: `Los niños manipulan, juegan y exploran en estaciones activas con materiales concretos para apropiar el concepto de "${unit.conceptName}".`,
        strategiesAndVoices: [
          'Manipulación de elementos del entorno y retos sensoriales',
          'Juego libre y cooperativo en estaciones',
          'Formulación de hipótesis espontáneas'
        ],
        svgType: 'planting'
      },
      {
        phaseNumber: 4,
        name: 'Momento 4: Consolidación Creativa y Muestra',
        timeframe: 'Momento 4',
        milestone: 'Representación Simbólica y Producción',
        title: unit.creativeConsolidation.title,
        description: unit.creativeConsolidation.description,
        strategiesAndVoices: [
          `Creación colectiva con: ${unit.creativeConsolidation.materials.join(', ')}`,
          'Expresión artística o representación simbólica',
          'Muestra de creaciones con la comunidad educativa'
        ],
        svgType: 'gallery'
      },
      {
        phaseNumber: 5,
        name: 'Momento 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
        timeframe: 'Momento 5',
        milestone: 'Seguimiento Cualitativo al Saber',
        title: `Valoración del Proceso: ${unit.conceptName}`,
        description: `Círculo dialógico donde los niños comparten lo que descubrieron sobre ${unit.conceptName}. Registro cualitativo en diarios de campo, bitácora y portafolio de evidencias sin calificar ni rotular.`,
        strategiesAndVoices: [
          `Asamblea infantil: "¿Qué descubrimos hoy sobre ${unit.conceptName}?"`,
          'Registro en diario de campo con descriptores cualitativos',
          'Documentación en el portafolio de evidencias'
        ],
        svgType: 'gallery'
      }
    ],
    rectorActivities: unit.rectorActivities,
    familyInvolvement: unit.familyActivity,
    inclusionPIAR: unit.adaptationsDUA,
    propositosMEN: [unit.propositoMEN],
    valorarElProceso: {
      seguimiento: 'Seguimiento cualitativo a la apropiación de conceptos mediante la exploración lúdica y expresión creadora.',
      instrumentos: [
        'Diarios de campo pedagógicos',
        'Bitácora de aula y bitácora viajera',
        'Portafolio de evidencias y producciones infantiles',
        'Estudio de casos y anecdotario formativo'
      ]
    },
    createdAt: new Date().toISOString()
  };
}

export interface ConceptPlanUnit {
  id: string;
  conceptName: string;
  category: 'Pensamiento Matemático' | 'Comunicación' | 'Exploración del Medio' | 'Arte' | 'Juego';
  icon: string;
  ageRange: AgeRange;
  dimensions: DimensionType[];
  aprendizajesImprescindibles: string[];
  propositoMEN: string;
  guidingQuestion: string;
  justification: string;
  sensoryProvocation: {
    title: string;
    description: string;
    materials: string[];
  };
  guidedExploration: {
    title: string;
    description: string;
    materials: string[];
  };
  creativeConsolidation: {
    title: string;
    description: string;
    materials: string[];
  };
  evaluativeDescriptors: string[];
  adaptationsDUA: string;
  familyActivity: string;
  rectorActivities?: RectorActivityDetail[];
}

export const CONCEPTOS_PREDEFINIDOS: ConceptPlanUnit[] = [
  {
    id: 'concepto-el-cuadrado',
    conceptName: 'El Cuadrado y las Formas Geométricas',
    category: 'Pensamiento Matemático',
    icon: '🔲',
    ageRange: '2 a 4 años',
    dimensions: ['COGNITIVA', 'CORPORAL', 'COMUNICATIVA Y CREATIVA'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Compara, dibuja y construye formas bidimensionales y tridimensionales.',
      'Aprendizaje Imprescindible 2: Identifica atributos medibles en objetos y formas del entorno.',
      'Aprendizaje Imprescindible 3: Reconoce relaciones espaciales (arriba/abajo, dentro/fuera) en objetos geométricos.'
    ],
    propositoMEN: 'Propósito 3: Los niños y las niñas disfrutan aprendiendo, exploran y se relacionan con el mundo para comprenderlo y construirlo.',
    guidingQuestion: '¿Dónde se esconden las cuatro esquinas y los cuatro lados iguales de la figura del cuadrado en nuestro salón?',
    justification: 'El concepto del cuadrado potencia la discriminación visual, el pensamiento espacio-temporal y la estructuración del esquema cognitivo en la primera infancia. A través de la manipulación sensorial de bloques, cintas y sellos, el niño pasa de la mera percepción a la conceptualización simbólica de la forma geométrica.',
    sensoryProvocation: {
      title: 'Momento 1: Provocación Sensorial y Caza del Cuadrado Secreto',
      description: 'El docente presenta una "Caja Misteriosa Cuadrada" cubierta con una tela de texturas. Dentro hay ventanas, servilletas, portarretratos y bloques cuadrados. Los niños tocan a ciegas e intentan contar los 4 lados y las 4 esquinas rectas con los dedos mientras entonan la canción "Tengo cuatro lados iguales".',
      materials: ['Caja de cartón cuadrada', 'Bloques de madera', 'Telas de texturas', 'Portarretratos', 'Cinta de enmascarar para trazar un cuadrado gigante en el piso']
    },
    guidedExploration: {
      title: 'Momento 2: Estaciones de Construcción y Caminata de Equilibrio Geométrico',
      description: 'Se organizan dos estaciones: 1) Caminata kinestésica sobre las líneas rectilíneas del cuadrado gigante trazado en el suelo con cinta, colocando huellas de pies en cada esquina. 2) Ensamblaje con palitos de helado y plastilina casera para armar estructuras cuadradas en 2D y 3D.',
      materials: ['Palitos de helado de colores', 'Plastilina de colores', 'Cinta adhesiva de piso', 'Bloques de construcción']
    },
    creativeConsolidation: {
      title: 'Momento 3: Taller de Estampado de Arte Cuadrado y Cierre Compartido',
      description: 'Los estudiantes usan esponjas y bloques de madera cuadrados sumergidos en pintura dactilar para estampar un mural colectivo titulado "El Pueblo de los Cuadrados". Reflexionan sobre los objetos cuadrados encontrados en sus casas.',
      materials: ['Esponjas recortadas en forma cuadrada', 'Pinturas lavables de colores', 'Papel Kraft gigante', 'Toallitas húmedas']
    },
    evaluativeDescriptors: [
      'Reconoce la forma geométrica del cuadrado diferenciándola de otras formas en su entorno cotidiano.',
      'Cuenta o señala con precisión los cuatro lados iguales y esquinas de una figura cuadrada.',
      'Construye representaciones cuadradas utilizando material concreto (palitos, plastilina, bloques).'
    ],
    adaptationsDUA: 'Para estudiantes con variabilidad sensorial o motora, se facilitan marcos cuadrados con relieve de lana para rastreo táctil y pinceles con mango engrosado.',
    familyActivity: 'Cacería fotográfica en familia: Buscar 3 objetos cuadrados en la cocina o habitación y traer un dibujo o foto al aula.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Cacería de cuadrados en el entorno: Los niños recorren el aula y el patio identificando objetos con 4 lados rectos (marcos de fotos, baldosas, ventanas, servilletas, mesas).",
        "howChildApplies": "El niño/a toca los bordes con las yemas de sus dedos, cuenta 1, 2, 3, 4 esquinas, compara una baldosa con una hoja cuadrada y comprueba si los 4 lados miden lo mismo usando sus manos o cintas."
    },
    {
        "activity": "Juego",
        "description": "Circuito psicomotor \"El Salto de la Caja Cuadrada\" y rayuela geométrica en el piso trazada con tiza o cinta.",
        "howChildApplies": "El niño/a salta dentro y fuera de los cuadrados dibujados en el suelo, camina haciendo equilibrio sobre los lados rectos sin salirse de la línea y juega al \"veo veo\" de formas geométricas con sus compañeros."
    },
    {
        "activity": "Arte",
        "description": "Estampado con esponjas y bloques cuadrados sobre papel kraft gigante y construcción de marcos con palitos de madera y plastilina.",
        "howChildApplies": "El niño/a unta pintura de colores en sellos cuadrados para crear patrones y secuencias, presiona con fuerza sobre el papel y une cuatro palitos en las esquinas con bolitas de plastilina para construir un marco tridimensional."
    },
    {
        "activity": "Literatura",
        "description": "Lectura dialógica del cuento \"La aventura del cuadrado aventurero\" y rimas sonoras sobre las figuras geométricas.",
        "howChildApplies": "El niño/a escucha la narración reconociendo cuándo el personaje cuadrado se transforma en casa o regalo, recita versitos en coro marcando el ritmo con palmas y nombra cosas cuadradas de su imaginación."
    }
]
  },
  {
    id: 'concepto-la-familia',
    conceptName: 'La Familia, Afecto y mi Entorno Social',
    category: 'Comunicación',
    icon: '👨‍👩‍👧‍👦',
    ageRange: '2 a 4 años',
    dimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'CIUDADANA Y POLÍTICA'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Reconoce que forma parte de una familia y una comunidad con costumbres y valores.',
      'Aprendizaje Imprescindible 2: Muestra consideración y respeto por sus pares y familiares en interacciones cotidianas.',
      'Aprendizaje Imprescindible 3: Expresa libremente sus pensamientos, emociones e historias vinculadas con su núcleo familiar.'
    ],
    propositoMEN: 'Propósito 1: Los niños y las niñas construyen su identidad en relación con los otros; se sienten queridos y valoran positivamente pertenecer a una familia.',
    guidingQuestion: '¿Quiénes componen mi hermosa familia y qué actividades llenas de amor compartimos juntos en el hogar?',
    justification: 'El concepto de familia en la educación inicial es el pilar afectivo primario. Permite al niño afianzar su seguridad emocional, reconocer la diversidad de tipologías familiares (monoparentales, extensas, homoparentales, de crianza por abuelos) y valorar el respeto, la gratitud y los acuerdos de convivencia cotidiana.',
    sensoryProvocation: {
      title: 'Momento 1: La Galería de Retratos Afectivos y Cuento de Abrazos',
      description: 'Lectura dramatizada del cuento "Mi Familia es Especial". Los niños descubren un rincón decorado con fotografías familiares traídas desde sus casas sostenidas con broches de madera en una guirnalda de luz cálida. Comparten a quiénes ven en la foto y qué sienten por ellos.',
      materials: ['Fotografías familiares aportadas por los padres', 'Broches de madera', 'Guirnalda de luces cálidas', 'Cuento ilustrado sobre familias']
    },
    guidedExploration: {
      title: 'Momento 2: Construcción del Árbol de las Manitas Afectivas',
      description: 'Cada niño plasma la huella de su mano con pintura de colores sobre una hoja y coloca las huellas de su familia o dibuja con crayolas gruesas a las personas que viven en su casa dentro del tronco del árbol del aula.',
      materials: ['Pintura dactilar ecológica', 'Hojas con el tronco del árbol dibujado', 'Crayolas gruesas', 'Pegamento en barra']
    },
    creativeConsolidation: {
      title: 'Momento 3: Representación Semiótica en la Casita del Juego Simbólico',
      description: 'Juego de roles en el Rincón de la Casita donde los niños asumen roles de cuidado (preparar alimentos, arrullar al bebé, cuidar las plantas, leer un cuento), vivenciando la reciprocidad y el amor intrafamiliar.',
      materials: ['Utensilios de cocina de juguete', 'Muñecos de tela', 'Delantales', 'Cuentos infantiles cortitos']
    },
    evaluativeDescriptors: [
      'Nombra y reconoce a los miembros de su núcleo familiar expresando afecto por ellos.',
      'Comprende que existen diversas formas de familias y que todas se fundamentan en el amor y el cuidado.',
      'Participa en juegos de roles representando situaciones de ayuda y convivencia familiar.'
    ],
    adaptationsDUA: 'Uso de pictogramas con símbolos familiares para niños con retos en la comunicación verbal y álbumes táctiles con telas.',
    familyActivity: 'El Cofre de los Recuerdos: Enviar en una caja un objeto o foto significativa de la familia para compartir una anécdota en la asamblea.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Indagación sobre los objetos, fotos, oficios y tradiciones de las familias en la comunidad escolar y el vecindario.",
        "howChildApplies": "El niño/a observa fotografías familiares, identifica a quiénes viven en su casa, compara los diferentes tipos de viviendas y describe qué utensilios u objetos usan sus padres en sus trabajos cotidianos."
    },
    {
        "activity": "Juego",
        "description": "Juego de roles en el Rincón del Hogar (\"La Casita del Afecto\"): preparar comida, arrullar al muñeco, ir al mercado.",
        "howChildApplies": "El niño/a asume el papel de mamá, papá, abuelita o hermano, recrea diálogos afectuosos, sirve alimentos imaginarios a sus pares y practica acuerdos de cuidado y resolución no violenta de conflictos."
    },
    {
        "activity": "Arte",
        "description": "Mural \"El Árbol de las Huellas Familiares\": estampación de manos con témpera y dibujo libre del núcleo familiar.",
        "howChildApplies": "El niño/a plasma su manita con pintura, traza con crayolas a las personas significativas de su vida agregando detalles como sonrisas y cabellos, y decora portarretratos con materiales reciclables."
    },
    {
        "activity": "Literatura",
        "description": "Lectura en voz alta de cuentos sobre diversidad familiar (\"Familias de todos los colores\"), coplas y nanas transmitidas por abuelos.",
        "howChildApplies": "El niño/a sigue con fascinación la historia, comparte en voz alta anécdotas de su casa, imita los gestos tiernos de los personajes y aprende nanas y arrullos típicos de su región."
    }
]
  },
  {
    id: 'concepto-mi-cuerpo',
    conceptName: 'Mi Cuerpo, Esquema Corporal y Movimiento',
    category: 'Exploración del Medio',
    icon: '🧍‍♂️',
    ageRange: '2 a 4 años',
    dimensions: ['CORPORAL', 'SOCIOEMOCIONAL', 'COGNITIVA', 'ÉTICA'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Toma conciencia de las posibilidades de movimiento de su cuerpo y explora el espacio.',
      'Aprendizaje Imprescindible 2: Muestra independencia en la realización de prácticas de higiene, alimentación y vestuario.',
      'Aprendizaje Imprescindible 3: Reconoce sus partes corporales, sus diferencias individuales y las respeta en sus pares.'
    ],
    propositoMEN: 'Propósito 1: Los niños y las niñas construyen su identidad en relación con los otros y desarrollan autonomía a través del cuerpo y el movimiento.',
    guidingQuestion: '¿Cómo se mueve mi cuerpo, para qué sirven mis sentidos y cómo lo cuido con amor cada día?',
    justification: 'La corporalidad es el primer territorio de aprendizaje del niño/a. Conocer las partes del cuerpo, sus funciones sensoriales, los límites de seguridad personal y los hábitos de higiene fortalece la autoestima, la coordinación psicomotriz gruesa y fina, y la prevención frente al autocuidado.',
    sensoryProvocation: {
      title: 'Momento 1: Espejo Mágico y Contorno de Silueta en Tamaño Real',
      description: 'Los estudiantes se observan frente a un espejo de cuerpo entero identificando cabeza, tronco, extremidades y rasgos faciales. Luego, por parejas, se acuestan sobre un papel Kraft gigante donde el docente dibuja su silueta en tamaño real.',
      materials: ['Espejos irrompibles para niños', 'Pliegos de papel Kraft', 'Marcadores gruesos de colores', 'Música rítmica instrumental']
    },
    guidedExploration: {
      title: 'Momento 2: Circuito Sensorial y Reconocimiento de los 5 Sentidos',
      description: 'Los niños recorren 4 estaciones sensoriales: 1) Vista (luces y colores), 2) Tacto (plumas, arroz, hielos), 3) Olfato/Gusto (frutas cítricas y canela), 4) Oído (sonidos de instrumentos musicales). Identifican la parte del cuerpo que usaron en cada estación.',
      materials: ['Cajas de texturas', 'Instrumentos musicales infantiles', 'Rodajas de naranja o manzana', 'Linternas de colores']
    },
    creativeConsolidation: {
      title: 'Momento 3: Baile de Estatuas y Collage del Esquema Corporal',
      description: 'Dinámica del "Baile de las Partes del Cuerpo" donde al pausar la música deben tocar la parte mencionada. Finalizan completando los rostros y prendas de vestir en su silueta de papel.',
      materials: ['Música alegre infantil', 'Retazos de tela', 'Lana para el cabello', 'Crayolas y pegamento']
    },
    evaluativeDescriptors: [
      'Identifica y nombra las partes principales de su cuerpo (cabeza, tronco, brazos, piernas, rostro).',
      'Demuestra mayor coordinación en movimientos globales (correr, saltar, marchar, equilibrarse).',
      'Aplica hábitos básicos de autocuidado como lavado de manos y cuidado de su intimidad corporal.'
    ],
    adaptationsDUA: 'Para estudiantes con movilidad reducida se realizan ajustes en las siluetas en posición sentada y estímulos vibrotáctiles con música.',
    familyActivity: 'El gráfico de las manos limpias: Elaborar un lavamanos casero divertido y registrar con stickers el lavado de manos antes de comer.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Circuito sensorial de texturas, olores, sabores, sonidos y temperaturas para explorar las capacidades de los 5 sentidos.",
        "howChildApplies": "El niño/a huele rodajas de frutas cítricas, toca hielo frío y plumas suaves, escucha sonidos graves y agudos tapándose los oídos y descubre cómo cada órgano de los sentidos le ayuda a conocer el mundo."
    },
    {
        "activity": "Juego",
        "description": "Juegos psicomotores: \"El Espejo Mágico\", \"Simón dice con el cuerpo\" y carreras de equilibrio y posturas corporales.",
        "howChildApplies": "El niño/a imita los movimientos de su compañero frente a frente, frena en seco al escuchar \"estatua\", salta en un solo pie y explora libremente qué posturas y piruetas puede hacer con su esquema corporal."
    },
    {
        "activity": "Arte",
        "description": "Trazado de la silueta corporal en tamaño real sobre papel kraft, collage de vestuario y modelado del cuerpo en arcilla.",
        "howChildApplies": "El niño/a se recuesta para que su compañero dibuje su contorno, rellena su rostro con ojos, nariz y boca de lana o recortes, y amasa arcilla para modelar personitas reconociendo cabeza, tronco y extremidades."
    },
    {
        "activity": "Literatura",
        "description": "Rondas cantadas (\"La batalla del calentamiento\", \"Cabeza, hombros, rodillas, pies\") y poemas corporales con onomatopeyas.",
        "howChildApplies": "El niño/a canta a viva voz señalando con rapidez la parte del cuerpo mencionada, inventa rimas con su propio nombre y partes de su cuerpo, y goza con trabalenguas motores."
    }
]
  },
  {
    id: 'concepto-los-colores',
    conceptName: 'Los Colores Primarios y Mezclas Mágicas',
    category: 'Arte',
    icon: '🎨',
    ageRange: '2 a 4 años',
    dimensions: ['COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'AMBIENTAL'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Expresa sus ideas, sentimientos y emociones a través de diferentes lenguajes artísticos.',
      'Aprendizaje Imprescindible 2: Clasifica y agrupa objetos de acuerdo con sus atributos cromáticos y visuales.',
      'Aprendizaje Imprescindible 3: Muestra curiosidad por descubrir las transformaciones del color mediante experimentos.'
    ],
    propositoMEN: 'Propósito 2: Los niños y las niñas se comunican activamente a través de sus lenguajes artísticos, imaginación y representación cromática.',
    guidingQuestion: '¿Qué sucede cuando los colores amarillo, azul y rojo se abrazan y juegan juntos en el agua?',
    justification: 'El color es uno de los primeros organizadores de la percepción visual infantil. Trabajar los colores promueve la observación detallada, la categorización de objetos y el desarrollo de la creatividad plástica a través del asombro experimental.',
    sensoryProvocation: {
      title: 'Momento 1: La Magia de las Botellas Cromáticas',
      description: 'El docente presenta 3 botellas con agua transparente en apariencia. Al agitarlas con energía (con pintura oculta en la tapa), el agua cambia mágicamente a amarillo, azul y rojo. Se genera un diálogo de asombro sobre los colores en la naturaleza.',
      materials: ['Botellas de agua transparentes', 'Pinturas acrílicas primaria oculta en la tapa', 'Cuentos sobre el arcoíris']
    },
    guidedExploration: {
      title: 'Momento 2: Experimento de Mezclas en Hielo y Filtros',
      description: 'Los estudiantes derraman gotas de tintas vegetales o témperas líquidas primarias sobre bolsas herméticas transparentes con gel para cabello. Al presionar con los dedos observan cómo nacen el verde, el naranja y el morado.',
      materials: ['Bolsas Ziploc transparentes', 'Gel para cabello transparente', 'Colorantes alimentarios amarillo, azul y rojo']
    },
    creativeConsolidation: {
      title: 'Momento 3: Laboratorio de Transparencias e Instalación Sensorial de Luces y Colores',
      description: 'Creación de vitrales transparentes en acetato y celofán de colores que se cuelgan en las ventanas del aula para proyectar sombras multicolores, acompañados de esculturas cromáticas con botellas de agua teñida.',
      materials: ['Papel celofán de colores', 'Marcos de cartulina', 'Acetato transparente', 'Linternas y mesa de luz', 'Botellas sensoriales teñidas']
    },
    evaluativeDescriptors: [
      'Identifica y nombra correctamente los colores primarios (amarillo, azul, rojo) en objetos de su entorno.',
      'Clasifica juguetes y materiales pedagógicos agrupándolos por su color.',
      'Disfruta explorar mezclas de color a través de experimentos táctiles y plástico-artísticos.'
    ],
    adaptationsDUA: 'Uso de contrastes de color de alta visibilidad para niños con baja visión y pinturas con textura de arena fina.',
    familyActivity: 'El día del color favorito: Vestir una prenda del color elegido y buscar 3 alimentos de ese color para la lonchera.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Laboratorio de luz, transparencias con linternas y filtros de colores, y recolección de elementos naturales clasificados por tono.",
        "howChildApplies": "El niño/a superpone papeles celofán de colores sobre la linterna para ver cómo cambia la luz en la pared, recolecta flores amarillas, hojas verdes y tierra marrón para clasificar y comparar tonalidades."
    },
    {
        "activity": "Juego",
        "description": "Juego \"El Semáforo Loco\", \"Búsqueda del Tesoro Amarillo/Azul/Rojo\" y twister de colores en el piso.",
        "howChildApplies": "El niño/a corre velozmente hacia el aro del color que indica la docente, reacciona a los comandos de detención y avance del semáforo y ayuda a sus compañeros a encontrar juguetes del color solicitado."
    },
    {
        "activity": "Arte",
        "description": "Laboratorio de mezclas mágicas: dactilopintura en bolsas sensoriales, goteros con tintas sobre papel absorbente y mural multicolor.",
        "howChildApplies": "El niño/a presiona con sus dedos la bolsa con témpera amarilla y azul maravillándose al ver nacer el verde, salpica con goteros creando constelaciones cromáticas y expresa sus sentimientos mediante combinaciones libres."
    },
    {
        "activity": "Literatura",
        "description": "Lectura del cuento interactivo \"El país de los colores\" y rimas infantiles sobre el arcoíris y los matices de la naturaleza.",
        "howChildApplies": "El niño/a anticipa qué pasará cuando los colores del cuento se unan, asocia cada color con una emoción o un elemento conocido (rojo manzana, azul mar) y declama versitos cortos."
    }
]
  },
  {
    id: 'concepto-los-numeros-conteo',
    conceptName: 'Los Números y el Conteo Concreto (1 al 5)',
    category: 'Pensamiento Matemático',
    icon: '🔢',
    ageRange: '2 a 4 años',
    dimensions: ['COGNITIVA', 'CORPORAL', 'COMUNICATIVA Y CREATIVA'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Determina la cantidad de objetos que integran una colección utilizando el conteo.',
      'Aprendizaje Imprescindible 2: Establece relaciones de correspondencia uno a uno en juegos de conteo.',
      'Aprendizaje Imprescindible 3: Compara colecciones de objetos utilizando nociones como "más que", "menos que" o "igual".'
    ],
    propositoMEN: 'Propósito 3: Los niños y las niñas construyen nociones matemáticas tempranas mediante la exploración activa de cantidades y conjuntos.',
    guidingQuestion: '¿Cuántos dedos tengo en una mano y cuántos juguetes podemos contar juntos en la canasta?',
    justification: 'El número en la educación inicial no se enseña mediante planas memorísticas, sino a través del conteo manipulativo con sentido. Los niños descubren la cantidad contando objetos reales (piedras, botones, frutas, pasos), asociándolos a la grafía numérica y a la noción de orden.',
    sensoryProvocation: {
      title: 'Momento 1: La Canasta del Mercado Matemático',
      description: 'Se presenta una canasta con frutas o verduras de juguete. Los niños sacan elementos uno a uno contando en voz alta con aplausos y saltos coordinados por cada número contado del 1 al 5.',
      materials: ['Frutas y verduras de plástico o tela', 'Tarjetas grandes con números y puntos', 'Tambor o pandero']
    },
    guidedExploration: {
      title: 'Momento 2: Rayuela Numérica y Tapetes de Masa Concreta',
      description: 'Los niños saltan sobre cuadros numerados en el suelo y colocan la cantidad exacta de cuentas o bloques correspondientes en cada casilla numerada del 1 al 5.',
      materials: ['Cinta de enmascarar con números gigantes', 'Bloques de conteo', 'Fichas de colores', 'Masa moldeable']
    },
    creativeConsolidation: {
      title: 'Momento 3: Modelado de Numerales en Arena y Plastilina',
      description: 'Trazo de los números del 1 al 5 sobre bandejas con harina o arena sensorial, colocando sobre cada trazo la cantidad de piedritas o semillas correspondiente.',
      materials: ['Bandejas plásticas', 'Harina o arena fina', 'Semillas grandes o cuentas', 'Plastilina casera']
    },
    evaluativeDescriptors: [
      'Realiza conteo verbal en orden ascendente del 1 al 5 asignando una palabra número a cada objeto.',
      'Identifica la cantidad correspondiente a una colección de hasta 5 elementos concretos.',
      'Relaciona la representación gráfica del número con la cantidad de objetos representada.'
    ],
    adaptationsDUA: 'Tarjetas con números en relieve de lija para estimulación háptica y conteo con objetos de gran tamaño.',
    familyActivity: 'Conteo en la mesa: Contar las cucharas o platos al poner la mesa para el almuerzo en familia.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Conteo concreto en la naturaleza y el aula: semillas, hojas caídas, tapas plásticas, piedritas y cubos de madera.",
        "howChildApplies": "El niño/a agarra puñados de elementos, los coloca uno a uno en bandejas de huevos contando en voz alta \"1, 2, 3...\", compara montoncitos preguntando \"¿dónde hay más?\" y organiza colecciones ordenadas."
    },
    {
        "activity": "Juego",
        "description": "Juego \"La Tiendita del Aula\", rayuela numérica, bolos numerados del 1 al 5 y carreras de dados gigantes.",
        "howChildApplies": "El niño/a lanza el dado gigante, cuenta los puntos con el dedo, salta esa cantidad exacta de pasos, intercambia fichas por frutas en la tiendita y respeta los turnos de juego en equipo."
    },
    {
        "activity": "Arte",
        "description": "Modelado de números con plastilina, estampado de huellas con la cantidad indicada y creación de gusanos numéricos con círculos de cartulina.",
        "howChildApplies": "El niño/a hace rollitos de plastilina para formar las curvas y rectas de los números 1 al 5, estampa exactamente 3 huellitas al lado del número 3 y decora sus creaciones con brillantina y semillas."
    },
    {
        "activity": "Literatura",
        "description": "Canciones acumulativas de conteo (\"Los cinco patitos\", \"Un elefante se balanceaba\"), adivinanzas y cuentos numéricos ilustrados.",
        "howChildApplies": "El niño/a canta entusiasmado mostrando los dedos correspondientes en cada estrofa, dramatiza cómo desaparece un patito y resuelve adivinanzas sobre cantidades con picardía e ingenio."
    }
]
  },
  {
    id: 'concepto-el-juego-simbolico',
    conceptName: 'El Juego Simbólico y Roles de la Vida Diaria',
    category: 'Juego',
    icon: '🎭',
    ageRange: '2 a 4 años',
    dimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'CORPORAL'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Representa situaciones cotidianas y personajes mediante el juego de roles y la imaginación.',
      'Aprendizaje Imprescindible 2: Comparte materiales y negocia roles durante el juego cooperativo.',
      'Aprendizaje Imprescindible 3: Crea escenarios imaginarios utilizando objetos cotidianos con nuevos significados.'
    ],
    propositoMEN: 'Propósito 1: Los niños y las niñas construyen su identidad en relación con los otros mediante el juego y la imaginación libre.',
    guidingQuestion: '¿A qué queremos jugar hoy y qué personajes mágicos de nuestra comunidad podemos interpretar?',
    justification: 'El juego es la experiencia rectora por excelencia en la primera infancia. A través del juego simbólico, el niño procesa vivencias, desarrolla empatía, ensaya normas sociales y expande su pensamiento abstracto al transformar un palo de escoba en un caballo o una caja en un barco.',
    sensoryProvocation: {
      title: 'Momento 1: El Baúl de los Disfraces y Sombreros Mágicos',
      description: 'Se habilita un baúl misterioso con sombreros, capas, delantales, bolsos, lupas y estetoscopios. Los niños eligen accesorios libremente y crean sus propios personajes.',
      materials: ['Sombreros y disfraces variados', 'Bolsos y telas', 'Accesorios de profesiones de juguete', 'Espejo para caracterización']
    },
    guidedExploration: {
      title: 'Momento 2: La Minitierra de los Roles (Mercado, Hospital, Veterinaria y Taller)',
      description: 'El aula se transforma en cuatro estaciones de juego dramático donde los niños asumen roles de tenderos, doctores, constructores y chefs, interactuando y cooperando.',
      materials: ['Cajas registradoras de juguete', 'Monedas de cartón', 'Cajas de cartón', 'Camillas de muñecos']
    },
    creativeConsolidation: {
      title: 'Momento 3: Círculo de Cuentos Actuados y Foto-Recuerdo',
      description: 'En asamblea, cada niño presenta a su personaje y comparte qué fue lo que más disfrutó de su juego. Se dibuja una escena del juego simbólico.',
      materials: ['Papel y marcadores', 'Micrófono de juguete', 'Cámara para registro pedagógico']
    },
    evaluativeDescriptors: [
      'Asume y sostiene un rol imaginario durante periodos de juego libre y estructurado.',
      'Interactúa con sus pares respetando turnos y proponiendo ideas para el desarrollo del juego.',
      'Asigna significados simbólicos a objetos del entorno durante sus representaciones.'
    ],
    adaptationsDUA: 'Vestuario de fácil abrochado con velcro y apoyos con tarjetas ilustradas de secuencias de juego.',
    familyActivity: 'Tarde de Teatro en Casa: Representar juntos en familia una escena cotidiana divertida antes de cenar.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Exploración de oficios, herramientas reales adaptadas y espacios de la vida comunitaria (el hospital, la panadería, la estación de bomberos).",
        "howChildApplies": "El niño/a indaga para qué sirve una balanza, cómo funciona un estetoscopio de juguete, examina ingredientes de cocina y pregunta sobre los roles que desempeñan las personas en su barrio."
    },
    {
        "activity": "Juego",
        "description": "Juego dramático libre y guiado en estaciones temáticas con baúl de accesorios, disfraces, capas y escenarios transformables.",
        "howChildApplies": "El niño/a se transforma en doctor/a, chef o superhéroe, modula su voz para encarnar al personaje, inventa tramas complejas, negocia con sus compañeros (\"tú eras el paciente y yo te curaba\") y sostiene la ficción lúdica."
    },
    {
        "activity": "Arte",
        "description": "Diseño y confección de máscaras, capas de superhéroes con tela reciclada, micrófonos de cartón y escenografías pintadas con tizas.",
        "howChildApplies": "El niño/a recorta y pega materiales para armar su propio antifaz, pinta fondos y señales de tránsito para su ciudad de cartón y decora sus atuendos con plumas y papeles brillantes."
    },
    {
        "activity": "Literatura",
        "description": "Creación colectiva de historias a partir de títeres, dramatización de fábulas y narración oral de las aventuras vividas en el juego.",
        "howChildApplies": "El niño/a mueve un títere improvisado narrando lo que le ocurre, dialoga con otros títeres, propone giros inesperados en la historia y describe ante el grupo lo que sintió al actuar."
    }
]
  },
  {
    id: 'concepto-las-emociones',
    conceptName: 'Las Emociones y el Rincón de la Calma',
    category: 'Comunicación',
    icon: '🧠',
    ageRange: '2 a 4 años',
    dimensions: ['SOCIOEMOCIONAL', 'ÉTICA', 'COMUNICATIVA Y CREATIVA'],
    aprendizajesImprescindibles: [
      'Aprendizaje Imprescindible 1: Reconoce sus emociones básicas (alegría, tristeza, rabia, miedo) y las comunica verbal o gestualmente.',
      'Aprendizaje Imprescindible 2: Expresa empatía frente a las vivencias emocionales de sus compañeros de aula.',
      'Aprendizaje Imprescindible 3: Utiliza estrategias de respiración y autorregulación guiadas para volver al estado de calma.'
    ],
    propositoMEN: 'Propósito 1: Los niños y las niñas construyen seguridad afectiva y capacidad de autorregulación emocional.',
    guidingQuestion: '¿Qué siente mi corazón cuando estoy feliz, triste o enojado, y cómo me ayuda la respiración de la flor y la vela a encontrar la calma?',
    justification: 'La alfabetización emocional en la primera infancia es determinante para la convivencia armónica y el desarrollo neurocognitivo. Aprender a ponerle nombre a las emociones y validar cada estado de ánimo evita conductas disruptivas y fomenta la empatía.',
    sensoryProvocation: {
      title: 'Momento 1: El Monstruo de los Colores y los Frascos Emocionales',
      description: 'Lectura del cuento "El Monstruo de Colores". Cada color representa una emoción (Amarillo-Alegría, Azul-Tristeza, Rojo-Rabia, Negro-Miedo, Verde-Calma). Los niños depositan lanas de colores en frascos transparentes.',
      materials: ['Cuento ilustrado', 'Frascos de vidrio irrompible o plástico', 'Lanas de colores', 'Paletas con caritas expresivas']
    },
    guidedExploration: {
      title: 'Momento 2: Técnica de la Respiración de la Flor y la Vela',
      description: 'Práctica guiada de respiración consciente en el Rincón de la Calma: Inhalar el aroma de una flor imaginaria y exhalar suavemente para apagar la vela. Uso de botellas sensoriales de la calma con purpurina.',
      materials: ['Cojines en el suelo', 'Botellas sensoriales de purpurina líquida', 'Peluches suaves', 'Tarjetas de pausas activas']
    },
    creativeConsolidation: {
      title: 'Momento 3: Elaboración del Dado de las Soluciones Afectivas',
      description: 'Los estudiantes crean un dado de espuma gigante con imágenes de acciones para regularse: dar un abrazo, pedir ayuda al docente, dibujar su molestia, tomar agua o respirar profundo.',
      materials: ['Dado de espuma gigante', 'Pictogramas de autorregulación', 'Crayolas', 'Música ambiental suave']
    },
    evaluativeDescriptors: [
      'Identifica y nombra estados emocionales propios y de sus pares mediante gestos o palabras.',
      'Acude voluntariamente al rincón de la calma o pide ayuda cuando se siente abrumado o triste.',
      'Aplica técnicas sencillas de respiración para retomar la tranquilidad durante el juego.'
    ],
    adaptationsDUA: 'Termómetro emocional con emojis gigantes y zona suave con masajes de pelotitas de goma.',
    familyActivity: 'El Semáforo Afectivo en Casa: Dialogar antes de dormir sobre el momento más feliz y el más desafiante del día.',
    rectorActivities: [
    {
        "activity": "Exploración del Medio",
        "description": "Exploración de la naturaleza como catalizador de sensaciones: el viento fresco para calmarse, la lluvia para reflexionar, la luz solar para la alegría.",
        "howChildApplies": "El niño/a sale al patio a sentir la brisa en sus mejillas para relajarse, observa cómo las plantas reaccionan al sol o la lluvia, e identifica en su propio cuerpo latidos rápidos o lentos según su estado de ánimo."
    },
    {
        "activity": "Juego",
        "description": "El Juego de las Muecas Emocionales frente al espejo, la alfombra de la calma, el dado de las emociones y estatuas expresivas.",
        "howChildApplies": "El niño/a pone cara de sorpresa, enfado o alegría riéndose con sus compañeros, lanza el dado y actúa la emoción que cae, y practica ir al \"refugio suave\" con cojines cuando necesita un momento de descanso."
    },
    {
        "activity": "Arte",
        "description": "Pintura con música emocional (trazos rápidos con música enérgica, trazos suaves con música relajante), creación de botellas sensoriales de purpurina y máscaras de emociones.",
        "howChildApplies": "El niño/a elige colores oscuros o brillantes según cómo se siente, agita su botella sensorial observando fascinado cómo decanta la purpurina para tranquilizarse, y dibuja caritas con diversas expresiones."
    },
    {
        "activity": "Literatura",
        "description": "Lectura dialógica de \"El Monstruo de Colores\", poemas de abrazos y cuentos sobre la empatía, el perdón y el consuelo entre amigos.",
        "howChildApplies": "El niño/a identifica en qué color está su corazón en el momento, expresa por qué se siente de cierta manera (\"estoy alegre porque jugué con mi amigo\"), e inventa finales reconfortantes para personajes asustados."
    }
]
  }
];

