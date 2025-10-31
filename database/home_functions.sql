-- Función para obtener el producto más vendido por usuario
CREATE OR REPLACE FUNCTION get_most_sold_product(user_id_param UUID)
RETURNS TABLE (
  product JSONB,
  total_sold BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'stock', p.stock,
      'price', p.price,
      'user_id', p.user_id
    ) AS product,
    SUM(si.quantity) AS total_sold
  FROM 
    sale_items si
  JOIN 
    sales s ON si.sale_id = s.id
  JOIN 
    products p ON si.product_id = p.id
  WHERE 
    p.user_id = user_id_param
  GROUP BY 
    p.id
  ORDER BY 
    total_sold DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de ventas
CREATE OR REPLACE FUNCTION get_sales_stats(user_id_param UUID)
RETURNS TABLE (
  weekly_revenue NUMERIC,
  weekly_change NUMERIC,
  monthly_revenue NUMERIC,
  monthly_change NUMERIC
) AS $$
DECLARE
  current_week_revenue NUMERIC;
  previous_week_revenue NUMERIC;
  current_month_revenue NUMERIC;
  previous_month_revenue NUMERIC;
BEGIN
  -- Ingresos de la semana actual
  SELECT COALESCE(SUM(s.total), 0) INTO current_week_revenue
  FROM sales s
  WHERE s.user_id = user_id_param
    AND s.created_at >= date_trunc('week', CURRENT_DATE)
    AND s.created_at < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week';

  -- Ingresos de la semana anterior
  SELECT COALESCE(SUM(s.total), 0) INTO previous_week_revenue
  FROM sales s
  WHERE s.user_id = user_id_param
    AND s.created_at >= date_trunc('week', CURRENT_DATE) - INTERVAL '1 week'
    AND s.created_at < date_trunc('week', CURRENT_DATE);

  -- Ingresos del mes actual
  SELECT COALESCE(SUM(s.total), 0) INTO current_month_revenue
  FROM sales s
  WHERE s.user_id = user_id_param
    AND s.created_at >= date_trunc('month', CURRENT_DATE)
    AND s.created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month';

  -- Ingresos del mes anterior
  SELECT COALESCE(SUM(s.total), 0) INTO previous_month_revenue
  FROM sales s
  WHERE s.user_id = user_id_param
    AND s.created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
    AND s.created_at < date_trunc('month', CURRENT_DATE);

  -- Calcular cambios porcentuales
  RETURN QUERY SELECT
    current_week_revenue,
    CASE 
      WHEN previous_week_revenue = 0 THEN 0
      ELSE ((current_week_revenue - previous_week_revenue) / previous_week_revenue) * 100
    END,
    current_month_revenue,
    CASE 
      WHEN previous_month_revenue = 0 THEN 0
      ELSE ((current_month_revenue - previous_month_revenue) / previous_month_revenue) * 100
    END;
END;
$$ LANGUAGE plpgsql;