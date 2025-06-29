import { useEffect, useState, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/authContext.jsx";
import { sendEmailVerification } from "firebase/auth";
import { getDocumentById } from "../firebase/firestoreFunctions.js";
import Loading from "./Loading.jsx";

export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!currentUser) {
        navigate("/auth");
        return;
      }

      // Email not verified
      if (!currentUser.emailVerified) {
        try {
          await sendEmailVerification(currentUser);
        } catch (err) {
          console.error("Error sending verification email:", err);
        }
        navigate("/verification");
        return;
      }

      try {
        const data = await getDocumentById("updatedUsers", currentUser.uid);
        setUserData(data);
        if (role && data?.role && role !== data.role) {
          navigate(`/${data.role}/dashboard/home`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [currentUser, role, navigate]);

  if (loading || !userData) return <Loading />;

  return cloneElement(children, { userData });
}
