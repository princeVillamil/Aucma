import React, { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, getFriendlyAuthError, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../firebase/authContext.jsx";
import {checkIfAdmin} from "../firebase/firestoreFunctions.js"

import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function AuthPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [errorList, setErrorList] = useState([])
    const [type, setType] = useState("login");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "client",
    });

    useEffect(() => {
        const checkUserAndRedirect = async () => {
            if (currentUser && currentUser.emailVerified) {
            try {
                const isAdmin = await checkIfAdmin(currentUser.uid); // uid not id
                if (isAdmin) {
                    navigate("/admin/dashboard/home");
                } else {
                    navigate("/client/dashboard/home");
                }
            } catch (error) {
                console.error("Error checking role:", error);
            }
            }else if(currentUser && !currentUser.emailVerified) navigate("/verification");
        };

        checkUserAndRedirect();
    }, [currentUser, navigate]);

    const handleTabChange = (type) => {
        setForm({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        setErrorList([])
        setType(type)
    }
    function validateForm(form) {
        const errors = [];
        Object.entries(form).forEach(([key, value]) => {
            if (!value.trim()) {
            errors.push({
                type: "danger",
                title: `${key} is required`,
                message: `${key} is required`,
            });
            }
        });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            errors.push({
                type: "danger",
                title: `Invalid email format.`,
                message: `Invalid email format.`,
            });
        }
        if (form.password !== form.confirmPassword) {
            errors.push({
                type: "danger",
                title: `Password does not match.`,
                message: `Password does not match.`,
            });
        }
        console.log(errors)
        setErrorList(errors);
        return errors.length === 0;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        const errors = []
        e.preventDefault();
        if (type === "login") {
            setErrorList([]);
            try {
                const userCredential = await doSignInWithEmailAndPassword(form.email, form.password);
                const user = userCredential.user;

                if (!user.emailVerified) {
                    setErrorList(errors);

                    return;
                }

            } catch (error) {
                errors.push({
                    type: "danger",
                    title: getFriendlyAuthError(error),
                    message: getFriendlyAuthError(error),
                });
                setErrorList(errors);
            }
        } else {
            const newUser = {
                ...form,
            };
            if(!validateForm(newUser)) return

            try {
                const userCredential = await doCreateUserWithEmailAndPassword(newUser);
                navigate("/verification");
            } catch (error) {
                console.log(error);
                errors.push({
                    type: "danger",
                    title: `${getFriendlyAuthError(error)}`,
                    message: `${getFriendlyAuthError(error)}`,
                    })
                setErrorList(errors);
            }
        }
    };
    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        setErrorList([]);

        try {
            const userCredential = await doSignInWithGoogle();
            const user = userCredential.user;

            if (!user.emailVerified) {
            navigate("/verification");
            return;
            }

            const isAdmin = await checkIfAdmin(user.uid);

            if (isAdmin) {
            navigate("/admin/dashboard/home");
            } else {
            navigate("/client/dashboard/home");
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);

            setErrorList([
            {
                type: "danger",
                title: getFriendlyAuthError(error),
                message: getFriendlyAuthError(error),
            },
            ]);
        }
    };
  return (
    <Card className="w-full max-w-md mx-auto mt-12 shadow-xl">
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center bg-gray-900 px-4 py-6 text-center"
      >
        <Typography variant="h5" color="white">
          {type === "login" ? "Login" : "Register"}
        </Typography>
      </CardHeader>

      <CardBody>
        <Tabs value={type} className="overflow-visible">
          <TabsHeader className="relative z-0 mb-4">
            <Tab value="login" onClick={() => handleTabChange("login")}>
              Login
            </Tab>
            <Tab value="register" onClick={() => handleTabChange("register")}>
              Register
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value="login" className="p-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errorList.length >= 1 ? <Alert errorList={errorList} type="danger" /> : <></>}
                <Button type="submit" color="gray" fullWidth>
                  Login
                </Button>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-full border-t border-gray-300" />
                  <span className="bg-white px-2 text-xs text-gray-500 z-10">or</span>
                </div>
                <Button  onClick={(e)=>{onGoogleSignIn(e)}}  size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md border border-gray-900" fullWidth>
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
              </form>
            </TabPanel>

            <TabPanel value="register" className="p-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <Input
                  name="fullName"
                  label="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                {/* <Input
                  name="contactNumber"
                  label="Contact Number"
                  value={form.contactNumber}
                  onChange={handleChange}
                /> */}
                {/* <Input
                  name="address"
                  label="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                /> */}
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errorList.length >= 1 ? <Alert errorList={errorList} type="danger" /> : <></>}
                <Button type="submit" color="gray" fullWidth>
                  Register
                </Button>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-full border-t border-gray-300" />
                  <span className="bg-white px-2 text-xs text-gray-500 z-10">or</span>
                </div>
                <Button  onClick={(e)=>{onGoogleSignIn(e)}}  size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md border border-gray-900" fullWidth>
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
                <span>Register With Google</span>
                </Button>
              </form>
            </TabPanel>
          </TabsBody>
        </Tabs>

        <Typography
          variant="small"
          color="gray"
          className="mt-6 flex items-center justify-center gap-2 font-medium opacity-60"
        >
          <LockClosedIcon className="h-4 w-4" />
          Your credentials are secure
        </Typography>

      </CardBody>
    </Card>
  );
}
