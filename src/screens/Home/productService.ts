import { supabase } from '../../shared/config/supabase';

export interface ProductSaleHistory {
  id: string;
  sale_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export const productService = {
  async getProductSaleHistory(productId: string, userId: string): Promise<ProductSaleHistory[]> {
    try {
      console.log('Buscando historial para producto:', productId, 'y usuario:', userId);
      
      // Consulta simplificada para obtener todos los items de venta del producto
      const { data, error } = await supabase
        .from('sale_items')
        .select(`
          id,
          sale_id,
          quantity,
          unit_price,
          total_price,
          product_id,
          sales(created_at)
        `)
        .eq('product_id', productId);

      if (error) {
        console.error('Error al obtener el historial de ventas:', error);
        throw error;
      }

      console.log('Datos obtenidos:', data);

      if (!data || data.length === 0) {
        console.log('No se encontraron datos de ventas');
        return [];
      }

      const result = data.map(item => ({
        id: item.id,
        sale_id: item.sale_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: item.sales?.created_at || new Date().toISOString()
      }));

      console.log('Resultado procesado:', result);
      return result;
    } catch (error) {
      console.error('Error en getProductSaleHistory:', error);
      return [];
    }
  }
};