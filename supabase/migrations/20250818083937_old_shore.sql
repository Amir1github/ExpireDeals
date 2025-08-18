/*
  # Создание начальной схемы для ExpireDeals

  1. Новые таблицы
    - `profiles`
      - `id` (uuid, первичный ключ)
      - `email` (text, уникальный)
      - `full_name` (text, опциональный)
      - `avatar_url` (text, опциональный)
      - `user_type` (enum: 'buyer' или 'seller')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `sales` 
      - `id` (uuid, первичный ключ)
      - `title` (text)
      - `description` (text)
      - `image_url` (text, опциональный)
      - `expiry_date` (date)
      - `location` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `seller_id` (uuid, внешний ключ)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `comments`
      - `id` (uuid, первичный ключ)
      - `content` (text)
      - `sale_id` (uuid, внешний ключ)
      - `user_id` (uuid, внешний ключ)
      - `created_at` (timestamp)

    - `ratings`
      - `id` (uuid, первичный ключ)
      - `rating` (integer, 1-5)
      - `seller_id` (uuid, внешний ключ)
      - `buyer_id` (uuid, внешний ключ)
      - `sale_id` (uuid, внешний ключ)
      - `created_at` (timestamp)

  2. Безопасность
    - Включить RLS для всех таблиц
    - Добавить политики для аутентифицированных пользователей
    - Создать политики для продавцов и покупателей
*/

-- Создание типа для пользователей
CREATE TYPE user_type AS ENUM ('buyer', 'seller');

-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  user_type user_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица распродаж
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  expiry_date date NOT NULL,
  location text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица комментариев
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Таблица рейтингов
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seller_id, buyer_id, sale_id)
);

-- Включить RLS для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы profiles
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Политики для таблицы sales
CREATE POLICY "Anyone can read sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can insert sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'seller'
    )
  );

CREATE POLICY "Sellers can update their own sales"
  ON sales
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Sellers can delete their own sales"
  ON sales
  FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Политики для таблицы comments
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Политики для таблицы ratings
CREATE POLICY "Anyone can read ratings"
  ON ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can insert ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'buyer'
    )
  );

CREATE POLICY "Buyers can update their own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid());

-- Функции для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_sales_seller_id ON sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_sales_expiry_date ON sales(expiry_date);
CREATE INDEX IF NOT EXISTS idx_sales_location ON sales USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_comments_sale_id ON comments(sale_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_seller_id ON ratings(seller_id);
CREATE INDEX IF NOT EXISTS idx_ratings_buyer_id ON ratings(buyer_id);