import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext.jsx'
import 'leaflet/dist/leaflet.css';
import './index.css'

//Pages
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import TestimonialPage from './pages/TestimonialPage.jsx'
import ClientPage from './pages/ClientPage.jsx';

import TestPage from './pages/TestPage.jsx'

import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/testimonials" element={<TestimonialPage />} />
          <Route path="/form" element={<ClientPage />} />

          {/* Might need to add only Admin access */}
          <Route path="/admin" element={<TestPage />} />
          {/* <Route path="/test" element={<TestPage />} /> */}

        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
