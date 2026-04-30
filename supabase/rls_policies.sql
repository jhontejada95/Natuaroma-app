-- ============================================================
-- Natuaroma — Habilitar RLS + Políticas de seguridad
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-04-29
-- ============================================================

-- ============================================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. PROFILES
--    • Cada usuario lee/actualiza su propio perfil.
--    • El trigger de Supabase que crea perfiles en auth.users
--      corre como SECURITY DEFINER → bypasea RLS.
--    • Admins leen cualquier perfil via service role (bypasea RLS).
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ============================================================
-- 3. CATEGORIES  — solo lectura pública
--    • Cualquiera puede leer categorías.
--    • Escritura solo vía service role (admin panel).
-- ============================================================
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;

CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (true);


-- ============================================================
-- 4. PRODUCTS  — solo lectura pública de productos activos
--    • Anon/autenticado puede leer productos con status='active'.
--    • Admin panel usa service role → bypasea RLS para ver todos.
-- ============================================================
DROP POLICY IF EXISTS "products_public_read_active" ON public.products;

CREATE POLICY "products_public_read_active"
  ON public.products FOR SELECT
  USING (status = 'active');


-- ============================================================
-- 5. ORDERS  — usuarios ven sus propias órdenes
--    • INSERT: solo service role (checkout server action).
--    • SELECT: usuario autenticado ve sus propias órdenes por email.
--    • UPDATE: solo service role (webhook MP).
--    • Admin panel usa service role → ve todo.
-- ============================================================
DROP POLICY IF EXISTS "orders_select_own"  ON public.orders;

CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND customer_email = auth.email()
  );


-- ============================================================
-- 6. ORDER_ITEMS  — usuarios ven items de sus propias órdenes
--    • INSERT/UPDATE: solo service role.
--    • SELECT: usuario autenticado cuyo email coincide con la orden.
-- ============================================================
DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;

CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND order_id IN (
      SELECT id FROM public.orders
      WHERE customer_email = auth.email()
    )
  );


-- ============================================================
-- NOTA: wellness_access ya tiene RLS manejado via service role
-- en todas las operaciones del servidor. No necesita políticas
-- adicionales para users ya que el acceso es solo server-side.
-- ============================================================
