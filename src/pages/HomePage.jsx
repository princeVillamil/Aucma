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

import { featuresData } from '../assets/data/featuresData'
import { contactData } from '../assets/data/contactData.js'

import FeatureCard from '../components/featuresCard.jsx'
import Footer from '../components/footer.jsx'
import Navbar from '../components/navbar.jsx'

import LoginPage from './LoginPage.jsx'


function HomePage() {
  const { currentUser } = useAuth();

  return (
    <>
    <Navbar currentUser={currentUser}/>
    <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Your story starts with us.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                This is a simple example of a Landing Page you can build using
                Material Tailwind. It features multiple components based on the
                Tailwind CSS and Material Design by Google.
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
                    Working with us is a pleasure
                </Typography>
                <Typography className="mb-8 font-normal text-blue-gray-500">
                    Don't let your uses guess by attaching tooltips and popoves to
                    any element. Just make sure you enable them first via
                    JavaScript.
                    <br />
                    <br />
                    The kit comes with three pre-built pages to help you get started
                    faster. You can change the text and images and you're good to
                    go. Just make sure you enable them first via JavaScript.
                </Typography>
                <Button variant="filled">read more</Button>
                </div>
                <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
                <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                    <CardHeader floated={false} className="relative h-56">
                    <img
                        alt="Card Image"
                        src="/img/teamwork.png"
                        className="h-full w-full"
                    />
                    </CardHeader>
                    <CardBody>
                    <Typography variant="small" color="blue-gray" className="font-normal">Enterprise</Typography>
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-3 mt-2 font-bold"
                    >
                        Top Notch Services
                    </Typography>
                    <Typography className="font-normal text-blue-gray-500">
                        The Arctic Ocean freezes every winter and much of the
                        sea-ice then thaws every summer, and that process will
                        continue whatever happens.
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
                    Build something
                </Typography>
                <Typography variant="lead" className="text-blue-gray-500">
                    Put the potentially record low maximum sea ice extent tihs year down
                    to low ice. According to the National Oceanic and Atmospheric
                    Administration, Ted, Scambos.
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
            <div className="mx-auto w-full px-4 text-center lg:w-6/12">
                <Typography variant="lead" className="font-semibold">Contact Us</Typography>
                <Typography variant="h2" color="blue-gray" className="my-3">
                    Want to work with us?
                </Typography>
                <Typography variant="lead" className="text-blue-gray-500">
                    Complete this form and we will get back to you in 24 hours.
                </Typography>
            </div>
          <form className="mx-auto w-full mt-12 lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Full Name" />
              <Input variant="outlined" size="lg" label="Email Address" />
            </div>
            <Textarea variant="outlined" size="lg" label="Message" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Send Message
            </Button>
          </form>
        </div>
    </section>

    <div className="bg-white">
        <Footer />
    </div>
    </>
  )
}

export default HomePage