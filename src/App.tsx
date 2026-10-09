import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { PlanForm } from './components/PlanForm';
import { PlanView } from './components/PlanView';
import { RecursosView } from './components/RecursosView';
import { NormativaView } from './components/NormativaView';
import { HistorialView } from './components/HistorialView';
import { EvaluacionDiarioView } from './components/EvaluacionDiarioView';
import { ConceptosView } from './components/ConceptosView';
import { ShareModal } from './components/ShareModal';
import { AuthNoticeModal } from './components/AuthNoticeModal';
import { PlanType, AgeRange, DimensionType, Planification, Student, DiarioEntry } from './types';
import { DEFAULT_PLANS } from './data/defaultPlans';
import { createChildDetonatingQuestion } from './utils/childQuestions';
import { getRectorActivitiesDetails } from './utils/rectorActivitiesHelper';
import { initAuthListener, loginWithGoogle, logoutUser } from './lib/firebase';
import { 
  subscribeToUserPlans, 
  savePlanToFirestore, 
  deletePlanFromFirestore, 
  clearAllPlansFromFirestore,
  migrateInitialPlansToFirestore 
} from './services/planService';
import { 
  DEFAULT_STUDENTS, 
  DEFAULT_ENTRIES, 
  subscribeToUserStudents, 
  subscribeToUserDiarioEntries, 
  saveStudentToFirestore, 
  deleteStudentFromFirestore, 
  saveDiarioEntryToFirestore, 
  deleteDiarioEntryFromFirestore,
  clearAllDiarioDataFromFirestore,
  clearStudentDiarioEntriesFromFirestore,
  migrateInitialDiarioDataToFirestore 
} from './services/diarioService';
import { saveAutoSnapshot } from './utils/backupSystem';

// Helper to sanitize any legacy cached plans with old institutional names
function sanitizePlanForSanPedro(plan: Planification): Planification {
  const jsonStr = JSON.stringify(plan);
  if (!jsonStr.includes('San José') && !jsonStr.includes('SAN JOSÉ') && !jsonStr.includes('Sincelejo') && !jsonStr.includes('SINCELEJO') && !jsonStr.includes('sanjose')) {
    return plan;
  }
  const replaced = jsonStr
    .replace(/INSTITUCIÓN EDUCATIVA SAN JOSÉ DE SINCELEJO/gi, 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO')
    .replace(/INSTITUCIÓN EDUCATIVA SAN JOSÉ/gi, 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO')
    .replace(/I\.E\. SAN JOSÉ DE SINCELEJO/gi, 'I.E. DEL MUNICIPIO DE SAN PEDRO')
    .replace(/I\.E\. SAN JOSÉ/gi, 'I.E. DEL MUNICIPIO DE SAN PEDRO')
    .replace(/I\.E\. San José de Sincelejo/gi, 'I.E. del Municipio de San Pedro')
    .replace(/I\.E\. San José/gi, 'I.E. del Municipio de San Pedro')
    .replace(/Institución Educativa San José de Sincelejo/gi, 'Institución Educativa del Municipio de San Pedro')
    .replace(/Institución Educativa San José/gi, 'Institución Educativa del Municipio de San Pedro')
    .replace(/sanjoseísta/gi, 'escolar y comunitaria')
    .replace(/Sanjoseístas/gi, 'Infantiles')
    .replace(/Sincelejo/g, 'San Pedro')
    .replace(/SINCELEJO/g, 'SAN PEDRO');
  try {
    return JSON.parse(replaced);
  } catch {
    return plan;
  }
}

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<'planificador' | 'conceptos' | 'recursos' | 'normativa' | 'historial' | 'evaluacion'>('planificador');
  const [currentPlan, setCurrentPlan] = useState<Planification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGlobalShareOpen, setIsGlobalShareOpen] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<{ isOpen: boolean; message?: string; code?: string }>({
    isOpen: false
  });
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize saved plans state with local persistence
  const [savedPlans, setSavedPlans] = useState<Planification[]>(() => {
    try {
      const saved = localStorage.getItem('OBSERVADOR_PLANS_V3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizePlanForSanPedro);
        }
      }
    } catch (e) {
      console.warn('Could not read local plans:', e);
    }
    return DEFAULT_PLANS;
  });

  // Initialize Students & Diario Entries state with LocalStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const isSeeded = localStorage.getItem('OBSERVADOR_SEEDED_V3');
      if (!isSeeded) {
        localStorage.setItem('OBSERVADOR_SEEDED_V3', 'true');
        localStorage.setItem('OBSERVADOR_STUDENTS_V3', JSON.stringify(DEFAULT_STUDENTS));
        return DEFAULT_STUDENTS;
      }
      const saved = localStorage.getItem('OBSERVADOR_STUDENTS_V3');
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return DEFAULT_STUDENTS;
    }
  });

  const [diarioEntries, setDiarioEntries] = useState<DiarioEntry[]>(() => {
    try {
      const isSeeded = localStorage.getItem('OBSERVADOR_SEEDED_V3');
      if (!isSeeded) {
        localStorage.setItem('OBSERVADOR_ENTRIES_V3', JSON.stringify(DEFAULT_ENTRIES));
        return DEFAULT_ENTRIES;
      }
      const saved = localStorage.getItem('OBSERVADOR_ENTRIES_V3');
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return DEFAULT_ENTRIES;
    }
  });

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = initAuthListener((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to real-time user plans, students, and diario entries in Firestore
  useEffect(() => {
    if (!currentUser) return;

    // Migrate initial default plans & diario entries if user is new & Firestore is empty
    migrateInitialPlansToFirestore(currentUser.uid, DEFAULT_PLANS);
    migrateInitialDiarioDataToFirestore(currentUser.uid);

    const unsubscribePlans = subscribeToUserPlans(
      currentUser.uid, 
      (plans) => {
        if (plans && plans.length > 0) {
          setSavedPlans(plans);
        } else {
          setSavedPlans(DEFAULT_PLANS);
        }
      },
      (err) => {
        console.warn('Fallback plans due to Firestore error:', err);
      }
    );

    const unsubscribeStudents = subscribeToUserStudents(
      currentUser.uid,
      (stList) => {
        setStudents(stList);
      },
      (err) => {
        console.warn('Fallback students due to Firestore error:', err);
      }
    );

    const unsubscribeEntries = subscribeToUserDiarioEntries(
      currentUser.uid,
      (entryList) => {
        setDiarioEntries(entryList);
      },
      (err) => {
        console.warn('Fallback diario entries due to Firestore error:', err);
      }
    );

    return () => {
      unsubscribePlans();
      unsubscribeStudents();
      unsubscribeEntries();
    };
  }, [currentUser]);

  // Auto-backup local snapshot & localStorage sync whenever students or diario entries are updated
  useEffect(() => {
    try {
      localStorage.setItem('OBSERVADOR_STUDENTS_V3', JSON.stringify(students));
      localStorage.setItem('OBSERVADOR_ENTRIES_V3', JSON.stringify(diarioEntries));
      localStorage.setItem('OBSERVADOR_PLANS_V3', JSON.stringify(savedPlans));
      localStorage.setItem('OBSERVADOR_SEEDED_V3', 'true');
    } catch (e) {
      console.warn('Error synchronizing local storage:', e);
    }
    saveAutoSnapshot(students, diarioEntries);
  }, [students, diarioEntries, savedPlans]);

  // Student & Diario Entry Handlers
  const handleRestoreBackupData = (restoredStudents: Student[], restoredEntries: DiarioEntry[]) => {
    setStudents(restoredStudents);
    setDiarioEntries(restoredEntries);
    if (currentUser?.uid) {
      restoredStudents.forEach((st) => saveStudentToFirestore(currentUser.uid, st));
      restoredEntries.forEach((entry) => saveDiarioEntryToFirestore(currentUser.uid, entry));
    }
    saveAutoSnapshot(restoredStudents, restoredEntries);
  };

  const handleSaveStudent = (student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (exists) {
        return prev.map((s) => (s.id === student.id ? student : s));
      }
      return [student, ...prev];
    });

    if (currentUser?.uid) {
      saveStudentToFirestore(currentUser.uid, student);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setDiarioEntries((prev) => prev.filter((e) => e.studentId !== studentId));

    if (currentUser?.uid) {
      deleteStudentFromFirestore(currentUser.uid, studentId);
    }
  };

  const handleSaveDiarioEntry = (entry: DiarioEntry) => {
    setDiarioEntries((prev) => {
      const exists = prev.some((e) => e.id === entry.id);
      if (exists) {
        return prev.map((e) => (e.id === entry.id ? entry : e));
      }
      return [entry, ...prev];
    });

    if (currentUser?.uid) {
      saveDiarioEntryToFirestore(currentUser.uid, entry);
    }
  };

  const handleDeleteDiarioEntry = (entryId: string) => {
    setDiarioEntries((prev) => prev.filter((e) => e.id !== entryId));

    if (currentUser?.uid) {
      deleteDiarioEntryFromFirestore(currentUser.uid, entryId);
    }
  };

  const handleResetSeedData = () => {
    setStudents(DEFAULT_STUDENTS);
    setDiarioEntries(DEFAULT_ENTRIES);

    if (currentUser?.uid) {
      DEFAULT_STUDENTS.forEach((st) => saveStudentToFirestore(currentUser.uid, st));
      DEFAULT_ENTRIES.forEach((entry) => saveDiarioEntryToFirestore(currentUser.uid, entry));
    }
  };

  // Auth Handlers
  const handleLoginGoogle = async () => {
    try {
      const res = await loginWithGoogle();
      if (!res.success && res.code !== 'auth/popup-closed-by-user' && res.code !== 'auth/cancelled-popup-request') {
        setAuthNotice({
          isOpen: true,
          message: res.error,
          code: res.code
        });
      }
    } catch (error) {
      console.warn('Login notice:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn('Logout notice:', error);
    }
  };

  // Handler to generate plan
  const handleGeneratePlan = async (
    type: PlanType,
    ageRange: AgeRange,
    selectedDimensions: DimensionType[],
    topic: string,
    propositosMEN?: string[],
    teacherPrompt?: string
  ) => {
    setIsLoading(true);

    let generatedPlan: Planification | null = null;

    try {
      // Try fetching from server-side Gemini API
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ageRange, selectedDimensions, topic, propositosMEN, teacherPrompt })
      });

      if (response.ok) {
        generatedPlan = await response.json();
      }
    } catch (err) {
      console.warn('Server generation unavailable, using smart local generator:', err);
    }

    if (!generatedPlan) {
      // Fallback generator if API key is not configured or network offline
      const isMovement = topic.toLowerCase().includes('movimiento') || topic.toLowerCase().includes('cuerpo');
      const baseTemplate = isMovement ? DEFAULT_PLANS[1] : DEFAULT_PLANS[0];

      const cleanPrompt = teacherPrompt?.trim() || '';
      const promptSnippets = cleanPrompt 
        ? cleanPrompt.split(/\n|;|\./).map(s => s.replace(/^-\s*/, '').trim()).filter(s => s.length > 3)
        : [];
      const mainIdea = promptSnippets[0] || cleanPrompt;
      const secondIdea = promptSnippets[1] || promptSnippets[0] || 'exploración vivencial en el entorno';
      const thirdIdea = promptSnippets[2] || promptSnippets[0] || 'taller creativo y de expresión';

      generatedPlan = {
        id: `plan-${Date.now()}`,
        type,
        ageRange,
        selectedDimensions,
        teacherPrompt: cleanPrompt || undefined,
        propositosMEN: propositosMEN && propositosMEN.length > 0 ? propositosMEN : [
          'Propósito 1: Las niñas y los niños construyen su identidad en relación con los otros.',
          'Propósito 2: Las niñas y los niños son comunicadores activos de sus ideas y emociones.',
          'Propósito 3: Las niñas y los niños disfrutan aprender y exploran el mundo.'
        ],
        topic,
        title: cleanPrompt
          ? `${type === 'proyecto' ? 'PROYECTO DE AULA' : type === 'contenido' ? 'PLANEACIÓN DE CONTENIDOS' : 'EXPERIENCIA'}: ${topic.toUpperCase()} - ${mainIdea.slice(0, 50).toUpperCase()}`
          : `${type === 'proyecto' ? 'PROYECTO DE AULA' : type === 'contenido' ? 'PLANEACIÓN DE CONTENIDOS Y CONCEPTOS' : 'EXPERIENCIA'}: ${topic.toUpperCase()} Y EL DESARROLLO INTEGRAL`,
        duration: type === 'proyecto' ? '4 semanas' : '1 semana',
        targetAudience: 'Comunidad Educativa',
        relationalAxis: baseTemplate.relationalAxis,
        theExperience: createChildDetonatingQuestion(topic, cleanPrompt),
        problematizingQuestion: createChildDetonatingQuestion(topic, cleanPrompt),
        justification: `Enmarcado en el Decreto 1411 de 2022 y la Ley 2503 de 2025, esta experiencia responde a los intereses de los niños sobre "${topic}" en la franja de ${ageRange}.${cleanPrompt ? ` Directrices e ideas del docente incorporadas: "${cleanPrompt}".` : ''} Integra las 4 experiencias rectoras (juego, arte, literatura y exploración del medio) fortaleciendo las dimensiones ${selectedDimensions.join(', ')}.`,
        generalObjective: cleanPrompt
          ? `Promover la indagación y exploración alrededor de "${topic}" en niños de ${ageRange}, llevando a la práctica la propuesta pedagógica del docente: ${mainIdea}.`
          : `Promover la indagación y exploración lúdica alrededor de "${topic}" en niños de ${ageRange}, potenciando sus capacidades comunicativas, corporales y socioemocionales.`,
        essentialLearnings: [
          cleanPrompt ? `Exploración y comprensión vivencial de: ${mainIdea}.` : `Identificación de aspectos clave sobre "${topic}" en el entorno cercano.`,
          cleanPrompt ? `Expresión creativa y corporal vinculada a: ${secondIdea}.` : 'Expresión de emociones y vivencias compartidas con sus pares.',
          cleanPrompt ? `Participación activa y colaborativa en: ${thirdIdea}.` : 'Respeto y cuidado por el propio cuerpo, los compañeros y el ecosistema.'
        ],
        capacitiesToDevelop: [
          `Comunica sus hallazgos e ideas sobre "${topic}" mediante el arte y el movimiento.`,
          cleanPrompt ? `Aplica sus destrezas motrices y curiosidad en: ${mainIdea}.` : 'Coordina sus posibilidades de movimiento en circuitos de juego simbólico.',
          'Demuestra empatía, escucha activa y autorregulación emocional.'
        ],
        expectedResult: cleanPrompt
          ? `Producción vivencial y muestra colectiva inspirada en la propuesta del docente: ${thirdIdea || mainIdea}. Los niños exponen sus creaciones y registros.`
          : `"Instalación Pedagógica y Muestra Colectiva: Un mural participativo e instalación tridimensional donde los niños exponen sus creaciones, diarios de registro e investigaciones sobre ${topic}."`,
        phases: [
          {
            phaseNumber: 1,
            name: 'INDAGAR',
            title: cleanPrompt ? `Momento 1: Indagar - Acogida y Provocación (${mainIdea.slice(0, 45)})` : 'Momento 1: Indagar - Asombro y Descubrimiento',
            description: cleanPrompt
              ? `Apertura y provocación sensorial mediada a partir de las indicaciones del docente: "${mainIdea}". Círculo de la palabra y preguntas infantiles.`
              : `Exploración sensorial directa en el aula y patio sobre "${topic}", identificando sensaciones y preguntas de los niños.`,
            strategiesAndVoices: [
              cleanPrompt ? `Implementación pedagógica: ${mainIdea}` : `Caminata sensorial de indagación sobre ${topic}`,
              'Caja misteriosa con elementos táctiles y sonoros',
              'Ronda cantada y lectura de imágenes'
            ],
            svgType: 'nature'
          },
          {
            phaseNumber: 2,
            name: 'PROYECTAR',
            title: cleanPrompt ? `Momento 2: Proyectar - Acuerdos y Organización (${secondIdea.slice(0, 45)})` : 'Momento 2: Proyectar - Acuerdos y Organización',
            description: cleanPrompt
              ? `Estaciones de indagación y acuerdos pedagógicos donde los niños organizan la experiencia con: "${secondIdea}". Registro de hipótesis y juego cooperativo.`
              : `Acuerdos grupales y diseño de rutas de investigación sobre "${topic}" integrando la lectura dramatizada.`,
            strategiesAndVoices: [
              cleanPrompt ? `Taller de indagación: ${secondIdea}` : `Asamblea infantil: "¿Qué queremos descubrir sobre ${topic}?"`,
              'Mural de compromisos socioemocionales',
              'Lectura dramatizada con cuentos infantiles'
            ],
            svgType: 'wind'
          },
          {
            phaseNumber: 3,
            name: 'VIVIR LA EXPERIENCIA',
            title: cleanPrompt ? `Momento 3: Vivir la Experiencia (${thirdIdea.slice(0, 45)})` : 'Momento 3: Vivir la Experiencia Activa',
            description: cleanPrompt
              ? `Exploración activa y vivencial donde los niños interactúan directamente con los materiales y espacios según: "${thirdIdea}". Expresión corporal y sensorial.`
              : `Laboratorio práctico con modelado en arcilla, pintura sensorial y circuitos motores inspirados en "${topic}".`,
            strategiesAndVoices: [
              cleanPrompt ? `Vivencia directa: ${thirdIdea}` : `Taller de modelado analítico y expresión plástica sobre ${topic}`,
              'Circuito motor y expresión corporal',
              'Laboratorio sensorial de experimentación'
            ],
            svgType: 'planting'
          },
          {
            phaseNumber: 4,
            name: 'CONSOLIDACIÓN CREATIVA',
            title: 'Momento 4: Taller Creativo y Muestra',
            description: cleanPrompt
              ? `Consolidación de la creación colectiva y muestra inspirada en "${cleanPrompt}". Exposición participativa de las producciones de los niños.`
              : `Presentación pública de los aprendizajes y la obra colectiva con las familias y la comunidad educativa.`,
            strategiesAndVoices: [
              cleanPrompt ? `Muestra colectiva de: ${mainIdea}` : `Exposición interactiva de la instalación pedagógica`,
              'Canto colectivo y muestra corporal',
              'Entrega de reconocimientos a las familias'
            ],
            svgType: 'gallery'
          },
          {
            phaseNumber: 5,
            name: 'VALORAR EL PROCESO',
            title: 'Momento 5: Valorar el Proceso y Escucha Pedagógica',
            description: `Círculo dialógico de valoración donde los niños comparten con palabras y gestos sus emociones y hallazgos. Registro cualitativo en diarios de campo, bitácora y portafolio de evidencias sin calificar ni rotular.`,
            strategiesAndVoices: [
              'Asamblea de escucha atenta y voces infantiles sobre lo vivido',
              'Registro cualitativo en Diario de Campo y Bitácora pedagógica',
              'Revisión afectiva del portafolio de creaciones del niño/a'
            ],
            svgType: 'gallery'
          }
        ],
        familyInvolvement: cleanPrompt
          ? `Reto en Familia: Compartir en el hogar una experiencia de exploración sobre "${mainIdea}" y aportar una evidencia significativa para el aula.`
          : `Bitácora "Explorando en Casa": Las familias acompañan una actividad de indagación sobre ${topic} y comparten una foto o dibujo para la exposición.`,
        inclusionPIAR: cleanPrompt.toLowerCase().includes('dua') || cleanPrompt.toLowerCase().includes('pictograma')
          ? 'Ajustes DUA prioritarios: Apoyos visuales con pictogramas, materiales sensoriales de alto contraste y flexibilidad en los tiempos de respuesta.'
          : 'Diseño Universal para el Aprendizaje (DUA): Apoyos visuales con pictogramas, rutas de movimiento adaptadas y estimulación táctil para garantizar la participación plena.',
        valorarElProceso: {
          seguimiento: 'Observación atenta y escucha pedagógica dialógica de los avances singulares de cada niña y niño, reconociendo su proceso sin calificar ni comparar.',
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

    if (generatedPlan) {
      generatedPlan.rectorActivities = getRectorActivitiesDetails(generatedPlan);
    }

    setCurrentPlan(generatedPlan);
    setSavedPlans((prev) => [generatedPlan!, ...prev]);

    // Save to Firestore for the logged-in user
    if (currentUser?.uid && generatedPlan) {
      savePlanToFirestore(currentUser.uid, generatedPlan);
    }

    setIsLoading(false);
  };

  const handleSelectPrebuiltPlan = (plan: Planification) => {
    setCurrentPlan(plan);
    setActiveNavTab('planificador');
  };

  const handleDuplicatePlan = (plan: Planification) => {
    const duplicated: Planification = {
      ...plan,
      id: `plan-${Date.now()}`,
      title: `${plan.title} (Copia)`,
      createdAt: new Date().toISOString()
    };
    setSavedPlans((prev) => [duplicated, ...prev]);

    if (currentUser?.uid) {
      savePlanToFirestore(currentUser.uid, duplicated);
    }
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    if (currentPlan?.id === id) {
      setCurrentPlan(null);
    }

    if (currentUser?.uid) {
      deletePlanFromFirestore(currentUser.uid, id);
    }
  };

  const handleClearAllPlans = async () => {
    setSavedPlans([]);
    setCurrentPlan(null);
    if (currentUser?.uid) {
      await clearAllPlansFromFirestore(currentUser.uid);
    } else {
      localStorage.removeItem('local_plans_backup');
    }
  };

  const handleClearStudentEntries = async (studentId: string) => {
    setDiarioEntries((prev) => prev.filter((e) => e.studentId !== studentId));
    if (currentUser?.uid) {
      await clearStudentDiarioEntriesFromFirestore(currentUser.uid, studentId);
    }
  };

  const handleClearAllDiarioData = async () => {
    setStudents([]);
    setDiarioEntries([]);
    try {
      localStorage.setItem('OBSERVADOR_STUDENTS_V3', JSON.stringify([]));
      localStorage.setItem('OBSERVADOR_ENTRIES_V3', JSON.stringify([]));
      localStorage.setItem('OBSERVADOR_SEEDED_V3', 'true');
    } catch (e) {
      console.warn('Error clearing local storage:', e);
    }
    if (currentUser?.uid) {
      await clearAllDiarioDataFromFirestore(currentUser.uid);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={(tab) => {
          setActiveNavTab(tab);
          if (tab !== 'planificador') {
            setCurrentPlan(null);
          }
        }}
        savedCount={savedPlans.length}
        onShareApp={() => setIsGlobalShareOpen(true)}
        currentUser={currentUser}
        onLoginGoogle={handleLoginGoogle}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        
        {activeNavTab === 'planificador' && (
          currentPlan ? (
            <PlanView
              plan={currentPlan}
              onBack={() => setCurrentPlan(null)}
            />
          ) : (
            <PlanForm
              onGeneratePlan={handleGeneratePlan}
              onSelectPrebuiltPlan={handleSelectPrebuiltPlan}
              isLoading={isLoading}
            />
          )
        )}

        {activeNavTab === 'recursos' && <RecursosView students={students} />}

        {activeNavTab === 'conceptos' && (
          <ConceptosView
            onImportToPlanner={(plan) => {
              setCurrentPlan(plan);
              setActiveNavTab('planificador');
            }}
          />
        )}

        {activeNavTab === 'evaluacion' && (
          <EvaluacionDiarioView
            students={students}
            diarioEntries={diarioEntries}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onSaveDiarioEntry={handleSaveDiarioEntry}
            onDeleteDiarioEntry={handleDeleteDiarioEntry}
            onClearStudentEntries={handleClearStudentEntries}
            onClearAllDiarioData={handleClearAllDiarioData}
            onResetSeedData={handleResetSeedData}
            onRestoreBackupData={handleRestoreBackupData}
          />
        )}

        {activeNavTab === 'normativa' && <NormativaView />}

        {activeNavTab === 'historial' && (
          <HistorialView
            savedPlans={savedPlans}
            onViewPlan={(plan) => {
              setCurrentPlan(plan);
              setActiveNavTab('planificador');
            }}
            onDuplicatePlan={handleDuplicatePlan}
            onDeletePlan={handleDeletePlan}
            onClearAllPlans={handleClearAllPlans}
            onNewPlanClick={() => {
              setCurrentPlan(null);
              setActiveNavTab('planificador');
            }}
            currentUser={currentUser}
            onLoginGoogle={handleLoginGoogle}
          />
        )}

      </main>

      {/* Bottom Footer */}
      <footer className="bg-[#1e3a8a] text-blue-100 text-center py-6 px-4 text-xs font-medium border-t border-[#1d4ed8] print:hidden">
        <p className="max-w-4xl mx-auto leading-relaxed font-bold text-white text-sm">
          Instituciones Educativas del Municipio de San Pedro (Sucre) • Proyecto Pedagógico de Primera Infancia (PPEI 2026)
        </p>
        <p className="max-w-4xl mx-auto leading-relaxed mt-1 text-blue-200">
          Derechos Reservados a Miguel Sevilla Hernández — Creador de la APP
        </p>
        <p className="max-w-4xl mx-auto leading-relaxed mt-1 text-blue-200/90 text-[11px]">
          Instituciones Educativas Urbanas y Rurales • Municipio de San Pedro, Sucre • Sabana Sucreña
        </p>
        <p className="text-[11px] text-blue-300/80 mt-1.5 italic">
          "Solo los seres humanizados pueden transformar la sociedad" — Fundamentado en el Decreto 1411 de 2022 y Ley 2503 de 2025
        </p>
      </footer>

      {/* Global Share Modal */}
      <ShareModal
        isOpen={isGlobalShareOpen}
        onClose={() => setIsGlobalShareOpen(false)}
        plan={currentPlan}
      />

      {/* Auth & Access Notice Modal */}
      <AuthNoticeModal
        isOpen={authNotice.isOpen}
        onClose={() => setAuthNotice({ isOpen: false })}
        errorMessage={authNotice.message}
        errorCode={authNotice.code}
      />

    </div>
  );
}

