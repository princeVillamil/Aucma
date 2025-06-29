import React, { useState } from "react";
import { Link  } from "react-router-dom";
import {doSignOut} from "../firebase/auth"
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  WrenchScrewdriverIcon 
} from "@heroicons/react/24/outline";
 
function Navbar({headerType}) {
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
    <Card className="w-full max-w-[20rem] p-4 shadow-none">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Aucma Service
        </Typography>
      </div>
    <List>
      <Link to={`/${headerType}/dashboard/home`}>
        <ListItem>
          <ListItemPrefix>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
          Home
        </ListItem>
      </Link>
      <Link to={`/${headerType}/dashboard/mapview`}>
        <ListItem>
          <ListItemPrefix>
            <MapIcon  className="h-5 w-5" />
          </ListItemPrefix>
          Map View
        </ListItem>
      </Link>
      {(headerType=="admin")? 
        <Link to={`/${headerType}/dashboard/maintenance-requests`}>
          <ListItem>
            <ListItemPrefix>
              <WrenchScrewdriverIcon  className="h-5 w-5" />
            </ListItemPrefix>
            Requests
          </ListItem>
        </Link>
      :<></>}
      <Link to={`/${headerType}/dashboard/forms`}>
        <ListItem>
          <ListItemPrefix>
            <ClipboardDocumentListIcon  className="h-5 w-5" />
          </ListItemPrefix>
          Forms
        </ListItem>
      </Link>
      <hr className="my-2 border-blue-gray-50" />

      {/* Profile/Settings/Logout */}
      <Link to={`/${headerType}/dashboard/profile`}>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
      </Link>
      <ListItem onClick={handleSignOut} >
        <ListItemPrefix>
          <PowerIcon className="h-5 w-5" />
        </ListItemPrefix>
        Log Out
      </ListItem>
    </List>
      {/* <Alert open={openAlert} className="mt-auto" onClose={() => setOpenAlert(false)}>
        <CubeTransparentIcon className="mb-4 h-12 w-12" />
        <Typography variant="h6" className="mb-1">
          Upgrade to PRO
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          Upgrade to Material Tailwind PRO and get even more components, plugins, advanced features
          and premium.
        </Typography>
        <div className="mt-4 flex gap-3">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-medium opacity-80"
            onClick={() => setOpenAlert(false)}
          >
            Dismiss
          </Typography>
          <Typography as="a" href="#" variant="small" className="font-medium">
            Upgrade Now
          </Typography>
        </div>
      </Alert> */}
    </Card>
  );
}

export default Navbar
