import {db} from './firebase.js'
import emailjs from '@emailjs/browser';
import { collection, addDoc, getDocs, getDoc, serverTimestamp, doc, updateDoc, query, where, deleteDoc } from "firebase/firestore";


export const submitMaintenanceRequest = async(requestInfo) =>{
  try {
    const requestData = {
      name: requestInfo.name,
      address: requestInfo.address,
      date: requestInfo.date,
      time: requestInfo.time,
      lat: requestInfo.lat,
      lng: requestInfo.lng,
      description: requestInfo.description,
      clientID: requestInfo.clientID,
      technicianID: requestInfo.technicianID ||"unfinalized",
      status: requestInfo.status || "unfinalized",
      createdAt: serverTimestamp() // optional: for sorting/record keeping
    };

    const docRef = await addDoc(collection(db, "maintenanceRequests"), requestData);
    console.log("Maintenance request added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding maintenance request:", error);
    throw error;
  }
};
// Get ALL Technicians
export const getAllTechnicians = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "technician"));
    const querySnapshot = await getDocs(q);

    const technicians = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(technicians)
    return technicians;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
// Check if Admin
export const checkIfAdmin = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.role === "technician";
    } else {
      console.warn("No such user document:", userId);
      return false;
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};
// getAllTechnicians()
export const getAllOfUserReq = async (userID) => {
  console.log(userID, "FireStore")
  try {
    const usersRef = collection(db, "maintenanceRequests");
    const q = query(usersRef, where("clientID", "==", userID));
    const querySnapshot = await getDocs(q);

    const userReq = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userReq;
  } catch (error) {
    console.error("Error fetching userReq:", error);
    throw error;
  }
};
// Get ALL Maintenance Request 
export const getAllMaintenanceRequest = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "maintenanceRequests"));
    
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(docs)
    return docs;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};
// Get One Doc
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log({ id: docSnap.id, ...docSnap.data() })
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // console.warn("No such document!");
      return null;
    }
  } catch (error) {
    // console.error("Error getting document:", error);
    throw error;
  }
};
// Update Maintenance Request 
export const updateMaintenanceRequest = async (maintenanceRequestsID, updatedData) => {
  try {
    const docRef = doc(db, "maintenanceRequests", maintenanceRequestsID);
    await updateDoc(docRef, updatedData);
    console.log(`Document '${maintenanceRequestsID}' in '${"maintenanceRequests"}' updated.`);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Update User
export const updateDocumentById = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log(`Document '${docId}' in '${collectionName}' updated.`);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};
export const deleteDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`Document '${docId}' deleted from '${collectionName}'`);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};






// Email Sender
// export const sendEmail = async ({ to_name, to_email, message }) => {
//   try {
//     const result = await emailjs.send(
//       'your_service_id',
//       'your_template_id',
//       {
//         to_name,
//         to_email,
//         message,
//       },
//       'your_public_key'
//     );
//     console.log('Email sent!', result.text);
//     return true;
//   } catch (error) {
//     console.error('Email sending error:', error);
//     return false;
//   }
// };