import React, { useState, useEffect } from 'react'
// import { useAuthContext } from '../contexts/AuthContext'
// import { supabase } from '../lib/supabase'
import { Calendar, MapPin, Star, User, Store } from 'lucide-react'
// import type { Database } from '../lib/database.types'

// type Sale = Database['public']['Tables']['sales']['Row']

// Мокаем данные для тестирования
type Sale = {
  id: string
  title: string
  description: string
  image_url: string | null
  expiry_date: string
  location: string
  latitude: number
  longitude: number
  seller_id: string
  created_at: string
}

export function ProfilePage() {
  // const { user, profile } = useAuthContext()
  const [userSales, setUserSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  // Мокаем данные пользователя для тестирования
  const mockUser = { 
    id: 'test-user-id',
    email: 'test@example.com' 
  }
  const mockProfile = { 
    full_name: 'Тестовый продавец', 
    user_type: 'seller' as const,
    avatar_url: null 
  }
  useEffect(() => {
    if (mockUser && mockProfile?.user_type === 'seller') {
      // fetchUserSales()
      // Мокаем данные продаж для тестирования
      setTimeout(() => {
        setUserSales([
          {
            id: '1',
            title: 'Молочные продукты со скидкой 50%',
            description: 'Свежие молочные продукты с истекающим сроком годности. Молоко, йогурты, творог, сыры.',
            image_url: null,
            expiry_date: '2025-01-25',
            location: 'ул. Тверская, 15, Москва',
            latitude: 55.7558,
            longitude: 37.6176,
            seller_id: 'test-user-id',
            created_at: '2025-01-18T10:00:00Z'
          },
          {
            id: '2',
            title: 'Хлебобулочные изделия -40%',
            description: 'Свежий хлеб, булочки, пирожки и другая выпечка со скидкой.',
            image_url: null,
            expiry_date: '2025-01-20',
            location: 'пр. Мира, 45, Москва',
            latitude: 55.7749,
            longitude: 37.6354,
            seller_id: 'test-user-id',
            created_at: '2025-01-18T12:00:00Z'
          }
        ])
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [mockUser, mockProfile])

  // const fetchUserSales = async () => {
  //   if (!user) return

  //   try {
  //     const { data, error } = await supabase
  //       .from('sales')
  //       .select('*')
  //       .eq('seller_id', user.id)
  //       .order('created_at', { ascending: false })

  //     if (error) throw error
  //     setUserSales(data || [])
  //   } catch (error) {
  //     console.error('Error fetching user sales:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  if (!mockUser || !mockProfile) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center space-x-6">
          <img
            src={mockProfile.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face`}
            alt=""
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {mockProfile.full_name || mockUser.email}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              {mockProfile.user_type === 'seller' ? (
                <Store className="mr-2" size={20} />
              ) : (
                <User className="mr-2" size={20} />
              )}
              <span className="capitalize">{mockProfile.user_type}</span>
            </div>
            <p className="text-gray-600">
              {mockProfile.user_type === 'seller' 
                ? 'Продаю качественные продукты с истекающим сроком годности'
                : 'Ищу выгодные предложения и экономлю на покупках'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Statistics for Sellers */}
      {mockProfile.user_type === 'seller' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {userSales.length}
            </div>
            <div className="text-gray-600">Всего постов</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {userSales.filter(sale => new Date(sale.expiry_date) > new Date()).length}
            </div>
            <div className="text-gray-600">Активных</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2 flex items-center justify-center">
              <Star className="mr-1" size={24} />
              4.8
            </div>
            <div className="text-gray-600">Рейтинг</div>
          </div>
        </div>
      )}

      {/* User's Sales (for sellers) */}
      {mockProfile.user_type === 'seller' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Мои посты</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : userSales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">У вас пока нет постов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userSales.map((sale) => (
                <div key={sale.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {sale.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {sale.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(sale.expiry_date) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {new Date(sale.expiry_date) > new Date() ? 'Активный' : 'Истёк'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1" size={16} />
                      Истекает: {formatDate(sale.expiry_date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1" size={16} />
                      {sale.location}
                    </div>
                    <div>
                      Создан: {formatDate(sale.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Настройки аккаунта</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="text-gray-600">{mockUser.email}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полное имя
            </label>
            <div className="text-gray-600">
              {mockProfile.full_name || 'Не указано'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип аккаунта
            </label>
            <div className="text-gray-600 capitalize">
              {mockProfile.user_type === 'seller' ? 'Продавец' : 'Покупатель'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}