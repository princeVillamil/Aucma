import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext.jsx'
import 'leaflet/dist/leaflet.css';
import './index.css'

//Pages
import App from './App.jsx'

import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <Router>
          <App/>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
