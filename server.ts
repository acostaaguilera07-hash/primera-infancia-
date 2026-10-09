import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to safely extract and parse JSON from AI responses
function extractJson<T = any>(text: string | null | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(cleaned);
    return typeof parsed === 'object' && parsed !== null ? { ...fallback, ...parsed } : fallback;
  } catch (err) {
    console.warn('Error parsing AI JSON output, utilizing fallback structure:', err);
    return fallback;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Optimized JSON Parser with high payload ceiling
  app.use(express.json({ limit: '15mb' }));

  // CORS & Security headers for shared previews
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    const ai = getAIClient();
    res.json({ 
      status: 'ok', 
      hasGeminiKey: Boolean(ai),
      model: 'gemini-3.8-flash',
      serverTime: new Date().toISOString()
    });
  });

  // Reusable multi-model Gemini caller with automatic fallback and transient error retry
  async function generateStructuredWithGemini(prompt: string, schema: any) {
    const ai = getAIClient();
    if (!ai) throw new Error('Cliente de IA no inicializado');

    // Model prioritization adhering to Gemini API guidelines:
    // 1. gemini-3.8-flash: Standard primary model for text tasks
    // 2. gemini-flash-latest: Alias for general fast text generation
    // 3. gemini-2.5-flash: Resilient preview fallback
    // 4. gemini-3.1-flash-lite: Lightweight high-efficiency fallback
    // Note: Never use gemini-3.1-pro-preview here as it requires paid tier (limit: 0 on free tier)
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite'
    ];
    let lastError: any = null;

    for (const model of candidateModels) {
      // Allow up to 2 attempts per model for transient errors (e.g. 503 Service Unavailable / 500)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: schema
            }
          });
          if (response && response.text) {
            return response.text;
          }
        } catch (err: any) {
          const errorMsg = err?.message || String(err);
          const status = err?.status || err?.code || (errorMsg.includes('503') ? 503 : (errorMsg.includes('429') ? 429 : 0));
          console.warn(`[Gemini] Modelo ${model} (intento ${attempt}/2) reportó error (${status || errorMsg}), evaluando fallback...`);
          lastError = err;

          // If quota exceeded (429), break immediately to next model without retrying
          if (status === 429 || errorMsg.includes('Quota exceeded') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
            break;
          }

          // If transient error (503 / 500 / temporary overload) on attempt 1, wait 800ms before retrying
          if (attempt === 1 && (status === 503 || status === 500 || errorMsg.includes('overloaded') || errorMsg.includes('unavailable'))) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }
        }
      }
    }
    throw lastError || new Error('No se pudo generar respuesta con los modelos disponibles');
  }

  function createChildDetonatingQuestion(topic: string, teacherPrompt?: string): string {
    const clean = topic.trim().toLowerCase();

    if (teacherPrompt) {
      const questionMatch = teacherPrompt.match(/¿([^?]+)\?/);
      if (questionMatch) {
        const q = questionMatch[1].trim();
        if (!q.toLowerCase().includes('investigar y vivenciar') && !q.toLowerCase().includes('autonomía y afecto')) {
          return `¿${q}?`;
        }
      }
    }

    if (clean.includes('cometa')) {
      return '¿Por qué las cometas vuelan en el cielo?';
    }
    if (clean.includes('viento') || clean.includes('aire')) {
      return '¿Por qué el viento nos hace cosquillitas y hace volar las cometas y las hojas si no lo podemos ver?';
    }
    if (clean.includes('agua') || clean.includes('lluvia') || clean.includes('charco')) {
      return '¿De dónde viene la lluvia y por qué el agua es tan fresca y divertida al tocarla con nuestras manos?';
    }
    if (clean.includes('mariposa') || clean.includes('oruga')) {
      return '¿Cómo hacen las mariposas para pintar sus alitas de colores y volar de flor en flor?';
    }
    if (clean.includes('hormiga') || clean.includes('bicho') || clean.includes('insecto') || clean.includes('caracol')) {
      return '¿Por qué las hormiguitas caminan en fila y qué buscan debajo de las piedras?';
    }
    if (clean.includes('planta') || clean.includes('semilla') || clean.includes('árbol') || clean.includes('jardín')) {
      return '¿Cómo duermen las semillitas en la tierra y por qué se convierten en flores de colores cuando les damos agua y sol?';
    }
    if (clean.includes('animal') || clean.includes('mascota') || clean.includes('perro') || clean.includes('gato')) {
      return '¿Qué nos dicen los animalitos con sus miradas, caricias y sonidos cuando jugamos con ellos?';
    }
    if (clean.includes('cuerpo') || clean.includes('manos') || clean.includes('pies')) {
      return '¿Quién soy yo, qué sienten mis manitas y cómo abrazo a quienes quiero en mi casa y mi escuela?';
    }
    if (clean.includes('movimiento') || clean.includes('baile') || clean.includes('danza')) {
      return '¿Cómo se mueve mi cuerpo cuando salto como un sapito, ruedo por el pasto o bailo como el viento?';
    }
    if (clean.includes('emocion') || clean.includes('sentimiento') || clean.includes('alegr') || clean.includes('coraz')) {
      return '¿Dónde siente mi cuerpo la alegría y qué hace mi corazón cuando juego con mis amigos?';
    }
    if (clean.includes('familia') || clean.includes('abuelo') || clean.includes('mamá') || clean.includes('papá') || clean.includes('casa')) {
      return '¿Quiénes viven en mi casita y qué historias y abrazos me llenan de amor antes de dormir?';
    }
    if (clean.includes('color') || clean.includes('pintur') || clean.includes('arte')) {
      return '¿De dónde salen todos los colores del mundo y qué pasa cuando los mezclamos con nuestras manos?';
    }
    if (clean.includes('sonido') || clean.includes('música') || clean.includes('canto') || clean.includes('ritmo')) {
      return '¿Por qué cuando escuchamos música nuestro cuerpo tiene tantas ganas de cantar y bailar?';
    }
    if (clean.includes('sol') || clean.includes('luna') || clean.includes('estrella') || clean.includes('noche')) {
      return '¿Por qué el sol nos da calorcito en el día y la luna nos cuida desde el cielo en la noche?';
    }
    if (clean.includes('cuadrado') || clean.includes('figura') || clean.includes('triángulo') || clean.includes('círculo')) {
      return '¿Dónde se esconden las esquinas y qué juguetes y cosas de mi aula tienen forma divertida?';
    }
    if (clean.includes('alimento') || clean.includes('fruta') || clean.includes('comida') || clean.includes('sabor')) {
      return '¿A qué saben las frutas dulces y cómo nos dan energía para correr y jugar todo el día?';
    }

    if (clean.startsWith('el ') || clean.startsWith('la ') || clean.startsWith('los ') || clean.startsWith('las ')) {
      return `¿Por qué ${clean} despiertan tanta curiosidad y cómo podemos jugar y descubrirlos en nuestro rincón mágico?`;
    }

    return `¿Por qué ${clean} es tan especial y qué cosas maravillosas podemos descubrir explorándolo hoy?`;
  }

  // Smart pedagogical synthesizer that weaves the teacher's prompt into every single moment and rector activity
  function buildCustomizedPlan(
    type: string,
    ageRange: string,
    dimensionsList: string[],
    topic: string,
    propositosMEN?: string[],
    teacherPrompt?: string
  ) {
    const promptText = (teacherPrompt || '').trim();
    const hasPrompt = Boolean(promptText);

    // Extract key sentences or themes from teacher prompt
    const promptSnippets = hasPrompt 
      ? promptText.split(/\n|;|\./).map(s => s.replace(/^-\s*/, '').trim()).filter(s => s.length > 3)
      : [];

    const mainIdea = promptSnippets[0] || promptText;
    const secondIdea = promptSnippets[1] || promptSnippets[0] || 'exploración vivencial en el entorno';
    const thirdIdea = promptSnippets[2] || promptSnippets[0] || 'creación manual y simbólica con materiales diversos';

    const defaultPropositos = [
      'Propósito 1: Las niñas y los niños construyen su identidad en relación con los otros; se sienten queridos y valoran pertenecer a una familia, cultura y mundo.',
      'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas, sentimientos y emociones; expresan, imaginan y representan su realidad.',
      'Propósito 3: Las niñas y los niños disfrutan aprender; exploran y se relacionan con el mundo para comprenderlo y construirlo.',
      'Propósito 4: Las niñas y los niños experimentan el descubrimiento de sí mismos, apropian el espacio y el territorio que habitan, y se expresan a través del cuerpo y el movimiento libre en el encuentro con los otros.'
    ];

    const planTitle = hasPrompt
      ? `${type === 'proyecto' ? 'PROYECTO DE AULA' : type === 'contenido' ? 'UNIDAD PEDAGÓGICA' : 'EXPERIENCIA'}: ${topic.toUpperCase()} - ${mainIdea.slice(0, 60).toUpperCase()}`
      : `${type === 'proyecto' ? 'PROYECTO DE AULA' : type === 'contenido' ? 'PLANEACIÓN DE CONTENIDOS' : 'EXPERIENCIA'}: ${topic.toUpperCase()} Y EL DESARROLLO INTEGRAL`;

    const childDetonatingQuestion = createChildDetonatingQuestion(topic, hasPrompt ? promptText : undefined);

    return {
      id: `plan-${Date.now()}`,
      type,
      ageRange,
      selectedDimensions: dimensionsList,
      topic,
      teacherPrompt: hasPrompt ? promptText : undefined,
      propositosMEN: propositosMEN && propositosMEN.length > 0 ? propositosMEN : defaultPropositos,
      title: planTitle,
      duration: type === 'proyecto' ? '4 semanas' : type === 'contenido' ? '1 a 2 semanas' : '1 sesión / 1 semana',
      targetAudience: 'Comunidad Educativa y Primera Infancia',
      relationalAxis: 'Relación con el mundo, los lenguajes y la vida cotidiana',
      theExperience: childDetonatingQuestion,
      problematizingQuestion: childDetonatingQuestion,
      justification: `Basado en el Decreto 1411 de 2022 y la Ley 2503 de 2025, esta experiencia responde a los intereses genuinos de la primera infancia sobre "${topic}". ${hasPrompt ? `Diseñada a partir del prompt e ideas pedagógicas del docente: "${promptText}". ` : ''}Integra las 4 Experiencias Rectoras (juego, arte, literatura y exploración del medio) fortaleciendo las dimensiones ${dimensionsList.join(', ')}.`,
      generalObjective: hasPrompt
        ? `Potenciar la exploración, el goce lúdico y el aprendizaje significativo sobre "${topic}" en niños de ${ageRange}, llevando a la práctica la propuesta pedagógica del docente: ${mainIdea}.`
        : `Promover la indagación y exploración lúdica alrededor de "${topic}" en niños de ${ageRange}, potenciando sus capacidades comunicativas, corporales, cognitivas y socioemocionales.`,
      essentialLearnings: [
        hasPrompt ? `Comprensión vivencial y práctica de: ${mainIdea}.` : `Reconocimiento vivencial de elementos y relaciones clave sobre "${topic}" en el entorno cercano.`,
        hasPrompt ? `Expresión creativa y corporal a través de: ${secondIdea}.` : 'Expresión de sentimientos, vivencias e hipótesis mediante múltiples lenguajes artísticos y corporales.',
        hasPrompt ? `Colaboración y participación activa en: ${thirdIdea}.` : 'Cooperación, cuidado mutuo y autorregulación socioemocional en las actividades cotidianas.'
      ],
      capacitiesToDevelop: [
        `Comunica sus descubrimientos, emociones e inquietudes sobre "${topic}" con lenguaje verbal y gestual fluido.`,
        hasPrompt ? `Aplica su curiosidad y motricidad en las actividades propuestas: ${mainIdea}.` : 'Participa activamente en talleres de exploración, juego simbólico y circuitos lúdicos.',
        'Fortalece vínculos afectivos, respeto por los acuerdos y empatía con sus compañeros y docentes.'
      ],
      expectedResult: hasPrompt
        ? `Producción vivencial colectiva centrada en la propuesta del docente: ${thirdIdea || mainIdea}. Muestra participativa donde los niños exponen sus creaciones y registros.`
        : `Instalación tridimensional, libro viviente de telas, museo de descubrimientos u obra colectiva sobre "${topic}".`,
      phases: [
        {
          phaseNumber: 1,
          name: 'Momento 1: Indagar (Provocación Sensorial y Acogida)',
          timeframe: 'Momento 1',
          milestone: 'Descubrimiento y Acogida Inicial',
          title: hasPrompt ? `Acogida y Provocación: ${mainIdea}` : `Acogida y Provocación Sensorial con "${topic}"`,
          description: hasPrompt
            ? `Se recibe a los niños disponiendo el ambiente según la directiva del docente: "${mainIdea}". Se generan preguntas detonantes y asamblea de asombro.`
            : `Rincón de asombro con preguntas detonantes, objetos concretos y texturas para explorar libremente "${topic}".`,
          strategiesAndVoices: [
            hasPrompt ? `Implementación vivencial: ${mainIdea}` : 'Caja misteriosa con elementos sorpresa',
            'Círculo de la palabra e interrogantes espontáneos de las niñas y los niños',
            'Canción o ronda de bienvenida articulada a la experiencia'
          ],
          svgType: 'nature'
        },
        {
          phaseNumber: 2,
          name: 'Momento 2: Proyectar (Acuerdos y Organización)',
          timeframe: 'Momento 2',
          milestone: 'Acuerdos de Cuidado y Organización',
          title: hasPrompt ? `Proyectar la Aventura: ${secondIdea}` : `Pactos de Aula y Organización de Estaciones`,
          description: hasPrompt
            ? `Acuerdos grupales y diseño de la ruta pedagógica a partir de: "${secondIdea}". Organización de roles y espacios seguros de juego.`
            : `Asamblea de acuerdos para la convivencia, cuidado de los materiales y diseño cooperativo de las estaciones lúdicas.`,
          strategiesAndVoices: [
            hasPrompt ? `Organización y acuerdos: ${secondIdea}` : 'Pacto de buen trato y cuidado mutuo con pictogramas',
            'Distribución armónica de roles y materiales',
            'Lectura dialógica orientadora'
          ],
          svgType: 'wind'
        },
        {
          phaseNumber: 3,
          name: 'Momento 3: Vivir la Experiencia (Exploración Activa)',
          timeframe: 'Momento 3',
          milestone: 'Investigación Activa y Juego Libre',
          title: hasPrompt ? `Exploración Activa: ${secondIdea}` : `Talleres de Campo y Estaciones sobre "${topic}"`,
          description: hasPrompt
            ? `Estaciones de indagación y juego donde los niños experimentan directamente con: "${secondIdea}". Manipulación sensorial y trabajo en pequeños grupos.`
            : `Actividades de manipulación, clasificación y expresión plástica en pequeñas comunidades de trabajo.`,
          strategiesAndVoices: [
            hasPrompt ? `Estación de exploración: ${secondIdea}` : 'Estaciones de juego simbólico y construcción',
            'Manipulación libre y guiada de materiales concretos',
            'Registro gráfico, modelado y formulación de hipótesis infantiles'
          ],
          svgType: 'planting'
        },
        {
          phaseNumber: 4,
          name: 'Momento 4: Consolidación Creativa (Taller y Muestra)',
          timeframe: 'Momento 4',
          milestone: 'Producción Simbólica y Consolidación Creativa',
          title: hasPrompt ? `Taller de Creación: ${thirdIdea}` : `Elaboración Colectiva y Expresión de Saberes`,
          description: hasPrompt
            ? `Taller creativo donde los niños plasman lo vivido construyendo: "${thirdIdea}". Ensamble de materiales, juego dramático y producción plástica/sensorial.`
            : `Creación de un producto vivencial o instalación (maqueta 3D, libro gigante de tela, galería de descubrimientos o teatro de sombras) que plasma lo aprendido.`,
          strategiesAndVoices: [
            hasPrompt ? `Taller vivencial: ${thirdIdea}` : 'Uso de materiales variados, reciclables o de la naturaleza',
            'Construcción y modelado colectivo en volumen o puesta en escena',
            'Muestra comunitaria y exposición participativa'
          ],
          svgType: 'gallery'
        },
        {
          phaseNumber: 5,
          name: 'Momento 5: Valorar el Proceso (Escucha Pedagógica y Registro)',
          timeframe: 'Momento 5',
          milestone: 'Seguimiento Cualitativo y Círculo de Valoración',
          title: `Valorar el Proceso: Voces Infantiles y Escucha Atenta`,
          description: `Seguimiento al desarrollo infantil integral a través de la escucha pedagógica atenta y la observación sistemática. Asamblea dialógica donde los niños comparten sensaciones, descubrimientos y emociones sobre lo vivido. Registro cualitativo en diarios de campo, bitácora del aula y portafolio de evidencias sin calificaciones ni rotulaciones.`,
          strategiesAndVoices: [
            'Círculo de la palabra y escucha atenta: los niños relatan sus descubrimientos con gestos y palabras',
            'Registro pedagógico cualitativo en Diario de Campo y Bitácora del docente',
            'Revisión compartida del portafolio infantil de creaciones y logros vivenciados',
            'Estudio de casos reflexivo y diálogo afectivo con las familias'
          ],
          svgType: 'gallery'
        }
      ],
      familyInvolvement: hasPrompt
        ? `Reto en Familia alineado a la experiencia: Compartir en casa un momento de diálogo o actividad práctica sobre "${mainIdea}", registrando una foto o frase para el aula.`
        : `Reto en Familia: Compartir una actividad en casa sobre "${topic}" y registrar un dibujo o frase significativa para la bitácora escolar.`,
      inclusionPIAR: hasPrompt && (promptText.toLowerCase().includes('dua') || promptText.toLowerCase().includes('pictograma') || promptText.toLowerCase().includes('sensorial'))
        ? `Ajustes DUA prioritarios solicitados por el docente: Materiales táctiles de alto relieve, apoyos visuales con pictogramas y flexibilidad en los tiempos de respuesta.`
        : 'Ajustes DUA: Pictogramas de alto contraste, materiales táctiles de diversas texturas y ritmo flexible.',
      valorarElProceso: {
        seguimiento: 'Observación atenta y escucha pedagógica activa de los procesos singulares de cada niña y niño, reconociendo sus ritmos y conquistas sin calificar numéricamente ni rotular.',
        instrumentos: [
          'Diarios de campo pedagógicos',
          'Bitácora de aula y bitácora viajera',
          'Portafolio de evidencias y producciones infantiles',
          'Estudio de casos y anecdotario formativo'
        ],
        estrategias: [
          'Círculo de valoración dialógica con las niñas y niños (Momento 5)',
          'Registro cualitativo de avances en las dimensiones del desarrollo',
          'Retroalimentación afectiva y constructiva'
        ]
      },
      ethnicAndTerritorialContext: hasPrompt && (promptText.toLowerCase().includes('sucre') || promptText.toLowerCase().includes('san pedro') || promptText.toLowerCase().includes('costa') || promptText.toLowerCase().includes('sabana'))
        ? `Contexto Territorial y Cultural: Integración directa de saberes, flora, fauna, cantos y tradiciones del municipio de San Pedro y la sabana sucreña vinculados a la experiencia.`
        : 'Integración de historias, saberes del territorio de San Pedro (Sucre) y respeto por la biodiversidad y el entorno comunitario.',
      rectorActivities: [
        {
          activity: 'Exploración del Medio',
          description: hasPrompt
            ? `Indagación directa y experimentación sensorial mediada por el docente a partir de: "${mainIdea}". Recolección y observación de elementos en el espacio.`
            : `Indagación directa y recolección de materiales sensoriales del entorno cotidiano sobre "${topic}".`,
          howChildApplies: hasPrompt
            ? `El niño/a toca, explora, compara y descubre activamente a través de las acciones de: ${mainIdea}.`
            : `El niño/a toca, huele, compara y formula preguntas espontáneas mientras explora elementos vinculados a "${topic}".`,
          socioemotionalAspect: `Fortalecimiento de la seguridad afectiva ante lo desconocido, tolerancia a la incertidumbre y asombro respetuoso hacia los seres vivos y el entorno.`,
          momentSync: `Sincronizado con Momento 1 (Indagar • Asombro y acogida) y Momento 3 (Vivir la Experiencia • Estaciones sensoriales).`
        },
        {
          activity: 'Juego',
          description: hasPrompt
            ? `Juego libre, simbólico y motor estructurado alrededor de: "${secondIdea}". Ambientes provocadores para asumir roles y crear mundos imaginarios.`
            : `Experiencias de juego libre, simbólico y cooperativo con retos motores estructurados a partir de "${topic}".`,
          howChildApplies: hasPrompt
            ? `El niño/a juega espontáneamente, inventa reglas compartidas y disfruta de: ${secondIdea}.`
            : `El niño/a asume roles, inventa situaciones imaginarias, comparte materiales y disfruta del movimiento libre con sus compañeros.`,
          socioemotionalAspect: `Autorregulación emocional, empatía al ponerse en el lugar del otro en el juego de roles, respeto a los turnos y resolución dialógica de discrepancias.`,
          momentSync: `Sincronizado con Momento 2 (Proyectar • Acuerdos de convivencia) y Momento 3 (Vivir la Experiencia • Juego libre y cooperativo).`
        },
        {
          activity: 'Arte',
          description: hasPrompt
            ? `Laboratorio de expresión plástica, gráfica y sonora inspirado en: "${thirdIdea}". Transformación de materiales y goce estético.`
            : `Expresión plástica, corporal y musical donde se plasman sensaciones y descubrimientos sobre "${topic}".`,
          howChildApplies: hasPrompt
            ? `El niño/a modela, ensambla, pinta y crea con sus manos plasmando su vivencia de: ${thirdIdea}.`
            : `El niño/a moldea, pinta, canta y se mueve al ritmo de canciones expresando libremente sus emociones sobre "${topic}".`,
          socioemotionalAspect: `Catarsis saludable y expresión auténtica de emociones y vivencias internas, fortalecimiento de la autoimagen creadora y disfrute estético colectivo.`,
          momentSync: `Sincronizado con Momento 3 (Vivir la Experiencia • Creación estética) y Momento 4 (Consolidación • Muestra colectiva).`
        },
        {
          activity: 'Literatura',
          description: hasPrompt
            ? `Rondas, relatos orales, cuentos ilustrados y nanas articulados a: "${mainIdea}". Espacio poético para la palabra y la escucha.`
            : `Cuentos dialógicos, rimas, nanas y relatos orales que enriquecen el vocabulario e imaginario sobre "${topic}".`,
          howChildApplies: hasPrompt
            ? `El niño/a escucha historias, narra con sus palabras, hojea imágenes y canta las rondas vinculadas a: ${mainIdea}.`
            : `El niño/a escucha con asombro, hojea libros ilustrados, "lee" imágenes y narra con sus propias palabras historias de "${topic}".`,
          socioemotionalAspect: `Identificación y nombramiento de emociones complejas mediante personajes y relatos, desarrollo de la empatía narrativa y contención afectiva en el círculo de la palabra.`,
          momentSync: `Sincronizado con Momento 1 (Indagar • Acogida) y Momento 5 (Valoración • Narración reflexiva).`
        }
      ],
      createdAt: new Date().toISOString()
    };
  }

  // Ensures that the teacher prompt is deeply embedded in the plan even after AI parsing
  function ensureTeacherPromptInPlan(plan: any, promptText: string, topic: string) {
    if (!promptText || !promptText.trim()) return plan;
    const cleanPrompt = promptText.trim();
    plan.teacherPrompt = cleanPrompt;

    if (!plan.justification || !plan.justification.includes(cleanPrompt)) {
      plan.justification = `${plan.justification || ''} Directrices pedagógicas del docente incorporadas fielmente: "${cleanPrompt}".`.trim();
    }

    // Check if phases have strategies, ensure they reflect the prompt
    if (Array.isArray(plan.phases)) {
      plan.phases = plan.phases.map((phase: any, index: number) => {
        const strats = Array.isArray(phase.strategiesAndVoices) ? [...phase.strategiesAndVoices] : [];
        const hasPromptMention = strats.some((s: string) => s.toLowerCase().includes(cleanPrompt.slice(0, 15).toLowerCase())) 
          || (phase.description && phase.description.toLowerCase().includes(cleanPrompt.slice(0, 15).toLowerCase()));

        if (!hasPromptMention && index === 0) {
          strats.unshift(`Enfoque del docente en apertura: ${cleanPrompt.slice(0, 80)}`);
        } else if (!hasPromptMention && index === 2) {
          strats.push(`Creación orientada según propuesta del docente: ${cleanPrompt.slice(0, 80)}`);
        }

        return {
          ...phase,
          strategiesAndVoices: strats
        };
      });
    }

    return plan;
  }

  // API Endpoint: Generate Pedagogical Plan under Decreto 1411 & Ley 2503
  app.post('/api/generate-plan', async (req, res) => {
    const { 
      type = 'proyecto', 
      ageRange = '3 a 5 años', 
      selectedDimensions, 
      topic = 'Exploración y Juego', 
      propositosMEN,
      teacherPrompt,
      teacherIdeas,
      customPrompt
    } = req.body || {};

    const effectiveTeacherPrompt = (typeof teacherPrompt === 'string' && teacherPrompt.trim()) 
      || (typeof teacherIdeas === 'string' && teacherIdeas.trim())
      || (typeof customPrompt === 'string' && customPrompt.trim())
      || '';

    const dimensionsList = Array.isArray(selectedDimensions) && selectedDimensions.length > 0
      ? selectedDimensions
      : ['COGNITIVA', 'COMUNICATIVA Y CREATIVA', 'CORPORAL', 'SOCIOEMOCIONAL'];

    const fallbackPlan = buildCustomizedPlan(type, ageRange, dimensionsList, topic, propositosMEN, effectiveTeacherPrompt);

    const ai = getAIClient();
    if (!ai) {
      return res.json(fallbackPlan);
    }

    try {
      const prompt = `
Eres un pedagogo experto en Educación Inicial de Colombia, especializado en el Decreto 1411 de 2022, la Ley 2503 de 2025 y los Lineamientos Curriculares para la Formación Integral del Ministerio de Educación Nacional (MEN 2026).
Genera una planificación pedagógica detallada, innovadora y profundamente contextualizada para la Primera Infancia.

Parámetros de entrada:
- Tipo de planificación: ${type} (${type === 'clase' ? 'Plan de experiencia / sesión enfocado en vivencias cotidianas' : type === 'contenido' ? 'Planeación de contenidos y conceptos clave / unidad didáctica' : 'Proyecto de aula de investigación y exploración'})
- Rango de Edad: ${ageRange}
- Dimensiones del Ser seleccionadas: ${dimensionsList.join(', ')}
${propositosMEN && Array.isArray(propositosMEN) && propositosMEN.length > 0 ? `- Propósitos de la Educación Inicial (MEN Colombia) seleccionados: ${propositosMEN.join('; ')}` : ''}
- Tema o Contenido de Interés: "${topic}"
${effectiveTeacherPrompt ? `
================================================================================
MANDATO SUPREMO Y DIRECTIVA CRÍTICA DE PERSONALIZACIÓN DEL DOCENTE (OBLIGATORIO):
El docente ha redactado las siguientes ideas pedagógicas, actividades, materiales y especificaciones precisas:
"${effectiveTeacherPrompt}"

REQUISITO INNEGOCIABLE DE CUMPLIMIENTO DEL PROMPT DEL DOCENTE:
1. MOMENTO 1 (Indagar / Provocación y Acogida): DEBES diseñar la actividad inicial incorporando directamente las dinámicas, preguntas, objetos detonantes o salidas (ej. patio, rondas, asamblea, títeres) señaladas por el docente.
2. MOMENTO 2 (Proyectar / Acuerdos y Organización): DEBES estructurar los acuerdos de aula y organización de estaciones o retos lúdicos utilizando exactamente los espacios, metodologías o dinámicas pedidas por el docente.
3. MOMENTO 3 (Vivir la Experiencia / Exploración Activa): Talleres y juego directo con los materiales del entorno señalados por el docente.
4. MOMENTO 4 (Consolidación Creativa / Taller y Muestra): El producto o vivencia creativa debe construirse y modelarse con los materiales y la propuesta exacta del docente (ej. cajas, botellas, barro, hotel de bichos, teatro, etc.).
5. MOMENTO 5 (Valorar el Proceso / Escucha Pedagógica): Círculo dialógico de valoración con los niños, validando sus descubrimientos y registrando en diario de campo y bitácora.
6. ACTIVIDADES RECTORAS (Exploración del Medio, Juego, Arte, Literatura): En cada una de las 4 actividades rectoras, describe cómo se aplican las ideas y materiales del docente.
7. VINCULACIÓN FAMILIAR Y DUA: Si el docente propuso retos en casa, bitácoras o adaptaciones sensoriales/DUA, inclúyelas explícitamente.
================================================================================
` : ''}

DIRECTIVA PEDAGÓGICA CRÍTICA - DIVERSIFICACIÓN DEL RESULTADO ESPERADO / PRODUCTO FINAL (MOMENTO 4):
Como educador infantil experto, NO limites el resultado esperado o producto final a un "mural". Debes VARIAR Y ADAPTAR la experiencia o producto acumulativo al tema y a los intereses de la edad:
- Para literatura/lenguaje: Libros gigantes de telas/texturas, teatro de títeres/sombras, álbum ilustrado, audiolibro infantil.
- Para ciencias/medio ambiente: Museo de descubrimientos y objetos curiosos, terrarios vivos, compostera, huerta escolar, maqueta de ecosistemas.
- Para matemáticas/pensamiento lógico: Maquetas tridimensionales (ej. ciudad geométrica), circuitos de retos en el piso, juegos de mesa gigantes, instalaciones de conteo.
- Para arte/expresión: Esculturas con reciclaje, instalaciones de luz y transparencias, galería de fotos y relatos, máscaras/sombreros.
- Para socioemocional/juego: Rincón o refugio de la calma, festival de roles dramáticos de la comunidad, asambleas de palabra.

Instrucciones de contenido pedagógico:
1. Título: debe ser poético, evocador e integrador (reflejando las ideas del docente si las hay).
2. Duración: adecuada para el tipo.
3. Eje Relacional de Lineamientos 2026.
4. Alineación con los 4 Propósitos de la Educación Inicial (MEN Colombia).
5. Experiencia de Interés / Pregunta Detonante en Momento 1 (Indagar):
   DIRECTIVA CRÍTICA DE PRIMERA INFANCIA (MEN COLOMBIA):
   La pregunta detonante en "theExperience" y "problematizingQuestion" DEBE ESTAR DIRIGIDA AL NIÑO/A, no al docente. Debe ser una pregunta espontánea de asombro infantil, curiosidad y juego (por ejemplo: "¿Por qué las cometas vuelan en el cielo?", "¿De dónde viene la lluvia y por qué el agua es tan fresca?", "¿Dónde siente mi cuerpo la alegría?").
   NUNCA usar fórmulas adultocéntricas como "¿Cómo podemos investigar y vivenciar [tema] a través del juego y la exploración sensorial potenciando nuestra autonomía y afecto?".
6. Justificación: Mención al Decreto 1411 de 2022 y Ley 2503, integrando las ideas del docente.
7. Objetivo General.
8. Aprendizajes Imprescindibles (3 puntos).
9. Capacidades a Desarrollar (3 capacidades).
10. Resultado Esperado (variado, innovador y concreto, respetando las ideas del docente).
11. Ruta Metodológica en EXACTAMENTE 5 MOMENTOS PEDAGÓGICOS (phaseNumber 1 al 5):
    - Momento 1: Indagar (Provocación Sensorial y Acogida)
    - Momento 2: Proyectar (Acuerdos y Organización)
    - Momento 3: Vivir la Experiencia (Exploración Activa y Estaciones)
    - Momento 4: Consolidación Creativa (Taller, Producción y Muestra)
    - Momento 5: Valorar el Proceso (Escucha Pedagógica, Seguimiento y Registro en Diarios de Campo, Bitácora y Portafolio)
12. Vinculación Familiar.
13. Ajustes Razonables DUA/PIAR.
14. Valorar el Proceso: Seguimiento cualitativo al desarrollo infantil mediante observación atenta, escucha pedagógica e instrumentos técnicos (diarios de campo, bitácora de aula, portafolio de evidencias y estudio de casos).
15. Contexto Territorial.
16. Actividades Rectoras (Decreto 1411 de 2022): Detalla para cada una de las 4 actividades rectoras (Exploración del Medio, Juego, Arte, Literatura):
    - "description": Propuesta pedagógica y ambiente mediado por el docente.
    - "howChildApplies": Cómo el niño/a lo aplica, vivencia, experimenta y transforma activamente con su cuerpo, sentidos y pares.
`;

      const planSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          relationalAxis: { type: Type.STRING },
          theExperience: { type: Type.STRING },
          problematizingQuestion: { type: Type.STRING },
          justification: { type: Type.STRING },
          generalObjective: { type: Type.STRING },
          propositosMEN: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          essentialLearnings: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          capacitiesToDevelop: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          expectedResult: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseNumber: { type: Type.INTEGER },
                name: { type: Type.STRING },
                timeframe: { type: Type.STRING },
                milestone: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                strategiesAndVoices: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                svgType: { type: Type.STRING }
              },
              required: ['phaseNumber', 'name', 'title', 'description', 'strategiesAndVoices']
            }
          },
          familyInvolvement: { type: Type.STRING },
          inclusionPIAR: { type: Type.STRING },
          valorarElProceso: {
            type: Type.OBJECT,
            properties: {
              seguimiento: { type: Type.STRING },
              instrumentos: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          },
          ethnicAndTerritorialContext: { type: Type.STRING },
          rectorActivities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                howChildApplies: { type: Type.STRING },
                socioemotionalAspect: { type: Type.STRING },
                momentSync: { type: Type.STRING }
              },
              required: ['activity', 'description', 'howChildApplies']
            }
          }
        },
        required: [
          'title', 'duration', 'targetAudience', 'relationalAxis',
          'problematizingQuestion', 'justification',
          'generalObjective', 'essentialLearnings', 'capacitiesToDevelop',
          'expectedResult', 'phases', 'familyInvolvement', 'inclusionPIAR',
          'ethnicAndTerritorialContext', 'rectorActivities'
        ]
      };

      const responseText = await generateStructuredWithGemini(prompt, planSchema);
      const planData = extractJson(responseText, fallbackPlan);
      
      const completePlan = ensureTeacherPromptInPlan({
        ...fallbackPlan,
        ...planData,
        id: `plan-${Date.now()}`,
        type,
        ageRange,
        selectedDimensions: dimensionsList,
        topic,
        teacherPrompt: effectiveTeacherPrompt || undefined,
        createdAt: new Date().toISOString()
      }, effectiveTeacherPrompt, topic);

      res.json(completePlan);
    } catch (err: any) {
      console.warn('Error en generación con Gemini, sirviendo plan personalizado garantizado:', err?.message || err);
      res.json(fallbackPlan);
    }
  });

  // API Endpoint: Qualitative Student Report (Informe Cualitativo del Estudiante)
  app.post('/api/generate-informe', async (req, res) => {
    const studentName = req.body?.studentName?.trim() || 'Estudiante';
    const ageRange = req.body?.ageRange || 'Ciclo 2 (3-6 años)';
    const sede = req.body?.sede || 'Sede Principal';
    const period = req.body?.period || 'Periodo 1';
    const rectorExperience = req.body?.rectorExperience || 'Juego, Arte, Literatura y Exploración del Medio';
    const dimensions = Array.isArray(req.body?.dimensions) ? req.body.dimensions : ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'CORPORAL'];
    const observations = req.body?.observations?.trim() || 'Demuestra avance sostenido en sus experiencias pedagógicas diarias, participación lúdica y socialización afectiva.';

    const generateLocalReport = () => ({
      summary: `Resumen Cualitativo de Avances de ${studentName} (${period}) bajo las Bases Curriculares del MEN para Educación Inicial.`,
      frequentEmotion: 'Alegría y Asombro',
      evolucionProgreso: `Durante el ${period}, ${studentName} ha demostrado un desarrollo armonioso e integral. Se destaca por su paulatina consolidación de hábitos, adaptación al grupo y entusiasmo espontáneo por explorar las experiencias pedagógicas orientadas desde el juego y la literatura.`,
      fortalezas: `Posee una excelente disposición para el trabajo colaborativo, curiosidad para hacer preguntas sobre su entorno e inclinación por lenguajes artísticos y narrativos.`,
      proposito1: `${studentName} avanza de manera progresiva en la construcción de su identidad, autonomía y manejo de emociones (Ley 2503). Demuestra autorregulación socioemocional al reconocer y nombrar sus estados afectivos (calma, alegría, entusiasmo), acudiendo a mediaciones pedagógicas cuando lo requiere y fortaleciendo el respeto por sus pares.`,
      proposito2: `Es un/a comunicador/a activo/a de sus vivencias e impresiones. Disfruta de la literatura infantil, narraciones y representaciones plásticas, manifestando sus ideas con claridad, vocabulario enriquecido y escucha atenta a sus compañeros.`,
      proposito3: `Fortalece su desarrollo cognitivo y prematemática inicial a partir de la observación atenta e indagación de su entorno natural y social. Clasifica objetos por atributos (color, forma, tamaño), realiza conteos espontáneos e indaga sobre los fenómenos de su medio formulando hipótesis sencillas.`,
      proposito4: `${studentName} experimenta el descubrimiento de sí mismo/a y apropia con seguridad el espacio y el territorio que habita. Se expresa con libertad a través de su cuerpo, la vivencia corporal y el movimiento libre en el encuentro armónico con los otros.`,
      recomendacionesFamilia: `Continuar apoyando desde el hogar mediante espacios de lectura afectiva antes de dormir, diálogo diario sobre emociones, juego motor libre y actividades de clasificación o conteo lúdico con objetos cotidianos.`,
      compromisosDocente: `Brindar ambientes enriquecidos con provocaciones pedagógicas, rincones de autorregulación emocional, circuitos de movimiento libre y retos lúdico-matemáticos progresivos.`
    });

    const ai = getAIClient();
    if (!ai) {
      return res.json(generateLocalReport());
    }

    try {
      const prompt = `
Eres un pedagogo especialista en Educación Inicial en Colombia y evaluador cualitativo bajo las Bases Curriculares del MEN, el Decreto 1411 de 2022 y los Lineamientos del Desarrollo del Ser (2026).
Redacta un INFORME DE VALORACIÓN CUALITATIVA DEL PROGRESO DEL ESTUDIANTE estructurado en la evolución del desarrollo del niño/a y los 4 PROPÓSITOS DE LA EDUCACIÓN INICIAL (Bases Curriculares MEN) para entregar a la familia.

Datos del estudiante:
- Nombre del estudiante: ${studentName}
- Rango de Edad / Nivel: ${ageRange}
- Sede: ${sede}
- Periodo evaluado: ${period}
- Experiencia Rectora principal observada: ${rectorExperience}
- Lineamientos del Ser destacados: ${dimensions.join(', ')}
- Registro acumulado de observaciones del diario de campo:
"${observations}"

Instrucciones de redacción cualitativa:
1. Usa un lenguaje respetuoso, motivador, centrado en el PROGRESO Y POTENCIALIDADES del niño/a.
2. **evolucionProgreso**: Redacta 1 o 2 párrafos describiendo la trayectoria de desarrollo y la evolución del niño/a.
3. **fortalezas**: Describe las fortalezas, habilidades destacadas y aspectos más valiosos consolidados.
4. Redacta párrafos detallados para CADA UNO de los 4 Propósitos de las Bases Curriculares del MEN:
   - **proposito1** (PROPÓSITO 1: IDENTIDAD, AUTONOMÍA, MANEJO DE EMOCIONES Y PERTENENCIA): menciona autorregulación y manejo de emociones (Ley 2503).
   - **proposito2** (PROPÓSITO 2: COMUNICACIÓN ACTIVA, EXPRESIÓN Y LENGUAJES ARTÍSTICOS): comunicación, literatura, artes y expresión.
   - **proposito3** (PROPÓSITO 3: INDAGACIÓN, OBSERVACIÓN DEL ENTORNO Y DESARROLLO COGNITIVO - PREMATEMÁTICA): lo cognitivo, prematemática inicial (conteo, clasificación) e indagación del entorno.
   - **proposito4** (PROPÓSITO 4: DESCUBRIMIENTO DE SÍ MISMOS, ESPACIO, TERRITORIO Y MOVIMIENTO LIBRE EN EL ENCUENTRO CON LOS OTROS): descubrimiento de sí mismos, apropiación del espacio y territorio que habitan, y expresión corporal en movimiento libre con los otros.
5. **recomendacionesFamilia**: Estrategias prácticas y afectivas para la familia.
6. **compromisosDocente**: Compromisos institucionales y mediación pedagógica.
7. **summary**: Resumen sintético general de 1 párrafo.
8. **frequentEmotion**: Emoción Frecuente / Actitud destacada (ej: "Alegría y Asombro", "Curiosidad y Serenidad").
`;

      const informeSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          frequentEmotion: { type: Type.STRING },
          evolucionProgreso: { type: Type.STRING },
          fortalezas: { type: Type.STRING },
          proposito1: { type: Type.STRING },
          proposito2: { type: Type.STRING },
          proposito3: { type: Type.STRING },
          proposito4: { type: Type.STRING },
          recomendacionesFamilia: { type: Type.STRING },
          compromisosDocente: { type: Type.STRING }
        },
        required: [
          'summary', 'frequentEmotion', 'evolucionProgreso', 'fortalezas', 'proposito1', 'proposito2', 'proposito3', 'proposito4', 'recomendacionesFamilia', 'compromisosDocente'
        ]
      };

      const responseText = await generateStructuredWithGemini(prompt, informeSchema);
      const fallback = generateLocalReport();
      const parsedData = extractJson(responseText, fallback);
      res.json(parsedData);
    } catch (err: any) {
      console.warn('Error en generación de informe cualitativo, sirviendo informe local:', err?.message || err);
      res.json(generateLocalReport());
    }
  });

  // API Endpoint: Acta de Convivencia Escolar (Ley 1620 / Decreto 1411)
  app.post('/api/generate-acta', async (req, res) => {
    const { studentName = 'Estudiante', parentName = 'Familia', reason, situationContext } = req.body || {};

    const defaultActa = {
      motivoReunion: reason || 'Reunión de acompañamiento pedagógico, diálogo de convivencia y compromisos de desarrollo socioemocional.',
      hechosSituacion: situationContext || `Se realiza sesión de diálogo en el marco del Comité de Convivencia Escolar para revisar el proceso de adaptación, hábitos de escucha y autorregulación socioemocional del estudiante ${studentName}.`,
      acuerdosEstudiante: '• Utilizar el rincón de la calma y el diálogo afectivo ante situaciones de frustración.\n• Respetar a sus pares y docentes con palabras amables durante el juego y trabajo colaborativo.',
      acuerdosPadres: '• Fortalecer la crianza amorosa, límites respetuosos y tiempo de calidad en el hogar.\n• Acompañar la rutina diaria con hábitos de sueño adecuados y comunicación fluida con la institución.',
      acuerdosDocente: '• Brindar mediación pedagógica cálida e inclusión de estrategias de autorregulación emocional.\n• Hacer seguimiento cualitativo quincenal e informar los logros a la familia.'
    };

    const ai = getAIClient();
    if (!ai) {
      return res.json(defaultActa);
    }

    try {
      const prompt = `
Eres un especialista en Convivencia Escolar en Colombia (Ley 1620 de 2013, Decreto 1411 de 2022 y Código de la Infancia Ley 1098).
Redacta el contenido pedagógico para un ACTA DE COMPROMISO Y CONVIVENCIA ESCOLAR formal para educación inicial.

Datos:
- Estudiante: ${studentName}
- Padre / Acudiente: ${parentName}
- Motivo preliminar: ${reason || 'Acompañamiento en convivencia y autorregulación socioemocional'}
- Contexto / Observaciones previas: ${situationContext || 'Refuerzo de pautas de convivencia y adaptación'}

Instrucciones:
Redacta en tono legal-pedagógico constructivo, no punitivo, enfocando los compromisos en la garantía de derechos y el desarrollo armónico del niño/a.
Retorna un objeto JSON con: motivoReunion, hechosSituacion, acuerdosEstudiante, acuerdosPadres, acuerdosDocente.
`;

      const actaSchema = {
        type: Type.OBJECT,
        properties: {
          motivoReunion: { type: Type.STRING },
          hechosSituacion: { type: Type.STRING },
          acuerdosEstudiante: { type: Type.STRING },
          acuerdosPadres: { type: Type.STRING },
          acuerdosDocente: { type: Type.STRING }
        },
        required: [
          'motivoReunion', 'hechosSituacion', 'acuerdosEstudiante', 'acuerdosPadres', 'acuerdosDocente'
        ]
      };

      const responseText = await generateStructuredWithGemini(prompt, actaSchema);
      const actaData = extractJson(responseText, defaultActa);
      res.json(actaData);
    } catch (err: any) {
      console.warn('Error en generación de acta, sirviendo acta estructurada predeterminada:', err?.message || err);
      res.json(defaultActa);
    }
  });

  // API Endpoint: Consentimiento Informado (Registro de Imagen y Video)
  app.post('/api/generate-consentimiento', async (req, res) => {
    const { studentName = 'Estudiante', parentName = 'Acudiente', institucion, departamento, dane, nit, telefono, ciudad } = req.body || {};

    const defaultData = {
      institucion: institucion || 'INSTITUCION EDUCATIVA "SAN PEDRO CLAVER"',
      departamento: departamento || 'DEPARTAMENTO DE SUCRE',
      dane: dane || 'DANE 170717000016',
      nit: nit || 'NIT 800166354-7',
      telefono: telefono || 'TELEFONO 3202095647',
      ciudad: ciudad || 'SAN PEDRO SUCRE',
      objetivo: 'La Institución Educativa tiene como propósito principal enriquecer las experiencias pedagógicas de los estudiantes de primera infancia (Jardín y Transición). Para lograr esto, el Docente a cargo requiere registrar (mediante fotografías y/o videos) las actividades desarrolladas en el aula y espacios institucionales.',
      compromisoProteccionDatos: 'La institución se compromete a que el material obtenido será utilizado exclusivamente para los fines pedagógicos descritos. Se garantiza que la identidad de los menores será tratada con absoluta reserva y seguridad, evitando la exposición pública del material en redes sociales u otros medios de comunicación sin una autorización adicional específica.',
      autorizaFotos: 'SI',
      autorizaVideos: 'SI',
      autorizaUsoInterno: 'SI'
    };

    const ai = getAIClient();
    if (!ai) {
      return res.json(defaultData);
    }

    try {
      const prompt = `
Eres un experto en Derecho de la Infancia y Hábeas Data en Colombia (Ley 1581 de 2012, Ley 1098 de 2006).
Redacta el texto formal para un CONSENTIMIENTO INFORMADO PARA EL REGISTRO DE IMAGEN Y VIDEO de primera infancia.

Estudiante: ${studentName}
Padre / Madre / Acudiente: ${parentName}
Institución: ${institucion || 'INSTITUCION EDUCATIVA'}

Genera los textos clave en formato JSON:
1. "objetivo": Objetivo del consentimiento (1 párrafo formal y claro).
2. "compromisoProteccionDatos": Compromiso institucional de reserva, confidencialidad y protección de datos.
`;

      const consentSchema = {
        type: Type.OBJECT,
        properties: {
          objetivo: { type: Type.STRING },
          compromisoProteccionDatos: { type: Type.STRING }
        },
        required: ['objetivo', 'compromisoProteccionDatos']
      };

      const responseText = await generateStructuredWithGemini(prompt, consentSchema);
      const consentData = extractJson(responseText, defaultData);
      res.json({ ...defaultData, ...consentData });
    } catch (err: any) {
      console.warn('Error en consentimiento, sirviendo plantilla legal por defecto:', err?.message || err);
      res.json(defaultData);
    }
  });

  // API Endpoint: Concept-Based Planning (Educación Inicial / MEN / Decreto 1411)
  app.post('/api/generate-concept-plan', async (req, res) => {
    const { 
      conceptName = 'Concepto Clave', 
      ageRange = '2 a 4 años', 
      category = 'Pensamiento Matemático',
      teacherPrompt,
      customPrompt
    } = req.body || {};

    const effectiveTeacherPrompt = (typeof teacherPrompt === 'string' && teacherPrompt.trim())
      || (typeof customPrompt === 'string' && customPrompt.trim())
      || '';

    const fallbackConcept = {
      id: `concepto-${Date.now()}`,
      conceptName,
      category,
      icon: '✨',
      ageRange,
      dimensions: ['COGNITIVA', 'COMUNICATIVA Y CREATIVA', 'CORPORAL'],
      aprendizajesImprescindibles: [
        `Aprendizaje Imprescindible 1: Reconoce y relaciona propiedades y atributos del concepto "${conceptName}" en su entorno cotidiano.`,
        `Aprendizaje Imprescindible 2: Expresa vivencias, descubrimientos y preguntas en torno a "${conceptName}" mediante múltiples lenguajes.`,
        `Aprendizaje Imprescindible 3: Participa en actividades grupales de exploración activa y construcción simbólica de "${conceptName}".`
      ],
      propositoMEN: 'Propósito 3: Los niños y las niñas disfrutan aprendiendo, exploran y se relacionan con el mundo para comprenderlo y construirlo.',
      guidingQuestion: createChildDetonatingQuestion(conceptName, effectiveTeacherPrompt),
      justification: `El trabajo didáctico centrado en el concepto de "${conceptName}" fomenta el pensamiento estructurado, la curiosidad científica y la asimilación de nociones clave en la primera infancia, en concordancia con el Decreto 1411 de 2022 y las Bases Curriculares del MEN Colombia. ${effectiveTeacherPrompt ? `Enfoque pedagógico del docente: "${effectiveTeacherPrompt}".` : ''}`,
      sensoryProvocation: {
        title: `Momento 1: Provocación Sensorial y Asombro con "${conceptName}"`,
        description: `Presentación de un rincón de asombro con materiales concretos y una caja de sorpresas centrada en "${conceptName}". Los niños exploran libremente con todos sus sentidos.`,
        materials: ['Caja misteriosa', 'Materiales concretos y del medio', 'Texturas variadas', 'Canción o cuento temático']
      },
      guidedExploration: {
        title: `Momento 2: Estaciones de Descubrimiento e Indagación de "${conceptName}"`,
        description: `Recorrido por estaciones de juego donde los niños manipulan, clasifican, dibujan y realizan construcciones colectivas relacionadas con "${conceptName}".`,
        materials: ['Masa o plastilina casera', 'Tarjetas ilustradas', 'Material de ensamble', 'Papel y crayolas']
      },
      creativeConsolidation: {
        title: `Momento 3: Taller Plástico y Cierre de Producción Colectiva`,
        description: `Elaboración de una obra tridimensional, rincón sensorial o instalación participativa donde plasman lo aprendido sobre "${conceptName}" para compartirlo con sus compañeros.`,
        materials: ['Pinturas lavables', 'Papel gigante', 'Esponjas y pinceles', 'Retazos de material reutilizable']
      },
      evaluativeDescriptors: [
        `Muestra curiosidad e interés activo por explorar e identificar el concepto de "${conceptName}".`,
        `Nombra o representa características clave de "${conceptName}" a través del juego, el dibujo o la palabra.`,
        `Aplica lo aprendido sobre "${conceptName}" en situaciones cotidianas e interacciones con sus pares.`
      ],
      adaptationsDUA: 'Uso de pictogramas, materiales táctiles con relieve y apoyos visuales de alto contraste.',
      familyActivity: `Reto en Familia: Buscar en el hogar 2 momentos o elementos vinculados a "${conceptName}" y compartir una fotito o dibujo.`,
      rectorActivities: [
        {
          activity: 'Exploración del Medio',
          description: `Rincón de indagación sensorial, manipulación y observación directa de elementos vinculados a "${conceptName}".`,
          howChildApplies: `El niño/a toca, experimenta texturas, compara tamaños y formula hipótesis sobre "${conceptName}".`
        },
        {
          activity: 'Juego',
          description: `Circuitos psicomotores, dinámicas de roles y retos de clasificación lúdica sobre "${conceptName}".`,
          howChildApplies: `El niño/a participa en juegos grupales, respeta turnos, resuelve desafíos motores y se divierte explorando "${conceptName}".`
        },
        {
          activity: 'Arte',
          description: `Talleres plásticos, dactilopintura, ensamblaje tridimensional y modelado en masa de "${conceptName}".`,
          howChildApplies: `El niño/a crea figuras con sus manos, estampa colores y expresa libremente su visión de "${conceptName}".`
        },
        {
          activity: 'Literatura',
          description: `Lectura dialógica de cuentos, rimas sonoras y narración de anécdotas en torno a "${conceptName}".`,
          howChildApplies: `El niño/a disfruta de los relatos, repite estribillos poéticos y narra sus propios descubrimientos.`
        }
      ]
    };

    const ai = getAIClient();
    if (!ai) {
      return res.json(fallbackConcept);
    }

    try {
      const prompt = `
Eres un experto en Pedagogía de la Primera Infancia y Educación Preescolar en Colombia (Decreto 1411 de 2022, Bases Curriculares MEN y APRENDIZAJES IMPRESCINDIBLES).
Diseña una UNIDAD DIDÁCTICA COMPLETA Y DETALLADA POR CONCEPTO CLAVE para niños de ${ageRange}.

CONCEPTO SOLICITADO: "${conceptName}"
CATEGORÍA: "${category}"
${effectiveTeacherPrompt ? `
DIRECTIVA DE PERSONALIZACIÓN Y PROMPT DEL DOCENTE:
El docente ha incluido las siguientes instrucciones e ideas pedagógicas para personalizar la planeación de este concepto:
"${effectiveTeacherPrompt}"
Incorpora estas ideas en las actividades de los momentos, materiales sugeridos y dinámicas lúdicas.
` : ''}

REGLA DE VARIABILIDAD EN EL PRODUCTO FINAL (MOMENTO 3 - CONSOLIDACIÓN CREATIVA):
Como educador infantil experto, NO limites la producción final a un mural. Elige y propone formatos vivenciales diversos adaptados a la categoría y concepto:
- Para Pensamiento Matemático: Maquetas tridimensionales, circuitos de retos en el suelo, juegos de mesa o cajas de clasificación.
- Para Comunicación / Literatura: Libros gigantes de telas y relieve, mini-teatros de títeres/sombras, máscaras expresivas.
- Para Exploración del Medio: Museos de descubrimientos u objetos curiosos, terrarios, maquetas vivas, composteras.
- Para Arte: Esculturas con material reutilizable, galerías de arte en relieve, instalaciones de luz.
- Para Juego / Socioemocional: Festivales de roles dramáticos, rincones de la calma, asambleas de palabra.

Estructura una planificación pedagógica de altísima calidad profesional, práctica, lúdica y centrada en las Experiencias Rectoras. Genera 3 APRENDIZAJES IMPRESCINDIBLES claros.

DIRECTIVA DE EDUCACIÓN INICIAL PARA LA PREGUNTA DETONANTE ("guidingQuestion" / Experiencia de Interés):
La pregunta DEBE ESTAR DIRIGIDA AL NIÑO/A, formulada desde su asombro, curiosidad infantil y juego cotidiano (ejemplo: si el concepto es "las cometas", debe ser "¿Por qué las cometas vuelan en el cielo?", nunca "¿Cómo podemos explorar el concepto de...").

Incluye las 4 Actividades Rectoras (Exploración del Medio, Juego, Arte, Literatura) especificando:
- "description": Propuesta pedagógica y mediación docente.
- "howChildApplies": Cómo el niño/a lo aplica, vivencia y experimenta con sus sentidos y en interacción con sus pares.
`;

      const conceptSchema = {
        type: Type.OBJECT,
        properties: {
          conceptName: { type: Type.STRING },
          category: { type: Type.STRING },
          icon: { type: Type.STRING },
          ageRange: { type: Type.STRING },
          dimensions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          aprendizajesImprescindibles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          propositoMEN: { type: Type.STRING },
          guidingQuestion: { type: Type.STRING },
          justification: { type: Type.STRING },
          sensoryProvocation: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'materials']
          },
          guidedExploration: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'materials']
          },
          creativeConsolidation: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'materials']
          },
          evaluativeDescriptors: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          adaptationsDUA: { type: Type.STRING },
          familyActivity: { type: Type.STRING },
          rectorActivities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                howChildApplies: { type: Type.STRING }
              },
              required: ['activity', 'description', 'howChildApplies']
            }
          }
        },
        required: [
          'conceptName', 'category', 'icon', 'ageRange', 'dimensions',
          'aprendizajesImprescindibles', 'propositoMEN', 'guidingQuestion', 'justification',
          'sensoryProvocation', 'guidedExploration', 'creativeConsolidation',
          'evaluativeDescriptors', 'adaptationsDUA', 'familyActivity', 'rectorActivities'
        ]
      };

      const responseText = await generateStructuredWithGemini(prompt, conceptSchema);
      const parsedConcept = extractJson(responseText, fallbackConcept);
      parsedConcept.id = `concepto-${Date.now()}`;
      res.json(parsedConcept);
    } catch (err: any) {
      console.warn('Error en concepto con Gemini, sirviendo unidad contextual:', err?.message || err);
      res.json(fallbackConcept);
    }
  });

  // API Endpoint: High Quality Pedagogical Images (Imagen 3 / Fallback)
  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9' } = req.body || {};

      if (!prompt) {
        return res.status(400).json({ error: 'El texto descriptivo para la imagen es obligatorio.' });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          isFallback: true,
          message: 'Motor ilustrativo pedagógico activo con banco de imágenes de alta resolución.',
          imageUrl: null
        });
      }

      const enhancedPrompt = `${prompt}. High quality, warm hand-painted children's book illustration or warm pedagogical classroom photography, early childhood education setting in Colombia, Decreto 1411 style, rich details, soft lighting, cheerful children and teachers.`;

      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio === '1:1' ? '1:1' : aspectRatio === '4:3' ? '4:3' : '16:9'
        }
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Bytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64Bytes}`;
        return res.json({ imageUrl, isFallback: false });
      } else {
        return res.json({
          isFallback: true,
          message: 'Ilustración seleccionada del banco pedagógico.',
          imageUrl: null
        });
      }
    } catch (err: any) {
      console.warn('Fallback fluido para generación de imagen:', err?.message || err);
      return res.json({
        isFallback: true,
        message: 'Ilustración seleccionada automáticamente del banco pedagógico de alta calidad.',
        imageUrl: null
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
