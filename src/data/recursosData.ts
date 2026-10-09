export interface ResourceItem {
  id: string;
  category: 'experiencias' | 'dua' | 'pictogramas' | 'canciones';
  title: string;
  tag: string;
  description: string;
  content: string[];
  recommendation: string;
}

export const RECURSOS_BANK: ResourceItem[] = [
  {
    id: 'exp-juego',
    category: 'experiencias',
    title: 'El Juego Libre y Simbólico en el Aula',
    tag: 'Experiencia Rectora: Juego',
    description: 'Guía para estructurar rincones de juego simbólico (La casa, El mercado, El hospital de animales) basados en el Decreto 1411.',
    content: [
      'Organización de disfraces y accesorios de la vida cotidiana.',
      'Preguntas abiertas para dinamizar el juego sin dirigirlo.',
      'Acompañamiento del docente como mediador de acuerdos sociales.'
    ],
    recommendation: 'Ideal para la autorregulación y negociación de roles entre los 2 y 4 años.'
  },
  {
    id: 'exp-arte',
    category: 'experiencias',
    title: 'Pintura Sensorial y Escultura Natural',
    tag: 'Experiencia Rectora: Arte',
    description: 'Técnicas de expresión plástica no tóxica utilizando barro, plastilina casera de harina y tintes de remolacha y cúrcuma.',
    content: [
      'Receta de masa para moldear con sal, harina, agua y aceite comestible.',
      'Uso de hojas, ramas y piedras como sellos y texturas de estampado.',
      'Espacio de secado y exposición colectiva tipo museo de aula.'
    ],
    recommendation: 'Promueve la motricidad fina y la relajación en niños con alta excitabilidad.'
  },
  {
    id: 'exp-literatura',
    category: 'experiencias',
    title: 'Cuentos Susurrados y Kamishibai Infantil',
    tag: 'Experiencia Rectora: Literatura',
    description: 'Estrategias de lectura dramatizada con teatro de sombras y tarjetas Kamishibai sobre animales y emociones.',
    content: [
      'Creación de una caja de susurros con tubos decorados.',
      'Rincón de lectura accesible a la altura de los niños con cojines.',
      'Preguntas de anticipación: "¿Qué creen que pasará cuando salga el sol?"'
    ],
    recommendation: 'Fortalece la capacidad comunicativa y la concentración.'
  },
  {
    id: 'exp-exploracion',
    category: 'experiencias',
    title: 'Laboratorio de Exploración del Entorno',
    tag: 'Experiencia Rectora: Exploración del Medio',
    description: 'Rutas de investigación sobre insectos, agua, viento y plantas del patio escolar con herramientas de observación.',
    content: [
      'Equipamiento: Lupas de plástico, recolectores transparentes, pinceles suaves.',
      'Bitácora de registro gráfico con huellas de hojas y garabatos.',
      'Reglas de protección: "Miramos con atención y dejamos a los bichitos en su hogar."'
    ],
    recommendation: 'Ideal para conectar con la Dimensión Ambiental.'
  },
  {
    id: 'dua-1',
    category: 'dua',
    title: 'Adaptaciones DUA e Inclusión (PIAR)',
    tag: 'Soporte DUA / PIAR',
    description: 'Estrategias universales de aprendizaje para estudiantes con neurodiversidad o discapacidades sensoriales.',
    content: [
      'Uso de secuencias en pictogramas visuales para transiciones entre actividades.',
      'Rincón de autorregulación con luces suaves, cojines de peso y frascos de la calma.',
      'Ofrecer alternativas táctiles para niños con aversión a ciertas texturas (pinceles en lugar de dedos).'
    ],
    recommendation: 'Garantiza la participación plena bajo la perspectiva inclusiva del Decreto 1411.'
  },
  {
    id: 'picto-emociones',
    category: 'pictogramas',
    title: 'Banco de Pictogramas Emocionales y Rutinas',
    tag: 'Material Imprimible',
    description: 'Símbolos claros para identificar estados de ánimo (Alegría, Calma, Asombro, Frustración, Cansancio) y pasos de la sesión.',
    content: [
      'Visualizador del estado del tiempo y mapa emocional diario.',
      'Tarjetas de pasos: 1. Escuchar cuento 2. Explorar 3. Crear 4. Guardar.',
      'Indicadores de normas: Manos cariñosas, Voz de susurro, Pies tranquilos.'
    ],
    recommendation: 'Facilita la comunicación con niños no verbales o en proceso de adquisición del lenguaje.'
  }
];
