import { Student, DiarioEntry } from '../types';

const AUTO_BACKUP_KEY = 'DIARIO_AUTO_SNAPSHOT_DATA_V1';
const AUTO_BACKUP_TIME_KEY = 'DIARIO_AUTO_SNAPSHOT_TIME_V1';

export interface BackupPayload {
  version: string;
  timestamp: string;
  appName: string;
  studentsCount: number;
  entriesCount: number;
  students: Student[];
  diarioEntries: DiarioEntry[];
}

/**
 * Guarda un resguardo automático en el almacenamiento local del navegador
 */
export const saveAutoSnapshot = (students: Student[], diarioEntries: DiarioEntry[]) => {
  try {
    const payload: BackupPayload = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      appName: 'Observador e Informe Cualitativo Primera Infancia',
      studentsCount: students ? students.length : 0,
      entriesCount: diarioEntries ? diarioEntries.length : 0,
      students: students || [],
      diarioEntries: diarioEntries || []
    };
    localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(payload));
    localStorage.setItem(AUTO_BACKUP_TIME_KEY, new Date().toISOString());
  } catch (err) {
    console.warn('No se pudo guardar la copia automática en localStorage:', err);
  }
};

/**
 * Obtiene la fecha y los datos del último resguardo automático local
 */
export const getAutoSnapshotInfo = (): { timestamp: string | null; data: BackupPayload | null } => {
  try {
    const rawTime = localStorage.getItem(AUTO_BACKUP_TIME_KEY);
    const rawData = localStorage.getItem(AUTO_BACKUP_KEY);
    if (!rawData) return { timestamp: null, data: null };
    const parsed: BackupPayload = JSON.parse(rawData);
    return {
      timestamp: rawTime || parsed.timestamp,
      data: parsed
    };
  } catch (err) {
    console.error('Error al leer resguardo automático:', err);
    return { timestamp: null, data: null };
  }
};

/**
 * Exporta un archivo JSON descargable con la copia de seguridad completa de la app
 */
export const exportBackupToJson = (students: Student[], diarioEntries: DiarioEntry[]) => {
  const payload: BackupPayload = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    appName: 'Observador e Informe Cualitativo Primera Infancia',
    studentsCount: students.length,
    entriesCount: diarioEntries.length,
    students,
    diarioEntries
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const nowStr = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.href = url;
  link.download = `copia_seguridad_observador_docente_${nowStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Valida y procesa un archivo JSON importado por el usuario
 */
export const parseBackupFile = (file: File): Promise<BackupPayload> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('El archivo no tiene una estructura JSON válida.');
        }
        if (!Array.isArray(parsed.students) || !Array.isArray(parsed.diarioEntries)) {
          throw new Error('El archivo de copia de seguridad no contiene la estructura esperada de estudiantes y diarios.');
        }
        resolve(parsed as BackupPayload);
      } catch (err: any) {
        reject(new Error(err.message || 'Error al procesar el archivo de copia de seguridad.'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(file);
  });
};
