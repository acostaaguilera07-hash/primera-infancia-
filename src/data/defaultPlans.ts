import { Planification } from '../types';

export const DEFAULT_PLANS: Planification[] = [
  {
    id: 'sanjose-p1-afecto',
    type: 'proyecto',
    ageRange: '4 a 6 años',
    selectedDimensions: ['SOCIOEMOCIONAL', 'CORPORAL', 'COMUNICATIVA Y CREATIVA', 'CIUDADANA Y POLÍTICA', 'ÉTICA'],
    topic: 'Me relaciono con afecto en mi entorno',
    title: 'PROYECTO 1 (PPEI I.E. MUNICIPIO DE SAN PEDRO): ME RELACIONO CON AFECTO EN MI ENTORNO',
    duration: '20 Horas semanales (4 a 8 semanas)',
    targetAudience: 'Comunidad Educativa I.E. del Municipio de San Pedro • Transición, Jardín y Prejardín',
    relationalAxis: 'Relación consigo mismo/a y con los otros seres humanos',
    theExperience: '¿Quién soy yo, qué sienten mis manitas y cómo abrazo a quienes quiero en mi casa y mi escuela?',
    problematizingQuestion: '¿Quién soy yo, qué sienten mis manitas y cómo abrazo a quienes quiero en mi casa y mi escuela?',
    justification: 'Proyecto pedagógico oficial del PPEI 2026 de las Instituciones Educativas del Municipio de San Pedro (Sucre), fundamentado en el Decreto 1411 de 2022, la Ley 2503 de 2025 y los referentes técnicos del MEN. Articula el desarrollo de la identidad personal, el esquema corporal, los hábitos de autocuidado y la afectividad, con transversalidad en el Proyecto de Educación Sexual y Construcción de Ciudadanía (PESC) y el proyecto "Derecho a mis Derechos".',
    generalObjective: 'Potenciar en las niñas y los niños de las Instituciones Educativas del Municipio de San Pedro la construcción de su identidad, el conocimiento y cuidado de su esquema corporal, la expresión de sus emociones y el fortalecimiento de vínculos afectivos familiares y comunitarios.',
    essentialLearnings: [
      'Reconocimiento de las partes del cuerpo humano, órganos de los sentidos y sus funciones elementales de autocuidado y aseo.',
      'Identificación y comunicación de emociones (alegría, calma, asombro, afecto) en la relación con sus pares y cuidadores.',
      'Valoración positiva de su pertenencia familiar, roles del hogar y normas de convivencia escolar en la comunidad educativa.'
    ],
    capacitiesToDevelop: [
      'Ilustra su cuerpo en forma detallada mediante dibujo, modelado en plastilina, rasgado y coloreado.',
      'Expresa mediante gestos y palabras afectos adecuados (abrazos, dar la mano, sonreír) demostrando confianza hacia los demás.',
      'Práctica normas de higiene y aseo personal en situaciones cotidianas de clase y en la vida diaria del hogar.'
    ],
    expectedResult: '"El Mural del Afecto y Mi Silueta Viva": Silueta en tamaño real de cada estudiante decorada con sus rasgos únicos y un álbum familiar de los afectos con compromisos de convivencia firmados con huellas dactilares.',
    phases: [
      {
        phaseNumber: 1,
        name: 'Fase 1: Indagar (Fase de Aprehensión Sensorial / Saberes Previos)',
        timeframe: 'Semanas 1 y 2',
        milestone: 'Hito 1: Bienvenida Afectiva y Espejo del Asombro Corporal',
        title: 'Detectives del Cuerpo y las Emociones',
        description: 'Recorrido sensorial por el aula y juego frente al espejo para reconocer rasgos físicos, diferencias, semejanzas y nombrar emociones al ser acogidos.',
        strategiesAndVoices: [
          'Juego del espejo: gestos, sonrisas, muecas y posturas corporales',
          'Ronda cantada de bienvenida y saludo afectivo elegido por el niño (abrazo, choque de manos, guiño)',
          'Caja sensorial con objetos de aseo personal (jabón aromático, toalla suave, cepillo)'
        ],
        svgType: 'body'
      },
      {
        phaseNumber: 2,
        name: 'Fase 2: Proyectar (Fase de Juzgar / Nuevos Aprendizajes)',
        timeframe: 'Semanas 3 y 4',
        milestone: 'Hito 2: Mapa de Mi Familia y Pactos de Aula Afectuosos',
        title: 'Mi Familia, Mi Casa y Mis Espacios Compartidos',
        description: 'Diálogo guiado con fotografías familiares para explorar "¿Con quién vivo?", "¿Dónde vivo?" y acordar normas de cuidado mutuo en la escuela.',
        strategiesAndVoices: [
          'Lectura compartida de cuentos sobre diversidad de familias (nucleares, monoparentales, extendidas)',
          'Dibujo del hogar y las dependencias de la casa identificando objetos de cada espacio',
          'Pacto de convivencia escolar con pictogramas de buen trato y afecto'
        ],
        svgType: 'wind'
      },
      {
        phaseNumber: 3,
        name: 'Fase 3: Vivir la Experiencia (Fase de Actuar / Proponer y Vivenciar)',
        timeframe: 'Semanas 5 y 6',
        milestone: 'Hito 3: Circuito de Roles Familiares y Cuidado del Cuerpo',
        title: 'Manos a la Obra: Cuidándome y Jugando en Familia',
        description: 'Dramatizaciones de roles familiares ("En qué trabaja mi familia"), juegos en parejas con pelotas y telas de colores, y modelado en arcilla de figuras corporales.',
        strategiesAndVoices: [
          'Taller lúdico de lavado de manos y cepillado dental con canciones rítmicas',
          'Juego de roles de profesiones y oficios del municipio de San Pedro y sus comunidades',
          'Circuito psicomotor en parejas para fortalecer la confianza y el trabajo cooperativo'
        ],
        svgType: 'planting'
      },
      {
        phaseNumber: 4,
        name: 'Fase 4: Consolidación Creativa y Encuentro Comunitario',
        timeframe: 'Semanas 7',
        milestone: 'Hito 4: Galería de los Afectos y Celebración con Familias',
        title: 'Feria de los Afectos y Encuentro de Convivencia Familiar',
        description: 'Exposición comunitaria de las siluetas corporales y el Libro de Historias Familiares, entrega de reconocimientos y firma del pacto de amor con acudientes.',
        strategiesAndVoices: [
          'Exposición artística en el patio y espacios escolares de la institución',
          'Canto colectivo "Me quiero y te cuido" con expresión gestual y rítmica',
          'Firma de acuerdos afectivos con huellitas dactilares'
        ],
        svgType: 'gallery'
      },
      {
        phaseNumber: 5,
        name: 'Fase 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
        timeframe: 'Semana 8 / Cierre',
        milestone: 'Hito 5: Círculo de Valoración y Registro en Diarios de Campo',
        title: 'Círculo de la Palabra y Valoración del Proceso',
        description: 'Encuentro reflexivo y dialógico con las niñas y los niños para valorar lo vivido, reconocer emociones y aprendizajes mediante la escucha atenta, registrando avances en el diario de campo, bitácora y portafolio de evidencias sin calificar ni rotular.',
        strategiesAndVoices: [
          'Círculo dialógico: "¿Qué fue lo que más disfrutamos y qué aprendimos juntos?"',
          'Registro pedagógico cualitativo en Diario de Campo y Bitácora del docente',
          'Portafolio de evidencias con las producciones infantiles y notas de observación'
        ],
        svgType: 'gallery'
      }
    ],
    rectorActivities: [
      {
        activity: "Exploración del Medio",
        description: "Recorridos guiados por las diferentes áreas del aula, patios y espacios de la institución educativa para identificar lugares de acogida, elementos de aseo personal e indagar texturas, temperaturas y objetos del entorno escolar.",
        howChildApplies: "El niño/a explora con sus manos y sentidos objetos de higiene (jabón, toalla, agua), compara temperaturas, descubre espacios seguros en su colegio, formula preguntas sobre las diferencias de estatura y rasgos corporales entre compañeros y clasifica objetos de uso personal."
      },
      {
        activity: "Juego",
        description: "Juegos cooperativos, rondas tradicionales de saludo, circuitos de confianza corporal en parejas y juego simbólico en el rincón del hogar (\"La Casita de los Afectos\").",
        howChildApplies: "El niño/a asume roles de cuidado familiar (arrullar, alimentar, cocinar, cuidar al hermanito), negocia turnos en dinámicas con pelotas y aros, crea reglas para convivir en paz con sus pares y disfruta el movimiento libre mediante danzas y juegos de estatuas."
      },
      {
        activity: "Arte",
        description: "Expresión plástica a través del trazado de siluetas humanas en tamaño real, dactilopintura con pigmentos ecológicos, modelado del rostro en plastilina casera y collage textil de prendas familiares.",
        howChildApplies: "El niño/a estampa sus manos con pintura, delinea los ojos, boca y corazón en su silueta de papel, mezcla colores para representar su tono de piel, moldea figuras que representan a su familia y exterioriza sus estados emocionales a través del trazo espontáneo."
      },
      {
        activity: "Literatura",
        description: "Lectura en voz alta de cuentos sobre diversidad familiar y emociones, recital de nanas y arrullos de la sabana de Sucre, y creación del \"Libro Viajero de los Afectos\".",
        howChildApplies: "El niño/a escucha atento los relatos, describe las ilustraciones de los personajes, inventa pequeñas historias sobre cómo le gusta ser abrazado/a, repite rimas afectuosas y comparte anécdotas de su casa usando sus propias palabras y gestos."
      }
    ],
    familyInvolvement: 'Encuentro Alianza Familia-Escuela: Taller de Crianza Amorosa y entrega del "Diario de Caricias y Diálogos en el Hogar" con registro de momentos de afecto compartido.',
    inclusionPIAR: 'Uso de tableros de comunicación con pictogramas aumentativos de emociones y partes del cuerpo, adaptaciones táctiles para niños con baja visión y rutinas anticipadas para niños con TEA.',
    valorarElProceso: {
      seguimiento: 'Observación atenta y escucha pedagógica dialógica de los avances singulares de cada niña y niño, reconociendo su proceso sin calificar ni comparar.',
      instrumentos: [
        'Diarios de campo pedagógicos',
        'Bitácora de aula y bitácora viajera',
        'Portafolio de evidencias y producciones infantiles',
        'Estudio de casos y anecdotario formativo'
      ]
    },
    ethnicAndTerritorialContext: 'Contextualizado en la realidad comunitaria de las familias del municipio de San Pedro (Sucre), reconociendo la calidez, la cultura agropecuaria y la solidaridad comunitaria de la sabana sucreña.',
    propositosMEN: [
      'Propósito 1: Las niñas y los niños construyen su identidad en relación con los otros; se sienten queridos y valoran positivamente pertenecer a una familia, cultura y mundo.',
      'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.',
      'Propósito 4: Las niñas y los niños experimentan el descubrimiento de sí mismos, apropian el espacio y el territorio que habitan, y se expresan a través del cuerpo y el movimiento libre en el encuentro con los otros.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sanjose-p2-ecotierno',
    type: 'proyecto',
    ageRange: '4 a 6 años',
    selectedDimensions: ['AMBIENTAL', 'COGNITIVA', 'CIUDADANA Y POLÍTICA', 'COMUNICATIVA Y CREATIVA'],
    topic: 'Amigos del medio ambiente "Soy Ecotierno"',
    title: 'PROYECTO 2 (PPEI I.E. MUNICIPIO DE SAN PEDRO): AMIGOS DEL MEDIO AMBIENTE "SOY ECOTIERNO"',
    duration: '20 Horas semanales (4 a 8 semanas)',
    targetAudience: 'Comunidad Educativa I.E. del Municipio de San Pedro • Transición, Jardín y Prejardín',
    relationalAxis: 'Relación con la vida y el entorno',
    theExperience: '¿Por qué las plantitas crecen con agua y sol, y quiénes son los bichitos que viven en la tierra?',
    problematizingQuestion: '¿Por qué las plantitas crecen con agua y sol, y quiénes son los bichitos que viven en la tierra?',
    justification: 'Proyecto institucional del PPEI 2026 de las I.E. del Municipio de San Pedro articulado al Proyecto Ambiental Escolar (PRAE). Fomenta el respeto por la Madre Tierra, el reciclaje creativo, la siembra en huertas/chagras escolares y el cuidado de los recursos naturales desde la primera infancia.',
    generalObjective: 'Desarrollar en las niñas y niños actitudes de asombro, respeto, indagación y cuidado activo hacia los seres vivos y el ambiente escolar y comunitario en San Pedro (Sucre).',
    essentialLearnings: [
      'Identificación de los elementos naturales (tierra, agua, aire, plantas y animales) y su valor vital.',
      'Práctica de separación de residuos (plástico, papel, orgánicos) y reutilización en creaciones artísticas.',
      'Participación activa en procesos de siembra, riego y observación del crecimiento vegetal.'
    ],
    capacitiesToDevelop: [
      'Utiliza herramientas lúdicas (lupas, frascos de trasvase, regaderas) para explorar la naturaleza.',
      'Elabora instrumentos y juguetes a partir de materiales reciclables con creatividad.',
      'Formula preguntas e hipótesis sencillas sobre el agua, el clima y los seres vivos.'
    ],
    expectedResult: '"La Huerta Ecotierna y la Eco-Instalación Sonora": Huerto en frascos y macetas recicladas junto con una orquesta de instrumentos musicales creados con material reutilizable.',
    phases: [
      {
        phaseNumber: 1,
        name: 'Fase 1: Indagar (Fase de Aprehensión Sensorial / Saberes Previos)',
        timeframe: 'Semanas 1 y 2',
        milestone: 'Hito 1: Expedición Botánica en el Patio Escolar',
        title: 'Detectives Ecotiernos en el Jardín',
        description: 'Caminata con lupas para descubrir bichitos, hojas secas, cortezas y texturas del suelo en los alrededores de la institución educativa.',
        strategiesAndVoices: [
          'Safari fotográfico y de recolección de hojas caídas',
          'Rincón sensorial de tierra húmeda, semillas y piedras lisas',
          'Pregunta detonante: "¿Qué necesitan las plantitas para vivir felices?"'
        ],
        svgType: 'nature'
      },
      {
        phaseNumber: 2,
        name: 'Fase 2: Proyectar (Fase de Juzgar / Nuevos Aprendizajes)',
        timeframe: 'Semanas 3 y 4',
        milestone: 'Hito 2: Laboratorio de Semillas y Separación Mágica',
        title: 'Sembrando Vida y Transformando Residuos',
        description: 'Diseño del plan de siembra en frascos transparentes y organización de las estaciones de reciclaje en el aula.',
        strategiesAndVoices: [
          'Experimento de germinación de fríjoles y maíz en algodón y tierra',
          'Taller de clasificación por colores de canecas (residuos aprovechables)',
          'Lectura del cuento "El árbol que aprendió a cantar"'
        ],
        svgType: 'wind'
      },
      {
        phaseNumber: 3,
        name: 'Fase 3: Vivir la Experiencia (Fase de Actuar / Proponer y Vivenciar)',
        timeframe: 'Semanas 5 y 6',
        milestone: 'Hito 3: Fabricación de Eco-Instrumentos y Riego Comunitario',
        title: 'Manos Verdes: Cuidadores del Agua y Creadores Ecológicos',
        description: 'Construcción de maracas y tambores con botellas y tubos de cartón, y jornadas diarias de cuidado del agua y la huerta.',
        strategiesAndVoices: [
          'Elaboración de regaderas caseras con botellas plásticas perforadas',
          'Pintura natural con extractos de achiote, espinaca y remolacha',
          'Música corporal y ritmos imitando la lluvia y el viento sabanero'
        ],
        svgType: 'planting'
      },
      {
        phaseNumber: 4,
        name: 'Fase 4: Consolidación Creativa y Encuentro Ecológico',
        timeframe: 'Semana 7',
        milestone: 'Hito 4: Feria Ambiental "Guardianes Ecotiernos" con Familias',
        title: 'Carnaval Verde y Concierto Reciclado Comunitario',
        description: 'Presentación de la huerta, muestra de instrumentos reciclados y concierto ecológico frente a los padres de familia.',
        strategiesAndVoices: [
          'Concierto rítmico con la Eco-Orquesta de los niños',
          'Entrega de plantitas germinadas a las familias para cuidar en casa',
          'Exposición interactiva de juguetes reciclados'
        ],
        svgType: 'gallery'
      },
      {
        phaseNumber: 5,
        name: 'Fase 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
        timeframe: 'Semana 8 / Cierre',
        milestone: 'Hito 5: Círculo de la Tierra y Registro en Diarios de Campo',
        title: 'Asamblea de los Guardianes y Valoración del Proceso',
        description: 'Diálogo circular donde los niños reflexionan sobre el cuidado del agua y los seres vivos, registrando avances cualitativos en diario de campo y bitácora escolar.',
        strategiesAndVoices: [
          'Asamblea de la palabra: "¿Cómo cambió nuestro patio escolar y cómo nos sentimos cuidándolo?"',
          'Registro en diarios de campo con anécdotas del crecimiento de las plantas',
          'Revisión comunitaria de la bitácora ecológica'
        ],
        svgType: 'gallery'
      }
    ],
    rectorActivities: [
      {
        activity: "Exploración del Medio",
        description: "Caminata de observación ecológica por los patios y jardines de la sede, recolección clasificada de hojas secas, piedras y ramas, e indagación en la mini-huerta escolar sobre el ciclo de las semillas y el cuidado del agua.",
        howChildApplies: "El niño/a toca la tierra húmeda, huele hojas aromáticas, usa lupas para observar hormigas y lombrices, formula hipótesis sobre qué necesitan las plantas para crecer, clasifica residuos en los botes ecológicos y riega con cuidado las plántulas."
      },
      {
        activity: "Juego",
        description: "Juego de roles de \"Guardianes Ecotiernos del Planeta\", circuito motor \"Salva al Río\" esquivando obstáculos y juego reglado de clasificación rápida de reciclaje (plástico, papel, orgánicos).",
        howChildApplies: "El niño/a se disfraza con capas recicladas para rescatar animales de juguete, participa con entusiasmo en carreras de recolección selectiva, inventa desafíos lúdicos para no desperdiciar agua al lavarse las manos y coopera activamente con su equipo."
      },
      {
        activity: "Arte",
        description: "Taller de esculturas y juguetes con material reciclable (botellas, tapas, cartones), pintura botánica estampando hojas de plantas sobre tela y creación del espantapájaros guardián con ropa reutilizada.",
        howChildApplies: "El niño/a transforma una botella en una regadera o un animalito, experimenta imprimiendo texturas de cortezas con témperas, modela animalitos del entorno en barro o plastilina y construye instrumentos sonoros con semillas y tapas."
      },
      {
        activity: "Literatura",
        description: "Lectura compartida de fábulas ecológicas, poemas al sol y a la lluvia, narración de leyendas tradicionales del cuidado de la naturaleza y creación de versos y pregones ambientales infantiles.",
        howChildApplies: "El niño/a hojea libros sobre la fauna silvestre, imita los sonidos de los pájaros del cuento, propone soluciones creativas para personajes en peligro ecológico y canta con ritmo los pregones creados para invitar a la comunidad a no botar basura."
      }
    ],
    familyInvolvement: 'Campaña "Un árbol o planta en mi hogar": Las familias siembran una planta ornamental o medicinal en casa y envían fotografías para el mural verde del colegio.',
    inclusionPIAR: 'Adaptación de macetas a diferentes alturas para niños con movilidad reducida y experiencias multisensoriales táctiles y olfativas para niños con discapacidad visual.',
    valorarElProceso: {
      seguimiento: 'Seguimiento cualitativo al despertar ecológico, empatía con los seres vivos y autonomía en el manejo de residuos.',
      instrumentos: [
        'Diarios de campo pedagógicos',
        'Bitácora de aula y bitácora viajera',
        'Portafolio de evidencias y producciones infantiles',
        'Estudio de casos y anecdotario formativo'
      ]
    },
    propositosMEN: [
      'Propósito 3: Las niñas y los niños disfrutan aprender; exploran y se relacionan con el mundo para comprenderlo y construirlo.',
      'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sanjose-p3-colombia',
    type: 'proyecto',
    ageRange: '4 a 6 años',
    selectedDimensions: ['CULTURAL', 'HISTÓRICA Y DE MEMORIA HISTÓRICA', 'COMUNICATIVA Y CREATIVA', 'CORPORAL'],
    topic: 'El país donde vivo - Colombia tierra querida',
    title: 'PROYECTO 3 (PPEI I.E. MUNICIPIO DE SAN PEDRO): EL PAÍS DONDE VIVO - COLOMBIA TIERRA QUERIDA',
    duration: '20 Horas semanales (4 a 8 semanas)',
    targetAudience: 'Comunidad Educativa I.E. del Municipio de San Pedro • Transición, Jardín y Prejardín',
    relationalAxis: 'Relación con el mundo, la cultura y las tradiciones',
    theExperience: '¿Por qué la música de gaitas nos da tantas ganas de bailar y qué comidas ricas nos preparan los abuelos?',
    problematizingQuestion: '¿Por qué la música de gaitas nos da tantas ganas de bailar y qué comidas ricas nos preparan los abuelos?',
    justification: 'Proyecto institucional del PPEI 2026 de las I.E. del Municipio de San Pedro enfocado en el rescate del patrimonio inmaterial sabanero y la identidad nacional. Conecta a los niños con las tradiciones de San Pedro (Sucre), el Encuentro de Bandas, los platos típicos (mote de queso, machucaos) y los saberes ancestrales de la sabana.',
    generalObjective: 'Fortalecer el sentido de pertenencia, la identidad cultural y la apreciación artística de las niñas y niños mediante el reconocimiento de las tradiciones, fiestas, músicas y sabores de San Pedro (Sucre) y Colombia.',
    essentialLearnings: [
      'Reconocimiento de las manifestaciones culturales de San Pedro y Sucre (fiestas patronales, bandas de viento, porro y fandango).',
      'Identificación de platos típicos de la región (mote de queso con ñame, machucao de berenjena, sancocho).',
      'Aprecio por los símbolos culturales colombianos, el sombrero vueltiao y la diversidad étnica del país.'
    ],
    capacitiesToDevelop: [
      'Participa en danzas tradicionales coordinando movimientos al compás de la música folclórica.',
      'Narra anécdotas y relatos compartidos por sus abuelos y familiares sobre su ciudad.',
      'Modela y dibuja elementos representativos del folclor colombiano con diversos materiales.'
    ],
    expectedResult: '"El Gran Rincón Sabanero y la Muestra Folclórica": Museo interactivo con maquetas de las fiestas sabaneras, sombreros decorados y muestra dancística de porro y cumbia.',
    phases: [
      {
        phaseNumber: 1,
        name: 'Fase 1: Indagar (Fase de Aprehensión Sensorial / Saberes Previos)',
        timeframe: 'Semanas 1 y 2',
        milestone: 'Hito 1: Audición de Bandas y Aromas de la Sabana',
        title: 'Los Sonidos y Sabores de Nuestra Tierra',
        description: 'Audición guiada de porros y cumbias de bandas tradicionales de viento, y exploración de ingredientes típicos como el ñame y el queso costeño.',
        strategiesAndVoices: [
          'Taller de escucha: Reconociendo el clarinete, el bombardino y las trompetas de viento',
          'Mesa de degustación olfativa de hierbas y condimentos tradicionales',
          'Ronda de preguntas: "¿Qué celebramos en las fiestas y tradiciones de San Pedro?"'
        ],
        svgType: 'music'
      },
      {
        phaseNumber: 2,
        name: 'Fase 2: Proyectar (Fase de Juzgar / Nuevos Aprendizajes)',
        timeframe: 'Semanas 3 y 4',
        milestone: 'Hito 2: El Baúl de los Trajes y Relatos Sabaneros',
        title: 'Viajando por Colombia y la Sabana Sucreña',
        description: 'Reconocimiento de trajes típicos, sombreros vueltiaos y construcción colectiva del mapa cultural de Colombia.',
        strategiesAndVoices: [
          'Elaboración artesanal de polleras de papel crepé y sombreros con cartulina',
          'Lectura dramatizada de mitos y leyendas infantiles de la Costa Caribe',
          'Juego de ubicación en el mapa: "¿Dónde queda San Pedro en Sucre y Colombia?"'
        ],
        svgType: 'wind'
      },
      {
        phaseNumber: 3,
        name: 'Fase 3: Vivir la Experiencia (Fase de Actuar / Proponer y Vivenciar)',
        timeframe: 'Semanas 5 y 6',
        milestone: 'Hito 3: Ensayos de Fandango y Pequeños Cocineritos',
        title: '¡A Bailar y Cocinar con Sabor Sabanero!',
        description: 'Prácticas de movimiento con cintas de colores y preparación lúdica de plasti-machucaos y amasado simbólico.',
        strategiesAndVoices: [
          'Danza de cintas y rondas al ritmo de "Colombia Tierra Querida"',
          'Taller lúdico gastronómico: Modelando las comidas típicas de San Pedro y la sabana con plastilina casera',
          'Ensayos del fandango infantil con polleras y sombreros'
        ],
        svgType: 'planting'
      },
      {
        phaseNumber: 4,
        name: 'Fase 4: Consolidación Creativa y Gran Muestra Sabanera',
        timeframe: 'Semana 7',
        milestone: 'Hito 4: Muestra Folclórica y Degustación con Familias',
        title: 'Fandango Infantil y Muestra de la Identidad Sabanera',
        description: 'Gran festival de danzas folclóricas, degustación de platos típicos aportados por las familias y exposición del mapa cultural de Colombia.',
        strategiesAndVoices: [
          'Presentación del baile de cumbia y porro por los niños vestidos con trajes típicos',
          'Mesa de degustación sabanera compartida con padres y abuelos',
          'Exposición interactiva de artesanías y sombreros vueltiaos elaborados en el aula'
        ],
        svgType: 'gallery'
      },
      {
        phaseNumber: 5,
        name: 'Fase 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
        timeframe: 'Semana 8 / Cierre',
        milestone: 'Hito 5: Círculo de la Memoria y Registro en Diarios de Campo',
        title: 'Asamblea de Tradiciones y Valoración del Proceso',
        description: 'Círculo de la palabra donde las niñas y niños expresan sus emociones y aprendizajes sobre la música y tradiciones de San Pedro y la sabana sucreña. Registro cualitativo en diarios de campo y bitácoras pedagógicas.',
        strategiesAndVoices: [
          'Círculo dialógico: "¿Qué música y bailes nos alegraron el corazón?"',
          'Registro en diarios de campo de la apropiación cultural de los niños',
          'Portafolio con fotos de la muestra folclórica y creaciones'
        ],
        svgType: 'gallery'
      }
    ],
    rectorActivities: [
      {
        activity: "Exploración del Medio",
        description: "Reconocimiento sensorial de productos agrícolas de la región sabanera (ñame criollo y diamante, yuca, plátano, coco), indagación sobre los paisajes colombianos y observación de fotografías históricas de San Pedro y sus comunidades.",
        howChildApplies: "El niño/a toca y compara la textura rugosa del ñame con la suavidad del queso, huele hierbas como el orégano y cilantro, explora mapas sensoriales con relieves de plastilina y formula preguntas sobre cómo vivían sus bisabuelos en Sucre."
      },
      {
        activity: "Juego",
        description: "Juegos tradicionales de la región (la peregrina, el trompo de madera, la lleva, rondas de corro), juego de roles de \"El Mercado Campesino de San Pedro\" y carreras de caballitos de palo.",
        howChildApplies: "El niño/a salta y coordina su cuerpo en la peregrina, asume el rol de vendedor o comprador de frutas en el mercado lúdico usando monedas de cartón, inventa canciones para sus carreras en caballitos y comparte turnos respetuosamente."
      },
      {
        activity: "Arte",
        description: "Danza infantil de porro y cumbia marcando el paso con los pies descalzos, trenzado simbólico de cintas imitando el tejido del sombrero vueltiao y pintura con tonos de la bandera colombiana.",
        howChildApplies: "El niño/a mueve sus caderas y levanta sus brazos al compás de la banda de viento, entrelaza tiras de papel para crear patrones geométricos Zenú, pinta con sus dedos la fauna colombiana y modela réplicas de instrumentos musicales."
      },
      {
        activity: "Literatura",
        description: "Narración de leyendas sabaneras, recital de coplas populares, trabalenguas y versos adaptados a la infancia, y lectura dialogada de relatos tradicionales de Sucre.",
        howChildApplies: "El niño/a declama con gracia coplas rimadas, inventa nuevos pregones festivos, escucha atento las historias contadas por abuelos invitados al aula y relata con emoción las fiestas que ha visto en su comunidad."
      }
    ],
    familyInvolvement: 'Encuentro Intergeneracional: Los abuelos y padres visitan el aula para compartir relatos orales antiguos de San Pedro, coplas sabaneras y enseñar a los niños pasos básicos de porro.',
    inclusionPIAR: 'Apoyos auditivos con instrumentos de percusión de vibración marcada para niños con hipoacusia, y descripciones verbales y táctiles de los trajes y artesanías para niños con discapacidad visual.',
    valorarElProceso: {
      seguimiento: 'Seguimiento cualitativo a la expresión corporal, disfrute del folclor y sentido de identidad cultural.',
      instrumentos: [
        'Diarios de campo pedagógicos',
        'Bitácora de aula y bitácora viajera',
        'Portafolio de evidencias y producciones infantiles',
        'Estudio de casos y anecdotario formativo'
      ]
    },
    propositosMEN: [
      'Propósito 1: Las niñas y los niños construyen su identidad en relación con los otros; se sienten queridos y valoran pertenecer a una familia, cultura y mundo.',
      'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sanjose-p4-cuento',
    type: 'proyecto',
    ageRange: '4 a 6 años',
    selectedDimensions: ['COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'SOCIOEMOCIONAL', 'CULTURAL'],
    topic: 'Recreando el cuento aprendo',
    title: 'PROYECTO 4 (PPEI I.E. MUNICIPIO DE SAN PEDRO): RECREANDO EL CUENTO APRENDO',
    duration: '20 Horas semanales (4 a 8 semanas)',
    targetAudience: 'Comunidad Educativa I.E. del Municipio de San Pedro • Transición, Jardín y Prejardín',
    relationalAxis: 'Relación con el lenguaje, la imaginación y la creatividad',
    theExperience: '¿Dónde viven los personajes de los cuentos y cómo podemos jugar con títeres y sombras mágicas?',
    problematizingQuestion: '¿Dónde viven los personajes de los cuentos y cómo podemos jugar con títeres y sombras mágicas?',
    justification: 'Proyecto institucional del PPEI 2026 de las I.E. del Municipio de San Pedro centrado en la literatura como experiencia rectora. Estimula el pensamiento simbólico, el disfrute estético, la oralidad y la estructuración de ideas a partir de la recreación lúdica de relatos infantiles.',
    generalObjective: 'Potenciar las habilidades comunicativas, la creatividad, la comprensión lectora inicial y la empatía en las niñas y niños mediante el juego con la literatura, los títeres y el arte escénico.',
    essentialLearnings: [
      'Comprensión de textos orales sencillos (narraciones, canciones, rimas, trabalenguas y poemas).',
      'Representación del mundo y sus emociones a través de dramatizaciones, títeres y lecturas de imágenes.',
      'Creación e invención colectiva de personajes, secuencias y finales alternativos para los cuentos.'
    ],
    capacitiesToDevelop: [
      'Narra secuencias de cuentos utilizando gestos expresivos y entonaciones variadas.',
      'Construye títeres y máscaras con diversos materiales reciclables y textiles.',
      'Muestra interés por explorar portadores de texto (libros ilustrados, álbumes, pictogramas).'
    ],
    expectedResult: '"El Teatro Mágico y el Gran Libro de Telas": Escenario de títeres y teatro de sombras construido colectivamente, acompañado de un libro gigante ilustrado por los niños.',
    phases: [
      {
        phaseNumber: 1,
        name: 'Fase 1: Indagar (Fase de Aprehensión Sensorial / Saberes Previos)',
        timeframe: 'Semanas 1 y 2',
        milestone: 'Hito 1: La Carpa de los Susurros y Cuentos Mágicos',
        title: 'El Bosque Encantado de las Palabras',
        description: 'Lectura susurrada y dramatizada bajo una carpa de telas y cojines en el rincón de lectura de la institución educativa.',
        strategiesAndVoices: [
          'Lectura con linternas y efectos sonoros de fondo',
          'Caja sorpresa de personajes: muñecos, sombreros mágicos y varitas de papel',
          'Lluvia de preguntas: "¿Qué personaje te gustaría ser hoy y por qué?"'
        ],
        svgType: 'nature'
      },
      {
        phaseNumber: 2,
        name: 'Fase 2: Proyectar (Fase de Juzgar / Nuevos Aprendizajes)',
        timeframe: 'Semanas 3 y 4',
        milestone: 'Hito 2: Co-Creación del Guion y Taller de Personajes',
        title: 'Inventando Nuestro Cuento Infantil',
        description: 'Votación infantil y asamblea para decidir quiénes serán los protagonistas y qué aventuras vivirán en la historia.',
        strategiesAndVoices: [
          'Mural de viñetas con pictogramas e ilustraciones secuenciales',
          'Diseño de títeres de calcetín, cucharas de palo y material reciclado',
          'Creación de rimas y canciones con los nombres de los personajes'
        ],
        svgType: 'wind'
      },
      {
        phaseNumber: 3,
        name: 'Fase 3: Vivir la Experiencia (Fase de Actuar / Proponer y Vivenciar)',
        timeframe: 'Semanas 5 y 6',
        milestone: 'Hito 3: Ensayos de Sombras y Voces Divertidas',
        title: 'Luces, Sombras y ¡Acción en el Escenario!',
        description: 'Laboratorio de teatro de sombras proyectadas con tela blanca y linternas, explorando movimientos corporales y voces moduladas.',
        strategiesAndVoices: [
          'Juego de siluetas y adivinanzas con sombras chinas',
          'Elaboración de máscaras de cartón con plumas y escarcha',
          'Grabación de audio-cuento infantil con risas y efectos creados por los niños'
        ],
        svgType: 'body'
      },
      {
        phaseNumber: 4,
        name: 'Fase 4: Consolidación Creativa y Festival Teatral',
        timeframe: 'Semana 7',
        milestone: 'Hito 4: Festival de Títeres "Palabras Mágicas" con Familias',
        title: 'Gran Estreno Teatral y Entrega del Libro Gigante',
        description: 'Función teatral y exposición del libro de telas ante la comunidad educativa y familias en el preescolar.',
        strategiesAndVoices: [
          'Puesta en escena de la obra de títeres creada por los niños',
          'Lectura pública compartida del Gran Libro Ilustrado',
          'Entrega de diplomas de Pequeños Autores Infantiles'
        ],
        svgType: 'gallery'
      },
      {
        phaseNumber: 5,
        name: 'Fase 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
        timeframe: 'Semana 8 / Cierre',
        milestone: 'Hito 5: Círculo de Lectura y Registro en Diarios de Campo',
        title: 'Asamblea de Voces y Valoración del Proceso',
        description: 'Círculo de la palabra donde los niños comparten lo que más disfrutaron al inventar personajes y recrear historias. Registro cualitativo en diarios de campo y portafolios de creaciones infantiles.',
        strategiesAndVoices: [
          'Círculo de la palabra: "¿Qué personaje me hizo reír y qué sentí al actuar?"',
          'Registro en diarios de campo del vocabulario y expresión oral',
          'Portafolio de títeres y dibujos de los cuentos'
        ],
        svgType: 'gallery'
      }
    ],
    familyInvolvement: 'Cuento Viajero: Una maleta con un cuaderno en blanco rota semanalmente por las casas para que cada familia escriba e ilustre una página del cuento con su hijo/a.',
    inclusionPIAR: 'Textos adaptados en macrotipo y con texturas táctiles en relieve (braille inicial / DUA) para garantizar la accesibilidad a todos los niños.',
    valorarElProceso: {
      seguimiento: 'Seguimiento cualitativo a la expresión verbal, gestual, comprensión de relatos y creatividad simbólica.',
      instrumentos: [
        'Diarios de campo pedagógicos',
        'Bitácora de aula y bitácora viajera',
        'Portafolio de evidencias y producciones infantiles',
        'Estudio de casos y anecdotario formativo'
      ]
    },
    propositosMEN: [
      'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.',
      'Propósito 3: Las niñas y los niños disfrutan aprender; exploran y se relacionan con el mundo para comprenderlo y construirlo.'
    ],
    createdAt: new Date().toISOString()
  }
];
