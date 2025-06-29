import { Button } from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";


function Header({currentPage, headerType}) {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
        root.classList.add("dark");
        } else {
        root.classList.remove("dark");
        }
    }, [darkMode]);
  return (
    <div className="flex items-center justify-between bg-white py-6 px-10 shadow-sm">
      {/* Breadcrumb + Title */}
      <div>
        <nav className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <span className="hover:underline cursor-pointer text-gray-900">{headerType.charAt(0).toUpperCase() + headerType.slice(1)}</span>
          <span className="text-gray-900">/</span>
          <span className="hover:underline cursor-pointer text-gray-900">Dashboard</span>
          <span className="text-gray-900">/</span>
          <span className="text-gray-900">{currentPage}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
            <div className="flex justify-end items-center gap-4">
            {/* <button className="flex items-center gap-1 text-blue-gray text-sm">
                <UserCircleIcon className="h-5 w-5" />
                <span>Sign In</span>
            </button> */}
            {/* <button className="text-blue-gray">
                <BellIcon className="h-5 w-5" />
            </button> */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                // dark:text-gray-300
                className="text-blue-gray"
                title="Toggle theme"
            >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button className="text-blue-gray">
                <Cog6ToothIcon className="h-5 w-5" />
            </button>
            </div>
      </div>
    </div>
  );
}

export default Header