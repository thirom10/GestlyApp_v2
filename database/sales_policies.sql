-- Habilitar RLS para las tablas
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción en la tabla sales
DROP POLICY IF EXISTS "Users can insert their own sales" ON sales;
CREATE POLICY "Enable insert for authenticated users"
ON sales FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para permitir lectura de ventas propias
CREATE POLICY "Users can view their own sales"
ON sales FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para permitir inserción en sale_items
CREATE POLICY "Users can insert sale items for their sales"
ON sale_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM sales
        WHERE sales.id = sale_items.sale_id
        AND sales.user_id = auth.uid()
    )
);

-- Política para permitir lectura de items de ventas propias
CREATE POLICY "Users can view their own sale items"
ON sale_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM sales
        WHERE sales.id = sale_items.sale_id
        AND sales.user_id = auth.uid()
    )
);