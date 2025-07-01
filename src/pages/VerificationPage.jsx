import { useEffect } from "react";
import {doSignOut} from "../firebase/auth"
import { useAuth } from "../firebase/authContext.jsx";
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Button,
} from "@material-tailwind/react";

export default function VerificationPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    

    useEffect(()=>{
      const handleSignOut = async () => {
        try {
          if(currentUser){
            console.log("Logged OUt")
            await doSignOut();
          }
        } catch (error) {
          console.error("Sign out failed:", error);
        }
      };
      handleSignOut()
    },[])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-5 text-center">
        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
          Check your inbox
        </h2>
        <p className="mb-2 text-lg text-zinc-500">
          We are glad that you’re with us. We’ve sent you a verification link to
          the email address{" "}
          <span className="font-medium text-gray-900">
            mail@yourdomain.com
          </span>.
        </p>
        <Button type="text" onClick={() => navigate('/auth')}>
          Login →
        </Button>
      </div>
    </div>
  );
}
