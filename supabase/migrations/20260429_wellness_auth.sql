-- ============================================================
-- Natuaroma Wellness Auth v2
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Nuevas columnas en wellness_access
ALTER TABLE wellness_access
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS password_set      BOOLEAN DEFAULT FALSE;

-- 2. Tabla de perfiles de usuario (si no existe)
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT,
  full_name          TEXT,
  wellness_active    BOOLEAN DEFAULT FALSE,
  marketing_consent  BOOLEAN DEFAULT FALSE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuarios ven y editan solo su propio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- 3. Actualizar perfiles de usuarios que ya existen
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICACION: correr esto para confirmar
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'wellness_access'
--   AND column_name IN ('marketing_consent', 'password_set');
-- ============================================================
