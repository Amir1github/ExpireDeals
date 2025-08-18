import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { ShoppingBag, Store, User } from 'lucide-react'

export function SetupProfilePage() {
  const { createProfile } = useAuthContext()
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<'buyer' | 'seller' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType) return

    setLoading(true)
    try {
      await createProfile(selectedType)
      navigate('/')
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const userTypes = [
    {
      type: 'buyer' as const,
      title: 'Покупатель',
      description: 'Ищу выгодные распродажи и экономлю на покупках',
      icon: ShoppingBag,
      color: 'green'
    },
    {
      type: 'seller' as const,
      title: 'Продавец',
      description: 'Продаю продукты с истекающим сроком годности',
      icon: Store,
      color: 'orange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="text-green-600 mr-2" size={40} />
            <h1 className="text-2xl font-bold text-gray-800">Настройка профиля</h1>
          </div>
          <p className="text-gray-600">
            Выберите тип вашего аккаунта
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {userTypes.map((userType) => (
            <button
              key={userType.type}
              onClick={() => setSelectedType(userType.type)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedType === userType.type
                  ? `border-${userType.color}-500 bg-${userType.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <userType.icon 
                  className={`mx-auto mb-4 ${
                    selectedType === userType.type 
                      ? `text-${userType.color}-600` 
                      : 'text-gray-400'
                  }`} 
                  size={48} 
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {userType.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {userType.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedType || loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Создание профиля...' : 'Продолжить'}
        </button>
      </div>
    </div>
  )
}