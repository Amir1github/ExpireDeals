import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AuthGuard } from './components/AuthGuard'
import { Layout } from './components/Layout'

// Pages
import { AuthPage } from './pages/AuthPage'
import { RegisterPage } from './pages/RegisterPage'
import { SetupProfilePage } from './pages/SetupProfilePage'
import { HomePage } from './pages/HomePage'
import { MapPage } from './pages/MapPage'
import { CreateSalePage } from './pages/CreateSalePage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/setup-profile" 
            element={
              <AuthGuard requireAuth>
                <SetupProfilePage />
              </AuthGuard>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <AuthGuard requireAuth>
                <Layout>
                  <HomePage />
                </Layout>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/map" 
            element={
              <AuthGuard requireAuth>
                <Layout>
                  <MapPage />
                </Layout>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/create-sale" 
            element={
              <AuthGuard requireAuth userType="seller">
                <Layout>
                  <CreateSalePage />
                </Layout>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <AuthGuard requireAuth>
                <Layout>
                  <ProfilePage />
                </Layout>
              </AuthGuard>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App