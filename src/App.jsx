import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import React from 'react'
import Layout from "./components/Layout";
import HomePage from './pages/HomePage'
import MapviewPage from './pages/MapviewPage';
import RequestsviewPage from './pages/RequestsviewPage';
import CreateFormsPage from './pages/CreateFormsPage';
import EditFormsPage from './pages/EditFormsPage';
import ProfilePage from './pages/ProfilePage';

import ClientHomePage from './pages/ClientHomePage';
import ClientMapviewPage from './pages/ClientMapviewPage';
import ClientCreateFormsPage from './pages/ClientCreateFormsPage';

import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import VerificationPage from './pages/VerificationPage';
import HeroPage from './pages/HeroPage';

import CancelledPage from './pages/CancelledPage';
import NotificationPage from './pages/NotificationPage';


function App() {

  return (
    <Routes>
      {/* Auth */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/" element={<AuthPage />} />

      {/* Client Routes */}
      <Route
        path="client/dashboard/home"
        element={
          <Layout currentPage="Home" headerType="client">
            <ProtectedRoute role="client">
              <ClientHomePage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/mapview"
        element={
          <Layout currentPage="Map View" headerType="client">
            <ProtectedRoute role="client">
              <ClientMapviewPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/forms"
        element={
          <Layout currentPage="Create Forms" headerType="client">
            <ProtectedRoute role="client">
              <ClientCreateFormsPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/forms/edit"
        element={
          <Layout currentPage="Edit Forms" headerType="client">
            <ProtectedRoute role="client">
              <EditFormsPage type="client" />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/profile"
        element={
          <Layout currentPage="Profile">
            <ProtectedRoute role="client">
              <ProfilePage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/forms/cancel"
        element={
          <Layout currentPage="Cancel" headerType="client">
            <ProtectedRoute role="client">
              <CancelledPage type="client"/>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="client/dashboard/notification"
        element={
          <Layout currentPage="Notification" headerType="client">
            <ProtectedRoute role="client">
              <NotificationPage type="client"/>
            </ProtectedRoute>
          </Layout>
        }
      />
      

      {/* Admin Routes */}
      <Route
        path="admin/dashboard/home"
        element={
          <Layout currentPage="Home">
            <ProtectedRoute role="admin">
              <HomePage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/mapview"
        element={
          <Layout currentPage="Map View">
            <ProtectedRoute role="admin">
              <MapviewPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/maintenance-requests"
        element={
          <Layout currentPage="Maintenance Requests">
            <ProtectedRoute role="admin">
              <RequestsviewPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/forms"
        element={
          <Layout currentPage="Create Forms">
            <ProtectedRoute role="admin">
              <CreateFormsPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/forms/edit"
        element={
          <Layout currentPage="Edit Forms">
            <ProtectedRoute role="admin">
              <EditFormsPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/profile"
        element={
          <Layout currentPage="Profile">
            <ProtectedRoute role="admin">
              <ProfilePage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/forms/cancel"
        element={
          <Layout currentPage="Cancel">
            <ProtectedRoute role="admin">
              <CancelledPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="admin/dashboard/notification"
        element={
          <Layout currentPage="Notification">
            <ProtectedRoute role="admin">
              <NotificationPage type="admin"/>
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>


    
  )
}

export default App
