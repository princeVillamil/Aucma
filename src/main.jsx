import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './index.css'

//Pages
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

import TestPage from './pages/TestPage.jsx'

import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Might need to add only Admin access */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
)
