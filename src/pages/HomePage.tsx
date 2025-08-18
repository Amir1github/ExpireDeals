import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { supabase } from '../lib/supabase'
import { Calendar, MapPin, Star } from 'lucide-react'
// import type { Database } from '../lib/database.types'

// type Sale = Database['public']['Tables']['sales']['Row'] & {
//   profiles: Database['public']['Tables']['profiles']['Row']
// }

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
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}
export function HomePage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // fetchSales()
    // Мокаем данные для тестирования
    setTimeout(() => {
      setSales([
        {
          id: '1',
          title: 'Молочные продукты со скидкой 50%',
          description: 'Свежие молочные продукты с истекающим сроком годности. Молоко, йогурты, творог, сыры. Все продукты проверены и безопасны для употребления.',
          image_url: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
          expiry_date: '2025-01-25',
          location: 'ул. Тверская, 15, Москва',
          latitude: 55.7558,
          longitude: 37.6176,
          seller_id: '1',
          created_at: '2025-01-18T10:00:00Z',
          profiles: {
            full_name: 'Магазин "Свежесть"',
            avatar_url: null
          }
        },
        {
          id: '2',
          title: 'Хлебобулочные изделия -40%',
          description: 'Свежий хлеб, булочки, пирожки и другая выпечка со скидкой. Идеально для завтрака или перекуса.',
          image_url: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
          expiry_date: '2025-01-20',
          location: 'пр. Мира, 45, Москва',
          latitude: 55.7749,
          longitude: 37.6354,
          seller_id: '2',
          created_at: '2025-01-18T12:00:00Z',
          profiles: {
            full_name: 'Пекарня "Золотой колос"',
            avatar_url: null
          }
        },
        {
          id: '3',
          title: 'Фрукты и овощи до 60% скидки',
          description: 'Спелые фрукты и свежие овощи по выгодным ценам. Бананы, яблоки, морковь, картофель и многое другое.',
          image_url: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
          expiry_date: '2025-01-22',
          location: 'ул. Арбат, 28, Москва',
          latitude: 55.7522,
          longitude: 37.5911,
          seller_id: '3',
          created_at: '2025-01-18T14:00:00Z',
          profiles: {
            full_name: 'Фермерский рынок',
            avatar_url: null
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // const fetchSales = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('sales')
  //       .select(`
  //         *,
  //         profiles (*)
  //       `)
  //       .order('created_at', { ascending: false })

  //     if (error) throw error
  //     setSales(data || [])
  //   } catch (error) {
  //     console.error('Error fetching sales:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Актуальные распродажи
        </h1>
        <p className="text-gray-600">
          Находите выгодные предложения на продукты с истекающим сроком годности
        </p>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Пока нет активных распродаж</p>
          <Link
            to="/create-sale"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Добавить распродажу
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {sale.image_url ? (
                  <img
                    src={sale.image_url}
                    alt={sale.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Calendar size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Распродажа
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {sale.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {sale.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2" size={16} />
                    Истекает: {formatDate(sale.expiry_date)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2" size={16} />
                    {sale.location}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={sale.profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                      alt=""
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {sale.profiles?.full_name || 'Продавец'}
                    </span>
                  </div>
                  
                  <Link
                    to={`/sale/${sale.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}