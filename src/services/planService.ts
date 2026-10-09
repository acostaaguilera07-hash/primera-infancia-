import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Planification } from '../types';

const PLANS_COLLECTION = 'plans';

export const subscribeToUserPlans = (
  userId: string, 
  onSuccess: (plans: Planification[]) => void,
  onError?: (err: any) => void
) => {
  if (!userId) {
    onSuccess([]);
    return () => {};
  }

  const q = query(
    collection(db, PLANS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const plans: Planification[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        // Omit userId from Planification type if needed, or parse cleanly
        const { userId: _uid, ...rest } = data;
        return rest as Planification;
      });
      
      // Sort plans client-side by createdAt descending
      plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      onSuccess(plans);
    },
    (err) => {
      console.error('Error fetching plans from Firestore:', err);
      if (onError) onError(err);
    }
  );
};

export const savePlanToFirestore = async (userId: string, plan: Planification) => {
  if (!userId) return;
  const planDocRef = doc(db, PLANS_COLLECTION, plan.id);
  const dataToSave = {
    ...plan,
    userId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(planDocRef, dataToSave, { merge: true });
};

export const deletePlanFromFirestore = async (userId: string, planId: string) => {
  if (!userId) return;
  const planDocRef = doc(db, PLANS_COLLECTION, planId);
  await deleteDoc(planDocRef);
};

export const clearAllPlansFromFirestore = async (userId: string) => {
  if (!userId) return;
  try {
    const q = query(collection(db, PLANS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, PLANS_COLLECTION, docSnap.id));
    }
  } catch (error) {
    console.error('Error clearing all plans from Firestore:', error);
  }
};


export const migrateInitialPlansToFirestore = async (userId: string, plans: Planification[]) => {
  if (!userId || !plans.length) return;
  
  try {
    const q = query(collection(db, PLANS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    // If user already has plans in Firestore, don't overwrite automatically
    if (snapshot.empty) {
      for (const plan of plans) {
        await savePlanToFirestore(userId, plan);
      }
    }
  } catch (error) {
    console.error('Error migrating initial plans to Firestore:', error);
  }
};
