import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Student, DiarioEntry } from '../types';

const STUDENTS_COLLECTION = 'students';
const DIARIO_COLLECTION = 'diario_entries';

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student-sofia',
    userId: 'default',
    name: 'Sofía Villalba Ríos',
    sede: 'Sede Principal',
    cycle: 'Ciclo 2 (3-6 años)',
    frequentEmotion: 'Alegría y Asombro',
    birthDate: '2022-03-15',
    age: '4 años',
    photoUrl: '',
    guardians: 'Mariana Ríos (Madre) y Jorge Villalba (Padre)',
    contactPhones: '300 123 4567 / 315 987 6543',
    address: 'Calle 14 # 8-25',
    neighborhood: 'Barrio El Centro',
    healthRegimen: 'Subsidiado',
    eps: 'Capital Salud EPS',
    healthNutritionNotes: 'Esquema de vacunación completo. Nutrición adecuada, consumo activo de frutas en lonchera.',
    generalObservations: 'Muestra gran autonomía en actividades artísticas y lectura simbólica.',
    createdAt: '2026-07-28T08:00:00.000Z'
  },
  {
    id: 'student-1',
    userId: 'default',
    name: 'Mateo Pérez Sampayo',
    sede: 'Sede El Rosal',
    cycle: 'Ciclo 2 (3-6 años)',
    frequentEmotion: 'Curiosidad y Alegría',
    birthDate: '2021-08-20',
    age: '4.5 años',
    photoUrl: '',
    guardians: 'Clara Sampayo (Madre)',
    contactPhones: '310 555 7890',
    address: 'Carrera 5 # 12-40',
    neighborhood: 'Barrio El Rosal',
    healthNutritionNotes: 'Sin alergias reportadas. Excelente estado físico y motricidad gruesa.',
    generalObservations: 'Disfruta la exploración de la naturaleza y el trabajo en equipo con lupas.',
    createdAt: '2026-07-20T08:00:00.000Z'
  },
  {
    id: 'student-2',
    userId: 'default',
    name: 'Lucía Gómez Morales',
    sede: 'Sede San Ignacio',
    cycle: 'Ciclo 2 (3-6 años)',
    frequentEmotion: 'Curiosidad y Empatía',
    birthDate: '2022-01-10',
    age: '4 años',
    photoUrl: '',
    guardians: 'Andrea Morales (Madre)',
    contactPhones: '318 444 3210',
    address: 'Av. Circunvalar # 45-12',
    neighborhood: 'San Ignacio',
    healthNutritionNotes: 'Tolerante a todos los alimentos. Asiste a controles pediátricos al día.',
    generalObservations: 'Alta sensibilidad artística y expresión verbal fluida.',
    createdAt: '2026-07-21T08:00:00.000Z'
  },
  {
    id: 'student-3',
    userId: 'default',
    name: 'Carlos Mendoza Parra',
    sede: 'Sede Los Borrachos',
    cycle: 'Ciclo 1 (0-3 años)',
    frequentEmotion: 'Calma y Asombro',
    birthDate: '2024-06-05',
    age: '2 años',
    photoUrl: '',
    guardians: 'Roberto Mendoza (Padre)',
    contactPhones: '301 222 9988',
    address: 'Calle 8 # 3-15',
    neighborhood: 'La Esperanza',
    healthNutritionNotes: 'Período de adaptación al espacio escolar exitoso.',
    generalObservations: 'Exploración sensorial activa mediante texturas e instrumentos sonoros.',
    createdAt: '2026-07-22T08:00:00.000Z'
  },
  {
    id: 'student-4',
    userId: 'default',
    name: 'Valentina Torres',
    sede: 'Sede Perendengue',
    cycle: 'Ciclo 2 (3-6 años)',
    frequentEmotion: 'Entusiasmo',
    birthDate: '2021-11-30',
    age: '4 años',
    photoUrl: '',
    guardians: 'Laura Torres (Tía y Acudiente)',
    contactPhones: '320 111 2233',
    address: 'Transversal 3 # 18-09',
    neighborhood: 'Perendengue',
    healthNutritionNotes: 'Buena hidratación y respuesta positiva en actividades psicomotrices.',
    generalObservations: 'Participa activamente en asambleas y rondas infantiles.',
    createdAt: '2026-07-23T08:00:00.000Z'
  }
];

export const DEFAULT_ENTRIES: DiarioEntry[] = [
  {
    id: 'entry-sofia-1',
    studentId: 'student-sofia',
    userId: 'default',
    date: '2026-07-28',
    rectorExperience: 'Literatura, Arte y Juego',
    activityTitle: '✨ Resumen de Avances por los 3 Propósitos (Bases Curriculares MEN)',
    observation: 'Disfruta la lectura de cuentos y relatos infantiles. Nombra cuando siente calma al usar el semáforo de las emociones.',
    developmentAdvancement: 'Consolida la identidad cultural, la autorregulación emocional y la indagación simbólica.',
    selectedDimensions: ['SOCIOEMOCIONAL', 'COMUNICATIVA Y CREATIVA', 'CULTURAL', 'COGNITIVA'],
    emotion: 'Alegría y Asombro',
    pedagogicalReflection: 'Acompañar desde el hogar fortaleciendo la lectura afectiva y las experiencias dramáticas.',
    period: 'Periodo 1',
    isAiGeneratedReport: true,
    qualitativeSections: {
      proposito1: 'Sofía avanza de manera progresiva y destacada en la construcción de su identidad, autonomía y manejo de emociones (Ley 2503). Demuestra autorregulación socioemocional al identificar y nombrar voluntariamente sus estados afectivos (alegría, asombro, calma) utilizando el semáforo de las emociones y recurriendo al rincón de la calma de forma autónoma.',
      proposito2: 'Manifiesta un especial disfrute y fascinación por la literatura infantil y las narraciones culturales, destacándose su interés espontáneo durante la lectura de relatos. Logra expresar abiertamente sus sentimientos, ideas y vivencias a través de lenguajes verbales y gestuales, enriqueciendo sus habilidades comunicativas y su sensibilidad estética dentro del aula.',
      proposito3: 'Desarrolla su pensamiento cognitivo y prematemática inicial mediante la observación atenta de su entorno natural y social. Clasifica colecciones por color, tamaño y atributos, realiza conteos espontáneos durante el juego e indaga sobre los elementos de su contexto, formulando preguntas e hipótesis con curiosidad.'
    },
    createdAt: '2026-07-28T10:30:00.000Z'
  },
  {
    id: 'entry-1',
    studentId: 'student-1',
    userId: 'default',
    date: '2026-07-28',
    rectorExperience: 'Exploración del Medio',
    activityTitle: 'Exploración de la Chagra y Recolección de Semillas Ancestrales',
    observation: 'Mateo mostró gran interés al explorar la chagra escolar. Seleccionó de forma autónoma semillas de maíz y fríjol, observando sus texturas con la lupa y compartiendo sus hallazgos con sus compañeros de mesa.',
    developmentAdvancement: 'Avanza en la autorregulación y en la formulación de preguntas explicativas sobre el ciclo de vida vegetal y el cuidado del entorno natural (Decreto 1411).',
    selectedDimensions: ['AMBIENTAL', 'COGNITIVA', 'COMUNICATIVA Y CREATIVA'],
    emotion: 'Alegría y Asombro',
    pedagogicalReflection: 'Aprovechar el interés de Mateo por las lupas para diseñar un rincón de detectives de la naturaleza con bitácoras infantiles de dibujo.',
    period: 'Periodo 3',
    createdAt: '2026-07-28T10:30:00.000Z'
  },
  {
    id: 'entry-2',
    studentId: 'student-1',
    userId: 'default',
    date: '2026-05-15',
    rectorExperience: 'Arte',
    activityTitle: 'Teatro de Sombras y Expresión de Emociones',
    observation: 'Durante la sesión de teatro de sombras, Mateo construyó un personaje utilizando siluetas de animales y moduló su voz para expresar momentos de alegría y sorpresa ante sus pares.',
    developmentAdvancement: 'Expresa vivencias socioemocionales de manera simbólica, reconociendo emociones básicas en sí mismo y en los demás.',
    selectedDimensions: ['COMUNICATIVA Y CREATIVA', 'SOCIOEMOCIONAL', 'CORPORAL'],
    emotion: 'Entusiasmo',
    pedagogicalReflection: 'Incentivar la creación de diálogos en parejas durante los momentos de juego dramático.',
    period: 'Periodo 2',
    createdAt: '2026-05-15T09:15:00.000Z'
  },
  {
    id: 'entry-3',
    studentId: 'student-1',
    userId: 'default',
    date: '2026-03-10',
    rectorExperience: 'Juego',
    activityTitle: 'Circuito Motor y Rincón de la Calma',
    observation: 'Mateo participó activamente en el circuito de equilibrio corporal. Al finalizar la actividad física intensa, acudió espontáneamente al rincón de la calma para realizar respiraciones conscientes.',
    developmentAdvancement: 'Consolida el control tónico-postural e identifica estrategias grupales para recuperar el equilibrio emocional.',
    selectedDimensions: ['CORPORAL', 'SOCIOEMOCIONAL', 'ÉTICA'],
    emotion: 'Calma y Serenidad',
    pedagogicalReflection: 'Mantener el acceso libre al rincón de la calma durante todas las transiciones pedagógicas del día.',
    period: 'Periodo 1',
    createdAt: '2026-03-10T11:00:00.000Z'
  },
  {
    id: 'entry-4',
    studentId: 'student-2',
    userId: 'default',
    date: '2026-07-27',
    rectorExperience: 'Literatura',
    activityTitle: 'Lectura Compartida y Creación de Cuentos Colectivos',
    observation: 'Lucía propuso el cambio de final para el cuento leído en la asamblea, integrando elementos de empatía y cuidado de la fauna silvestre.',
    developmentAdvancement: 'Demuestra habilidades narrativas complejas y vocabulario rico para describir conflictos emocionales.',
    selectedDimensions: ['COMUNICATIVA Y CREATIVA', 'CULTURAL', 'SOCIOEMOCIONAL'],
    emotion: 'Curiosidad y Empatía',
    pedagogicalReflection: 'Promover la creación de un libro viajero donde las familias continúen la historia escrita por Lucía.',
    period: 'Periodo 3',
    createdAt: '2026-07-27T08:45:00.000Z'
  }
];

export const subscribeToUserStudents = (
  userId: string,
  onSuccess: (students: Student[]) => void,
  onError?: (err: any) => void
) => {
  if (!userId) {
    onSuccess([]);
    return () => {};
  }

  const q = query(
    collection(db, STUDENTS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Student[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const { userId: _uid, ...rest } = data;
        return rest as Student;
      });

      list.sort((a, b) => a.name.localeCompare(b.name));
      onSuccess(list);
    },
    (err) => {
      console.error('Error fetching students from Firestore:', err);
      if (onError) onError(err);
    }
  );
};

export const subscribeToUserDiarioEntries = (
  userId: string,
  onSuccess: (entries: DiarioEntry[]) => void,
  onError?: (err: any) => void
) => {
  if (!userId) {
    onSuccess([]);
    return () => {};
  }

  const q = query(
    collection(db, DIARIO_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: DiarioEntry[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const { userId: _uid, ...rest } = data;
        return rest as DiarioEntry;
      });

      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onSuccess(list);
    },
    (err) => {
      console.error('Error fetching diario entries from Firestore:', err);
      if (onError) onError(err);
    }
  );
};

export const saveStudentToFirestore = async (userId: string, student: Student) => {
  if (!userId) return;
  const docRef = doc(db, STUDENTS_COLLECTION, student.id);
  const dataToSave = {
    ...student,
    userId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, dataToSave, { merge: true });
};

export const deleteStudentFromFirestore = async (userId: string, studentId: string) => {
  if (!userId) return;
  const docRef = doc(db, STUDENTS_COLLECTION, studentId);
  await deleteDoc(docRef);
};

export const saveDiarioEntryToFirestore = async (userId: string, entry: DiarioEntry) => {
  if (!userId) return;
  const docRef = doc(db, DIARIO_COLLECTION, entry.id);
  const dataToSave = {
    ...entry,
    userId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, dataToSave, { merge: true });
};

export const deleteDiarioEntryFromFirestore = async (userId: string, entryId: string) => {
  if (!userId) return;
  const docRef = doc(db, DIARIO_COLLECTION, entryId);
  await deleteDoc(docRef);
};

export const clearStudentDiarioEntriesFromFirestore = async (userId: string, studentId: string) => {
  if (!userId || !studentId) return;
  try {
    const q = query(
      collection(db, DIARIO_COLLECTION),
      where('userId', '==', userId),
      where('studentId', '==', studentId)
    );
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, DIARIO_COLLECTION, docSnap.id));
    }
  } catch (error) {
    console.error('Error clearing student entries from Firestore:', error);
  }
};

export const clearAllDiarioDataFromFirestore = async (userId: string) => {
  if (!userId) return;
  try {
    const qEntries = query(collection(db, DIARIO_COLLECTION), where('userId', '==', userId));
    const snapEntries = await getDocs(qEntries);
    for (const docSnap of snapEntries.docs) {
      await deleteDoc(doc(db, DIARIO_COLLECTION, docSnap.id));
    }

    const qStudents = query(collection(db, STUDENTS_COLLECTION), where('userId', '==', userId));
    const snapStudents = await getDocs(qStudents);
    for (const docSnap of snapStudents.docs) {
      await deleteDoc(doc(db, STUDENTS_COLLECTION, docSnap.id));
    }

    // Mark as explicitly seeded/cleared so auto-migration won't recreate demo data
    const settingsRef = doc(db, 'user_settings', userId);
    await setDoc(settingsRef, { diarioSeeded: true, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error clearing all diario data from Firestore:', error);
  }
};

export const migrateInitialDiarioDataToFirestore = async (userId: string) => {
  if (!userId) return;

  try {
    const settingsRef = doc(db, 'user_settings', userId);
    const settingsSnap = await getDoc(settingsRef);

    // If already initialized/seeded once, do not recreate demo data
    if (settingsSnap.exists() && settingsSnap.data()?.diarioSeeded) {
      return;
    }

    const qStudents = query(collection(db, STUDENTS_COLLECTION), where('userId', '==', userId));
    const snapshotStudents = await getDocs(qStudents);

    if (snapshotStudents.empty) {
      for (const st of DEFAULT_STUDENTS) {
        await saveStudentToFirestore(userId, { ...st, userId });
      }
      for (const entry of DEFAULT_ENTRIES) {
        await saveDiarioEntryToFirestore(userId, { ...entry, userId });
      }
    }

    await setDoc(settingsRef, { diarioSeeded: true, createdAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'user_settings');
  }
};
