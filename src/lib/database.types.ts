export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          user_type: 'buyer' | 'seller'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          user_type: 'buyer' | 'seller'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'buyer' | 'seller'
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
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
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          expiry_date: string
          location: string
          latitude: number
          longitude: number
          seller_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          expiry_date?: string
          location?: string
          latitude?: number
          longitude?: number
          seller_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          sale_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          sale_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          sale_id?: string
          user_id?: string
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          rating: number
          seller_id: string
          buyer_id: string
          sale_id: string
          created_at: string
        }
        Insert: {
          id?: string
          rating: number
          seller_id: string
          buyer_id: string
          sale_id: string
          created_at?: string
        }
        Update: {
          id?: string
          rating?: number
          seller_id?: string
          buyer_id?: string
          sale_id?: string
          created_at?: string
        }
      }
    }
  }
}