export interface DimensionInfo {
  code: string;
  name: string;
  icon: string;
  description: string;
  keyGoals: {
    '0-2': string;
    '2-4': string;
    '4-6': string;
  };
}

export interface EjeRelacionalInfo {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  pedagogicalFocus: string[];
  keyQuotes: string[];
}

export interface PrincipioCurricularInfo {
  name: string;
  definition: string;
  application: string;
}

export interface MomentoItinerarioInfo {
  step: number;
  name: string;
  title: string;
  description: string;
  keyQuestions: string[];
  output: string;
}

export interface EtnoeducacionInfo {
  community: string;
  code: string;
  keyConcepts: string[];
  description: string;
  pedagogicalImpact: string;
}

export const EJES_RELACIONALES_2026: EjeRelacionalInfo[] = [
  {
    id: 'consigo_mismo',
    title: 'Relación consigo mismo/a',
    icon: 'User',
    subtitle: 'Identidad, Autonomía y Autorregulación Socioemocional',
    description: 'Sitúa al estudiante como sujeto activo de derechos que construye su identidad, autoestima y autonomía en interacción colectiva. Fortalece capacidades socioemocionales para reconocer su propio valor, potencial y sentido de vida.',
    pedagogicalFocus: [
      'Identificación y regulación de emociones (Ley 2503 de 2025).',
      'Construcción de proyecto de vida personal y cuidado de la salud mental.',
      'Desarrollo de la libre voluntad, pensamiento crítico y autoconocimiento.'
    ],
    keyQuotes: [
      '“Ser obra de sí mismo/a en la interacción con otros seres humanos y con la vida.” (Lineamientos MEN, 2026)'
    ]
  },
  {
    id: 'con_los_otros',
    title: 'Relación con los otros seres humanos',
    icon: 'Users',
    subtitle: 'Convivencia, Ética del Cuidado y Vínculos Comunitarios',
    description: 'Fomenta vínculos éticos, empáticos y horizontales donde los saberes locales, familiares y comunitarios cimentan la justicia social y la responsabilidad compartida. Se nutre de la filosofía Ubuntu y las pedagogías de la proximidad.',
    pedagogicalFocus: [
      'Ética del cuidado: prestar atención, responsabilizarse, responder y acompañar.',
      'Resolución pacífica de conflictos y cultura de paz en la escuela.',
      'Valoración de saberes comunitarios y filosofía del Ubuntu ("soy porque somos").'
    ],
    keyQuotes: [
      '“Educar implica crear y sostener una comunidad sobre la base de la cooperación, la solidaridad y la fraternidad.” (Lineamientos MEN, 2026)'
    ]
  },
  {
    id: 'con_la_vida_y_entorno',
    title: 'Relación con la vida y el entorno',
    icon: 'Sprout',
    subtitle: 'Conciencia Ecológica, Biocentrismo y Territorio',
    description: 'Expande el escenario formativo hacia el territorio, promoviendo una visión no antropocéntrica que entiende la interdependencia entre la sociedad y la naturaleza. La naturaleza es concebida como sujeto de derechos y vida viva.',
    pedagogicalFocus: [
      'Prácticas de cuidado de la vida y biodiversidad colombiana.',
      'Interdependencia ecológica, hábitos sostenibles y soberanía alimentaria (chagras y huertas).',
      'Apropiación del concepto del "Buen Vivir" y el "crecer bien".'
    ],
    keyQuotes: [
      '“Tránsito hacia visiones ecocéntricas y biocéntricas donde la naturaleza se reconoce como sujeto de derechos.” (Lineamientos MEN, 2026)'
    ]
  },
  {
    id: 'con_el_mundo_y_tecnologias',
    title: 'Relación con el mundo y las tecnologías',
    icon: 'Laptop',
    subtitle: 'Ciudadanía Digital Crítica, IA Ética y Lenguajes',
    description: 'Dota al sujeto de herramientas éticas y reflexivas para navegar en la sociedad del conocimiento, interpretar críticamente los medios digitales y comprender la Inteligencia Artificial al servicio del desarrollo humano.',
    pedagogicalFocus: [
      'Alfabetización digital crítica y entornos seguros de aprendizaje (ESA).',
      'Uso ético y reflexivo de la IA generativa en procesos de indagación.',
      'Lectura crítica de contenidos y prevención de violencias digitales.'
    ],
    keyQuotes: [
      '“Desarrollar una postura crítica frente a la tecnología que empodere al ciudadano digital para transformar su entorno.” (Lineamientos MEN, 2026)'
    ]
  }
];

export const PRINCIPIOS_CURRICULARES: PrincipioCurricularInfo[] = [
  {
    name: 'Coherencia',
    definition: 'Articulación lógica y transparente entre los fines educativos, intencionalidades, capacidades, estrategias didácticas y evaluación formativa.',
    application: 'Evita contradicciones entre el currículo declarado y la práctica viva de aula, garantizando que cada evaluación sirva para aprender.'
  },
  {
    name: 'Transversalidad',
    definition: 'Reorganización de contenidos escolares alrededor de Problemas Socialmente Relevantes (PSR) y preguntas problematizadoras.',
    application: 'Supera la fragmentación en materias aisladas, conectando el saber de las ciencias, artes y humanidades con la realidad del territorio.'
  },
  {
    name: 'Flexibilidad',
    definition: 'Adaptación del currículo a las particularidades, intereses, ritmos de aprendizaje y diversidades culturales de los estudiantes (DUA / PIAR).',
    application: 'Garantiza oportunidades de participación equitativa desde el diseño inicial sin depender exclusivamente de parches o adaptaciones.'
  },
  {
    name: 'Armonización',
    definition: 'Garantía de trayectorias educativas fluidas sin rupturas bruscas entre transiciones (Inicial -> Primaria -> Secundaria -> Media).',
    application: 'Acompaña intencionalmente los pasos del desarrollo infantil preservando los núcleos esenciales y los lineamientos del ser.'
  }
];

export const MOMENTOS_ITINERARIO: MomentoItinerarioInfo[] = [
  {
    step: 1,
    name: 'Momento 1',
    title: 'Comprensión del sujeto desde el territorio',
    description: 'Lectura crítica y amorosa de las dinámicas socioculturales, ambientales y familiares donde crecen las niñas y niños.',
    keyQuestions: [
      '¿Cómo habitan los niños su entorno escolar y comunitario?',
      '¿Qué saberes ancestrales o locales alimentan sus experiencias cotidianas?',
      '¿Cuáles son sus ritmos y estilos de aprendizaje en el marco del DUA?'
    ],
    output: 'Diagnóstico situado del sujeto y mapa de potencialidades del entorno.'
  },
  {
    step: 2,
    name: 'Momento 2',
    title: 'Identificación de la Experiencia de Interés y Provocación Pedagógica',
    description: 'Escucha atenta y reconocimiento de los centros de interés, preguntas espontáneas y asombro de las niñas y niños en su territorio.',
    keyQuestions: [
      '¿Qué experiencia, elemento de la naturaleza o situación del entorno despierta el asombro y la curiosidad de los niños?',
      '¿Cuáles son las preguntas, intereses y saberes previos que emergen de las voces infantiles?'
    ],
    output: 'Experiencia de Interés y provocación lúdica como núcleo dinamizador de la planeación.'
  },
  {
    step: 3,
    name: 'Momento 3',
    title: 'Planeación pedagógica y didáctica',
    description: 'Estructuración de secuencias didácticas integrando capacidades, aprendizajes imprescindibles, competencias y experiencias rectoras.',
    keyQuestions: [
      '¿Qué capacidades y aprendizajes imprescindibles se van a potenciar?',
      '¿De qué manera el juego, el arte, la literatura y la exploración activan la experiencia?'
    ],
    output: 'Matriz de planeación con ruta en 4 fases y productos finales acumulativos.'
  },
  {
    step: 4,
    name: 'Momento 4',
    title: 'Acción educativa y Evaluación Formativa',
    description: 'Vivencia de la experiencia pedagógica acompañada de procesos continuos de autoevaluación, coevaluación y retroalimentación dialógica.',
    keyQuestions: [
      '¿Cómo reconocen los niños lo que han aprendido?',
      '¿Qué evidencias (portafolios, proyectos, instalaciones) visibilizan el avance?',
      '¿De qué manera la retroalimentación fortalece la autonomía?'
    ],
    output: 'Evaluación formativa, socialización pública y reelaboración del proyecto.'
  }
];

export const DIVERSIDADES_ETNICAS: EtnoeducacionInfo[] = [
  {
    community: 'Pueblos Indígenas',
    code: 'INDIGENA',
    keyConcepts: ['Ley de Origen', 'Chagra & Fogón', 'Sabedores Ancestrales', 'Siembra de Vida'],
    description: 'La educación propia se da en cumplimiento de la Ley de Vida y Derecho Mayor. El fogón y la chagra son espacios sagrados de aprendizaje para tejer la vida en armonía con la naturaleza.',
    pedagogicalImpact: 'Atención y cuidado mediante el silencio, el tejido, la observación y la palabra dulce.'
  },
  {
    community: 'Comunidades Afrocolombianas, Negras y Palenqueras',
    code: 'AFRO_PALENQUE',
    keyConcepts: ['Muntú', 'Filosofía Ubuntu', 'El Kuagro', 'Vivir Sabroso', 'Cimarronaje'],
    description: 'Comprensión de la persona como nudo de relaciones (Muntú). La filosofía Ubuntu ("soy porque somos") y el Kuagro palenquero guían la socialización horizontal, el afecto y la solidaridad.',
    pedagogicalImpact: 'Pedagogías de la re-existencia, tradición oral, medicina tradicional y reparación histórica.'
  },
  {
    community: 'Pueblo Raizal (San Andrés, Providencia y Santa Catalina)',
    code: 'RAIZAL',
    keyConcepts: ['El Maritorio', 'Nodo Dah Wi', 'Cat Boat / Coconut Boat', 'Preservación Trilingüe'],
    description: 'Formación enraizada en la relación mística con el mar ("maritorio"), las técnicas tradicionales de navegación, la fe protestante y la lengua kriol como espacio de resistencia.',
    pedagogicalImpact: 'Educación emancipatoria y contextualizada en el ecosistema marino e insular.'
  },
  {
    community: 'Pueblo Rrom (Gitano)',
    code: 'RROM',
    keyConcepts: ['La Kumpania', 'La Kriss (Ley Gitana)', 'Endoculturación', 'Bilingüismo'],
    description: 'Transmisión de valores basada en la solidaridad en alegrías y tristezas, la memoria del nomadismo, el respeto sagrado por los mayores y la preservación de la lengua shib rromaní.',
    pedagogicalImpact: 'Fortalecimiento de la identidad comunitaria y el plan colectivo de vida (lasho lungo Drom).'
  }
];

export const DIMENSIONES_SER: DimensionInfo[] = [
  {
    code: 'AMBIENTAL',
    name: 'Lineamiento Ambiental',
    icon: 'Leaf',
    description: 'Relación de respeto, asombro y cuidado activo con la naturaleza, plantas, animales y el ecosistema (visión biocéntrica).',
    keyGoals: {
      '0-2': 'Exploración sensorial táctil de elementos naturales (tierra, agua, hojas) con seguridad.',
      '2-4': 'Reconocimiento de seres vivos y prácticas sencillas de cuidado como regar plantas o alimentar animales.',
      '4-6': 'Comprensión de ciclos naturales, separación de residuos y liderazgo en proyectos ambientales.'
    }
  },
  {
    code: 'CIUDADANA Y POLÍTICA',
    name: 'Lineamiento Ciudadano y Político',
    icon: 'Globe',
    description: 'Construcción de convivencia, acuerdos colectivos, sentido de pertenencia y participación democrática infantil.',
    keyGoals: {
      '0-2': 'Reconocimiento del nombre propio y primera integración en pequeños grupos.',
      '2-4': 'Participación en asambleas infantiles para elegir normas sencillas de convivencia.',
      '4-6': 'Resolución pacífica de conflictos y valoración de la diversidad en el aula.'
    }
  },
  {
    code: 'COGNITIVA',
    name: 'Lineamiento Cognitivo',
    icon: 'Brain',
    description: 'Pensamiento lógico, indagación, resolución de situaciones problema y estructuración del conocimiento.',
    keyGoals: {
      '0-2': 'Permanencia del objeto y experimentación causa-efecto.',
      '2-4': 'Clasificación por color, forma y tamaño; preguntas inquisitivas ("¿por qué?").',
      '4-6': 'Secuenciación de procesos, hipótesis sobre fenómenos naturales y lógica matemática inicial.'
    }
  },
  {
    code: 'COMUNICATIVA Y CREATIVA',
    name: 'Lineamiento Comunicativo y Creativo',
    icon: 'MessageSquare',
    description: 'Expresión verbal, no verbal, corporal y artística para transmitir ideas, emociones e historias.',
    keyGoals: {
      '0-2': 'Balbuceo, gestos expresivos y juego con sonidos vocales.',
      '2-4': 'Estructuración de frases completas, narración de historias sencillas y dibujo simbólico.',
      '4-6': 'Lectura crítica de imágenes, invención de cuentos y argumentación inicial.'
    }
  },
  {
    code: 'CORPORAL',
    name: 'Lineamiento Corporal',
    icon: 'Activity',
    description: 'Conciencia del propio cuerpo, motricidad fina y gruesa, autorregulación y espacialidad.',
    keyGoals: {
      '0-2': 'Control postural, gateo y primeros pasos independientes.',
      '2-4': 'Coordinación en saltos, carreras, circuitos de equilibrio y manipulación de plastilina.',
      '4-6': 'Habilidades motrices complejas, lateralidad definida y expresión dancística.'
    }
  },
  {
    code: 'CULTURAL',
    name: 'Lineamiento Cultural',
    icon: 'Music',
    description: 'Aprecio por las tradiciones, diversidad pluricultural colombiana, música y patrimonio vivo.',
    keyGoals: {
      '0-2': 'Reacción ante ritmos folclóricos y arrullos tradicionales.',
      '2-4': 'Participación en rondas infantiles tradicionales y celebración de festividades de la comunidad.',
      '4-6': 'Reconocimiento de identidades culturales, gastronomía e instrumentos tradicionales.'
    }
  },
  {
    code: 'ÉTICA',
    name: 'Lineamiento Ético',
    icon: 'Shield',
    description: 'Desarrollo de la honestidad, el respeto, la justicia y el compromiso con la verdad.',
    keyGoals: {
      '0-2': 'Confianza básica en los cuidadores principales.',
      '2-4': 'Reconocimiento del turno en el juego y respeto por los juguetes de los compañeros.',
      '4-6': 'Distinción entre acciones constructivas y dañinas, asumiendo compromisos éticos.'
    }
  },
  {
    code: 'HISTÓRICA Y DE MEMORIA HISTÓRICA',
    name: 'Lineamiento Histórico y de Memoria Histórica',
    icon: 'Clock',
    description: 'Comprensión del tiempo, historia personal, familiar y comunitaria para la paz.',
    keyGoals: {
      '0-2': 'Reconocimiento de fotos de su historia de bebé y familia.',
      '2-4': 'Noción de pasado-presente ("ayer fuimos al parque", "hoy estamos sembrando").',
      '4-6': 'Reconstrucción de relatos familiares y valoración de la memoria local.'
    }
  },
  {
    code: 'SOCIOEMOCIONAL',
    name: 'Lineamiento Socioemocional',
    icon: 'Heart',
    description: 'Identificación, validación y autorregulación de emociones, empatía y vínculos afectivos seguros.',
    keyGoals: {
      '0-2': 'Vínculo afectivo seguro y consuelo ante el llanto.',
      '2-4': 'Nombramiento de emociones básicas (alegría, tristeza, rabia, miedo) y empatía hacia pares.',
      '4-6': 'Estrategias de autorregulación (respiración, rincón de la calma) y trabajo en equipo.'
    }
  }
];

export const NORMATIVA_INFO = {
  decreto1411: {
    title: 'Decreto 1411 de 2022',
    sub: 'Reglamentación de la Educación Inicial en Colombia y Servicio Público Educativo',
    description: 'Establece los marcos de calidad para la gestión de la educación inicial en el país, promoviendo el desarrollo integral desde el nacimiento hasta los 6 años a través de las experiencias rectoras.',
    pillars: [
      { name: 'Educación Inicial con Enfoque de Derechos', detail: 'Acceso, permanencia y desarrollo integral sin discriminación.' },
      { name: 'Las 4 Experiencias Rectoras', detail: 'Juego, Arte, Literatura y Exploración del Medio como ejes articuladores.' },
      { name: 'Ambientes Pedagógicos Seguros y Potenciadores', detail: 'Espacios que incentivan la investigación y el descubrimiento.' },
      { name: 'Trabajo Intersectorial con Familias', detail: 'Corresponsabilidad entre el estado, las instituciones y el hogar.' }
    ]
  },
  ley2503: {
    title: 'Ley 2503 de 2025',
    sub: 'Educación Socioemocional en la Primera Infancia',
    description: 'Institucionaliza la integración transversal de la educación socioemocional, promoviendo el autocuidado, la empatía y la resolución pacífica en aulas infantiles.',
    highlights: [
      'Identificación temprana de estados emocionales a través de lenguajes artísticos.',
      'Espacios de autorregulación como el Rincón de la Calma.',
      'Vínculos emocionales respetuosos entre docentes, estudiantes y familias.'
    ]
  },
  ley1620: {
    badge: 'Documento Normativo Ley 1620',
    title: 'Ley 1620 de 2013',
    sub: 'Sistema Nacional de Convivencia Escolar y Formación para los Derechos Humanos',
    description: 'Crea el Sistema Nacional de Convivencia Escolar para la prevención, mitigación y atención de situaciones que afectan la convivencia, promoviendo la educación para los derechos humanos, la sexualidad y la prevención de la violencia escolar.',
    pillars: [
      { name: 'Ruta de Atención Integral', detail: 'Protocolos de prevención, promoción, atención y seguimiento en la convivencia escolar.' },
      { name: 'Comité de Convivencia Escolar', detail: 'Instancia de diálogo, mediación pedagógica y pactos de aula con la comunidad educativa.' },
      { name: 'Acuerdos Pedagógicos y Actas Formativas', detail: 'Suscripción de compromisos para el diálogo restaurativo y la autorregulación socioemocional.' },
      { name: 'Enfoque Restaurativo y de Derechos', detail: 'Atención pedagógica basada en la empatía sin esquemas punitivos.' }
    ]
  },
  ley1581_1098: {
    badge: 'Hábeas Data Ley 1581 / Ley 1098',
    title: 'Ley 1581 de 2012 & Ley 1098 de 2006',
    sub: 'Protección de Datos Personales (Hábeas Data) y Código de la Infancia y la Adolescencia',
    description: 'Regula el tratamiento confidencial de datos personales sensibles, registros fotográficos y material audiovisual de niños y niñas en primera infancia, garantizando el interés superior del menor de edad.',
    highlights: [
      'Autorización previa, expresa e informada de los padres/acudientes para el registro pedagógico.',
      'Protección reforzada del derecho a la intimidad, propia imagen e identidad de los estudiantes.',
      'Uso estrictamente institucional y pedagógico sin difusión comercial ni pública no autorizada.',
      'Formato de consentimiento informado editable y en blanco para diligenciamiento manuscrito.'
    ]
  },
  manualConvivencia: {
    badge: 'Manual de Convivencia Escolar',
    title: 'Manual de Convivencia Escolar (I.E. del Municipio de San Pedro)',
    sub: 'Pacto social y marco regulatorio institucional (San Pedro, Sucre)',
    description: 'Normativa institucional que regula la convivencia, los derechos, deberes y acuerdos pedagógicos de la comunidad educativa, enmarcada en la Constitución de 1991, Ley 115, Ley 1620 y Ley 1098.',
    pillars: [
      { name: 'Derechos y Deberes de la Comunidad Educativa', detail: 'Formación en autonomía, libertad responsable, inclusión y respeto por la diversidad.' },
      { name: 'Ruta de Atención e Instancias de Convivencia', detail: 'Protocolos de atención para situaciones Tipo I, II y III, mediación pedagógica y enfoque restaurativo.' },
      { name: 'Gobierno Escolar y Democracia', detail: 'Participación activa mediante Consejo Directivo, Personero y Contralor Estudiantil.' },
      { name: 'Proyectos Transversales y Cátedra de la Paz', detail: 'Educación en DDHH, educación para la sexualidad y fomento del clima escolar armonioso.' }
    ]
  },
  lineamientos2026: {
    title: 'Lineamientos Curriculares para la Formación Integral (MEN 2026)',
    sub: 'Un viaje curricular: rutas para la transformación del ser y del saber',
    description: 'Marco pedagógico nacional que propone transformar las prácticas escolares mediante 4 ejes relacionales, 9 lineamientos del ser, integración en Problemas Socialmente Relevantes (PSR) y una evaluación formativa y humanizadora.',
    pillars: [
      { name: 'Sujeto Activo de Derechos', detail: 'El estudiante como centro, portador de historias y creador en el territorio.' },
      { name: '4 Ejes Curriculares Relacionales', detail: 'Consigo mismo/a, con los otros, con la vida y el entorno, con el mundo y tecnologías.' },
      { name: 'Integración y Flexibilidad Curricular', detail: 'Superación de materias fragmentadas mediante PSR y diseño DUA.' },
      { name: 'Evaluación Formativa y Dialógica', detail: 'Autoevaluación y coevaluación para potenciar la autonomía del ser.' }
    ]
  }
};

export interface PropositoMENInfo {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  keyAspects: string[];
  pedagogicalActions: string[];
}

export const INSTITUCIONES_SAN_PEDRO: string[] = [
  'Institución Educativa del Municipio de San Pedro',
  'Institución Educativa Normal Superior de San Pedro',
  'Institución Educativa San Pedro Claver',
  'Institución Educativa Luis Patrón Rosano',
  'Institución Educativa Santa Teresa',
  'Institución Educativa Cañito'
];

export const SEDES_INSTITUCIONALES: string[] = [
  'Sede Principal',
  'Sede Preescolar / Unidad Primera Infancia',
  'Sede Urbana San Pedro',
  'Sede Rural San Pedro',
  'Sede Primaria / Transición',
  'Sede Integrada San Pedro'
];

export const INSTITUCION_SAN_PEDRO_INFO = {
  nombre: 'Instituciones Educativas del Municipio de San Pedro',
  ciudad: 'San Pedro',
  departamento: 'Sucre',
  dane: 'Municipio de San Pedro - Sucre',
  rector: 'Equipo Directivo Institucional',
  rectorCel: '3116815339',
  direccion: 'Municipio de San Pedro (Sucre) • Sabana Sucreña',
  correo: 'educacion@sanpedro-sucre.gov.co',
  tipo: 'Oficial, Mixta, Jornada Única / Matinal',
  lema: 'Solo los seres humanizados pueden transformar la sociedad.',
  fundacion: 'Municipio de San Pedro, Sucre',
  poblacionTotalEducacionInicial: 260,
  grados: ['Prejardín (4 DBA)', 'Jardín (8 DBA)', 'Transición (16 DBA)'],
  escalaValoracion: [
    {
      sigla: 'I',
      nombre: 'INICIO',
      color: 'amber',
      descripcion: 'Representa que la niña y el niño tiene algunas habilidades básicas que le permiten iniciar el proceso de construcción de los aprendizajes propuestos y requiere de mayor trabajo con sus pares y adultos para avanzar en el proceso.'
    },
    {
      sigla: 'EP',
      nombre: 'EN PROCESO',
      color: 'blue',
      descripcion: 'Representa la construcción de aprendizajes que se evidencian en las condiciones específicas en las que se ha generado, por lo tanto, se adelantarán acciones para que se consolide el proceso.'
    },
    {
      sigla: 'L',
      nombre: 'LOGRADO',
      color: 'indigo',
      descripcion: 'Evidencia que la niña y el niño han construido unos aprendizajes y puede usarlos en diferentes contextos o situaciones con variados propósitos y es posible trabajar un nivel de complejidad mayor.'
    }
  ],
  componentesCalidad: [
    {
      numero: 1,
      nombre: 'Componente Familia, Comunidad y Redes Sociales',
      descripcion: 'Caracterización de las familias del Municipio de San Pedro (Sucre), Alianza Familia-Escuela (SIMAT / Ley 2025) y protocolos de atención dialogada y acompañamiento afectivo.'
    },
    {
      numero: 2,
      nombre: 'Componente Salud y Nutrición',
      descripcion: 'Afiliación al SGSSS, Crecimiento y Desarrollo, Esquema Vacunación PAI, atención a la discapacidad con PIAR, Minuta Patrón ICBF/PAE, Buenas Prácticas de Manufactura (BPM) y Plan de Saneamiento.'
    },
    {
      numero: 3,
      nombre: 'Componente Proceso Pedagógico',
      descripcion: 'Currículo basado en la experiencia, saber pedagógico, interacciones y las 4 actividades rectoras (Juego, Arte, Literatura, Exploración del medio) estructuradas en fases vivenciales.'
    },
    {
      numero: 4,
      nombre: 'Componente Ambientes Educativos y Protectores',
      descripcion: 'Infraestructura física segura, aulas de preescolar acondicionadas, comedor escolar PAE, gestión del riesgo y plan de emergencias escolar vigente.'
    },
    {
      numero: 5,
      nombre: 'Componente Talento Humano',
      descripcion: 'Equipo docente interdisciplinar y directivo altamente cualificado con vocación y formación especializada en educación infantil, lúdica y desarrollo integral.'
    },
    {
      numero: 6,
      nombre: 'Componente Administrativo y de Gestión',
      descripcion: 'Registro legal formal ante Secretaría de Educación Departamental de Sucre, matrícula en plataforma SIMAT, ficha acumulativa del estudiante, observador digital y buzón de PQRS.'
    }
  ],
  alianzaFamiliaEscuela2026: [
    {
      encuentro: '01',
      fecha: '24 de abril de 2026',
      categoria: 'Garantía de Derechos',
      contenido: 'Responsabilidades de los padres, madres o cuidadores en la crianza de sus hijos, acompañamiento al proceso de aprendizaje y garantía de sus derechos.'
    },
    {
      encuentro: '02',
      fecha: '12 de junio de 2026',
      categoria: 'Crianza Amorosa y Estilos de Vida Saludables',
      contenido: 'Prohibición del maltrato físico y psicológico o tratos degradantes y humillantes en su contexto familiar y escolar; hábitos saludables.'
    },
    {
      encuentro: '03',
      fecha: '17 de julio de 2026',
      categoria: 'Educación de la Sexualidad (Taller Obligatorio)',
      contenido: 'Taller obligatorio: Prevención y atención de la violencia sexual contra niños y niñas desde el interior de las familias.'
    },
    {
      encuentro: '04',
      fecha: '09 de octubre de 2026',
      categoria: 'Apoyo en Procesos Educativos y Contención Familiar',
      contenido: 'Instrumentos adecuados de técnicas de estudio y apoyo y acompañamiento a los procesos educativos en el hogar.'
    }
  ]
};

export const INSTITUCION_SAN_JOSE_INFO = INSTITUCION_SAN_PEDRO_INFO;

export const PROPOSITOS_MEN_COLOMBIA: PropositoMENInfo[] = [
  {
    id: 'proposito_1',
    number: 1,
    title: 'Propósito 1: Identidad, Autonomía, Manejo de Emociones y Pertenencia',
    subtitle: 'Construcción del ser, manejo de emociones y autorregulación socioemocional (Ley 2503) con otros y la cultura',
    description: 'Las niñas y los niños construyen su identidad en relación con los otros; reconocen, nombran y manejan sus emociones, se sienten queridos y valoran positivamente pertenecer a una familia, cultura y mundo.',
    keyAspects: [
      'Reconocimiento de su propio cuerpo, género, origen e historia personal.',
      'Manejo de emociones y autorregulación socioemocional (Ley 2503): identificación de alegrías, miedos, enojos y uso de estrategias de calma.',
      'Fortalecimiento de la autoestima, la seguridad afectiva, la autonomía y la resolución pacífica de conflictos.',
      'Sentido de pertenencia a su comunidad, cultura y valoración de la diversidad colombiana.'
    ],
    pedagogicalActions: [
      'Espacios de bienvenida, semáforo del afecto y rincón de la calma para el manejo de emociones.',
      'Promoción del autocuidado, decisiones autónomas y expresión asertiva de sentimientos.',
      'Integración de relatos familiares, objetos significativos e historias del territorio.'
    ]
  },
  {
    id: 'proposito_2',
    number: 2,
    title: 'Propósito 2: Comunicación Activa, Expresión y Lenguajes Artísticos',
    subtitle: 'Expresión de ideas, transmisión de vivencias emocionales, representación simbólica y literatura',
    description: 'Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.',
    keyAspects: [
      'Exploración del lenguaje verbal, gestual, corporal, poético y artístico.',
      'Apropiación de la literatura infantil, el juego dramático y la transmisión de estados emocionales.',
      'Lectura de imágenes, invención de historias y diálogo horizontal sobre sus vivencias y el entorno.'
    ],
    pedagogicalActions: [
      'Círculos de la palabra y asambleas infantiles para expresar pensamientos y emociones.',
      'Rincones de cuentos, teatro de sombras, máscaras y producción plástica simbólica.',
      'Sensibilidad estética ante manifestaciones culturales, sonoras y corporales.'
    ]
  },
  {
    id: 'proposito_3',
    number: 3,
    title: 'Propósito 3: Indagación, Observación del Entorno y Desarrollo Cognitivo - Prematemática',
    subtitle: 'Observación atenta del entorno natural, pensamiento lógico-matemático inicial, nociones cuantitativas y curiosidad',
    description: 'Las niñas y los niños disfrutan aprender; observan e indagan activamente su entorno natural y social, y construyen nociones cognitivas y prematemáticas para comprender el mundo.',
    keyAspects: [
      'Observación atenta e indagación de su entorno: formulación de preguntas explicativas, hipótesis y exploración sensorial del medio.',
      'Desarrollo cognitivo y prematemática inicial: clasificación por atributos, seriación, nociones de espacio, tiempo, medida, patrones y conteo espontáneo.',
      'Pensamiento lógico-matemático y resolución creativa de problemas en situaciones cotidianas.',
      'Relación respetuosa e investigativa con la naturaleza, seres vivos, huertas y tecnología.'
    ],
    pedagogicalActions: [
      'Aulas vivas, chagras, rincón de la ciencia, balanzas, lupas, recipientes de trasvase y colecciones del entorno.',
      'Experiencias de agrupación, patrones visuales/sonoros, conteo libre y comparaciones cuantitativas en el juego.',
      'Desafíos exploratorios que estimulen la observación directa, la comprobación de hipótesis y el cuidado del medio ambiente.'
    ]
  },
  {
    id: 'proposito_4',
    number: 4,
    title: 'Propósito 4: Descubrimiento de Sí Mismos, Apropiación del Espacio, Territorio y Movimiento Libre',
    subtitle: 'Descubrimiento personal, vivencia del espacio y territorio, y expresión corporal en encuentro con los otros',
    description: 'Las niñas y los niños experimentan el descubrimiento de sí mismos, apropian el espacio y el territorio que habitan, y se expresan a través del cuerpo y el movimiento libre en el encuentro con los otros.',
    keyAspects: [
      'Descubrimiento y conciencia del propio cuerpo, esquema corporal y posibilidades de movimiento.',
      'Apropiación, recorrido y vivencia sensible del espacio físico, geográfico y del territorio comunitario.',
      'Expresión psicomotriz, motricidad libre, juego motor y posturas autónomas en interacción con pares.',
      'Construcción de vínculos afectivos y encuentro con los otros a través de la danza, el desplazamiento y la espacialidad compartida.'
    ],
    pedagogicalActions: [
      'Circuitos psicomotores, juegos de orientación espacial, laberintos de texturas y exploración de planos.',
      'Caminatas de reconocimiento del territorio, mapas vivenciales y vivencias al aire libre.',
      'Danza libre, juegos tradicionales de ronda, expresión rítmica y dinámicas de encuentro corporal respetuoso.'
    ]
  }
];

