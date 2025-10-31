-- Script para actualizar fechas de productos y ventas existentes
-- Cambia todas las fechas del 01/08/2025 hasta 31/10/2025
-- Usuario específico: 1b1b1892-9185-45b7-b189-6c380b3ef355

-- =====================================================
-- ACTUALIZACIÓN MASIVA DE FECHAS DE PRODUCTOS
-- =====================================================

-- 1. Actualizar fechas de productos
WITH product_updates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY id) as row_num,
    -- Distribuir en 92 días (del 1 de agosto al 31 de octubre de 2025)
    ('2025-08-01'::date + ((ROW_NUMBER() OVER (ORDER BY id) - 1) * 92 / (SELECT COUNT(*) FROM products WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'))::integer)::date as new_purchase_date,
    ('2025-08-01'::date + ((ROW_NUMBER() OVER (ORDER BY id) - 1) * 92 / (SELECT COUNT(*) FROM products WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'))::integer)::date + interval '10 hours' as new_created_at
  FROM products 
  WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'
)
UPDATE products 
SET 
  purchase_date = pu.new_purchase_date,
  created_at = pu.new_created_at,
  updated_at = NOW()
FROM product_updates pu
WHERE products.id = pu.id;

-- 2. Actualizar fechas de ventas
WITH sales_updates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY id) as row_num,
    -- Distribuir en 92 días (del 1 de agosto al 31 de octubre de 2025)
    ('2025-08-01'::date + ((ROW_NUMBER() OVER (ORDER BY id) - 1) * 92 / (SELECT COUNT(*) FROM sales WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'))::integer)::date + 
    interval '1 hour' * (ROW_NUMBER() OVER (ORDER BY id) % 12 + 8) as new_created_at
  FROM sales 
  WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'
)
UPDATE sales 
SET created_at = su.new_created_at
FROM sales_updates su
WHERE sales.id = su.id;

-- 3. Actualizar fechas de sale_items para que coincidan con sus ventas
UPDATE sale_items 
SET created_at = s.created_at
FROM sales s
WHERE sale_items.sale_id = s.id 
  AND s.user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355';

-- =====================================================
-- VERIFICACIONES
-- =====================================================

-- Verificar que no queden fechas de 2024
SELECT 'Productos con fechas 2024' as tabla, COUNT(*) as cantidad
FROM products 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355' 
  AND (EXTRACT(YEAR FROM purchase_date) = 2024 OR EXTRACT(YEAR FROM created_at) = 2024)

UNION ALL

SELECT 'Ventas con fechas 2024' as tabla, COUNT(*) as cantidad
FROM sales 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355' 
  AND EXTRACT(YEAR FROM created_at) = 2024

UNION ALL

SELECT 'Sale_items con fechas 2024' as tabla, COUNT(*) as cantidad
FROM sale_items si
JOIN sales s ON si.sale_id = s.id
WHERE s.user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355' 
  AND EXTRACT(YEAR FROM si.created_at) = 2024;

-- Verificar rango de fechas actualizado (debe ser 01/08/2025 - 31/10/2025)
SELECT 
  'Productos' as tabla,
  MIN(purchase_date) as fecha_minima,
  MAX(purchase_date) as fecha_maxima,
  COUNT(*) as total_registros
FROM products 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'

UNION ALL

SELECT 
  'Ventas' as tabla,
  MIN(created_at::date) as fecha_minima,
  MAX(created_at::date) as fecha_maxima,
  COUNT(*) as total_registros
FROM sales 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'

UNION ALL

SELECT 
  'Sale_items' as tabla,
  MIN(si.created_at::date) as fecha_minima,
  MAX(si.created_at::date) as fecha_maxima,
  COUNT(*) as total_registros
FROM sale_items si
JOIN sales s ON si.sale_id = s.id
WHERE s.user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355';

-- =====================================================
-- CONSULTA DETALLADA DE FECHAS PARA REVISIÓN
-- =====================================================

-- Mostrar un resumen de las fechas actualizadas
SELECT 
  'PRODUCTOS' as tabla,
  MIN(purchase_date) as fecha_minima,
  MAX(purchase_date) as fecha_maxima,
  COUNT(*) as total_registros
FROM products 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'

UNION ALL

SELECT 
  'VENTAS' as tabla,
  MIN(created_at::date) as fecha_minima,
  MAX(created_at::date) as fecha_maxima,
  COUNT(*) as total_registros
FROM sales 
WHERE user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355'

UNION ALL

SELECT 
  'SALE_ITEMS' as tabla,
  MIN(si.created_at::date) as fecha_minima,
  MAX(si.created_at::date) as fecha_maxima,
  COUNT(*) as total_registros
FROM sale_items si
JOIN sales s ON si.sale_id = s.id
WHERE s.user_id = '1b1b1892-9185-45b7-b189-6c380b3ef355';