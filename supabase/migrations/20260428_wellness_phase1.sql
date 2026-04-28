-- ===================================================
-- NATUAROMA WELLNESS APP - Phase 1 Migration
-- Run in Supabase SQL Editor
-- ===================================================

-- 1. Agregar columnas a orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS early_access_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;

-- 2. Tabla wellness_access (codigos de acceso Early Access)
CREATE TABLE IF NOT EXISTS wellness_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  code text UNIQUE NOT NULL,
  activated_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '1 year'),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellness_access_code ON wellness_access(code);
CREATE INDEX IF NOT EXISTS idx_wellness_access_user_email ON wellness_access(user_email);
CREATE INDEX IF NOT EXISTS idx_wellness_access_order_id ON wellness_access(order_id);

-- RLS
ALTER TABLE wellness_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access"
  ON wellness_access FOR SELECT
  USING (auth.uid() = user_id OR user_email = auth.email());

CREATE POLICY "Service role full access"
  ON wellness_access FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Tabla wellness_content (biblioteca de contenido)
CREATE TABLE IF NOT EXISTS wellness_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('meditation', 'guide', 'habit', 'recipe', 'video')),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content_body text,
  media_url text,
  thumbnail_url text,
  category text,
  tags text[],
  duration_minutes int,
  sort_order int DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellness_content_type ON wellness_content(type);
CREATE INDEX IF NOT EXISTS idx_wellness_content_category ON wellness_content(category);
CREATE INDEX IF NOT EXISTS idx_wellness_content_published ON wellness_content(is_published);

ALTER TABLE wellness_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wellness users can view published content"
  ON wellness_content FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM wellness_access wa
      WHERE (wa.user_id = auth.uid() OR wa.user_email = auth.email())
        AND wa.activated_at IS NOT NULL
        AND (wa.expires_at IS NULL OR wa.expires_at > now())
    )
  );

CREATE POLICY "Admins can manage content"
  ON wellness_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Tabla user_habits (habitos y racha del usuario)
CREATE TABLE IF NOT EXISTS user_habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_name text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  streak_count int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_habits_user_id ON user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_habits_completed ON user_habits(user_id, completed_at);

ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own habits"
  ON user_habits FOR ALL
  USING (auth.uid() = user_id);

-- 5. Agregar role 'wellness' al check en profiles (si existe el constraint)
-- Primero revisar si existe el constraint y actualizarlo:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('admin', 'customer', 'wellness'));
  END IF;
END $$;

-- 6. Agregar columna wellness_role a profiles para acceso granular
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS wellness_active boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS wellness_code text;

-- ===================================================
-- SEED: Contenido inicial de ejemplo
-- ===================================================
INSERT INTO wellness_content (type, title, slug, description, category, duration_minutes, sort_order, is_published)
VALUES
  ('meditation', 'Meditacion de Bienvenida', 'meditacion-bienvenida', 'Introduce tu cuerpo y mente al mundo del bienestar natural', 'inicio', 10, 1, true),
  ('guide', 'Guia de Aromaterapia para Dormir', 'aromaterapia-sueno', 'Aprende a usar aceites esenciales para mejorar tu descanso', 'aceites', 15, 2, true),
  ('guide', 'Los 5 Aceites Esenciales que Todo Hogar Necesita', 'aceites-esenciales-esenciales', 'Descubre el poder de la lavanda, eucalipto y mas', 'aceites', 10, 3, true),
  ('meditation', 'Respiracion 4-7-8 con Vela Aromatica', 'respiracion-478', 'Tecnica de respiracion para reducir ansiedad', 'tecnicas', 8, 4, true),
  ('habit', 'Rutina Matutina con Aromaterapia', 'rutina-matutina', 'Establece habitos saludables con esencias naturales', 'habitos', 20, 5, true)
ON CONFLICT (slug) DO NOTHING;
