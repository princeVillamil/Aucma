import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";

import { FingerPrintIcon } from "@heroicons/react/24/solid";

import { useAuth } from '../firebase/authContext.jsx'

import { Link } from "react-router-dom";

import { featuresData } from '../assets/data/featuresData'
import { contactData } from '../assets/data/contactData.js'
import AucmaFreezer from '../assets/imgs/AucmaFreezer.jpg'

import FeatureCard from '../components/featuresCard.jsx'
import Footer from '../components/footer.jsx'
import Navbar from '../components/navbar.jsx'



import BGImg from '../assets/imgs/bg.jpg'

function HomePage() {
  const { currentUser } = useAuth();


  return (
    <>
    <Navbar currentUser={currentUser}/>
    <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div style={{ backgroundImage: `url(${BGImg})` }} className="absolute top-0 h-full w-full bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                About Aucma Service Center
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                At Aucma Service Center, we specialize in expert maintenance and reliable repair services to keep your Aucma fridge running at its best.
              </Typography>
            </div>
          </div>
        </div>
    </div>

    <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuresData.map(({ color, title, icon, description }) => (
                    <FeatureCard
                    key={title}
                    color={color}
                    title={title}
                    icon={React.createElement(icon, {
                        className: "w-5 h-5 text-white",
                    })}
                    description={description}
                    />
                ))}
            </div>
            <div className="mt-32 flex flex-wrap items-center">
                <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
                <IconButton
                    variant="gradient"
                    size="lg"
                    color="gray"
                    className="pointer-events-none mb-6 rounded-full"
                >
                    <FingerPrintIcon className="h-8 w-8 text-white " />
                </IconButton>
                <Typography
                    variant="h3"
                    className="mb-3 font-bold"
                    color="blue-gray"
                >
                    Trusted Support for Aucma Operations
                </Typography>
                <Typography className="mb-8 font-normal text-blue-gray-500">
                    Aucma Service Center is the official support hub for all Aucma Warehouse operations. We ensure every unit runs efficiently with timely, expert servicing—exclusively for Aucma Warehouse use.
                    <br />
                    <br />
                    This platform simplifies service requests, tracking, and management across warehouse sites, helping reduce downtime and maintain high operational standards. From refrigeration systems to inventory equipment, we deliver fast, accurate, and transparent support tailored to Aucma’s standards.
                </Typography>
                {/* <Button variant="filled">read more</Button> */}
                </div>
                <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
                <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                    <CardHeader floated={false} className="relative h-56">
                    <img
                        alt="Card Image"
                        src={AucmaFreezer}
                        className="h-full w-full object-cover"
                    />
                    </CardHeader>
                    <CardBody>
                    <Typography variant="small" color="blue-gray" className="font-normal">Enterprise</Typography>
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-3 mt-2 font-bold"
                    >
                        Reliable Cold Storage Solutions
                    </Typography>
                    <Typography className="font-normal text-blue-gray-500">
                        Aucma fridges are designed for optimal performance and durability, keeping your products consistently cold even in demanding environments. Built with advanced cooling technology, they ensure energy efficiency, reliability, and long-term value for your business.
                    </Typography>
                    </CardBody>
                </Card>
                </div>
            </div>
        </div>
    </section>

    <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
            <div className="mx-auto w-full px-4 text-center lg:w-6/12">
                <Typography variant="lead" className="font-semibold">Co-Working</Typography>
                <Typography variant="h2" color="blue-gray" className="my-3">
                  Keep Your Operations Running
                </Typography>
                <Typography variant="lead" className="text-blue-gray-500">
                  The Aucma Service Center helps ensure that your warehouse equipment—especially refrigeration units—receives fast, reliable maintenance to minimize downtime and maximize efficiency.
                </Typography>
            </div>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
                <FeatureCard
                    key={title}
                    color="gray"
                    title={title}
                    icon={React.createElement(icon, {
                        className: "w-5 h-5 text-white",
                    })}
                    description={description}
                />
            ))}
          </div>
          <section className="py-6 rounded-lg shadow-lg shadow-gray-500/10">
            <div className="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
              <h1 className="text-5xl font-bold leading-none text-center">Sign up now</h1>
              <p className="text-xl font-medium text-center text-gray-500">Sign up now to become a partner. We’re ready when you are! A dedicated platform ensuring your Aucma refrigeration units and warehouse equipment receive expert maintenance— fast, efficient, and certified.</p>
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
              
                <Link to="/form" className="flex"><a className="px-8 py-3 text-lg font-normal border-b-2 border- hover:border-gray-900">Get started</a></Link>
                <Link to="/testimonials" className="flex"><a className="px-8 py-3 text-lg font-normal border-b-2 border- hover:border-gray-900">Learn more</a></Link>
              </div>
            </div>
          </section>
        </div>
    </section>

    <div className="bg-white">
        <Footer />
    </div>
    </>
  )
}

export default HomePage