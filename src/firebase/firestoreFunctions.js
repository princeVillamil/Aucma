import {db} from './firebase.js'
import emailjs from "@emailjs/browser";
import { collection, addDoc, getDocs, getDoc, serverTimestamp, doc, updateDoc, query, where, deleteDoc, arrayUnion} from "firebase/firestore";
// VITE_EMAILJS_SERVICE_ID=service_kvqdts5
// VITE_EMAILJS_TEMPLATE_ID=template_16ccyqj
// VITE_EMAILJS_PUBLIC_KEY=miNUXvjUMTUmrCixK
const SERVICE_ID = "service_kvqdts5";
const TEMPLATE_ID = "template_o2m35hk";
const PUBLIC_KEY = "miNUXvjUMTUmrCixK";

// Check if USER from DB
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
      // console.log({ id: docSnap.id, ...docSnap.data() }, "getDocumentById")
      console.log()
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
// Get Technicians List
export const getAllTechnicians = async () => {
  try {
    const usersRef = collection(db, "updatedUsers");
    const q = query(usersRef, where("isTechnician", "==", true));
    const querySnapshot = await getDocs(q);

    const technicians = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return technicians;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
// Get All of a User Req
export const getAllSingleUserReq = async (userID) => {
  try {
    const usersRef = collection(db, "updatedMaintenanceRequests");
    const q = query(usersRef, where("clientID", "==", userID));
    const querySnapshot = await getDocs(q);

    const technicians = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return technicians;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
// Create Maintenance Request
export const submitMaintenanceRequest = async(requestInfo) =>{
  try {
    const requestData = {
      clientID: requestInfo.clientID,
      clientName: requestInfo.clientName,
      contactNumber: requestInfo.contactNumber,
      address: requestInfo.address,
      clientAddress: "",
      issueDescription: requestInfo.issueDescription,
      preferredDate: requestInfo.preferredDate,
      preferredTime: requestInfo.preferredTime,
      technicianID: requestInfo.technicianID,
      technician: requestInfo.technician,
      status: requestInfo.status,
      createdAt: requestInfo.clientID,
      lat: requestInfo.lat,
      lng: requestInfo.lng,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "updatedMaintenanceRequests"), requestData);
    console.log("Maintenance request added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding maintenance request:", error);
    throw error;
  }
};
// Get All Maintenance Request
export const getAllMaintenanceRequest = async (role="admin") => {
  try {

    if(role=="admin"){
      const querySnapshot = await getDocs(collection(db, "updatedMaintenanceRequests"));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return docs;
    }else{
      console.log("client")
    }
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};
// Update DOC with ID in a Collection
export const updateMaintenanceRequest = async (collectionName, maintenanceRequestsID, updatedData) => {
  try {
    const docRef = doc(db, collectionName, maintenanceRequestsID);
    await updateDoc(docRef, updatedData);
    console.log(`Document '${maintenanceRequestsID}' in '${collectionName}' updated.`);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};
//
export const pushCancelMessage = async (requestID, cancelData) => {
  try {

    const requestRef = doc(db, "updatedUsers", requestID);
    await updateDoc(requestRef, {
      message: arrayUnion(cancelData),
    });
    await updateMaintenanceRequest("updatedMaintenanceRequests", cancelData.requestID, {status: "Cancelled"})
  } catch (error) {
    throw error;
  }
};
export const pushCancelMessageToRequest = async (requestID, cancelMessage) => {
  try {
    const requestRef = doc(db, "updatedMaintenanceRequests", requestID);
    await updateDoc(requestRef, {
      cancelledMessage: arrayUnion(cancelMessage),
      status: "Cancelled"
    });
  } catch (error) {
    throw error;
  }
};
// Get All User
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "updatedUsers"));
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docs;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};
// Email
export const sendEmail = async (data) => {
  const emailData = {
    to_name: "",
    to_email: "",
    from_name: "",
    from_email: "Company@Email.com",
    eta: data.preferredTime,
    technician_name: data.technician,
    issueDescription: data.issueDescription
  };

  try {
    const userData = await getDocumentById("updatedUsers", data.clientID);
    emailData.to_name = userData.fullName;
    emailData.to_email = userData.email;
    emailData.from_name = userData.technician;

    console.log("Sending email with data:", emailData);

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, PUBLIC_KEY);
    console.log("Email sent successfully:", result.text);

    return { success: true, message: result.text };
  } catch (error) {
    console.error("Email failed:", error);
    return { success: false, message: error.text || "Email send failed" };
  }
};
