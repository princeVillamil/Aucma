import {db} from './firebase.js'
import { collection, addDoc, getDocs, getDoc, serverTimestamp, doc, updateDoc, query, where, deleteDoc } from "firebase/firestore";


// Check  of USER from DB
export const checkIfAdmin = async (userId) => {
  try {
    const docRef = doc(db, "updatedUsers", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.role === "admin";
    } else {
      console.warn("No such user document:", userId);
      return false;
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};
// Get Doc from DB by ID
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log({ id: docSnap.id, ...docSnap.data() })
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
