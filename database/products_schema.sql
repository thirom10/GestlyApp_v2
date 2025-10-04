-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  purchase_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  net_weight DECIMAL(10,3),
  weight_unit VARCHAR(10) CHECK (weight_unit IN ('ml', 'mg', 'l', 'kg')),
  purchase_date DATE,
  branch VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propios productos
CREATE POLICY "Users can view their own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan insertar productos para sí mismos
CREATE POLICY "Users can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan actualizar sus propios productos
CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan eliminar sus propios productos
CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();