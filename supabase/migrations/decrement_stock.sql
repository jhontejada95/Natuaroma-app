-- ============================================================
-- MIGRACIÓN REQUERIDA: Función para decrementar stock
-- C-02: Stock nunca se decrementaba al completar un pago.
--
-- INSTRUCCIONES:
--   1. Abrir Supabase Dashboard → SQL Editor
--   2. Pegar y ejecutar este script completo
--   3. Verificar que la función aparece en Database → Functions
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id uuid,
  p_qty        int
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE products
  SET    stock = GREATEST(0, stock - p_qty)
  WHERE  id = p_product_id
    AND  stock > 0;
$$;

-- Índices recomendados (M-05)
-- Mejoran el rendimiento de las búsquedas más frecuentes.
-- Solo ejecutar si no existen — Supabase no tiene IF NOT EXISTS en CREATE INDEX en todas las versiones.

CREATE UNIQUE INDEX IF NOT EXISTS idx_wellness_access_email
  ON wellness_access (user_email);

CREATE INDEX IF NOT EXISTS idx_user_habits_user
  ON user_habits (user_id, habit_name);

CREATE INDEX IF NOT EXISTS idx_orders_email
  ON orders (customer_email);
