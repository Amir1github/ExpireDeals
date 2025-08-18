import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAuthContext } from '../contexts/AuthContext'
// import { supabase } from '../lib/supabase'
import { Upload, MapPin, Calendar } from 'lucide-react'

export function CreateSalePage() {
  // const { user } = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    expiryDate: '',
    location: '',
    latitude: 0,
    longitude: 0
  })

  // Мокаем пользователя для тестирования
  const mockUser = { id: 'test-user-id' }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const geocoder = new google.maps.Geocoder()
      return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location
            resolve({
              lat: location.lat(),
              lng: location.lng()
            })
          } else {
            reject(new Error('Не удалось найти координаты адреса'))
          }
        })
      })
    } catch (error) {
      console.error('Error geocoding address:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mockUser) return

    setLoading(true)
    try {
      // Get coordinates from address
      const coordinates = await getCoordinatesFromAddress(formData.location)

      // Мокаем создание поста для тестирования
      console.log('Создание поста:', {
        title: formData.title,
        description: formData.description,
        image_url: formData.imageUrl || null,
        expiry_date: formData.expiryDate,
        location: formData.location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        seller_id: mockUser.id
      })

      // const { error } = await supabase
      //   .from('sales')
      //   .insert({
      //     title: formData.title,
      //     description: formData.description,
      //     image_url: formData.imageUrl || null,
      //     expiry_date: formData.expiryDate,
      //     location: formData.location,
      //     latitude: coordinates.lat,
      //     longitude: coordinates.lng,
      //     seller_id: user.id
      //   })

      // if (error) throw error

      alert('Пост успешно создан! (тестовый режим)')

      navigate('/')
    } catch (error) {
      console.error('Error creating sale:', error)
      alert('Ошибка при создании поста: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // Reverse geocoding to get address
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === 'OK' && results?.[0]) {
                  setFormData(prev => ({
                    ...prev,
                    location: results[0].formatted_address,
                    latitude,
                    longitude
                  }))
                }
              }
            )
          } catch (error) {
            console.error('Error getting location:', error)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Не удалось получить ваше местоположение')
        }
      )
    } else {
      alert('Геолокация не поддерживается вашим браузером')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Создать пост о распродаже
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Название распродажи *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Например: Молочные продукты со скидкой 50%"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Опишите товары, цены, условия..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Ссылка на фото
            </label>
            <div className="flex items-center">
              <Upload className="text-gray-400 mr-2" size={20} />
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Дата истечения срока годности *
            </label>
            <div className="flex items-center">
              <Calendar className="text-gray-400 mr-2" size={20} />
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Местоположение *
            </label>
            <div className="flex items-center space-x-2">
              <MapPin className="text-gray-400" size={20} />
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Введите адрес"
              />
              <button
                type="button"
                onClick={handleLocationClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Моё местоположение
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}