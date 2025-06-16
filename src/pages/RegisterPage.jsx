import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react"; 
import { Link } from "react-router-dom";
import { useState } from "react";


import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/authContext.jsx'
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth.js'


import AucmaLogo from '../assets/imgs/AucmaLogo.png'


function RegisterPage() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  //add later
  const [errorMessage, setErrorMessage] = useState('')
    const onSubmit = async (e) => {
      console.log("working")
    e.preventDefault();
    const passwordRegex = /^(?=.*\d).{6,}$/; // Ensures at least 6 chars & one digit
    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must be at least 6 characters long and contain at least one number.");
      return;
    }
    // if (password !== confirmPassword) {
    //   setErrorMessage("Passwords do not match.");
    //   return;
    // }
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigate("/"); 
      } catch (error) {
        setErrorMessage(error.message); 
        setIsRegistering(false); 
      }
    }
  };

  // const onGoogleSignIn = (e)=>{
  //   e.preventDefault()
  //   if(!isRegistering){
  //     setIsRegistering(true)
  //     doSignInWithGoogle().catch(err=>{
  //       setIsRegistering(false)
  //       console.log(err)
  //     })
  //   }
  // }
  
  return (
    <section className="h-screen flex">
      {userLoggedIn && (<Navigate to={'/'} replace={true}/>)}
        <div className="w-2/5 hidden lg:block items-center justify-center">
            <img
            src={AucmaLogo}
            className="h-full w-full object-cover"
            />
        </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <form  onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              required
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              disabled={isRegistering} 
              value={password} 
              onChange={(e) => { setPassword(e.target.value) }} 
              minLength="6" 
              pattern="^(?=.*\d).{6,}$" 
              title="Password must be at least 6 characters long and contain at least one number." 
              name="password" 
              id="password"
              required  
              type="password"
              size="lg"
              placeholder="••••••••"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                lassName: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {errorMessage && (
              <span className='text-red-600 font-bold'>{isRegistering ? "redirecting" : errorMessage}</span>
          )}
          <Button type="submit" disabled={isRegistering} id='registerBTN' typ className="mt-6" fullWidth>
            Register Now
          </Button>

          <div className="space-y-4 mt-8">
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/login" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>

      </div>
    </section>

  )
}

export default RegisterPage