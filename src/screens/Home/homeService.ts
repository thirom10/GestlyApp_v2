import { supabase } from '../../shared/config/supabase';

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  user_id: string;
}

export interface SaleItem {
  id: string;
  product_id: string;
  quantity: number;
  product_name?: string;
}

export interface HomeStats {
  weeklyRevenue: number;
  weeklyChange: number;
  monthlyRevenue: number;
  monthlyChange: number;
}

export const homeService = {
  /**
   * Obtiene el producto más vendido
   */
  async getMostSoldProduct(userId: string): Promise<Product | null> {
    try {
      // Consulta para obtener los productos más vendidos con su cantidad total vendida
      const { data: salesItems, error: salesError } = await supabase
        .from('sale_items')
        .select(`
          quantity,
          product_id,
          sale_id,
          sales!inner(user_id)
        `)
        .eq('sales.user_id', userId);

      if (salesError) {
        console.error('Error al obtener items de ventas:', salesError);
        return null;
      }

      if (!salesItems || salesItems.length === 0) {
        return null;
      }

      // Agrupar por producto y sumar cantidades
      const productSales: Record<string, number> = {};
      salesItems.forEach(item => {
        const productId = item.product_id;
        if (productId) {
          productSales[productId] = (productSales[productId] || 0) + (item.quantity || 0);
        }
      });

      // Encontrar el producto con mayor cantidad vendida
      let maxQuantity = 0;
      let bestSellingProductId = null;

      Object.entries(productSales).forEach(([productId, quantity]) => {
        if (quantity > maxQuantity) {
          maxQuantity = quantity;
          bestSellingProductId = productId;
        }
      });

      if (!bestSellingProductId) {
        return null;
      }

      // Obtener los detalles del producto más vendido
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', bestSellingProductId)
        .single();

      if (productError) {
        console.error('Error al obtener detalles del producto:', productError);
        return null;
      }

      return product;
    } catch (error) {
      console.error('Error inesperado:', error);
      return null;
    }
  },

  /**
   * Obtiene los productos con menor stock (hasta 3)
   */
  async getLowStockProducts(userId: string, limit: number = 3): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('stock', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error al obtener productos con bajo stock:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  },

  /**
   * Obtiene estadísticas de ventas (ingresos semanales y mensuales)
   */
  async getStats(userId: string): Promise<HomeStats> {
    try {
      // Fechas para los cálculos
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo de esta semana
      startOfWeek.setHours(0, 0, 0, 0);
      
      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Consulta para ventas de esta semana
      const { data: weekSales, error: weekError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', userId)
        .gte('created_at', startOfWeek.toISOString())
        .lt('created_at', now.toISOString());

      // Consulta para ventas de la semana pasada
      const { data: lastWeekSales, error: lastWeekError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', userId)
        .gte('created_at', startOfLastWeek.toISOString())
        .lt('created_at', startOfWeek.toISOString());

      // Consulta para ventas de este mes
      const { data: monthSales, error: monthError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', now.toISOString());

      // Consulta para ventas del mes pasado
      const { data: lastMonthSales, error: lastMonthError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', userId)
        .gte('created_at', startOfLastMonth.toISOString())
        .lt('created_at', endOfLastMonth.toISOString());

      if (weekError || lastWeekError || monthError || lastMonthError) {
        console.error('Error al obtener estadísticas de ventas:', 
          weekError || lastWeekError || monthError || lastMonthError);
        return {
          weeklyRevenue: 0,
          weeklyChange: 0,
          monthlyRevenue: 0,
          monthlyChange: 0
        };
      }

      // Calcular ingresos
      const weeklyRevenue = weekSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const lastWeekRevenue = lastWeekSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const monthlyRevenue = monthSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const lastMonthRevenue = lastMonthSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

      // Calcular cambios porcentuales
      const weeklyChange = lastWeekRevenue === 0 
        ? 0 
        : ((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
      
      const monthlyChange = lastMonthRevenue === 0 
        ? 0 
        : ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

      return {
        weeklyRevenue,
        weeklyChange,
        monthlyRevenue,
        monthlyChange
      };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        weeklyRevenue: 0,
        weeklyChange: 0,
        monthlyRevenue: 0,
        monthlyChange: 0
      };
    }
  }
};