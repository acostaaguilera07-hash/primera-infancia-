import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  RefreshCw, 
  UserPlus, 
  Search, 
  Plus, 
  Calendar, 
  Smile, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  User, 
  Filter,
  Layers,
  Heart,
  Lightbulb,
  FileText,
  Phone,
  MapPin,
  Users,
  Activity,
  Compass,
  Camera,
  ChevronDown,
  ChevronUp,
  Upload,
  Image,
  Download,
  FileJson,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Student, DiarioEntry, DimensionType, ActaConvivenciaData, ConsentimientoInformadoData } from '../types';
import { DIMENSIONES_SER, SEDES_INSTITUCIONALES } from '../data/normativaData';
import { exportPeriodReportToWord, exportAllPeriodsReportToWord, exportStudentObservadorWord, exportActaConvivenciaWord, exportConsentimientoInformadoWord } from '../utils/exportWord';
import { exportBackupToJson, parseBackupFile, getAutoSnapshotInfo } from '../utils/backupSystem';

interface EvaluacionDiarioViewProps {
  students: Student[];
  diarioEntries: DiarioEntry[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSaveDiarioEntry: (entry: DiarioEntry) => void;
  onDeleteDiarioEntry: (entryId: string) => void;
  onClearStudentEntries?: (studentId: string) => void;
  onClearAllDiarioData?: () => void;
  onResetSeedData?: () => void;
  onRestoreBackupData?: (students: Student[], diarioEntries: DiarioEntry[]) => void;
}

const ACTIVIDADES_RECTORAS = [
  'Exploración del Medio',
  'Juego',
  'Arte',
  'Literatura'
];

const EMOCIONES_PREDETERMINADAS = [
  'Alegría y Asombro',
  'Curiosidad y Entusiasmo',
  'Serenidad y Calma',
  'Empatía y Afecto',
  'Frustración / En Autorregulación',
  'Timidez y Reserva',
  'Tristeza / Sensibilidad'
];

const REGIMENES_SALUD = [
  'Subsidiado',
  'Contributivo',
  'Especial / Excepción (Magisterio / FFMM)',
  'No Vinculado / En trámite'
];

const EPS_COLOMBIA = [
  'Capital Salud EPS',
  'Nueva EPS',
  'SURA EPS',
  'Sanitas EPS',
  'Compensar EPS',
  'Salud Total EPS',
  'Famisanar EPS',
  'Coosalud EPS',
  'Mutual Ser EPS',
  'Savia Salud EPS',
  'Asmet Salud EPS',
  'Emssanar EPS',
  'FOSYGA / ADRES (En trámite)'
];

export const EvaluacionDiarioView: React.FC<EvaluacionDiarioViewProps> = ({
  students,
  diarioEntries,
  onSaveStudent,
  onDeleteStudent,
  onSaveDiarioEntry,
  onDeleteDiarioEntry,
  onClearStudentEntries,
  onClearAllDiarioData,
  onResetSeedData,
  onRestoreBackupData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Backup / Safety Modal State
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [backupStatusMsg, setBackupStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const autoSnapshotInfo = getAutoSnapshotInfo();

  const handleDownloadBackup = () => {
    exportBackupToJson(students, diarioEntries);
    setBackupStatusMsg({
      type: 'success',
      text: '¡Copia de seguridad descargada exitosamente en formato JSON!'
    });
  };

  const handleImportBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const payload = await parseBackupFile(file);
      if (onRestoreBackupData) {
        onRestoreBackupData(payload.students, payload.diarioEntries);
        setBackupStatusMsg({
          type: 'success',
          text: `¡Restauración exitosa! Se cargaron ${payload.students.length} estudiantes y ${payload.diarioEntries.length} entradas en el diario.`
        });
      } else {
        setBackupStatusMsg({
          type: 'error',
          text: 'No se pudo vincular la función de restauración.'
        });
      }
    } catch (err: any) {
      setBackupStatusMsg({
        type: 'error',
        text: err.message || 'Error al procesar el archivo de copia de seguridad.'
      });
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleRestoreAutoSnapshot = () => {
    const info = getAutoSnapshotInfo();
    if (!info.data || (!info.data.students?.length && !info.data.diarioEntries?.length)) {
      setBackupStatusMsg({
        type: 'error',
        text: 'No hay ningún resguardo automático previo guardado en este navegador.'
      });
      return;
    }
    if (onRestoreBackupData) {
      onRestoreBackupData(info.data.students, info.data.diarioEntries);
      setBackupStatusMsg({
        type: 'success',
        text: `¡Restaurado desde Resguardo Automático! (${info.data.students.length} estudiantes y ${info.data.diarioEntries.length} diarios).`
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentForm((prev) => ({
          ...prev,
          photoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students.length > 0 ? students[0].id : ''
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSedeFilter, setSelectedSedeFilter] = useState<string>('Todas');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('Todos');

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<DiarioEntry | null>(null);

  // AI Assistant Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiStudentName, setAiStudentName] = useState<string>('Sofía Villalba Ríos');
  const [aiSede, setAiSede] = useState<string>('Sede Principal');
  const [aiNotes, setAiNotes] = useState<string>('Disfruta la lectura del cuento del Rey Momo y la Marimonda. Nombra cuando siente calma al usar el semáforo.');
  const [aiPeriod, setAiPeriod] = useState<string>('Periodo 1');
  const [aiSelectedRector, setAiSelectedRector] = useState<string>('Juego, Arte y Exploración del Medio');

  // Acta de Convivencia Modal State
  const [isActaModalOpen, setIsActaModalOpen] = useState<boolean>(false);
  const [isGeneratingActaAi, setIsGeneratingActaAi] = useState<boolean>(false);
  const [actaForm, setActaForm] = useState<ActaConvivenciaData>({
    institucion: 'INSTITUCIÓN EDUCATIVA DE EDUCACIÓN INICIAL',
    sede: 'Sede Principal',
    fecha: new Date().toISOString().split('T')[0],
    hora: '08:30 AM',
    lugar: 'Coordinación Pedagógica / Salón de Mediación',
    studentName: 'Sofía Villalba Ríos',
    studentAge: '4 años',
    studentGrade: 'Jardín / Transición',
    parentName: 'María Villalba',
    parentIdType: 'C.C.',
    parentIdNumber: '1018234567',
    parentRelationship: 'Madre / Acudiente',
    parentPhone: '310 456 7890',
    teacherName: 'Docente Mediadora de Aula',
    teacherRole: 'Especialista en Educación Inicial',
    coordinatorName: 'Coordinación de Convivencia Escolar',
    motivoReunion: 'Reunión de diálogo reflexivo, acompañamiento socioemocional y suscripción de acuerdos pedagógicos de convivencia escolar.',
    hechosSituacion: 'Se convoca a la familia para valorar de manera concertada el proceso de adaptación, pautas de escucha, respeto mutuo y autorregulación emocional del estudiante durante las vivencias pedagógicas.',
    acuerdosEstudiante: '• Hacer uso del rincón de la calma y el semáforo emocional cuando experimente emociones intensas o frustración.\n• Respetar los acuerdos del aula, utilizando un lenguaje afectivo y participando activamente en las actividades grupales.',
    acuerdosPadres: '• Fortalecer en el hogar la crianza amorosa, estableciendo rutinas claras de descanso y diálogo diario sobre las emociones.\n• Mantener una comunicación cercana e informada con la docente y asistir puntualmente a los encuentros citados.',
    acuerdosDocente: '• Implementar estrategias de mediación pedagógica cálida y ambientes favorecedores de la autorregulación socioemocional.\n• Brindar seguimiento cualitativo quincenal e informar periódicamente los logros alcanzados a la familia.',
    fechaSeguimiento: 'En 15 días hábiles (Próximo encuentro de verificación)',
    observacionesAdicionales: 'La reunión se desarrolló en un ambiente de respeto, escucha mutua y corresponsabilidad entre el hogar y la institución educativa.'
  });

  // Consentimiento Informado Modal State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [isGeneratingConsentAi, setIsGeneratingConsentAi] = useState<boolean>(false);
  const [consentForm, setConsentForm] = useState<ConsentimientoInformadoData>({
    institucion: 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO',
    departamento: 'DEPARTAMENTO DE SUCRE',
    dane: 'DANE - MUNICIPIO DE SAN PEDRO',
    nit: 'NIT 892.201.294-8',
    telefono: 'TELEFONO (605) 274-5612 / 312 654 8920',
    ciudad: 'SAN PEDRO - SUCRE',
    fecha: new Date().toISOString().split('T')[0],
    studentName: 'Sofía Villalba Ríos',
    parentName: 'María Villalba',
    parentIdNumber: '1018234567',
    autorizaFotos: '',
    autorizaVideos: '',
    autorizaUsoInterno: '',
    objetivo: 'La Institución Educativa tiene como propósito principal enriquecer las experiencias pedagógicas de los estudiantes de primera infancia (Jardín y Transición). Para lograr esto, el Docente a cargo requiere registrar (mediante fotografías y/o videos) las actividades desarrolladas en el aula y espacios institucionales.',
    compromisoProteccionDatos: 'La institución se compromete a que el material obtenido será utilizado exclusivamente para los fines pedagógicos descritos. Se garantiza que la identidad de los menores será tratada con absoluta reserva y seguridad, evitando la exposición pública del material en redes sociales u otros medios de comunicación sin una autorización adicional específica.'
  });

  // Clear History Modal State
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState<boolean>(false);
  const [showObservadorCard, setShowObservadorCard] = useState<boolean>(true);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'entry' | 'student' | 'all';
    id?: string;
    name?: string;
  } | null>(null);

  // Form States for Student
  const [studentForm, setStudentForm] = useState<{
    name: string;
    documentId: string;
    sede: string;
    cycle: string;
    frequentEmotion: string;
    birthDate: string;
    age: string;
    photoUrl: string;
    guardians: string;
    contactPhones: string;
    address: string;
    neighborhood: string;
    healthRegimen: string;
    eps: string;
    healthNutritionNotes: string;
    generalObservations: string;
  }>({
    name: '',
    documentId: '',
    sede: 'Sede Principal',
    cycle: 'Ciclo 2 (3-6 años)',
    frequentEmotion: 'Alegría y Asombro',
    birthDate: '',
    age: '',
    photoUrl: '',
    guardians: '',
    contactPhones: '',
    address: '',
    neighborhood: '',
    healthRegimen: 'Subsidiado',
    eps: 'Capital Salud EPS',
    healthNutritionNotes: '',
    generalObservations: ''
  });

  // Form States for Diario Entry
  const [entryForm, setEntryForm] = useState<{
    date: string;
    rectorExperience: string;
    activityTitle: string;
    observation: string;
    developmentAdvancement: string;
    selectedDimensions: DimensionType[];
    emotion: string;
    pedagogicalReflection: string;
    period: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    rectorExperience: 'Exploración del Medio',
    activityTitle: '',
    observation: '',
    developmentAdvancement: '',
    selectedDimensions: ['COGNITIVA', 'COMUNICATIVA Y CREATIVA'],
    emotion: 'Alegría y Asombro',
    pedagogicalReflection: '',
    period: 'Periodo 1'
  });

  const handleToggleRectorExperience = (exp: string) => {
    // Parse currently selected list from string
    let currentList = entryForm.rectorExperience
      ? entryForm.rectorExperience.split(/,|\by\b/).map((s) => s.trim()).filter(Boolean)
      : [];

    const exists = currentList.some((item) => item.toLowerCase() === exp.toLowerCase());

    if (exists) {
      currentList = currentList.filter((item) => item.toLowerCase() !== exp.toLowerCase());
    } else {
      currentList = [...currentList, exp];
    }

    let formatted = '';
    if (currentList.length === 0) {
      formatted = exp;
    } else if (currentList.length === 1) {
      formatted = currentList[0];
    } else if (currentList.length === 2) {
      formatted = `${currentList[0]} y ${currentList[1]}`;
    } else {
      formatted = `${currentList.slice(0, -1).join(', ')} y ${currentList[currentList.length - 1]}`;
    }

    setEntryForm((prev) => ({
      ...prev,
      rectorExperience: formatted
    }));
  };

  // Derived lists
  const availableSedes = Array.from(new Set([...SEDES_INSTITUCIONALES, ...students.map((s) => s.sede)]));

  const filteredStudents = students.filter((st) => {
    const matchesSearch = 
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.sede.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSede = selectedSedeFilter === 'Todas' || st.sede === selectedSedeFilter;
    return matchesSearch && matchesSede;
  });

  // Ensure an active student is selected
  const currentStudent = 
    students.find((s) => s.id === selectedStudentId) || 
    (filteredStudents.length > 0 ? filteredStudents[0] : students[0]);

  const currentStudentEntries = currentStudent 
    ? diarioEntries.filter((e) => e.studentId === currentStudent.id)
    : [];

  const visibleEntries = currentStudentEntries.filter((e) => {
    if (selectedPeriodFilter === 'Todos') return true;
    return (e.period || 'Periodo 1') === selectedPeriodFilter;
  });

  // Handler for confirmed deletion
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'entry' && deleteTarget.id) {
      onDeleteDiarioEntry(deleteTarget.id);
    } else if (deleteTarget.type === 'student' && deleteTarget.id) {
      onDeleteStudent(deleteTarget.id);
      const remaining = students.filter((s) => s.id !== deleteTarget.id);
      if (remaining.length > 0) {
        setSelectedStudentId(remaining[0].id);
      } else {
        setSelectedStudentId('');
      }
    } else if (deleteTarget.type === 'all') {
      if (onClearAllDiarioData) {
        onClearAllDiarioData();
      }
      setIsClearHistoryModalOpen(false);
    }

    setDeleteTarget(null);
  };

  // Handlers for AI Qualitative Report Generator
  const handleOpenAiModal = () => {
    if (currentStudent) {
      setAiStudentName(currentStudent.name);
      setAiSede(currentStudent.sede || 'Sede Principal');

      const studentEntries = diarioEntries.filter((e) => e.studentId === currentStudent.id);
      if (studentEntries.length > 0) {
        const aggregated = studentEntries
          .map((e) => `[Fecha: ${e.date} - ${e.period || 'P1'} - Exp: ${e.rectorExperience}]: ${e.observation} (Avances: ${e.developmentAdvancement || 'N/A'})`)
          .join('\n');
        setAiNotes(aggregated);
      } else {
        setAiNotes('Disfruta la lectura de cuentos e interacción libre. Expresa sus emociones utilizando el semáforo emocional e indaga con curiosidad los objetos de su entorno.');
      }
    } else {
      setAiStudentName('Sofía Villalba Ríos');
      setAiSede('Sede Principal');
      setAiNotes('Disfruta la lectura de cuentos e interacción libre. Expresa sus emociones utilizando el semáforo emocional e indaga con curiosidad los objetos de su entorno.');
    }
    setIsAiModalOpen(true);
  };

  const handleGenerateAiInformeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiStudentName.trim() || !aiNotes.trim()) return;

    setIsGeneratingAi(true);

    // Find or create student
    let targetStudent = students.find((s) => s.name.toLowerCase() === aiStudentName.trim().toLowerCase());
    if (!targetStudent) {
      const newStId = `student-${Date.now()}`;
      targetStudent = {
        id: newStId,
        userId: '',
        name: aiStudentName.trim(),
        sede: aiSede,
        cycle: 'Ciclo 2 (3-6 años)',
        frequentEmotion: 'Alegría y Asombro',
        createdAt: new Date().toISOString()
      };
      onSaveStudent(targetStudent);
    }
    setSelectedStudentId(targetStudent.id);

    try {
      const res = await fetch('/api/generate-informe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: targetStudent.name,
          ageRange: targetStudent.cycle,
          sede: targetStudent.sede,
          observations: aiNotes,
          period: aiPeriod,
          rectorExperience: aiSelectedRector,
          dimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'CORPORAL']
        })
      });

      let data: any = {};
      if (res.ok) {
        data = await res.json();
      } else {
        // Fallback qualitative generator using 4 Propósitos Bases Curriculares MEN
        data = {
          summary: `Resumen de Avances de ${targetStudent.name} elaborado bajo las Bases Curriculares del MEN para Educación Inicial.`,
          frequentEmotion: 'Alegría y Asombro',
          proposito1: `${targetStudent.name} avanza de manera progresiva en la construcción de su identidad, autonomía y manejo de emociones (Ley 2503). Demuestra autorregulación socioemocional al identificar y nombrar espontáneamente sus emociones (alegría, calma, sorpresa) utilizando el semáforo emocional e interactuando con empatía con sus pares.`,
          proposito2: `Es una comunicadora activa de sus ideas, sentimientos y vivencias. Disfruta de la literatura infantil y los lenguajes artísticos, expresando sus pensamientos a través del diálogo, el juego dramático y representaciones plásticas con entusiasmo.`,
          proposito3: `Fortalece su desarrollo cognitivo y prematemática inicial a partir de la observación atenta e indagación de su entorno natural y social. Clasifica elementos por forma y tamaño, realiza conteos espontáneos e indaga sobre los fenómenos de su medio formulando preguntas explicativas.`,
          proposito4: `${targetStudent.name} experimenta el descubrimiento de sí mismo/a y apropia con seguridad el espacio y el territorio que habita. Se expresa a través del cuerpo, el movimiento libre y la vivencia corporal en el encuentro con los otros.`
        };
      }

      const newReportEntry: DiarioEntry = {
        id: `informe-${Date.now()}`,
        studentId: targetStudent.id,
        userId: targetStudent.userId || '',
        date: new Date().toISOString().split('T')[0],
        rectorExperience: aiSelectedRector,
        activityTitle: `✨ Resumen de Avances por los 4 Propósitos (Bases Curriculares MEN)`,
        observation: aiNotes,
        developmentAdvancement: data.summary || `Consolida el manejo de emociones, la prematemática cognitiva, la observación del entorno y el movimiento libre.`,
        selectedDimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'CORPORAL'],
        emotion: data.frequentEmotion || targetStudent.frequentEmotion || 'Alegría y Asombro',
        pedagogicalReflection: data.recomendacionesFamilia || 'Acompañar desde el hogar fortaleciendo la lectura afectiva, la clasificación de objetos cotidianos y la conversación sobre emociones.',
        period: aiPeriod || 'Periodo 1',
        isAiGeneratedReport: true,
        qualitativeSections: {
          evolucionProgreso: data.evolucionProgreso || `Durante el periodo, ${targetStudent.name} ha demostrado un progreso significativo en su proceso de adaptación e integración grupal. Participa activamente con curiosidad y confianza en las experiencias pedagógicas diarias.`,
          fortalezas: data.fortalezas || `Destaca por su empatía con sus pares, expresión creativa mediante el lenguaje verbal y artístico, y gran capacidad de observación e indagación del entorno natural.`,
          proposito1: data.proposito1 || `${targetStudent.name} avanza de manera progresiva en la construcción de su identidad, autonomía y manejo de emociones (Ley 2503). Demuestra autorregulación socioemocional al identificar y nombrar espontáneamente sus emociones utilizando el semáforo emocional.`,
          proposito2: data.proposito2 || `Es una comunicadora activa de sus ideas, sentimientos y vivencias. Disfruta de la literatura infantil y los lenguajes artísticos, expresando sus pensamientos a través del diálogo y representaciones artísticas.`,
          proposito3: data.proposito3 || `Fortalece su desarrollo cognitivo y prematemática inicial a partir de la observación atenta e indagación de su entorno natural y social. Clasifica elementos por atributos, realiza conteos espontáneos e indaga con curiosidad.`,
          proposito4: data.proposito4 || `${targetStudent.name} experimenta el descubrimiento de sí mismo/a y apropia con seguridad el espacio y el territorio que habita. Se expresa con libertad a través de su cuerpo y el movimiento libre en el encuentro con los otros.`,
          recomendacionesFamilia: data.recomendacionesFamilia || 'Fortalecer el hábito de la lectura compartida en casa y la conversación diaria sobre emociones.',
          compromisosDocente: data.compromisosDocente || 'Continuar propiciando ambientes provocadores de aprendizaje, rincones de la calma y retos de resolución de problemas cotidianos.'
        },
        createdAt: new Date().toISOString()
      };

      onSaveDiarioEntry(newReportEntry);
      setIsAiModalOpen(false);
    } catch (err) {
      console.error('Error generating qualitative report:', err);
      const fallbackReportEntry: DiarioEntry = {
        id: `informe-${Date.now()}`,
        studentId: targetStudent.id,
        userId: targetStudent.userId || '',
        date: new Date().toISOString().split('T')[0],
        rectorExperience: aiSelectedRector,
        activityTitle: `✨ Resumen de Avances por los 4 Propósitos (Bases Curriculares MEN)`,
        observation: aiNotes,
        developmentAdvancement: 'Fortalece el manejo de emociones, la comunicación activa, lo cognitivo, la prematemática inicial y el movimiento libre.',
        selectedDimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'COGNITIVA', 'CORPORAL'],
        emotion: targetStudent.frequentEmotion || 'Alegría y Asombro',
        pedagogicalReflection: 'Continuar brindando afecto y experiencias de exploración sensorial, movimiento y conteo libre en el aula y la familia.',
        period: aiPeriod || 'Periodo 1',
        isAiGeneratedReport: true,
        qualitativeSections: {
          evolucionProgreso: `Demuestra una evolución positiva sostenida desde el inicio del periodo. Participa con mayor seguridad y autonomía en las actividades pedagógicas y de grupo.`,
          fortalezas: `Destaca por su empatía, expresión verbal fluida y curiosidad activa para explorar retos matemáticos sencillos y fenómenos del entorno.`,
          proposito1: `${targetStudent.name} avanza de manera progresiva en la construcción de su identidad, autonomía y manejo de emociones (Ley 2503). Demuestra autorregulación socioemocional al identificar sus emociones con el semáforo emocional.`,
          proposito2: `Muestra un profundo interés por la literatura y la expresión verbal, manifestando libremente sus sentimientos e ideas a través de dramatizaciones y la palabra.`,
          proposito3: `Desarrolla su pensamiento cognitivo y prematemática inicial mediante la observación atenta de su entorno. Clasifica objetos, realiza conteos espontáneos e indaga sobre los seres vivos de su medio.`,
          proposito4: `${targetStudent.name} experimenta el descubrimiento de sí mismo/a y apropia con seguridad el espacio y el territorio que habita. Se expresa a través del cuerpo y el movimiento libre en el encuentro armónico con los otros.`,
          recomendacionesFamilia: 'Acompañar con lectura diaria, juego psicomotor y ejercicios prácticos de conteo y clasificación en rutinas familiares.',
          compromisosDocente: 'Continuar brindando afecto, circuitos motores y experiencias de exploración sensorial en el aula.'
        },
        createdAt: new Date().toISOString()
      };
      onSaveDiarioEntry(fallbackReportEntry);
      setIsAiModalOpen(false);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handlers for Acta de Convivencia
  const handleOpenActaModal = (studentOverride?: Student) => {
    const targetStudent = studentOverride || currentStudent;
    if (targetStudent) {
      setActaForm({
        institucion: 'INSTITUCIÓN EDUCATIVA DE EDUCACIÓN INICIAL',
        sede: targetStudent.sede || 'Sede Principal',
        fecha: new Date().toISOString().split('T')[0],
        hora: '08:30 AM',
        lugar: 'Coordinación Pedagógica / Salón de Mediación',
        studentName: targetStudent.name,
        studentAge: targetStudent.age || '4 años',
        studentGrade: targetStudent.cycle || 'Educación Inicial',
        parentName: targetStudent.guardians || 'Padre / Madre / Acudiente',
        parentIdType: 'C.C.',
        parentIdNumber: targetStudent.documentId || 'Sin registrar',
        parentRelationship: 'Acudiente Principal',
        parentPhone: targetStudent.contactPhones || '300 000 0000',
        teacherName: 'Docente Mediadora',
        teacherRole: 'Docente de Aula - Educación Inicial',
        coordinatorName: 'Coordinación de Convivencia Escolar',
        motivoReunion: 'Reunión de diálogo reflexivo, acompañamiento socioemocional y suscripción de pactos de convivencia escolar.',
        hechosSituacion: 'Se invita a la familia a la sesión de mediación pedagógica para concertar apoyos en la autorregulación socioemocional, hábitos de atención y pautas de relacionamiento armónico en el aula.',
        acuerdosEstudiante: '• Practicar el diálogo afectivo y la autorregulación recurriendo al rincón de la calma en momentos de frustración.\n• Respetar a sus compañeros y docentes mediante el uso de palabras amables y la participación colaborativa.',
        acuerdosPadres: '• Fortalecer en el hogar el diálogo afectivo sobre emociones y limitar el tiempo de pantallas antes de dormir.\n• Mantener comunicación continua con la docente y asistir a las jornadas de seguimiento.',
        acuerdosDocente: '• Promover experiencias lúdicas de empatía y autorregulación emocional en el grupo.\n• Realizar seguimiento cualitativo continuo y notificar periódicamente a la familia.',
        fechaSeguimiento: 'En 15 días hábiles',
        observacionesAdicionales: 'Acta suscrita de mutuo acuerdo bajo los principios de la Ley 1620 de Convivencia Escolar y la Ley 2503 de Desarrollo Emocional.'
      });
    }
    setIsActaModalOpen(true);
  };

  const handleGenerateActaAi = async () => {
    setIsGeneratingActaAi(true);
    try {
      const response = await fetch('/api/generate-acta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: actaForm.studentName,
          parentName: actaForm.parentName,
          reason: actaForm.motivoReunion,
          situationContext: actaForm.hechosSituacion
        })
      });
      if (response.ok) {
        const data = await response.json();
        setActaForm((prev) => ({
          ...prev,
          motivoReunion: data.motivoReunion || prev.motivoReunion,
          hechosSituacion: data.hechosSituacion || prev.hechosSituacion,
          acuerdosEstudiante: data.acuerdosEstudiante || prev.acuerdosEstudiante,
          acuerdosPadres: data.acuerdosPadres || prev.acuerdosPadres,
          acuerdosDocente: data.acuerdosDocente || prev.acuerdosDocente,
        }));
      }
    } catch (e) {
      console.warn('Error fetching AI generated acta:', e);
    } finally {
      setIsGeneratingActaAi(false);
    }
  };

  const handleExportActaWord = async () => {
    try {
      await exportActaConvivenciaWord(actaForm);
    } catch (e) {
      console.error('Error al exportar acta a Word:', e);
      alert('Ocurrió un inconveniente al generar el documento de Word. Por favor intenta nuevamente.');
    }
  };

  // Handlers for Consentimiento Informado
  const handleOpenConsentModal = (studentOverride?: Student) => {
    const targetStudent = studentOverride || currentStudent;
    if (targetStudent) {
      setConsentForm({
        institucion: 'INSTITUCIÓN EDUCATIVA DE EDUCACIÓN INICIAL',
        sede: targetStudent.sede || 'Sede Principal',
        fecha: new Date().toISOString().split('T')[0],
        ciudad: 'Colombia',
        studentName: targetStudent.name,
        studentAge: targetStudent.age || '4 años',
        studentGrade: targetStudent.cycle || 'Educación Inicial',
        studentDocId: targetStudent.documentId || 'Sin registrar',
        parentName: targetStudent.guardians || 'Padre / Madre / Acudiente',
        parentIdType: 'C.C.',
        parentIdNumber: targetStudent.documentId || 'Sin registrar',
        parentRelationship: 'Acudiente Principal',
        parentPhone: targetStudent.contactPhones || '300 000 0000',
        parentEmail: 'familia@ejemplo.edu.co',
        teacherName: 'Docente Mediadora',
        teacherRole: 'Docente de Aula - Educación Inicial',
        motivoConsentimiento: 'Autorización pedagógica e institucional para la toma de evidencias (fotográficas y narrativas), acompañamiento en experiencias de autorregulación socioemocional y salidas de observación.',
        detallesActividad: 'Las evidencias recolectadas servirán exclusivamente para fundamentar la valoración cualitativa en el observador escolar y el informe trimestral de desarrollo. Se garantiza el trato digno y la privacidad del niño/a.',
        tratamientoDatos: 'En cumplimiento de la Ley 1581 de 2012 y el Código de la Infancia (Ley 1098 de 2006), la información del menor se tratará con confidencialidad absoluta.',
        opcionAutorizacion: 'AUTORIZO',
        observacionesFamilia: ''
      });
    }
    setIsConsentModalOpen(true);
  };

  const handleGenerateConsentAi = async () => {
    setIsGeneratingConsentAi(true);
    try {
      const response = await fetch('/api/generate-consentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: consentForm.studentName,
          parentName: consentForm.parentName,
          institucion: consentForm.institucion,
          departamento: consentForm.departamento,
          dane: consentForm.dane,
          nit: consentForm.nit,
          telefono: consentForm.telefono,
          ciudad: consentForm.ciudad
        })
      });
      if (response.ok) {
        const data = await response.json();
        setConsentForm((prev) => ({
          ...prev,
          objetivo: data.objetivo || prev.objetivo,
          compromisoProteccionDatos: data.compromisoProteccionDatos || prev.compromisoProteccionDatos
        }));
      }
    } catch (e) {
      console.warn('Error fetching AI generated consentimiento:', e);
    } finally {
      setIsGeneratingConsentAi(false);
    }
  };

  const handleExportConsentWord = async () => {
    try {
      await exportConsentimientoInformadoWord(consentForm);
    } catch (e) {
      console.error('Error al exportar consentimiento a Word:', e);
      alert('Ocurrió un inconveniente al generar el consentimiento en Word. Intente nuevamente.');
    }
  };

  // Handlers for Student Modal
  const handleOpenStudentModal = (stToEdit?: Student) => {
    if (stToEdit) {
      setEditingStudent(stToEdit);
      setStudentForm({
        name: stToEdit.name,
        documentId: stToEdit.documentId || '',
        sede: stToEdit.sede,
        cycle: stToEdit.cycle,
        frequentEmotion: stToEdit.frequentEmotion || 'Alegría y Asombro',
        birthDate: stToEdit.birthDate || '',
        age: stToEdit.age || '',
        photoUrl: stToEdit.photoUrl || '',
        guardians: stToEdit.guardians || '',
        contactPhones: stToEdit.contactPhones || '',
        address: stToEdit.address || '',
        neighborhood: stToEdit.neighborhood || '',
        healthRegimen: stToEdit.healthRegimen || 'Subsidiado',
        eps: stToEdit.eps || 'Capital Salud EPS',
        healthNutritionNotes: stToEdit.healthNutritionNotes || '',
        generalObservations: stToEdit.generalObservations || ''
      });
    } else {
      setEditingStudent(null);
      setStudentForm({
        name: '',
        documentId: '',
        sede: 'Sede Principal',
        cycle: 'Ciclo 2 (3-6 años)',
        frequentEmotion: 'Alegría y Asombro',
        birthDate: '',
        age: '',
        photoUrl: '',
        guardians: '',
        contactPhones: '',
        address: '',
        neighborhood: '',
        healthRegimen: 'Subsidiado',
        eps: 'Capital Salud EPS',
        healthNutritionNotes: '',
        generalObservations: ''
      });
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    const newStudent: Student = {
      id: editingStudent ? editingStudent.id : `student-${Date.now()}`,
      userId: editingStudent ? editingStudent.userId : '',
      name: studentForm.name.trim(),
      documentId: studentForm.documentId.trim(),
      sede: studentForm.sede,
      cycle: studentForm.cycle,
      frequentEmotion: studentForm.frequentEmotion,
      birthDate: studentForm.birthDate,
      age: studentForm.age,
      photoUrl: studentForm.photoUrl,
      guardians: studentForm.guardians,
      contactPhones: studentForm.contactPhones,
      address: studentForm.address,
      neighborhood: studentForm.neighborhood,
      healthRegimen: studentForm.healthRegimen,
      eps: studentForm.eps,
      healthNutritionNotes: studentForm.healthNutritionNotes,
      generalObservations: studentForm.generalObservations,
      createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString()
    };

    onSaveStudent(newStudent);
    setSelectedStudentId(newStudent.id);
    setIsStudentModalOpen(false);
  };

  // Handlers for Diario Entry Modal
  const handleOpenEntryModal = (entryToEdit?: DiarioEntry, presetPeriod?: string) => {
    if (!currentStudent) return;

    if (entryToEdit) {
      setEditingEntry(entryToEdit);
      setEntryForm({
        date: entryToEdit.date,
        rectorExperience: entryToEdit.rectorExperience,
        activityTitle: entryToEdit.activityTitle,
        observation: entryToEdit.observation,
        developmentAdvancement: entryToEdit.developmentAdvancement,
        selectedDimensions: entryToEdit.selectedDimensions,
        emotion: entryToEdit.emotion,
        pedagogicalReflection: entryToEdit.pedagogicalReflection,
        period: entryToEdit.period || 'Periodo 1'
      });
    } else {
      setEditingEntry(null);
      setEntryForm({
        date: new Date().toISOString().split('T')[0],
        rectorExperience: 'Exploración del Medio',
        activityTitle: '',
        observation: '',
        developmentAdvancement: '',
        selectedDimensions: ['COGNITIVA', 'COMUNICATIVA Y CREATIVA'],
        emotion: currentStudent.frequentEmotion || 'Alegría y Asombro',
        pedagogicalReflection: '',
        period: presetPeriod || (selectedPeriodFilter !== 'Todos' ? selectedPeriodFilter : 'Periodo 1')
      });
    }
    setIsEntryModalOpen(true);
  };

  const handleSaveEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !entryForm.activityTitle.trim() || !entryForm.observation.trim()) return;

    const newEntry: DiarioEntry = {
      id: editingEntry ? editingEntry.id : `entry-${Date.now()}`,
      studentId: currentStudent.id,
      userId: editingEntry ? editingEntry.userId : '',
      date: entryForm.date,
      rectorExperience: entryForm.rectorExperience,
      activityTitle: entryForm.activityTitle.trim(),
      observation: entryForm.observation.trim(),
      developmentAdvancement: entryForm.developmentAdvancement.trim(),
      selectedDimensions: entryForm.selectedDimensions,
      emotion: entryForm.emotion,
      pedagogicalReflection: entryForm.pedagogicalReflection.trim(),
      period: entryForm.period || 'Periodo 1',
      isAiGeneratedReport: editingEntry ? editingEntry.isAiGeneratedReport : false,
      qualitativeSections: editingEntry ? editingEntry.qualitativeSections : undefined,
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString()
    };

    onSaveDiarioEntry(newEntry);
    setIsEntryModalOpen(false);
  };

  const handleToggleDimension = (dimCode: DimensionType) => {
    setEntryForm((prev) => {
      const exists = prev.selectedDimensions.includes(dimCode);
      if (exists) {
        return {
          ...prev,
          selectedDimensions: prev.selectedDimensions.filter((d) => d !== dimCode)
        };
      } else {
        return {
          ...prev,
          selectedDimensions: [...prev.selectedDimensions, dimCode]
        };
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* TOP BANNER */}
      <div className="bg-white rounded-3xl border border-blue-200 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              <span className="bg-amber-100/80 px-1 py-0.5 rounded">Informe Cualitativo del Estudiante</span>
            </h2>

            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1e3a8a] border border-blue-300">
              Decreto 1411 / Lineamientos MEN 2026
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 pl-0 sm:pl-10">
            Redacta informes cualitativos profesionales asistidos por IA a partir de tus apuntes u observaciones pedagógicas del desarrollo infantil.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setIsBackupModalOpen(true)}
            title="Seguro de Recuperación de Datos y Resguardo Automático"
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="whitespace-nowrap">Seguro de Datos</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button>

          <button
            onClick={handleOpenAiModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-indigo-900 hover:from-[#172554] hover:to-[#1e3a8a] text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 border border-blue-500/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>✨ Redactar Informe con IA</span>
          </button>


          <button
            onClick={() => handleOpenStudentModal()}
            className="flex items-center space-x-1 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>+ Estudiante</span>
          </button>

          <button
            onClick={() => setIsClearHistoryModalOpen(true)}
            title="Vaciar historial de informes y diario"
            className="flex items-center space-x-1 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Vaciar Historial</span>
          </button>

          <button
            onClick={handlePrint}
            title="Imprimir informe en PDF"
            className="flex items-center space-x-1 border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir</span>
          </button>

          {onResetSeedData && (
            <button
              onClick={onResetSeedData}
              title="Restablecer datos de muestra"
              className="p-2.5 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-2xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* TWO COLUMN LAYOUT: Sidebar (Estudiantes) + Main (Diario de Campo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Estudiantes (3 or 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-blue-200/90 rounded-3xl p-5 shadow-sm space-y-4 h-fit">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-700" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Estudiantes ({students.length})
              </h3>
            </div>

            <span className="bg-blue-100 text-[#1e3a8a] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-300">
              Persistente
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar estudiante o sede..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filter Dropdown */}
          <div>
            <select
              value={selectedSedeFilter}
              onChange={(e) => setSelectedSedeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Todas">Todas las sedes</option>
              {availableSedes.map((sede) => (
                <option key={sede} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
          </div>

          {/* Student List Cards */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No se encontraron estudiantes.
              </div>
            ) : (
              filteredStudents.map((st) => {
                const isSelected = currentStudent?.id === st.id;
                const entriesCount = diarioEntries.filter((e) => e.studentId === st.id).length;

                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-[#1e3a8a] text-blue-100' 
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}>
                        {st.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold line-clamp-1 ${
                          isSelected ? 'text-blue-950' : 'text-slate-800'
                        }`}>
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {st.sede} • {st.cycle.split(' ')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {entriesCount} reg
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ type: 'student', id: st.id, name: st.name });
                        }}
                        title={`Eliminar ${st.name}`}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => handleOpenStudentModal()}
            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] font-bold text-xs rounded-2xl border border-blue-300 transition-colors flex items-center justify-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar Otro Estudiante</span>
          </button>

        </div>

        {/* RIGHT COLUMN: Diario de Campo Details of Selected Student (8 cols) */}
        <div className="lg:col-span-8 bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          
          {currentStudent ? (
            <>
              {/* Header Badges & Main Title */}
              <div className="space-y-3 pb-4 border-b border-slate-200/80">
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                      {currentStudent.sede} • {currentStudent.cycle}
                    </span>

                    {currentStudent.frequentEmotion && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <span>🎭 Emoción: {currentStudent.frequentEmotion}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleOpenAiModal}
                      className="flex items-center space-x-1.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] hover:from-[#172554] hover:to-[#1e3a8a] text-white px-3.5 py-2 rounded-2xl font-extrabold text-xs shadow-sm transition-all active:scale-95 border border-blue-500/30"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>✨ Redactar Informe con IA</span>
                    </button>

                    <button
                      onClick={() => handleOpenEntryModal()}
                      className="flex items-center space-x-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-3.5 py-2 rounded-2xl font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-blue-300" />
                      <span>+ Entrada Manual</span>
                    </button>
                  </div>
                </div>

                {/* Name Title & Options */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentStudent.name}
                  </h3>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenStudentModal(currentStudent)}
                      title="Editar Estudiante"
                      className="p-2 text-slate-500 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'student', id: currentStudent.id, name: currentStudent.name })}
                      title="Eliminar Estudiante"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FICHA DEL OBSERVADOR DEL ESTUDIANTE (EXPANDIBLE) */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowObservadorCard(!showObservadorCard)}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1e40af] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentStudent.photoUrl ? (
                        <img src={currentStudent.photoUrl} alt={currentStudent.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        currentStudent.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-blue-950 flex items-center space-x-1.5">
                        <span>Ficha del Observador del Estudiante</span>
                        <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                          Decreto 1411
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#1e3a8a]">
                        Información familiar, ubicación y seguimiento de salud/desarrollo
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportStudentObservadorWord(currentStudent, currentStudentEntries);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 border border-blue-600"
                      title="Descargar Ficha del Observador en formato Word (.docx) - Letra Calibri 12 Justificado"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-200" />
                      <span className="hidden sm:inline">Ficha Observador Word</span>
                      <span className="sm:hidden">Ficha Word</span>
                    </button>

                    <button className="p-1.5 text-[#1e3a8a] hover:bg-blue-100 rounded-lg transition-colors">
                      {showObservadorCard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {showObservadorCard && (
                  <div className="pt-3 border-t border-blue-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {/* Datos Personales */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Datos del Alumno:</span>
                      </span>
                      <p className="text-slate-700 font-medium">
                        <strong>Nacimiento:</strong> {currentStudent.birthDate || 'No registrada'}<br/>
                        <strong>Edad:</strong> {currentStudent.age || 'No registrada'}<br/>
                        <strong>Emoción:</strong> {currentStudent.frequentEmotion || 'No especificada'}
                      </p>
                    </div>

                    {/* Datos Familiares */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-blue-700" />
                        <span>Información Familiar:</span>
                      </span>
                      <p className="text-slate-700 font-medium">
                        <strong>Padres/Acudientes:</strong> {currentStudent.guardians || 'No registrados'}<br/>
                        <strong>Teléfonos:</strong> {currentStudent.contactPhones || 'No registrados'}
                      </p>
                    </div>

                    {/* Ubicación */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        <span>Ubicación:</span>
                      </span>
                      <p className="text-slate-700 font-medium">
                        <strong>Dirección:</strong> {currentStudent.address || 'No registrada'}<br/>
                        <strong>Barrio:</strong> {currentStudent.neighborhood || 'No registrado'}
                      </p>
                    </div>

                    {/* Sistema de Salud y EPS */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <Activity className="w-3.5 h-3.5 text-blue-700" />
                        <span>Aseguramiento en Salud:</span>
                      </span>
                      <p className="text-slate-700 font-medium">
                        <strong>Régimen:</strong> {currentStudent.healthRegimen || 'No registrado'}<br/>
                        <strong>EPS:</strong> {currentStudent.eps || 'No registrada'}
                      </p>
                    </div>

                    {/* Salud y Nutrición */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 sm:col-span-2 lg:col-span-1">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <Activity className="w-3.5 h-3.5 text-blue-700" />
                        <span>Novedades Nutrición / Salud:</span>
                      </span>
                      <p className="text-slate-700 leading-snug">
                        {currentStudent.healthNutritionNotes || 'Sin novedades de salud o nutrición registradas.'}
                      </p>
                    </div>

                    {/* Observaciones Generales */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 sm:col-span-2 lg:col-span-2">
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                        <span>Observaciones Generales del Observador:</span>
                      </span>
                      <p className="text-slate-700 leading-snug italic">
                        {currentStudent.generalObservations || 'Sin observaciones iniciales adicionales.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              </div>

              {/* SECCIÓN DE SEGUIMIENTO PROGRESIVO COGNITIVO Y CUALITATIVO POR PERIODOS (P1 - P4) */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-blue-800 space-y-5 overflow-hidden">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-blue-800/80 pb-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-2 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30 shrink-0">
                        <Layers className="w-5 h-5" />
                      </span>
                      <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-wide leading-tight">
                        Evolución Cognitiva y Cualitativa por Periodos (P1 - P4)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-200/80">
                      Seguimiento amplio del proceso cognitivo de <strong className="text-white">{currentStudent.name}</strong> a lo largo del año escolar.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 xl:pt-0">
                    <button
                      onClick={() => exportStudentObservadorWord(currentStudent, currentStudentEntries)}
                      className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-[#1e40af]/90 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 border border-blue-500/40"
                      title="Descargar Ficha Completa del Observador con letra Calibri 12 Justificado en formato Word (.docx)"
                    >
                      <FileText className="w-4 h-4 text-blue-200 shrink-0" />
                      <span className="whitespace-nowrap">Ficha Observador (.docx)</span>
                    </button>

                    <button
                      onClick={() => exportAllPeriodsReportToWord(currentStudent, currentStudentEntries)}
                      className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-blue-600/90 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 border border-blue-400/40"
                      title="Descargar informe completo de los 4 periodos en formato Microsoft Word (.docx)"
                    >
                      <FileText className="w-4 h-4 text-blue-200 shrink-0" />
                      <span className="whitespace-nowrap">Informe 4 Periodos (.docx)</span>
                    </button>

                    <button
                      onClick={() => handleOpenAiModal()}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-400 hover:bg-blue-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 border border-blue-300"
                    >
                      <Sparkles className="w-4 h-4 text-blue-950 shrink-0" />
                      <span className="whitespace-nowrap">Redactar con IA</span>
                    </button>
                  </div>
                </div>

                {/* 4 PERIODS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {['Periodo 1', 'Periodo 2', 'Periodo 3', 'Periodo 4'].map((pName, idx) => {
                    const pEntries = currentStudentEntries.filter((e) => (e.period || 'Periodo 1') === pName);
                    const hasEntries = pEntries.length > 0;
                    const latest = pEntries[0];

                    return (
                      <div
                        key={pName}
                        className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 transition-all ${
                          hasEntries
                            ? 'bg-slate-800/80 border-blue-500/40 text-slate-100 shadow-md hover:border-blue-400'
                            : 'bg-slate-900/50 border-slate-700/60 text-slate-400 border-dashed'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              idx === 0 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                              idx === 1 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              idx === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {pName}
                            </span>

                            {hasEntries && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800">
                                {pEntries.length} {pEntries.length === 1 ? 'registro' : 'registros'}
                              </span>
                            )}
                          </div>

                          {hasEntries && latest ? (
                            <div className="space-y-1.5 text-xs pt-1">
                              <p className="font-bold text-blue-200 line-clamp-1">
                                {latest.activityTitle || 'Informe Cualitativo'}
                              </p>
                              <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                                {latest.developmentAdvancement || latest.observation}
                              </p>
                            </div>
                          ) : (
                            <div className="py-2 text-center space-y-1">
                              <p className="text-[11px] text-slate-400 italic">
                                Sin informes cualitativos guardados en {pName}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-1 flex-wrap">
                          <button
                            onClick={() => setSelectedPeriodFilter(pName)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
                              selectedPeriodFilter === pName
                                ? 'bg-blue-500 text-slate-950 font-black'
                                : 'text-blue-300 hover:bg-blue-900/50'
                            }`}
                          >
                            {selectedPeriodFilter === pName ? 'Filtrando...' : 'Ver'}
                          </button>

                          {hasEntries && (
                            <button
                              onClick={() => exportPeriodReportToWord(currentStudent, pEntries, pName)}
                              title={`Descargar informe de ${pName} en Word (.docx)`}
                              className="text-[11px] font-bold text-sky-200 hover:text-white bg-slate-700 hover:bg-sky-900/60 px-2 py-1 rounded-lg flex items-center space-x-1 border border-slate-600 transition-colors"
                            >
                              <FileText className="w-3 h-3 text-sky-400" />
                              <span>Word</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEntryModal(undefined, pName)}
                            className="text-[11px] font-bold text-white hover:text-blue-300 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BARRAS DE FILTRADO POR PERIODO */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider mr-1 flex items-center space-x-1">
                    <Filter className="w-3.5 h-3.5 text-blue-700" />
                    <span>Filtrar Periodo:</span>
                  </span>

                  {['Todos', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Periodo 4', 'Informe Final'].map((p) => {
                    const isActive = selectedPeriodFilter === p;
                    const count = p === 'Todos' 
                      ? currentStudentEntries.length 
                      : currentStudentEntries.filter((e) => (e.period || 'Periodo 1') === p).length;

                    return (
                      <button
                        key={p}
                        onClick={() => setSelectedPeriodFilter(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                          isActive
                            ? 'bg-[#1e3a8a] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <span>{p === 'Todos' ? '🌐 Todos' : p}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive ? 'bg-[#1e3a8a] text-blue-100' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  Mostrando {visibleEntries.length} de {currentStudentEntries.length} informes
                </span>
              </div>

              {/* Diario Entries List */}
              {visibleEntries.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">
                    No hay informes ni entradas en {selectedPeriodFilter === 'Todos' ? 'el historial' : selectedPeriodFilter} para {currentStudent.name}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Haz clic a continuación para registrar una observación o generar un informe con IA correspondiente a este periodo.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEntryModal(undefined, selectedPeriodFilter !== 'Todos' ? selectedPeriodFilter : 'Periodo 1')}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1e3a8a] text-white font-bold text-xs rounded-xl hover:bg-[#1e40af]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Entrada Manual</span>
                    </button>
                    <button
                      onClick={() => handleOpenAiModal()}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs rounded-xl hover:bg-blue-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Generar Informe IA</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {visibleEntries.map((entry) => {
                    if (entry.isAiGeneratedReport) {
                      return (
                        <div
                          key={entry.id}
                          className="bg-white border-2 border-blue-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">🧠</span>
                              <h4 className="text-sm sm:text-base font-black text-slate-900">
                                Resumen de Avances por los 4 Propósitos (Bases Curriculares MEN)
                              </h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border flex items-center space-x-1 ${
                                entry.period === 'Periodo 2' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                                entry.period === 'Periodo 3' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                entry.period === 'Periodo 4' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                                entry.period === 'Informe Final' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                                'bg-blue-100 text-blue-900 border-blue-300'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                <span>{entry.period || 'Periodo 1'}</span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => exportPeriodReportToWord(currentStudent, [entry], entry.period || 'Periodo 1')}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 rounded-xl text-xs font-bold transition-all shadow-xs"
                                title="Descargar informe en formato Word (.docx)"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-700" />
                                <span>Word (.docx)</span>
                              </button>

                              <button
                                onClick={() => handleOpenEntryModal(entry)}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 rounded-xl text-xs font-bold transition-all shadow-xs"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                                <span>Editar</span>
                              </button>
                              <button
                                onClick={handlePrint}
                                title="Imprimir o guardar PDF"
                                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'entry', id: entry.id, name: entry.activityTitle || 'Resumen de Avances' })}
                                title="Eliminar Informe"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 pt-1">
                            {/* EVOLUCIÓN DEL PROGRESO CARD */}
                            {entry.qualitativeSections?.evolucionProgreso && (
                              <div className="bg-[#f8fafc] border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-1">
                                  <div className="flex items-center space-x-2 text-indigo-950 font-black text-xs sm:text-sm tracking-wide">
                                    <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>EVOLUCIÓN Y TRAYECTORIA DEL PROGRESO DEL NIÑO/A</span>
                                  </div>
                                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-300">
                                    📈 Progreso Cronológico
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                  {entry.qualitativeSections.evolucionProgreso}
                                </p>
                              </div>
                            )}

                            {/* FORTALEZAS CARD */}
                            {entry.qualitativeSections?.fortalezas && (
                              <div className="bg-[#f0fdf4] border-2 border-blue-300 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-1">
                                  <div className="flex items-center space-x-2 text-blue-950 font-black text-xs sm:text-sm tracking-wide">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>FORTALEZAS Y DESEMPEÑOS CONSOLIDADOS</span>
                                  </div>
                                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md border border-blue-300">
                                    🌟 Logros Principales
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                  {entry.qualitativeSections.fortalezas}
                                </p>
                              </div>
                            )}

                            {/* PROPÓSITO 1 CARD */}
                            <div className="bg-[#f0f9ff] border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center space-x-2 text-sky-950 font-black text-xs sm:text-sm tracking-wide">
                                  <Heart className="w-4 h-4 text-sky-600 shrink-0" />
                                  <span>PROPÓSITO 1: IDENTIDAD, AUTONOMÍA, MANEJO DE EMOCIONES & PERTENENCIA</span>
                                </div>
                                <span className="text-[10px] font-extrabold bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md border border-sky-300">
                                  💖 Manejo de Emociones & Autorregulación
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                {entry.qualitativeSections?.proposito1 || entry.qualitativeSections?.socioemocional || entry.observation}
                              </p>
                            </div>

                            {/* PROPÓSITO 2 CARD */}
                            <div className="bg-[#fff1f2] border border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center space-x-2 text-rose-950 font-black text-xs sm:text-sm tracking-wide">
                                  <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>PROPÓSITO 2: COMUNICACIÓN ACTIVA, EXPRESIÓN & LENGUAJES ARTÍSTICOS</span>
                                </div>
                                <span className="text-[10px] font-extrabold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md border border-rose-300">
                                  🗣️ Expresión de Sentimientos & Diálogo
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                {entry.qualitativeSections?.proposito2 || entry.qualitativeSections?.lenguajesYArte || entry.developmentAdvancement}
                              </p>
                            </div>

                            {/* PROPÓSITO 3 CARD */}
                            <div className="bg-[#f0fdf4] border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center space-x-2 text-blue-950 font-black text-xs sm:text-sm tracking-wide">
                                  <Search className="w-4 h-4 text-blue-600 shrink-0" />
                                  <span>PROPÓSITO 3: INDAGACIÓN, OBSERVACIÓN DEL ENTORNO & DESARROLLO COGNITIVO (PREMATEMÁTICA)</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md border border-blue-300">
                                    🧠 Prematemática
                                  </span>
                                  <span className="text-[10px] font-extrabold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md border border-teal-300">
                                    🌿 Observación del Entorno
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                {entry.qualitativeSections?.proposito3 || entry.qualitativeSections?.exploracionYPensamiento || entry.pedagogicalReflection}
                              </p>
                            </div>

                            {/* PROPÓSITO 4 CARD */}
                            <div className="bg-[#faf5ff] border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center space-x-2 text-purple-950 font-black text-xs sm:text-sm tracking-wide">
                                  <Compass className="w-4 h-4 text-purple-600 shrink-0" />
                                  <span>PROPÓSITO 4: DESCUBRIMIENTO DE SÍ MISMOS, ESPACIO, TERRITORIO & MOVIMIENTO LIBRE</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] font-extrabold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md border border-purple-300">
                                    🏃 Movimiento Libre
                                  </span>
                                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-300">
                                    🗺️ Espacio & Territorio
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                {entry.qualitativeSections?.proposito4 || `${currentStudent.name} experimenta el descubrimiento de sí mismo/a y apropia con seguridad el espacio y el territorio que habita. Se expresa a través del cuerpo y el movimiento libre en el encuentro con los otros.`}
                              </p>
                            </div>

                            {/* RECOMENDACIONES FAMILIA Y COMPROMISOS */}
                            <div className="bg-[#fffbeb] border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center space-x-2 text-amber-950 font-black text-xs sm:text-sm tracking-wide">
                                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>RECOMENDACIONES PARA EL ACOMPAÑAMIENTO EN FAMILIA & COMPROMISOS</span>
                                </div>
                                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                                  🏡 Vínculo Hogar - Escuela
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                {entry.qualitativeSections?.recomendacionesFamilia || entry.pedagogicalReflection || 'Continuar fortaleciendo las rutinas de lectura compartida, el diálogo afectivo y la conversación sobre emociones en el hogar.'}
                              </p>
                              {entry.qualitativeSections?.compromisosDocente && (
                                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold pt-1 border-t border-amber-200/80">
                                  <strong>Compromisos Institucionales:</strong> {entry.qualitativeSections.compromisosDocente}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={entry.id}
                        className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 space-y-3 hover:border-blue-300 transition-all shadow-sm"
                      >
                      {/* Entry Top Header Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border flex items-center space-x-1 ${
                            entry.period === 'Periodo 2' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                            entry.period === 'Periodo 3' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            entry.period === 'Periodo 4' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                            entry.period === 'Informe Final' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                            'bg-blue-100 text-blue-900 border-blue-300'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{entry.period || 'Periodo 1'}</span>
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1e3a8a] text-blue-100">
                            {entry.date}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            Experiencia Rectora: {entry.rectorExperience}
                          </span>

                          {entry.emotion && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                              🎭 {entry.emotion}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => exportPeriodReportToWord(currentStudent, [entry], entry.period || 'Periodo 1')}
                            title="Descargar Entrada en Word (.docx)"
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 font-bold text-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleOpenEntryModal(entry)}
                            title="Editar Entrada"
                            className="p-1.5 text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'entry', id: entry.id, name: entry.activityTitle || 'Entrada de Diario' })}
                            title="Eliminar Entrada"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Activity Title */}
                      <h4 className="text-base font-extrabold text-slate-900">
                        {entry.activityTitle}
                      </h4>

                      {/* Observación Cualitativa (Diario de Campo) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          REGISTRO DE OBSERVACIÓN CUALITATIVA (DIARIO DE CAMPO)
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed pt-1">
                          {entry.observation}
                        </p>
                      </div>

                      {/* Avances Cualitativos del Desarrollo Infantíl */}
                      {entry.developmentAdvancement && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            AVANCES CUALITATIVOS DEL DESARROLLO (DECRETO 1411 / MEN 2026)
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed pt-1 font-medium">
                            {entry.developmentAdvancement}
                          </p>
                        </div>
                      )}

                      {/* Lineamientos del Ser Evaluados */}
                      {entry.selectedDimensions && entry.selectedDimensions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-bold mr-1">
                            Lineamientos del Ser:
                          </span>
                          {entry.selectedDimensions.map((dim) => (
                            <span
                              key={dim}
                              className="text-[10px] font-bold bg-white text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {dim}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Reflexión Docente / Acciones de Ajuste */}
                      {entry.pedagogicalReflection && (
                        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
                          <span className="font-extrabold text-amber-900 flex items-center space-x-1 text-[11px]">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                            <span>Reflexión Pedagógica y Acción Docente:</span>
                          </span>
                          <p className="text-amber-950 italic">
                            "{entry.pedagogicalReflection}"
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
                </div>
              )}

            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Selecciona o crea un estudiante para visualizar su Diario de Campo.
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: REGISTRO/EDICIÓN DE ESTUDIANTE (OBSERVADOR COMPLETO) */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
            {/* Cabecera Fija */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-7 py-4 bg-slate-50/90 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-[#1e3a8a]" />
                  <span>{editingStudent ? 'Editar Ficha del Estudiante' : 'Nuevo Registro de Estudiante (Observador)'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ficha de caracterización pedagógica e historial del alumno en primera infancia
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario y Contenido Desplazable */}
            <form id="student-form" onSubmit={handleSaveStudentSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-xs custom-scrollbar">
              
              {/* SECCIÓN 1: DATOS DEL ALUMNO */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 text-blue-900">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>1. Datos Principales del Alumno</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Nombre Completo del Estudiante *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      placeholder="Ej: Mateo Pérez Sampayo"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Documento de Identificación (RC / TI)
                    </label>
                    <input
                      type="text"
                      value={studentForm.documentId}
                      onChange={(e) => setStudentForm({ ...studentForm, documentId: e.target.value })}
                      placeholder="Ej: RC 109238475"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={studentForm.birthDate}
                      onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Edad (e.g., 4 años, 3 años 6 meses)
                    </label>
                    <input
                      type="text"
                      value={studentForm.age}
                      onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                      placeholder="Ej: 4 años"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Sede Educativa *
                    </label>
                    <select
                      required
                      value={studentForm.sede}
                      onChange={(e) => setStudentForm({ ...studentForm, sede: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {SEDES_INSTITUCIONALES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      {!SEDES_INSTITUCIONALES.includes(studentForm.sede) && studentForm.sede && (
                        <option value={studentForm.sede}>{studentForm.sede}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Ciclo / Rango de Edad *
                    </label>
                    <select
                      value={studentForm.cycle}
                      onChange={(e) => setStudentForm({ ...studentForm, cycle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Ciclo 2 (3-6 años)">Ciclo 2 (3-6 años)</option>
                      <option value="Ciclo 1 (0-3 años)">Ciclo 1 (0-3 años)</option>
                      <option value="Transición / Jardín">Transición / Jardín</option>
                      <option value="Párvulos / Prejardín">Párvulos / Prejardín</option>
                    </select>
                  </div>

                  {/* EMOCIÓN PREDOMINANTE OBSERVADA (DESPLEGABLE CON OPCIÓN OTRA) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <Smile className="w-3.5 h-3.5 text-blue-700" />
                      <span>Emoción Predominante Observada</span>
                    </label>
                    <select
                      value={
                        EMOCIONES_PREDETERMINADAS.includes(studentForm.frequentEmotion)
                          ? studentForm.frequentEmotion
                          : 'Otra'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Otra') {
                          if (EMOCIONES_PREDETERMINADAS.includes(studentForm.frequentEmotion)) {
                            setStudentForm({ ...studentForm, frequentEmotion: '' });
                          }
                        } else {
                          setStudentForm({ ...studentForm, frequentEmotion: val });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                    >
                      {EMOCIONES_PREDETERMINADAS.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                      <option value="Otra">Otra (Escribir emoción personalizada...)</option>
                    </select>

                    {(!EMOCIONES_PREDETERMINADAS.includes(studentForm.frequentEmotion) ||
                      studentForm.frequentEmotion === '') && (
                      <div className="mt-2 animate-in fade-in duration-200">
                        <input
                          type="text"
                          required
                          value={studentForm.frequentEmotion}
                          onChange={(e) => setStudentForm({ ...studentForm, frequentEmotion: e.target.value })}
                          placeholder="Escriba la emoción observada (ej: Asombro e Inquietud...)"
                          className="w-full px-3.5 py-2 bg-blue-50/70 border border-blue-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* FOTOGRAFÍA DEL ESTUDIANTE (BOTÓN SUBIR IMAGEN / ARCHIVO O URL) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5 text-blue-700" />
                      <span>Fotografía del Estudiante</span>
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 border border-slate-300 rounded-2xl shadow-xs">
                      <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                        {studentForm.photoUrl ? (
                          <>
                            <img
                              src={studentForm.photoUrl}
                              alt="Foto estudiante"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setStudentForm({ ...studentForm, photoUrl: '' })}
                              className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl-lg hover:bg-red-700 transition-colors"
                              title="Eliminar foto"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <Camera className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 w-full min-w-0">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Subir Foto del Alumno</span>
                          </button>
                          {studentForm.photoUrl && (
                            <button
                              type="button"
                              onClick={() => setStudentForm({ ...studentForm, photoUrl: '' })}
                              className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
                            >
                              Quitar
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={studentForm.photoUrl}
                          onChange={(e) => setStudentForm({ ...studentForm, photoUrl: e.target.value })}
                          placeholder="O pegue una URL de imagen (https://...)"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 truncate"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: INFORMACIÓN FAMILIAR Y UBICACIÓN */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 text-blue-900">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>2. Información Familiar y Ubicación</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>Nombres de Padres o Acudientes</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.guardians}
                      onChange={(e) => setStudentForm({ ...studentForm, guardians: e.target.value })}
                      placeholder="Ej: Mariana Ríos (Madre) y Jorge Villalba (Padre)"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>Teléfonos de Contacto</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.contactPhones}
                      onChange={(e) => setStudentForm({ ...studentForm, contactPhones: e.target.value })}
                      placeholder="Ej: 300 123 4567 / 315 987 6543"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Dirección de Residencia</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.address}
                      onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                      placeholder="Ej: Calle 14 # 8-25"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Barrio / Sector</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.neighborhood}
                      onChange={(e) => setStudentForm({ ...studentForm, neighborhood: e.target.value })}
                      placeholder="Ej: Barrio El Centro"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: SEGUIMIENTO, SALUD Y EPS */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 text-blue-900">
                  <Activity className="w-4 h-4 text-blue-700" />
                  <span>3. Aseguramiento en Salud, Nutrición y Observaciones</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* RÉGIMEN DE SALUD */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Régimen de Salud *
                    </label>
                    <select
                      value={
                        REGIMENES_SALUD.includes(studentForm.healthRegimen)
                          ? studentForm.healthRegimen
                          : 'Otro'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Otro') {
                          if (REGIMENES_SALUD.includes(studentForm.healthRegimen)) {
                            setStudentForm({ ...studentForm, healthRegimen: '' });
                          }
                        } else {
                          setStudentForm({ ...studentForm, healthRegimen: val });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                    >
                      {REGIMENES_SALUD.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                      <option value="Otro">Otro Régimen (Especificar...)</option>
                    </select>

                    {(!REGIMENES_SALUD.includes(studentForm.healthRegimen) || studentForm.healthRegimen === '') && (
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={studentForm.healthRegimen}
                          onChange={(e) => setStudentForm({ ...studentForm, healthRegimen: e.target.value })}
                          placeholder="Nombre del régimen..."
                          className="w-full px-3 py-1.5 bg-blue-50/70 border border-blue-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* EPS QUE LO ATIENDE */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      EPS que lo Atiende *
                    </label>
                    <select
                      value={
                        EPS_COLOMBIA.includes(studentForm.eps)
                          ? studentForm.eps
                          : 'Otra'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Otra') {
                          if (EPS_COLOMBIA.includes(studentForm.eps)) {
                            setStudentForm({ ...studentForm, eps: '' });
                          }
                        } else {
                          setStudentForm({ ...studentForm, eps: val });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                    >
                      {EPS_COLOMBIA.map((eItem) => (
                        <option key={eItem} value={eItem}>
                          {eItem}
                        </option>
                      ))}
                      <option value="Otra">Otra EPS (Escribir nombre...)</option>
                    </select>

                    {(!EPS_COLOMBIA.includes(studentForm.eps) || studentForm.eps === '') && (
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={studentForm.eps}
                          onChange={(e) => setStudentForm({ ...studentForm, eps: e.target.value })}
                          placeholder="Escriba el nombre de la EPS..."
                          className="w-full px-3 py-1.5 bg-blue-50/70 border border-blue-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Novedades de Salud y Nutrición
                    </label>
                    <textarea
                      rows={2}
                      value={studentForm.healthNutritionNotes}
                      onChange={(e) => setStudentForm({ ...studentForm, healthNutritionNotes: e.target.value })}
                      placeholder="Vacunación, alergias, alimentación, hábitos..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Observaciones Generales del Observador / Docente
                    </label>
                    <textarea
                      rows={2}
                      value={studentForm.generalObservations}
                      onChange={(e) => setStudentForm({ ...studentForm, generalObservations: e.target.value })}
                      placeholder="Apreciaciones iniciales del desarrollo infantil, adaptación..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

            </form>

            {/* Pie de Modal Fijo con Botones de Acción */}
            <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="student-form"
                className="px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-98"
              >
                Guardar Ficha de Estudiante
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NUEVA/EDITAR ENTRADA EN EL DIARIO DE CAMPO */}
      {isEntryModalOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
            {/* Cabecera Fija */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-7 py-4 bg-slate-50/90 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {editingEntry ? 'Editar Entrada de Diario' : 'Agregar Entrada al Diario de Campo'}
                </h3>
                <p className="text-xs text-slate-500">
                  Estudiante: <strong className="text-blue-900">{currentStudent.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario Desplazable */}
            <form id="entry-form" onSubmit={handleSaveEntrySubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 text-xs custom-scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Periodo Escolar *
                  </label>
                  <select
                    value={entryForm.period}
                    onChange={(e) => setEntryForm({ ...entryForm, period: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Periodo 1">Periodo 1</option>
                    <option value="Periodo 2">Periodo 2</option>
                    <option value="Periodo 3">Periodo 3</option>
                    <option value="Periodo 4">Periodo 4</option>
                    <option value="Informe Final">Informe Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha de Observación *
                  </label>
                  <input
                    type="date"
                    required
                    value={entryForm.date}
                    onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* EXPERIENCIA RECTORA (SELECCIÓN ÚNICA O MÚLTIPLE) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex flex-wrap items-center justify-between gap-1">
                  <span>Experiencia Rectora (Seleccionar una o varias) *</span>
                  <span className="text-[11px] font-extrabold text-[#1e3a8a] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    {entryForm.rectorExperience || 'Ninguna seleccionada'}
                  </span>
                </label>

                {/* Botones de selección múltiple rápida (Pills) */}
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-xl mb-2">
                  {ACTIVIDADES_RECTORAS.map((act) => {
                    const isSelected = entryForm.rectorExperience
                      .toLowerCase()
                      .includes(act.toLowerCase());
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleToggleRectorExperience(act)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                          isSelected
                            ? 'bg-[#1e3a8a] text-white shadow-sm ring-2 ring-blue-600'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-blue-50 hover:text-blue-900'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black border ${
                            isSelected
                              ? 'bg-white text-blue-900 border-white'
                              : 'border-slate-400 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span>{act}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Lista Desplegable con Combinaciones Integradas y Múltiples */}
                <select
                  value={entryForm.rectorExperience}
                  onChange={(e) => setEntryForm({ ...entryForm, rectorExperience: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs text-xs"
                >
                  {!ACTIVIDADES_RECTORAS.includes(entryForm.rectorExperience) && (
                    <option value={entryForm.rectorExperience}>
                      Selección Actual: {entryForm.rectorExperience}
                    </option>
                  )}
                  <option value="Exploración del Medio">Exploración del Medio</option>
                  <option value="Juego">Juego</option>
                  <option value="Arte">Arte</option>
                  <option value="Literatura">Literatura</option>
                  <option value="Exploración del Medio y Juego">Exploración del Medio y Juego</option>
                  <option value="Arte y Juego">Arte y Juego</option>
                  <option value="Literatura y Arte">Literatura y Arte</option>
                  <option value="Literatura, Arte y Juego">Literatura, Arte y Juego</option>
                  <option value="Exploración del Medio, Arte y Juego">Exploración del Medio, Arte y Juego</option>
                  <option value="Exploración del Medio, Juego, Arte y Literatura">
                    Todas las Experiencias: Exploración, Juego, Arte y Literatura
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Actividad o Provocación *
                </label>
                <input
                  type="text"
                  required
                  value={entryForm.activityTitle}
                  onChange={(e) => setEntryForm({ ...entryForm, activityTitle: e.target.value })}
                  placeholder="Ej: Exploración de la Chagra y Recolección de Semillas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registro de Observación Cualitativa (Diario de Campo) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={entryForm.observation}
                  onChange={(e) => setEntryForm({ ...entryForm, observation: e.target.value })}
                  placeholder="Describe detalladamente las acciones, interacciones, voces e hipótesis del niño/a durante la experiencia..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Avances Cualitativos del Desarrollo Infantil (Decreto 1411 / MEN 2026)
                </label>
                <textarea
                  rows={2}
                  value={entryForm.developmentAdvancement}
                  onChange={(e) => setEntryForm({ ...entryForm, developmentAdvancement: e.target.value })}
                  placeholder="Relaciona los logros alcanzados en autonomía, autorregulación, comunicación o pensamiento reflexivo..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Selector de Lineamientos del Ser Evaluados */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lineamientos del Ser Evaluados
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {DIMENSIONES_SER.map((dim) => {
                    const isSelected = entryForm.selectedDimensions.includes(dim.code as DimensionType);
                    return (
                      <button
                        key={dim.code}
                        type="button"
                        onClick={() => handleToggleDimension(dim.code as DimensionType)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'bg-[#1e3a8a] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {dim.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Emoción Observada
                  </label>
                  <input
                    type="text"
                    value={entryForm.emotion}
                    onChange={(e) => setEntryForm({ ...entryForm, emotion: e.target.value })}
                    placeholder="Ej: Alegría y Asombro, Entusiasmo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reflexión Docente y Acciones de Seguimiento
                  </label>
                  <input
                    type="text"
                    value={entryForm.pedagogicalReflection}
                    onChange={(e) => setEntryForm({ ...entryForm, pedagogicalReflection: e.target.value })}
                    placeholder="Estrategia o ajuste para la próxima sesión..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

            </form>

            {/* Pie de Modal Fijo */}
            <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="entry-form"
                className="px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-98"
              >
                Guardar Entrada en Diario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REDACTOR ASISTIDO POR IA - REGISTRAR NUEVO ESTUDIANTE CON VALORACIÓN CUALITATIVA */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#f0fdf4]/90 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border-2 border-blue-400 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-700" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Registrar Nuevo Estudiante con Valoración Cualitativa (Gemini AI)
                </h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiInformeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Periodo Escolar *:
                  </label>
                  <select
                    value={aiPeriod}
                    onChange={(e) => setAiPeriod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Periodo 1">Periodo 1</option>
                    <option value="Periodo 2">Periodo 2</option>
                    <option value="Periodo 3">Periodo 3</option>
                    <option value="Periodo 4">Periodo 4</option>
                    <option value="Informe Final">Informe Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nombre del Niño o Niña *:
                  </label>
                  <input
                    type="text"
                    required
                    value={aiStudentName}
                    onChange={(e) => setAiStudentName(e.target.value)}
                    placeholder="Ej: Sofía Villalba Ríos"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Sede Institucional:
                  </label>
                  <select
                    value={aiSede}
                    onChange={(e) => setAiSede(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SEDES_INSTITUCIONALES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    {!SEDES_INSTITUCIONALES.includes(aiSede) && aiSede && (
                      <option value={aiSede}>{aiSede}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Observaciones Iniciales del Diario de Campo:
                </label>
                <textarea
                  required
                  rows={3}
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Ej: Disfruta la lectura del cuento del Rey Momo y la Marimonda. Nombra cuando siente calma al usar el semáforo."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGeneratingAi || !aiStudentName.trim() || !aiNotes.trim()}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-[#1e40af] hover:bg-[#065f46] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                      <span>Generando Informe e Incorporando al Historial...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generar Informe e Incorporar al Historial Permanente</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VACIAR HISTORIAL DE INFORMES Y DIARIO */}
      {isClearHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                ¿Vaciar Historial de Informes?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Selecciona la opción de limpieza que deseas realizar:
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {currentStudent && onClearStudentEntries && (
                <button
                  onClick={() => {
                    onClearStudentEntries(currentStudent.id);
                    setIsClearHistoryModalOpen(false);
                  }}
                  className="w-full p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-rose-900 text-left space-y-0.5 transition-all"
                >
                  <div className="font-extrabold text-xs">
                    1. Vaciar solo informes de {currentStudent.name}
                  </div>
                  <p className="text-[11px] text-rose-700">
                    Elimina todas las entradas e informes registrados para este estudiante.
                  </p>
                </button>
              )}

              {onClearAllDiarioData && (
                <button
                  onClick={() => {
                    setDeleteTarget({ type: 'all', name: 'Todo el historial de la aplicación' });
                  }}
                  className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-left space-y-0.5 shadow-md transition-all"
                >
                  <div className="font-extrabold text-xs">
                    2. Vaciar TODO el Historial de la App
                  </div>
                  <p className="text-[11px] text-red-100">
                    Elimina de forma permanente todos los estudiantes y sus informes cualitativos.
                  </p>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsClearHistoryModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">
                {deleteTarget.type === 'student' && '¿Eliminar Estudiante?'}
                {deleteTarget.type === 'entry' && '¿Eliminar Registro del Diario?'}
                {deleteTarget.type === 'all' && '¿Vaciar Todo el Historial?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {deleteTarget.type === 'student' && (
                  <>
                    Estás a punto de eliminar a <strong className="text-slate-900">{deleteTarget.name}</strong> y todos sus informes del diario de campo. Esta acción no se puede deshacer.
                  </>
                )}
                {deleteTarget.type === 'entry' && (
                  <>
                    ¿Deseas eliminar permanentemente la entrada o informe <strong className="text-slate-900">"{deleteTarget.name}"</strong>?
                  </>
                )}
                {deleteTarget.type === 'all' && (
                  <>
                    Se borrarán de forma permanente <strong className="text-slate-900">TODOS los estudiantes e informes cualitativos</strong> guardados en el sistema.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: SEGURO DE REPO / RECUPERACIÓN DE DATOS Y COPAS DE SEGURIDAD */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-blue-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-2xl border border-blue-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Seguro de Recuperación de Datos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Protección permanente contra pérdida de información pedagógica
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBackupModalOpen(false);
                  setBackupStatusMsg(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Message */}
            {backupStatusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
                  backupStatusMsg.type === 'success'
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : backupStatusMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}
              >
                {backupStatusMsg.type === 'success' && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                {backupStatusMsg.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{backupStatusMsg.text}</span>
              </div>
            )}

            {/* Resguardo Info Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4.5 rounded-2xl space-y-2 border border-blue-700/60 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="text-xs font-bold text-blue-200">Seguro Activo en Memoria Local</span>
                </div>
                <span className="text-[11px] font-extrabold bg-[#1e3a8a]/80 px-2.5 py-0.5 rounded-md border border-blue-600/40">
                  {students.length} Estudiantes / {diarioEntries.length} Diarios
                </span>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Tus registros están respaldados automáticamente. Si sufres desconexión de internet, cierre accidental o falla en el navegador, tus informes están a salvo.
              </p>
              {autoSnapshotInfo.timestamp && (
                <div className="text-[11px] text-blue-300/90 pt-1 font-mono">
                  Última copia automática: {new Date(autoSnapshotInfo.timestamp).toLocaleString('es-CO')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {/* Option 1: Descargar copia de seguridad */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <FileJson className="w-4 h-4 text-blue-700" />
                    <h4 className="text-xs font-extrabold text-slate-800">Descargar Copia de Seguridad (.json)</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Guarda un archivo de resguardo completo en tu equipo o memoria USB.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 shrink-0 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>

              {/* Option 2: Restaurar desde archivo */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-blue-700" />
                    <h4 className="text-xs font-extrabold text-slate-800">Restaurar desde Archivo (.json)</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Carga un archivo de copia de seguridad previo para recuperar tus datos.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    ref={backupFileInputRef}
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => backupFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 shrink-0 flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cargar Archivo</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Restaurar copia automática local */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs font-extrabold text-slate-800">Restaurar Copia Automática Local</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Restablece los datos desde la última memoria segura del navegador.
                  </p>
                </div>
                <button
                  onClick={handleRestoreAutoSnapshot}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 shrink-0 flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Copia</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsBackupModalOpen(false);
                  setBackupStatusMsg(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: GENERADOR DE ACTA DE CONVIVENCIA ESCOLAR (DOCX) */}
      {isActaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-6 shadow-2xl border border-sky-100 my-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-700 text-white rounded-2xl shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Generador de Acta de Convivencia Escolar</span>
                    <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-300">
                      Ley 1620 / Dec. 1411
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Suscripción formal de acuerdos entre Padres, Estudiante y Docentes descargable en formato Word (.docx)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsActaModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Auto-redacción Banner */}
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-sky-700/50">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-300 animate-pulse" />
                  <span className="text-xs font-bold text-sky-200">Asistente IA para Actas Pedagógicas</span>
                </div>
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  Redacta automáticamente acuerdos pedagógicos personalizados, normativos y constructivos adaptados a la situación del niño/a.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateActaAi}
                disabled={isGeneratingActaAi}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2 shrink-0 self-end sm:self-auto"
              >
                {isGeneratingActaAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redactando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Redactar Acuerdos con IA</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleExportActaWord(); }} className="space-y-5 text-xs">
              
              {/* SECCIÓN 1: DATOS INSTITUCIONALES Y DE LA REUNIÓN */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span>1. Datos Generales de la Sesión y Convocatoria</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institución Educativa:</label>
                    <input
                      type="text"
                      value={actaForm.institucion}
                      onChange={(e) => setActaForm({ ...actaForm, institucion: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sede:</label>
                    <input
                      type="text"
                      value={actaForm.sede}
                      onChange={(e) => setActaForm({ ...actaForm, sede: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lugar de Reunión:</label>
                    <input
                      type="text"
                      value={actaForm.lugar}
                      onChange={(e) => setActaForm({ ...actaForm, lugar: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha:</label>
                    <input
                      type="date"
                      value={actaForm.fecha}
                      onChange={(e) => setActaForm({ ...actaForm, fecha: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hora:</label>
                    <input
                      type="text"
                      value={actaForm.hora}
                      onChange={(e) => setActaForm({ ...actaForm, hora: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha de Seguimiento:</label>
                    <input
                      type="text"
                      value={actaForm.fechaSeguimiento}
                      onChange={(e) => setActaForm({ ...actaForm, fechaSeguimiento: e.target.value })}
                      placeholder="Ej: En 15 días hábiles"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: PARTICIPANTES (ESTUDIANTE, PADRES, DOCENTE) */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span>2. Partes Firmantes (Estudiante, Familiares y Docente)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre del Estudiante:</label>
                    <input
                      type="text"
                      value={actaForm.studentName}
                      onChange={(e) => setActaForm({ ...actaForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Edad del Estudiante:</label>
                    <input
                      type="text"
                      value={actaForm.studentAge}
                      onChange={(e) => setActaForm({ ...actaForm, studentAge: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Grado / Nivel:</label>
                    <input
                      type="text"
                      value={actaForm.studentGrade}
                      onChange={(e) => setActaForm({ ...actaForm, studentGrade: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Padre / Acudiente:</label>
                    <input
                      type="text"
                      value={actaForm.parentName}
                      onChange={(e) => setActaForm({ ...actaForm, parentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Documento de Identidad:</label>
                    <div className="flex gap-1.5">
                      <select
                        value={actaForm.parentIdType}
                        onChange={(e) => setActaForm({ ...actaForm, parentIdType: e.target.value })}
                        className="px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none shrink-0"
                      >
                        <option value="C.C.">C.C.</option>
                        <option value="C.E.">C.E.</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                      <input
                        type="text"
                        value={actaForm.parentIdNumber}
                        onChange={(e) => setActaForm({ ...actaForm, parentIdNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parentesco / Teléfono:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={actaForm.parentRelationship}
                        onChange={(e) => setActaForm({ ...actaForm, parentRelationship: e.target.value })}
                        placeholder="Parentesco"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={actaForm.parentPhone}
                        onChange={(e) => setActaForm({ ...actaForm, parentPhone: e.target.value })}
                        placeholder="Teléfono"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Docente de Aula:</label>
                    <input
                      type="text"
                      value={actaForm.teacherName}
                      onChange={(e) => setActaForm({ ...actaForm, teacherName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cargo / Especialidad:</label>
                    <input
                      type="text"
                      value={actaForm.teacherRole}
                      onChange={(e) => setActaForm({ ...actaForm, teacherRole: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Coordinación de Convivencia:</label>
                    <input
                      type="text"
                      value={actaForm.coordinatorName}
                      onChange={(e) => setActaForm({ ...actaForm, coordinatorName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: MOTIVO Y DESCRIPCIÓN DE LA SITUACIÓN */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span>3. Motivo de la Reunión y Contexto Pedagógico</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Motivo de la Convocatoria:</label>
                    <input
                      type="text"
                      value={actaForm.motivoReunion}
                      onChange={(e) => setActaForm({ ...actaForm, motivoReunion: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Descripción Pedagógica de los Hechos / Situación:</label>
                    <textarea
                      rows={3}
                      value={actaForm.hechosSituacion}
                      onChange={(e) => setActaForm({ ...actaForm, hechosSituacion: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: COMPROMISOS ESPECÍFICOS */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span>4. Pactos y Compromisos de Corresponsabilidad</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Compromisos del Estudiante */}
                  <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-2">
                    <label className="block font-extrabold text-sky-900 text-xs flex items-center space-x-1.5">
                      <span>👶 Compromisos del Estudiante:</span>
                    </label>
                    <textarea
                      rows={4}
                      value={actaForm.acuerdosEstudiante}
                      onChange={(e) => setActaForm({ ...actaForm, acuerdosEstudiante: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                    />
                  </div>

                  {/* Compromisos de la Familia */}
                  <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-2">
                    <label className="block font-extrabold text-blue-900 text-xs flex items-center space-x-1.5">
                      <span>👨‍👩‍👧 Compromisos de los Padres/Familia:</span>
                    </label>
                    <textarea
                      rows={4}
                      value={actaForm.acuerdosPadres}
                      onChange={(e) => setActaForm({ ...actaForm, acuerdosPadres: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                    />
                  </div>

                  {/* Compromisos del Docente */}
                  <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-2">
                    <label className="block font-extrabold text-indigo-900 text-xs flex items-center space-x-1.5">
                      <span>👩‍🏫 Compromisos Docente/Institución:</span>
                    </label>
                    <textarea
                      rows={4}
                      value={actaForm.acuerdosDocente}
                      onChange={(e) => setActaForm({ ...actaForm, acuerdosDocente: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                    />
                  </div>

                </div>
              </div>

              {/* SECCIÓN 5: OBSERVACIONES ADICIONALES */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones Finales y Cierre:</label>
                <textarea
                  rows={2}
                  value={actaForm.observacionesAdicionales}
                  onChange={(e) => setActaForm({ ...actaForm, observacionesAdicionales: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>El documento generado incluye firmas y tabla con diseño institucional norma MEN.</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsActaModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-sky-700 to-indigo-800 hover:from-sky-800 hover:to-indigo-900 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4 text-sky-200" />
                    <span>📥 Descargar Acta en Word (.docx)</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 8: GENERADOR DE CONSENTIMIENTO INFORMADO (DOCX) */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-6 shadow-2xl border border-blue-100 my-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Generador de Consentimiento Informado</span>
                    <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-300">
                      Ley 1581 Hábeas Data / Ley 1098
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Documento formal para autorización escrita de acudientes con motivo personalizado y descarga en formato Word (.docx)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Auto-redacción Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-blue-700/50">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-300 animate-pulse" />
                  <span className="text-xs font-bold text-sky-200">Asistente IA para Redacción Jurídico-Pedagógica</span>
                </div>
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  Redacta o refina automáticamente la justificación pedagógica, el alcance y las garantías de protección de datos conforme al motivo escrito por el docente.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateConsentAi}
                disabled={isGeneratingConsentAi}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2 shrink-0 self-end sm:self-auto"
              >
                {isGeneratingConsentAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redactando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Perfeccionar Motivo con IA</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleExportConsentWord(); }} className="space-y-5 text-xs">
              
              {/* SECCIÓN MODO DE DILIGENCIAMIENTO Y SELECCIÓN DE ESTUDIANTE */}
              <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <label className="font-extrabold text-indigo-950 text-xs flex items-center space-x-2">
                    <User className="w-4 h-4 text-indigo-700" />
                    <span>Cargar Datos desde Estudiante o Generar Plantilla en Blanco:</span>
                  </label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val || val === 'BLANK') {
                        setConsentForm({
                          ...consentForm,
                          studentName: '',
                          studentDocId: '',
                          parentName: '',
                          parentIdNumber: '',
                          parentPhone: '',
                          parentEmail: '',
                          modoDatosEnBlanco: true
                        });
                      } else {
                        const st = students.find(s => s.id === val);
                        if (st) {
                          setConsentForm({
                            ...consentForm,
                            studentName: st.name,
                            studentDocId: st.documentId || '',
                            parentName: st.guardians || '',
                            parentIdNumber: st.documentId || '',
                            parentPhone: st.contactPhones || '',
                            sede: st.sede || consentForm.sede,
                            modoDatosEnBlanco: false
                          });
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72 shadow-xs"
                  >
                    <option value="BLANK">📋 Ningún estudiante (Plantilla en blanco para llenar a mano)</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        👤 {st.name} ({st.sede || 'Sin sede'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setConsentForm({ ...consentForm, modoDatosEnBlanco: false })}
                    className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                      !consentForm.modoDatosEnBlanco
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 font-bold shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      !consentForm.modoDatosEnBlanco ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {!consentForm.modoDatosEnBlanco && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                    </div>
                    <div>
                      <div className="text-xs font-bold">1. Con Datos del Estudiante Pre-diligenciados</div>
                      <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                        Incluye nombres y documentos del estudiante y acudiente guardados en el sistema.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsentForm({
                      ...consentForm,
                      studentName: '',
                      studentDocId: '',
                      parentName: '',
                      parentIdNumber: '',
                      parentPhone: '',
                      parentEmail: '',
                      modoDatosEnBlanco: true
                    })}
                    className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                      consentForm.modoDatosEnBlanco
                        ? 'bg-white border-amber-600 ring-2 ring-amber-500/20 text-amber-950 font-bold shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      consentForm.modoDatosEnBlanco ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                    }`}>
                      {consentForm.modoDatosEnBlanco && <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">2. Plantilla en Blanco (Ningún Estudiante - Llenar a mano)</div>
                      <div className="text-[10px] text-amber-900/80 font-normal leading-tight mt-0.5">
                        Deja los datos personales con líneas (_________) para imprimir entregables físicos a las familias.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECCIÓN 1: DATOS INSTITUCIONALES */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>1. Datos Institucionales y de Ubicación</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Institución Educativa:</label>
                    <input
                      type="text"
                      value={consentForm.institucion}
                      onChange={(e) => setConsentForm({ ...consentForm, institucion: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sede:</label>
                    <input
                      type="text"
                      value={consentForm.sede}
                      onChange={(e) => setConsentForm({ ...consentForm, sede: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ciudad / Municipio:</label>
                    <input
                      type="text"
                      value={consentForm.ciudad}
                      onChange={(e) => setConsentForm({ ...consentForm, ciudad: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha de Diligenciamiento:</label>
                    <input
                      type="date"
                      value={consentForm.fecha}
                      onChange={(e) => setConsentForm({ ...consentForm, fecha: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: DATOS DEL ESTUDIANTE Y ACUDIENTE */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>2. Partes Intervinientes (Estudiante y Representante Legal)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre del Niño / Niña:</label>
                    <input
                      type="text"
                      value={consentForm.studentName}
                      onChange={(e) => setConsentForm({ ...consentForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Documento del Estudiante:</label>
                    <input
                      type="text"
                      value={consentForm.studentDocId}
                      onChange={(e) => setConsentForm({ ...consentForm, studentDocId: e.target.value })}
                      placeholder="N° Registro Civil o NUIP"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Grado / Nivel:</label>
                    <input
                      type="text"
                      value={consentForm.studentGrade}
                      onChange={(e) => setConsentForm({ ...consentForm, studentGrade: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Padre / Madre / Acudiente:</label>
                    <input
                      type="text"
                      value={consentForm.parentName}
                      onChange={(e) => setConsentForm({ ...consentForm, parentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Documento del Acudiente:</label>
                    <div className="flex gap-1.5">
                      <select
                        value={consentForm.parentIdType}
                        onChange={(e) => setConsentForm({ ...consentForm, parentIdType: e.target.value })}
                        className="px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shrink-0"
                      >
                        <option value="C.C.">C.C.</option>
                        <option value="C.E.">C.E.</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                      <input
                        type="text"
                        value={consentForm.parentIdNumber}
                        onChange={(e) => setConsentForm({ ...consentForm, parentIdNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parentesco / Teléfono:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={consentForm.parentRelationship}
                        onChange={(e) => setConsentForm({ ...consentForm, parentRelationship: e.target.value })}
                        placeholder="Parentesco"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={consentForm.parentPhone}
                        onChange={(e) => setConsentForm({ ...consentForm, parentPhone: e.target.value })}
                        placeholder="Teléfono"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Docente Responsable:</label>
                    <input
                      type="text"
                      value={consentForm.teacherName}
                      onChange={(e) => setConsentForm({ ...consentForm, teacherName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cargo / Especialidad Docente:</label>
                    <input
                      type="text"
                      value={consentForm.teacherRole}
                      onChange={(e) => setConsentForm({ ...consentForm, teacherRole: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correo Electrónico Acudiente:</label>
                    <input
                      type="email"
                      value={consentForm.parentEmail || ''}
                      onChange={(e) => setConsentForm({ ...consentForm, parentEmail: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: MOTIVO DEL CONSENTIMIENTO ESCROTO POR EL DOCENTE */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>3. Motivo Específico del Consentimiento (Escrito por el Docente)</span>
                  </h4>

                  {/* Plantillas rápidas de motivos */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConsentForm({
                        ...consentForm,
                        motivoConsentimiento: 'Autorización para la toma de registros fotográficos y audiovisuales institucionales con fines evaluativos y pedagógicos del desarrollo infantil.',
                        detallesActividad: 'Las imágenes se incorporarán a la ficha del observador, álbumes del aula y reportes a las familias. No se distribuirán en redes públicas sin consentimiento específico.'
                      })}
                      className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      📸 Fotos y Videos
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsentForm({
                        ...consentForm,
                        motivoConsentimiento: 'Autorización para participación en salida pedagógica y experiencia de exploración fuera del aula de clase.',
                        detallesActividad: 'Se garantizará transporte escolar autorizado, acompañamiento de docentes y auxiliares, así como protocolo de primeros auxilios y vigilancia permanente.'
                      })}
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      🚌 Salida Pedagógica
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsentForm({
                        ...consentForm,
                        motivoConsentimiento: 'Autorización para valoración socioemocional, pruebas cualitativas de desarrollo y acompañamiento en el rincón de la calma.',
                        detallesActividad: 'Las valoraciones serán estrictamente pedagógicas y cualitativas para adaptar las estrategias del aula según las necesidades afectivas y adaptativas del estudiante.'
                      })}
                      className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      🧠 Valoración Socioemocional
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Escriba el Motivo / Justificación Pedagógica del Consentimiento:
                    </label>
                    <textarea
                      rows={3}
                      value={consentForm.motivoConsentimiento}
                      onChange={(e) => setConsentForm({ ...consentForm, motivoConsentimiento: e.target.value })}
                      placeholder="Escriba aquí el motivo por el cual solicita la autorización de la familia (ej. fotos, salidas, apoyo pedagógico, etc.)"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Detalles de la Actividad, Alcance y Garantías de Seguridad:
                    </label>
                    <textarea
                      rows={3}
                      value={consentForm.detallesActividad}
                      onChange={(e) => setConsentForm({ ...consentForm, detallesActividad: e.target.value })}
                      placeholder="Describa las condiciones de seguridad, confidencialidad e integridad durante la actividad..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Cláusula de Protección de Datos Personales (Ley 1581 de 2012 / Hábeas Data):
                    </label>
                    <textarea
                      rows={2}
                      value={consentForm.tratamientoDatos}
                      onChange={(e) => setConsentForm({ ...consentForm, tratamientoDatos: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed text-[11px] text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: OPCIÓN Y MANIFESTACIÓN DE LA FAMILIA */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>4. Estado de Decisión del Acudiente</span>
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                    Sugerido: Dejar sin marcar para firma física
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsentForm({ ...consentForm, opcionAutorizacion: '', autorizaFotos: '', autorizaVideos: '', autorizaUsoInterno: '' })}
                    className={`p-3 rounded-xl border-2 font-extrabold text-xs flex items-center space-x-2.5 transition-all ${
                      !consentForm.opcionAutorizacion && !consentForm.autorizaFotos
                        ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      !consentForm.opcionAutorizacion && !consentForm.autorizaFotos ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                    }`}>
                      {(!consentForm.opcionAutorizacion && !consentForm.autorizaFotos) && <span className="text-[9px]">X</span>}
                    </div>
                    <div className="text-left">
                      <div className="text-amber-900 font-bold">SIN MARCAR [  ]</div>
                      <div className="text-[9px] font-normal text-amber-800">El acudiente diligenciará a mano</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsentForm({ ...consentForm, opcionAutorizacion: 'AUTORIZO', autorizaFotos: 'SI', autorizaVideos: 'SI', autorizaUsoInterno: 'SI' })}
                    className={`p-3 rounded-xl border-2 font-extrabold text-xs flex items-center space-x-2.5 transition-all ${
                      consentForm.opcionAutorizacion === 'AUTORIZO' || consentForm.autorizaFotos === 'SI'
                        ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      consentForm.opcionAutorizacion === 'AUTORIZO' || consentForm.autorizaFotos === 'SI' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {(consentForm.opcionAutorizacion === 'AUTORIZO' || consentForm.autorizaFotos === 'SI') && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className="text-left">
                      <div className="text-blue-900 font-bold">SI AUTORIZO</div>
                      <div className="text-[9px] font-normal text-blue-700">Pre-marcar SÍ ACEPTO</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsentForm({ ...consentForm, opcionAutorizacion: 'NO_AUTORIZO', autorizaFotos: 'NO', autorizaVideos: 'NO', autorizaUsoInterno: 'NO' })}
                    className={`p-3 rounded-xl border-2 font-extrabold text-xs flex items-center space-x-2.5 transition-all ${
                      consentForm.opcionAutorizacion === 'NO_AUTORIZO' || consentForm.autorizaFotos === 'NO'
                        ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      consentForm.opcionAutorizacion === 'NO_AUTORIZO' || consentForm.autorizaFotos === 'NO' ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                    }`}>
                      {(consentForm.opcionAutorizacion === 'NO_AUTORIZO' || consentForm.autorizaFotos === 'NO') && <AlertTriangle className="w-3 h-3" />}
                    </div>
                    <div className="text-left">
                      <div className="text-rose-900 font-bold">NO AUTORIZO</div>
                      <div className="text-[9px] font-normal text-rose-700">Pre-marcar NO ACEPTO</div>
                    </div>
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observaciones o Salvedades de la Familia (Opcional):</label>
                  <input
                    type="text"
                    value={consentForm.observacionesFamilia || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, observacionesFamilia: e.target.value })}
                    placeholder="Ej. 'Autorizo fotos grupales únicamente, no individuales'"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* VISTA PREVIA DEL DOCUMENTO EN VIVO (Coincidencia con la plantilla de la imagen) */}
              <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-300/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Vista Previa del Documento en Vivo</span>
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-300">
                    Formato Oficial
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs space-y-4 font-sans text-xs">
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-extrabold text-sky-600">
                      4. Declaración de Consentimiento
                    </h4>
                    <p className="text-[11px] text-slate-800 font-medium">
                      Por favor, marque con una (X) su decisión frente a las siguientes condiciones:
                    </p>

                    <div className="border-2 border-sky-600 rounded-sm overflow-hidden">
                      <table className="w-full text-[11px] text-left border-collapse">
                        <thead className="bg-white text-slate-900 font-bold border-b-2 border-sky-600 divide-x-2 divide-sky-600">
                          <tr>
                            <th className="p-2 w-[66%]">Actividad</th>
                            <th className="p-2 text-center w-[17%]">SÍ ACEPTO</th>
                            <th className="p-2 text-center w-[17%]">NO ACEPTO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 divide-x-2 divide-sky-600 text-slate-800">
                          <tr>
                            <td className="p-2">Autorizo la toma de fotografías de mi hijo(a) durante actividades pedagógicas.</td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'NO_AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2">Autorizo la grabación de videos de mi hijo(a) durante actividades pedagógicas.</td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'NO_AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2">Autorizo el uso de estas imágenes/videos en presentaciones pedagógicas internas.</td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                            <td className="p-2 text-center font-mono text-[11px] font-bold">
                              {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.opcionAutorizacion === 'NO_AUTORIZO' ? '[ X ]' : '[   ]')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-4 space-y-2.5 text-[11px] text-slate-800 font-normal">
                      <p className="flex flex-wrap items-baseline gap-1">
                        <span>Nombre del Estudiante:</span>{' '}
                        <span className="font-mono text-slate-800">
                          {consentForm.modoDatosEnBlanco || !consentForm.studentName
                            ? '_________________________________________________'
                            : consentForm.studentName}
                        </span>
                      </p>
                      <p className="flex flex-wrap items-baseline gap-1">
                        <span>Nombre del Padre/Madre/Acudiente:</span>{' '}
                        <span className="font-mono text-slate-800">
                          {consentForm.modoDatosEnBlanco || !consentForm.parentName
                            ? '_________________________________________________'
                            : consentForm.parentName}
                        </span>
                      </p>
                      <p className="flex flex-wrap items-baseline gap-1">
                        <span>Cédula de Ciudadanía:</span>{' '}
                        <span className="font-mono text-slate-800">
                          {consentForm.modoDatosEnBlanco || !consentForm.parentIdNumber
                            ? '_________________________________________________'
                            : consentForm.parentIdNumber}
                        </span>
                      </p>
                      <p className="flex flex-wrap items-baseline gap-1">
                        <span>Firma:</span>{' '}
                        <span className="font-mono text-slate-800">_________________________________________________</span>
                      </p>
                      <p className="flex flex-wrap items-baseline gap-1">
                        <span>Fecha:</span>{' '}
                        <span className="font-mono text-slate-800">
                          {consentForm.modoDatosEnBlanco || !consentForm.fecha
                            ? '_________________________________________________'
                            : consentForm.fecha}
                        </span>
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Documento formateado en Calibri 12 con estructura para firmas impresas.</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsConsentModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-900 hover:from-blue-800 hover:to-indigo-950 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-200" />
                    <span>📥 Descargar Consentimiento en Word (.docx)</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// Export InformeCualitativoView alias
export const InformeCualitativoView = EvaluacionDiarioView;

