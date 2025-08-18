import React, { ReactNode } from 'react'
// import { Navigate, useLocation } from 'react-router-dom'
// import { useAuthContext } from '../contexts/AuthContext'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  userType?: 'buyer' | 'seller'
}

export function AuthGuard({ children, requireAuth = true, userType }: AuthGuardProps) {
  // Временно отключаем аутентификацию для тестирования
  // const { user, profile, loading } = useAuthContext()
  // const location = useLocation()

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
  //     </div>
  //   )
  // }

  // if (requireAuth && !user) {
  //   return <Navigate to="/auth" state={{ from: location }} replace />
  // }

  // if (requireAuth && user && !profile) {
  //   return <Navigate to="/setup-profile" replace />
  // }

  // if (userType && profile?.user_type !== userType) {
  //   return <Navigate to="/" replace />
  // }

  return <>{children}</>
}