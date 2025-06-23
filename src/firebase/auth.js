import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";


export const doCreateUserWithEmailAndPassword = async(email, password) =>{
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  try {
    await sendEmailVerification(user);
    console.log("Verification email sent.", user);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "client",
      emailVerified: false,
      createdAt: serverTimestamp()
    });
    console.log("User saved!");
  } catch (error) {
    console.error("Firestore write error:", error);
  }

  return userCredential;
};

export const doSignInWithEmailAndPassword = async(email, password) =>{
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async()=>{
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Reference to the Firestore user document
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // If the user doesn't exist in Firestore, add them
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        role: "client", // adjust as needed
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
export function getFriendlyAuthError(errorCode) {
  switch (errorCode) {
    // Sign In + Sign Up common
    case "auth/invalid-email":
      return "The email address is not valid.";

    case "auth/invalid-credential":
    case "auth/internal-error":
      return "Something went wrong. Please try again.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/operation-not-allowed":
      return "This sign-in method is currently disabled. Please contact support.";

    // Sign Up specific
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";

    case "auth/weak-password":
      return "Your password is too weak. It must be at least 6 characters.";

    // Sign In specific
    case "auth/user-not-found":
      return "No account found with that email.";

    case "auth/wrong-password":
      return "Incorrect password. Please try again.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";

    // OAuth / Popup related
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