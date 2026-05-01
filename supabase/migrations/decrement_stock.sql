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
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET    stock = stock - p_qty
  WHERE  id = p_product_id
    AND  stock >= p_qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock insuficiente para el producto %', p_product_id;
  END IF;
END;
$$;

-- Decrementa el stock de una orden completa en una sola transaccion.
-- Si cualquier producto no tiene stock suficiente, la funcion hace ROLLBACK
-- de todos los decrementos y levanta una excepcion para que el webhook no
-- confirme una orden parcialmente descontada.
CREATE OR REPLACE FUNCTION decrement_order_stock(
  p_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT product_id, quantity
    FROM order_items
    WHERE order_id = p_order_id
    ORDER BY product_id
  LOOP
    PERFORM decrement_stock(item.product_id, item.quantity);
  END LOOP;
END;
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
