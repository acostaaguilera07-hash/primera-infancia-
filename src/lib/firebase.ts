import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface AuthActionResult {
  success: boolean;
  user?: User;
  error?: string;
  code?: string;
}

export const loginWithGoogle = async (): Promise<AuthActionResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.warn('Google sign-in attempt notice:', error?.code, error?.message);
    let friendlyMessage = 'No se pudo completar el acceso con Google.';
    
    if (error?.code === 'auth/unauthorized-domain') {
      friendlyMessage = 'El dominio actual no está en la lista de dominios autorizados de Google OAuth. Tu sesión continuará en Modo Docente Protegido (100% funcional con almacenamiento local y en la nube).';
    } else if (error?.code === 'auth/popup-blocked') {
      friendlyMessage = 'El navegador bloqueó la ventana emergente de Google. Puedes habilitar ventanas emergentes o continuar en Modo Docente.';
    } else if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      friendlyMessage = 'Ventana de acceso cerrada por el usuario.';
    } else if (error?.code === 'auth/network-request-failed') {
      friendlyMessage = 'Problema de conexión a internet. La aplicación sigue funcionando con respaldo local.';
    }

    return {
      success: false,
      error: friendlyMessage,
      code: error?.code || 'auth/unknown'
    };
  }
};

export const loginAnonymously = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.warn('Anonymous sign-in notice:', error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    // Automatically establish a fresh anonymous guest session
    await signInAnonymously(auth);
  } catch (error) {
    console.warn('Sign out notice:', error);
  }
};

export const initAuthListener = (onUserChanged: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserChanged(user);
    } else {
      // Automatically provide an anonymous session so Firestore security rules succeed
      try {
        const anonUserCredential = await signInAnonymously(auth);
        onUserChanged(anonUserCredential.user);
      } catch (anonErr) {
        console.warn('Auto anonymous auth fallback to local session:', anonErr);
        onUserChanged(null);
      }
    }
  });
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}
