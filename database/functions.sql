-- Función para actualizar el stock de un producto
CREATE OR REPLACE FUNCTION update_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE products
    SET stock = stock - p_quantity
    WHERE id = p_product_id AND stock >= p_quantity;
    
    -- Verificar si se actualizó el producto
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hay suficiente stock disponible';
    END IF;
END;
$$ LANGUAGE plpgsql;