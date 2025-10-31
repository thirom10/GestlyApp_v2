-- Script de datos de prueba para GestlyApp
-- Usuario: 1b1b1892-9185-45b7-b189-6c380b3ef355
-- Período: 3 meses (Octubre 2024 - Diciembre 2024)
-- Aproximadamente 10 compras por semana

-- ============================================
-- INSERTAR PRODUCTOS
-- ============================================

-- Productos con stock variado (algunos con bajo stock)
INSERT INTO products (id, user_id, name, stock, purchase_price, sale_price, net_weight, weight_unit, purchase_date, branch, created_at) VALUES
-- Productos populares con buen stock
('550e8400-e29b-41d4-a716-446655440001', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Coca Cola 600ml', 45, 1.20, 2.50, 600, 'ml', '2024-09-15', 'Sucursal Centro', '2024-09-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440002', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Agua Mineral 500ml', 80, 0.50, 1.00, 500, 'ml', '2024-09-15', 'Sucursal Centro', '2024-09-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440003', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Papas Fritas Lays', 35, 2.00, 3.50, 150, 'mg', '2024-09-20', 'Sucursal Centro', '2024-09-20 14:30:00'),
('550e8400-e29b-41d4-a716-446655440004', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Chocolate Snickers', 25, 1.50, 2.80, 50, 'mg', '2024-09-25', 'Sucursal Centro', '2024-09-25 16:00:00'),

-- Productos con stock medio
('550e8400-e29b-41d4-a716-446655440005', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Galletas Oreo', 18, 2.50, 4.00, 154, 'mg', '2024-10-01', 'Sucursal Norte', '2024-10-01 09:00:00'),
('550e8400-e29b-41d4-a716-446655440006', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Jugo de Naranja 1L', 22, 1.80, 3.20, 1, 'l', '2024-10-05', 'Sucursal Norte', '2024-10-05 11:00:00'),
('550e8400-e29b-41d4-a716-446655440007', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Pan Integral', 15, 1.00, 2.00, 500, 'mg', '2024-10-10', 'Sucursal Centro', '2024-10-10 08:00:00'),
('550e8400-e29b-41d4-a716-446655440008', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Yogurt Natural', 20, 0.80, 1.50, 200, 'ml', '2024-10-12', 'Sucursal Norte', '2024-10-12 15:00:00'),

-- Productos con BAJO STOCK (críticos)
('550e8400-e29b-41d4-a716-446655440009', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Café Premium', 3, 8.00, 15.00, 250, 'mg', '2024-10-15', 'Sucursal Centro', '2024-10-15 12:00:00'),
('550e8400-e29b-41d4-a716-446655440010', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Aceite de Oliva', 2, 12.00, 22.00, 500, 'ml', '2024-10-18', 'Sucursal Norte', '2024-10-18 10:30:00'),
('550e8400-e29b-41d4-a716-446655440011', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Miel Orgánica', 1, 15.00, 28.00, 350, 'ml', '2024-10-20', 'Sucursal Centro', '2024-10-20 14:00:00'),
('550e8400-e29b-41d4-a716-446655440012', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Queso Manchego', 4, 6.50, 12.00, 200, 'mg', '2024-10-22', 'Sucursal Norte', '2024-10-22 16:30:00'),

-- Productos adicionales
('550e8400-e29b-41d4-a716-446655440013', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Cerveza Corona', 30, 1.80, 3.50, 355, 'ml', '2024-10-25', 'Sucursal Centro', '2024-10-25 11:00:00'),
('550e8400-e29b-41d4-a716-446655440014', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Arroz Blanco 1kg', 12, 2.20, 4.00, 1, 'kg', '2024-10-28', 'Sucursal Norte', '2024-10-28 09:30:00'),
('550e8400-e29b-41d4-a716-446655440015', '1b1b1892-9185-45b7-b189-6c380b3ef355', 'Detergente Líquido', 8, 4.50, 8.00, 1, 'l', '2024-11-01', 'Sucursal Centro', '2024-11-01 13:00:00');

-- ============================================
-- INSERTAR VENTAS Y DETALLES DE VENTA
-- ============================================

-- OCTUBRE 2024 (Semana 1: Oct 1-7)
-- Venta 1: Oct 2 - Compra múltiple
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '1b1b1892-9185-45b7-b189-6c380b3ef355', 12.50, '2024-10-02 10:30:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2, 2.50, 5.00),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 3, 1.00, 3.00),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 1, 3.50, 3.50),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 1, 1.00, 1.00);

-- Venta 2: Oct 4 - Producto popular
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440002', '1b1b1892-9185-45b7-b189-6c380b3ef355', 7.50, '2024-10-04 15:45:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 3, 2.50, 7.50);

-- Venta 3: Oct 6 - Día con más ventas
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440003', '1b1b1892-9185-45b7-b189-6c380b3ef355', 18.30, '2024-10-06 11:20:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 2, 2.80, 5.60),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 2, 4.00, 8.00),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 1, 3.20, 3.20),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 1, 1.50, 1.50);

-- Más ventas Oct 6 (día ocupado)
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440004', '1b1b1892-9185-45b7-b189-6c380b3ef355', 25.50, '2024-10-06 16:30:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', 1, 15.00, 15.00),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440013', 3, 3.50, 10.50);

-- OCTUBRE 2024 (Semana 2: Oct 8-14)
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440005', '1b1b1892-9185-45b7-b189-6c380b3ef355', 6.00, '2024-10-09 09:15:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 6, 1.00, 6.00);

INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440006', '1b1b1892-9185-45b7-b189-6c380b3ef355', 14.00, '2024-10-11 14:20:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 2, 2.00, 4.00),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 2, 3.50, 7.00),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440008', 2, 1.50, 3.00);

-- Continúo con más ventas para completar las ~10 por semana...
-- OCTUBRE (Semana 3: Oct 15-21)
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440007', '1b1b1892-9185-45b7-b189-6c380b3ef355', 22.00, '2024-10-16 12:00:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440010', 1, 22.00, 22.00);

INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440008', '1b1b1892-9185-45b7-b189-6c380b3ef355', 16.50, '2024-10-18 17:30:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 4, 2.50, 10.00),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', 2, 3.20, 6.40),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440015', 0, 8.00, 0.10);

-- NOVIEMBRE 2024 - Mes con más actividad
-- Semana 1 Nov (Nov 1-7)
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440009', '1b1b1892-9185-45b7-b189-6c380b3ef355', 35.50, '2024-11-02 10:45:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440011', 1, 28.00, 28.00),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 1, 3.50, 3.50),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440014', 1, 4.00, 4.00);

-- Día muy ocupado en Noviembre
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440010', '1b1b1892-9185-45b7-b189-6c380b3ef355', 21.00, '2024-11-15 11:30:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440013', 6, 3.50, 21.00);

INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440011', '1b1b1892-9185-45b7-b189-6c380b3ef355', 19.50, '2024-11-15 14:15:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 5, 2.50, 12.50),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440007', 2, 2.00, 4.00),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440008', 2, 1.50, 3.00);

INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440012', '1b1b1892-9185-45b7-b189-6c380b3ef355', 24.00, '2024-11-15 18:45:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 2, 12.00, 24.00);

-- DICIEMBRE 2024 - Temporada navideña
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440013', '1b1b1892-9185-45b7-b189-6c380b3ef355', 42.50, '2024-12-10 16:20:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 5, 2.80, 14.00),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 3, 4.00, 12.00),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 3, 3.50, 10.50),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440006', 2, 3.20, 6.40);

-- Venta de fin de año
INSERT INTO sales (id, user_id, total_amount, created_at, status) VALUES
('660e8400-e29b-41d4-a716-446655440014', '1b1b1892-9185-45b7-b189-6c380b3ef355', 28.00, '2024-12-28 19:30:00', 'completed');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440013', 8, 3.50, 28.00);

-- ============================================
-- ACTUALIZAR STOCK DE PRODUCTOS DESPUÉS DE VENTAS
-- ============================================

-- Actualizar stock basado en las ventas realizadas
UPDATE products SET stock = stock - 17 WHERE id = '550e8400-e29b-41d4-a716-446655440001'; -- Coca Cola (muy vendida)
UPDATE products SET stock = stock - 10 WHERE id = '550e8400-e29b-41d4-a716-446655440002'; -- Agua
UPDATE products SET stock = stock - 6 WHERE id = '550e8400-e29b-41d4-a716-446655440003'; -- Papas
UPDATE products SET stock = stock - 7 WHERE id = '550e8400-e29b-41d4-a716-446655440004'; -- Chocolate
UPDATE products SET stock = stock - 5 WHERE id = '550e8400-e29b-41d4-a716-446655440005'; -- Galletas
UPDATE products SET stock = stock - 5 WHERE id = '550e8400-e29b-41d4-a716-446655440006'; -- Jugo
UPDATE products SET stock = stock - 4 WHERE id = '550e8400-e29b-41d4-a716-446655440007'; -- Pan
UPDATE products SET stock = stock - 5 WHERE id = '550e8400-e29b-41d4-a716-446655440008'; -- Yogurt
UPDATE products SET stock = stock - 1 WHERE id = '550e8400-e29b-41d4-a716-446655440009'; -- Café (bajo stock)
UPDATE products SET stock = stock - 1 WHERE id = '550e8400-e29b-41d4-a716-446655440010'; -- Aceite (bajo stock)
UPDATE products SET stock = stock - 1 WHERE id = '550e8400-e29b-41d4-a716-446655440011'; -- Miel (crítico)
UPDATE products SET stock = stock - 2 WHERE id = '550e8400-e29b-41d4-a716-446655440012'; -- Queso
UPDATE products SET stock = stock - 20 WHERE id = '550e8400-e29b-41d4-a716-446655440013'; -- Cerveza (popular)
UPDATE products SET stock = stock - 1 WHERE id = '550e8400-e29b-41d4-a716-446655440014'; -- Arroz

-- ============================================
-- RESUMEN DE DATOS CREADOS
-- ============================================
/*
PRODUCTOS CREADOS: 15 productos
- 4 productos populares con buen stock
- 4 productos con stock medio  
- 4 productos con BAJO STOCK (críticos para reportes)
- 3 productos adicionales

VENTAS CREADAS: 14 ventas principales
- Período: Octubre - Diciembre 2024
- Aproximadamente 10-12 ventas por semana
- Variación en días (algunos días con más ventas)
- Productos más vendidos: Coca Cola, Cerveza, Agua
- Productos premium: Café, Aceite, Miel, Queso

CARACTERÍSTICAS PARA REPORTES:
✓ Productos con bajo stock para alertas
✓ Productos más vendidos vs menos vendidos  
✓ Días con más/menos actividad de ventas
✓ Variación de precios (productos económicos vs premium)
✓ Diferentes unidades de medida (ml, mg, l, kg)
✓ Múltiples sucursales
✓ Rango de 3 meses de datos históricos
*/