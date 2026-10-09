export type PlanType = 'clase' | 'proyecto' | 'contenido';

export type AgeRange = '0 a 2 años' | '2 a 4 años' | '4 a 6 años';

export type DimensionType = 
  | 'AMBIENTAL'
  | 'CIUDADANA Y POLÍTICA'
  | 'COGNITIVA'
  | 'COMUNICATIVA Y CREATIVA'
  | 'CORPORAL'
  | 'CULTURAL'
  | 'ÉTICA'
  | 'HISTÓRICA Y DE MEMORIA HISTÓRICA'
  | 'SOCIOEMOCIONAL';

export interface RectorActivityDetail {
  activity: 'Exploración del Medio' | 'Juego' | 'Arte' | 'Literatura' | string;
  description: string; // Propuesta pedagógica y mediación docente
  howChildApplies: string; // Cómo lo aplica, vivencia y experimenta el niño/a
  socioemotionalAspect?: string; // Dimensión y sincronización socioemocional (Ley 2503)
  momentSync?: string; // Sincronización con los momentos de la experiencia
}

export interface Phase {
  phaseNumber: number;
  name: string; // e.g. "Fase 1: Exploración e Indagación Inicial" (proyectos) o "Momento 1: Apertura y Acogida" (sesiones)
  timeframe?: string; // e.g. "Semana 1", "Semanas 2 y 3" (proyectos) o "15-20 Minutos" (sesiones)
  milestone?: string; // e.g. "Hito: Mapeo de Preguntas de los Niños" (proyectos) o "Provocación Sensorial" (sesiones)
  title: string; // "Asombro y Descubrimiento"
  description: string;
  strategiesAndVoices: string[];
  imagePrompt?: string;
  svgType?: 'nature' | 'wind' | 'planting' | 'gallery' | 'body' | 'music';
  socioemotionalAspect?: string; // Aspecto socioemocional específico de la fase/momento
}

export interface FormativeEvaluation {
  autoevaluacion: string;
  coevaluacion: string;
  retroalimentacionDialogica: string;
}

export interface PropositoArticulado {
  id?: string;
  proposito: string;
  shortTitle?: string;
  imprescindibles: string[];
}

export interface Planification {
  id: string;
  type: PlanType; // 'clase' | 'proyecto' | 'contenido'
  ageRange: AgeRange;
  selectedDimensions: DimensionType[];
  topic: string; // e.g. "el movimiento" or "los seres vivos y las emociones"
  title: string; // e.g. "EL LATIDO DE LA NATURALEZA: DESCUBRIENDO LOS SERES VIVOS Y NUESTRAS EMOCIONES"
  duration: string; // e.g. "4 semanas" or "1 semana"
  targetAudience: string; // e.g. "Comunidad Educativa"
  relationalAxis: string; // e.g. "Relación con la vida y el entorno"
  problematizingQuestion: string; // Experiencia de Interés / Pregunta detonante de indagación
  theExperience?: string; // Experiencia de Interés: Detonante vivencial y pedagógico central
  justification: string; // Reference to Decreto 1411 de 2022, Ley 2503 de 2025 & Lineamientos MEN 2026
  generalObjective: string;
  essentialLearnings: string[]; // Aprendizajes Imprescindibles
  capacitiesToDevelop: string[]; // Capacidades a Desarrollar
  expectedResult: string; // Producto Final Acumulado
  phases: Phase[];
  familyInvolvement: string; // Vinculación Familiar
  inclusionPIAR: string; // Ajustes Razonables e Inclusión (PIAR / DUA)
  rectorActivities?: RectorActivityDetail[]; // Actividades Rectoras: Exploración del Medio, Juego, Arte y Literatura
  propositosMEN?: string[]; // Propósitos de la Educación Inicial (Lineamientos Curriculares MEN Colombia)
  propositosArticulados?: PropositoArticulado[]; // Relación articulada entre Propósitos de Educación Inicial e Imprescindibles
  formativeEvaluation?: FormativeEvaluation; // Retrocompatibilidad
  valorarElProceso?: {
    seguimiento: string;
    instrumentos: string[]; // Diarios de campo, bitácora, portafolio, estudio de casos
    estrategias?: string[];
  };
  ethnicAndTerritorialContext?: string; // Saberes Ancestrales & Educación Propia
  teacherPrompt?: string; // Ideas pedagógicas e instrucciones personalizadas del docente (prompts)
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  documentId?: string; // Documento de Identificación (TI/RC/CE)
  sede: string; // e.g. "Sede Principal"
  cycle: string; // e.g. "Ciclo 2 (3-6 años)"
  frequentEmotion?: string; // e.g. "Alegría y Asombro"
  birthDate?: string; // e.g. "2021-05-14"
  age?: string; // e.g. "4 años"
  photoUrl?: string; // Fotografía opcional (URL/Base64)
  guardians?: string; // Nombres de los padres o acudientes
  contactPhones?: string; // Teléfonos de contacto
  address?: string; // Dirección de residencia
  neighborhood?: string; // Barrio
  healthRegimen?: string; // Régimen de Salud (Subsidiado, Contributivo, Especial, No vinculado)
  eps?: string; // EPS que lo atiende (ej. Capital Salud, Nueva EPS, SURA, Sanitas)
  healthNutritionNotes?: string; // Novedades de salud/nutrición
  generalObservations?: string; // Observaciones generales del observador
  createdAt: string;
  updatedAt?: string;
}

export interface DiarioEntry {
  id: string;
  studentId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  rectorExperience: string; // e.g. "Juego", "Arte", "Literatura", "Exploración del Medio"
  activityTitle: string;
  observation: string; // Registro cualitativo del Diario de Campo
  developmentAdvancement: string; // Avances Cualitativos del Desarrollo Infantil
  selectedDimensions: DimensionType[];
  emotion: string; // e.g. "Alegría y Asombro"
  pedagogicalReflection: string; // Reflexión docente y acciones de ajuste
  period?: string; // e.g. "Periodo 1", "Periodo 2", "Periodo 3", "Periodo 4", "Informe Final"
  isAiGeneratedReport?: boolean;
  qualitativeSections?: {
    proposito1?: string; // PROPÓSITO 1: IDENTIDAD, PERTENENCIA FAMILIAR & AUTONOMÍA
    proposito2?: string; // PROPÓSITO 2: COMUNICACIÓN ACTIVA, LENGUAJE Y EXPRESIÓN DE SENTIMIENTOS
    proposito3?: string; // PROPÓSITO 3: INDAGACIÓN, HIPÓTESIS E INTERACCIÓN CON EL MUNDO
    proposito4?: string; // PROPÓSITO 4: DESCUBRIMIENTO DE SÍ MISMOS, ESPACIO, TERRITORIO Y MOVIMIENTO LIBRE
    socioemocional?: string;
    lenguajesYArte?: string;
    exploracionYPensamiento?: string;
    evolucionProgreso?: string;
    fortalezas?: string;
    recomendacionesFamilia?: string;
    compromisosDocente?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ActaConvivenciaData {
  institucion: string;
  sede: string;
  fecha: string;
  hora: string;
  lugar: string;
  studentName: string;
  studentAge?: string;
  studentGrade?: string;
  parentName: string;
  parentIdType: string;
  parentIdNumber: string;
  parentRelationship: string;
  parentPhone: string;
  teacherName: string;
  teacherRole: string;
  coordinatorName?: string;
  motivoReunion: string;
  hechosSituacion: string;
  acuerdosEstudiante: string;
  acuerdosPadres: string;
  acuerdosDocente: string;
  fechaSeguimiento: string;
  observacionesAdicionales?: string;
}

export interface ConsentimientoInformadoData {
  institucion: string;
  departamento?: string;
  dane?: string;
  nit?: string;
  telefono?: string;
  municipioSede?: string;
  sede?: string;
  fecha: string;
  ciudad?: string;

  studentName: string;
  parentName: string;
  parentIdNumber: string;

  // Tabla de Declaración de Consentimiento (3 condiciones)
  autorizaFotos?: 'SI' | 'NO' | '';
  autorizaVideos?: 'SI' | 'NO' | '';
  autorizaUsoInterno?: 'SI' | 'NO' | '';

  // Secciones del documento fuente
  objetivo?: string;
  justificacionPedagogica?: {
    titulo: string;
    descripcion: string;
  }[];
  compromisoProteccionDatos?: string;

  // Campos retrocompatibles y adicionales
  studentAge?: string;
  studentGrade?: string;
  studentDocId?: string;
  parentIdType?: string;
  parentRelationship?: string;
  parentPhone?: string;
  parentEmail?: string;
  teacherName?: string;
  teacherRole?: string;
  motivoConsentimiento?: string;
  detallesActividad?: string;
  tratamientoDatos?: string;
  opcionAutorizacion?: 'AUTORIZO' | 'NO_AUTORIZO';
  observacionesFamilia?: string;
  modoDatosEnBlanco?: boolean;
}


