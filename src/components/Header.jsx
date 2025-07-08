import { useEffect, useState } from "react";
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";
import { downloadChartsAsPDF } from "../components/ExportToPDF";

function Header({ currentPage, headerType }) {
  const [darkMode, setDarkMode] = useState(false);
  const [triggerExport, setTriggerExport] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const hideDownloadPages = [
    "mapview",
    "forms",
    "profile",
    "home",
    "notification",
  ];
  const normalizedPage = currentPage
    ?.toLowerCase()
    .replace(/\s+/g, "")
    .replace("page", "")
    .trim();

  const shouldHideDownload = hideDownloadPages.some((page) =>
    normalizedPage.includes(page)
  );

  const handleExportToPDF = () =>
    downloadChartsAsPDF("export-all-charts", currentPage);

  return (
    <div className="flex items-center justify-between bg-white py-6 px-10 shadow-sm">
      {/* Breadcrumb + Title */}
      <div>
        <nav className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <span className="hover:underline cursor-pointer text-gray-900">
            {headerType.charAt(0).toUpperCase() + headerType.slice(1)}
          </span>
          <span className="text-gray-900">/</span>
          <span className="hover:underline cursor-pointer text-gray-900">
            Dashboard
          </span>
          <span className="text-gray-900">/</span>
          <span className="text-gray-900">{currentPage}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        {!shouldHideDownload && (
          <button
            onClick={handleExportToPDF}
            className="text-gray-700"
            title="Download PDF"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-blue-gray"
          title="Toggle theme"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        <button className="text-blue-gray">
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default Header;
