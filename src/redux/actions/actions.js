import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

export const loginUser = async (user) => {
  const q = query(
    collection(db, 'wishlists'),
    where('createdById', '==', user.uid)
  );

  const querySnapshot = await getDocs(q);
  const wishlists = querySnapshot.docs.map((doc) => ({
    name: doc.data().name,
    id: doc.id,
  }));
  return {
    type: 'LOGIN',
    data: wishlists,
  };
};
