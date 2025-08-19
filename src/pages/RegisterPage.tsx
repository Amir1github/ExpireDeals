import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { ShoppingBag, Store, User as UserIcon } from 'lucide-react'

export function RegisterPage() {
  const { user, signUpWithEmail, signInWithGoogle } = useAuthContext()
  const [email, setEmail] = useState('')
  const [selectedType, setSelectedType] = useState<'buyer' | 'seller' | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleGoogleSignUp = async () => {
    if (!selectedType) {
      setStatus('Выберите тип пользователя')
      return
    }
    localStorage.setItem('pending_user_type', selectedType)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error with Google signup:', error)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    if (!selectedType) {
      setStatus('Выберите тип пользователя')
      return
    }
    localStorage.setItem('pending_user_type', selectedType)
    setSubmitting(true)
    try {
      await signUpWithEmail(email)
      setStatus('Мы отправили письмо для подтверждения. Проверьте почту.')
    } catch (error) {
      console.error('Email sign-up error:', error)
      setStatus('Не удалось отправить письмо. Попробуйте ещё раз.')
      localStorage.removeItem('pending_user_type')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="text-green-600 mr-2" size={40} />
            <h1 className="text-2xl font-bold text-gray-800">Регистрация</h1>
          </div>
          <p className="text-gray-600">Выберите тип и зарегистрируйтесь</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedType('buyer')}
            className={`border rounded-xl p-4 text-center transition ${selectedType === 'buyer' ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <UserIcon className="mx-auto mb-2 text-green-600" />
            <div className="font-medium">Покупатель</div>
            <div className="text-xs text-gray-500">Ищу скидки</div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('seller')}
            className={`border rounded-xl p-4 text-center transition ${selectedType === 'seller' ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <Store className="mx-auto mb-2 text-orange-500" />
            <div className="font-medium">Продавец</div>
            <div className="text-xs text-gray-500">Публикую распродажи</div>
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Зарегистрироваться через Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">или</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-70"
            >
              {submitting ? 'Отправка...' : 'Зарегистрироваться по почте'}
            </button>
            {status && (
              <p className="text-sm text-gray-600 text-center">{status}</p>
            )}
          </form>

          <div className="text-sm text-center text-gray-600">
            Уже есть аккаунт? <Link to="/auth" className="text-green-600 hover:underline">Войти</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Продолжая, вы соглашаетесь с условиями использования
        </div>
      </div>
    </div>
  )
}


