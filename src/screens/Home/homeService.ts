import { supabase } from '../../shared/config/supabase';

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  user_id: string;
}

export interface ProductWithSales extends Product {
  totalSold?: number;
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
  weeklyAverage: number;
  monthlyAverage: number;
}

export const homeService = {
  /**
   * Obtiene el producto más vendido
   */
  async getMostSoldProduct(userId: string): Promise<ProductWithSales | null> {
    try {
      // Primero obtener todas las ventas del usuario ordenadas por fecha (más recientes primero)
      const { data: userSales, error: salesError } = await supabase
        .from('sales')
        .select('id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (salesError) {
        console.error('Error al obtener ventas del usuario:', salesError);
        return null;
      }

      if (!userSales || userSales.length === 0) {
        console.log('No hay ventas para este usuario');
        return null;
      }

      const saleIds = userSales.map(sale => sale.id);

      // Obtener todos los items de venta para las ventas del usuario
      const { data: salesItems, error: salesItemsError } = await supabase
        .from('sale_items')
        .select('quantity, product_id, sale_id')
        .in('sale_id', saleIds);

      if (salesItemsError) {
        console.error('Error al obtener items de ventas:', salesItemsError);
        return null;
      }

      if (!salesItems || salesItems.length === 0) {
        console.log('No hay items de venta');
        return null;
      }

      // Agrupar por producto y sumar cantidades, manteniendo la fecha de la venta más reciente
      const productSales: Record<string, { quantity: number; mostRecentSaleDate: string }> = {};
      
      salesItems.forEach(item => {
        const productId = item.product_id;
        if (productId) {
          const saleDate = userSales.find(sale => sale.id === item.sale_id)?.created_at || '';
          
          if (!productSales[productId]) {
            productSales[productId] = {
              quantity: item.quantity || 0,
              mostRecentSaleDate: saleDate
            };
          } else {
            productSales[productId].quantity += (item.quantity || 0);
            // Mantener la fecha más reciente
            if (saleDate > productSales[productId].mostRecentSaleDate) {
              productSales[productId].mostRecentSaleDate = saleDate;
            }
          }
        }
      });

      console.log('Ventas por producto:', productSales);

      // Encontrar el producto con mayor cantidad vendida, en caso de empate, el más reciente
      let maxQuantity = 0;
      let bestSellingProductId = null;
      let mostRecentDate = '';

      Object.entries(productSales).forEach(([productId, data]) => {
        if (data.quantity > maxQuantity || 
            (data.quantity === maxQuantity && data.mostRecentSaleDate > mostRecentDate)) {
          maxQuantity = data.quantity;
          bestSellingProductId = productId;
          mostRecentDate = data.mostRecentSaleDate;
        }
      });

      if (!bestSellingProductId) {
        console.log('No se encontró producto más vendido');
        return null;
      }

      console.log(`Producto más vendido: ${bestSellingProductId} con ${maxQuantity} unidades`);

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

      return {
        ...product,
        totalSold: maxQuantity
      };
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
      
      // Semana actual (lunes a domingo)
      const startOfWeek = new Date(now);
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si es domingo (0), retroceder 6 días
      startOfWeek.setDate(now.getDate() - daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Semana pasada
      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfWeek);
      endOfLastWeek.setMilliseconds(-1);
      
      // Mes actual
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      // Mes pasado
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startOfLastMonth.setHours(0, 0, 0, 0);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      endOfLastMonth.setHours(23, 59, 59, 999);

      console.log('Fechas de cálculo:', {
        startOfWeek: startOfWeek.toISOString(),
        startOfLastWeek: startOfLastWeek.toISOString(),
        endOfLastWeek: endOfLastWeek.toISOString(),
        startOfMonth: startOfMonth.toISOString(),
        startOfLastMonth: startOfLastMonth.toISOString(),
        endOfLastMonth: endOfLastMonth.toISOString(),
        now: now.toISOString()
      });

      // Consulta para ventas de esta semana
      const { data: weekSales, error: weekError } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfWeek.toISOString())
        .lte('created_at', now.toISOString());

      // Consulta para ventas de la semana pasada
      const { data: lastWeekSales, error: lastWeekError } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfLastWeek.toISOString())
        .lte('created_at', endOfLastWeek.toISOString());

      // Consulta para ventas de este mes
      const { data: monthSales, error: monthError } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());

      // Consulta para ventas del mes pasado
      const { data: lastMonthSales, error: lastMonthError } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      if (weekError || lastWeekError || monthError || lastMonthError) {
        console.error('Error al obtener estadísticas de ventas:', 
          weekError || lastWeekError || monthError || lastMonthError);
        return {
          weeklyRevenue: 0,
          weeklyChange: 0,
          monthlyRevenue: 0,
          monthlyChange: 0,
          weeklyAverage: 0,
          monthlyAverage: 0
        };
      }

      // Calcular ingresos totales
      const weeklyRevenue = weekSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const lastWeekRevenue = lastWeekSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const monthlyRevenue = monthSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
      const lastMonthRevenue = lastMonthSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

      // Calcular promedios
      const weekSalesCount = weekSales?.length || 0;
      const monthSalesCount = monthSales?.length || 0;
      
      const weeklyAverage = weekSalesCount > 0 ? weeklyRevenue / weekSalesCount : 0;
      const monthlyAverage = monthSalesCount > 0 ? monthlyRevenue / monthSalesCount : 0;

      // Calcular cambios porcentuales
      const weeklyChange = lastWeekRevenue === 0 
        ? (weeklyRevenue > 0 ? 100 : 0)
        : ((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
      
      const monthlyChange = lastMonthRevenue === 0 
        ? (monthlyRevenue > 0 ? 100 : 0)
        : ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

      console.log('Estadísticas calculadas:', {
        weeklyRevenue,
        lastWeekRevenue,
        weeklyChange,
        monthlyRevenue,
        lastMonthRevenue,
        monthlyChange,
        weeklyAverage,
        monthlyAverage,
        weekSalesCount: weekSales?.length || 0,
        monthSalesCount: monthSales?.length || 0
      });

      return {
        weeklyRevenue,
        weeklyChange,
        monthlyRevenue,
        monthlyChange,
        weeklyAverage,
        monthlyAverage
      };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        weeklyRevenue: 0,
        weeklyChange: 0,
        monthlyRevenue: 0,
        monthlyChange: 0,
        weeklyAverage: 0,
        monthlyAverage: 0
      };
    }
  },

  /**
   * Actualiza el stock de un producto
   */
  async updateProductStock(productId: string, newStock: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar stock:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error inesperado al actualizar stock:', error);
      return false;
    }
  }
};