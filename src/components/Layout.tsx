import React, { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { 
  Home, 
  Map, 
  Plus, 
  User, 
  LogOut, 
  ShoppingBag,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { signOut } = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (!key) continue
        if (key.startsWith('sb-') || key === 'pending_user_type') {
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('LocalStorage cleanup error:', error)
    }

    setSidebarOpen(false)
    navigate('/auth', { replace: true })
  }

  // Мокаем данные пользователя для тестирования
  const mockUser = { email: 'test@example.com' }
  const mockProfile = { 
    full_name: 'Тестовый пользователь', 
    user_type: 'seller' as const,
    avatar_url: null 
  }

  const navigation = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Карта', href: '/map', icon: Map },
    ...(mockProfile?.user_type === 'seller' 
      ? [{ name: 'Добавить пост', href: '/create-sale', icon: Plus }]
      : []
    ),
    { name: 'Профиль', href: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <ShoppingBag className="text-green-600 mr-3" size={32} />
            <h1 className="text-xl font-bold text-gray-800">ExpireDeals</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and sign out */}
          {mockUser && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <img
                  src={mockProfile?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                  alt=""
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {mockProfile?.full_name || mockUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {mockProfile?.user_type}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="mr-3" size={16} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}