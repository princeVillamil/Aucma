import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";


export const doCreateUserWithEmailAndPassword = async (userDetails) => {
  const {
    fullName,
    email,
    password,
    contactNumber = null,
    address = null,
    isTechnician = false, 
    role = "client",      
    message = [] 
  } = userDetails;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent to:", user.email);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    await setDoc(doc(db, "updatedUsers", user.uid), {
      fullName,
      email,
      contactNumber,
      address,
      role,
      isTechnician,
      message,
      createdAt: serverTimestamp(),
    });

    return userCredential;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async(email, password) =>{
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "updatedUsers", user.uid);
    const userSnap = await getDoc(userRef);

    // If the user doesn't exist in Firestore, add them
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        fullName: user.displayName || "",
        email: user.email,
        contactNumber: null,     
        address: null,           
        role: "client",          
        isTechnician: false,
        message: [],
        createdAt: serverTimestamp(),
      });
      console.log("Google user added to Firestore.");
    } else {
      console.log("User already exists in Firestore.");
    }

    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const doSignOut = () =>{
  return auth.signOut();
};
export function getFriendlyAuthError(error) {
  const errorCode = error?.code || error;

  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is not valid.";

    case "auth/invalid-credential":
    case "auth/internal-error":
      return "Invalid email or password. Please try again.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/operation-not-allowed":
      return "This sign-in method is currently disabled. Please contact support.";

    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";

    case "auth/weak-password":
      return "Your password is too weak. It must be at least 6 characters.";

    case "auth/user-not-found":
      return "No account found with that email.";

    case "auth/wrong-password":
      return "Incorrect password. Please try again.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";

    case "auth/popup-closed-by-user":
      return "The sign-in popup was closed before completing sign in.";

    case "auth/popup-blocked":
      return "The sign-in popup was blocked by your browser.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but a different sign-in method.";

    case "auth/requires-recent-login":
      return "Please log in again to continue with this action.";

    default:
      return "An unknown error occurred. Please try again.";
  }
}



//Add Later
export const doPasswordReset = (email) =>{
  return sendPasswordResetEmail(auth, email);
};
export const doPasswordChange = (password) =>{
  return updatePassword(auth.currentUser, password)
};
export const doSendEmailVerification = () =>{
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`
  })
}