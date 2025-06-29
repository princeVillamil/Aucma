import React from "react";
import { Link } from "react-router-dom";
import {doSignOut} from "../firebase/auth"
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Button,
} from "@material-tailwind/react";

export default function VerificationPage() {
    const navigate = useNavigate();
    const handleSignOut = async () => {
      try {
        await doSignOut();
        navigate('/auth');     
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    };
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
        <Button type="text"
          onClick={handleSignOut}
          className="mt-3 inline-block w-96 rounded bg-gray-900 px-5 py-3 font-medium text-white shadow-xl hover:bg-gray-800"
        >
          Login →
        </Button>
      </div>
    </div>
  );
}
