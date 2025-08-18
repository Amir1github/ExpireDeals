import React, { useEffect, useRef, useState } from 'react'
// import { supabase } from '../lib/supabase'
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

export function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
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
          description: 'Свежие молочные продукты с истекающим сроком годности',
          image_url: null,
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
          description: 'Свежий хлеб, булочки, пирожки и другая выпечка со скидкой',
          image_url: null,
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
          description: 'Спелые фрукты и свежие овощи по выгодным ценам',
          image_url: null,
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
    initMap()
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && sales.length > 0) {
      addMarkers()
    }
  }, [sales])

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

  const initMap = () => {
    if (!mapRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 55.7558, lng: 37.6176 }, // Moscow center
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    mapInstanceRef.current = map

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          map.setCenter(userLocation)
          
          // Add user location marker
          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Ваше местоположение',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          })
        },
        () => {
          console.log('Geolocation not available')
        }
      )
    }
  }

  const addMarkers = () => {
    if (!mapInstanceRef.current) return

    sales.forEach((sale) => {
      const marker = new google.maps.Marker({
        position: { lat: sale.latitude, lng: sale.longitude },
        map: mapInstanceRef.current,
        title: sale.title,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#22C55E',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-800 mb-2">${sale.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${sale.description.substring(0, 100)}...</p>
            <div class="text-xs text-gray-500 mb-2">
              <div>Истекает: ${new Date(sale.expiry_date).toLocaleDateString('ru-RU')}</div>
              <div>${sale.location}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img src="${sale.profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face`}" 
                     class="w-6 h-6 rounded-full mr-2" />
                <span class="text-sm">${sale.profiles?.full_name || 'Продавец'}</span>
              </div>
              <a href="/sale/${sale.id}" 
                 class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Подробнее
              </a>
            </div>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker)
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Карта распродаж
        </h1>
        <p className="text-gray-600">
          Найдите ближайшие распродажи на карте
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div 
          ref={mapRef}
          className="w-full h-96 lg:h-[600px]"
        />
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Зеленые маркеры показывают активные распродажи</p>
        <p>Синий маркер показывает ваше местоположение</p>
      </div>
    </div>
  )
}