import { supabase } from '../config/supabase';
import { CartItem } from '../context/CartContext';

interface CreateSaleData {
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export const salesService = {
  async createSale({ userId, items, totalAmount }: CreateSaleData) {
    try {
      console.log('Iniciando creación de venta:', { userId, totalAmount, itemsCount: items.length });
      
      // Iniciar una transacción
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
        })
        .select()
        .single();

      if (saleError) {
        console.error('Error al crear la venta principal:', saleError);
        throw saleError;
      }
      
      console.log('Venta creada exitosamente:', sale);

      // Insertar los items de la venta
      const saleItems = items.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      console.log('Insertando items de la venta:', saleItems);
      
      const { data: insertedItems, error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)
        .select();

      if (itemsError) {
        console.error('Error al insertar los items de la venta:', itemsError);
        throw itemsError;
      }

      console.log('Items insertados exitosamente:', insertedItems);

      // Actualizar el stock de los productos
      console.log('Iniciando actualización de stock para los productos');
      
      for (const item of items) {
        console.log(`Actualizando stock del producto ${item.id}, cantidad: ${item.quantity}`);
        
        const { error: updateError } = await supabase
          .rpc('update_product_stock', {
            p_product_id: item.id,
            p_quantity: item.quantity
          });

        if (updateError) {
          console.error(`Error al actualizar stock del producto ${item.id}:`, updateError);
          throw updateError;
        }
        
        console.log(`Stock actualizado exitosamente para el producto ${item.id}`);
      }

      return { success: true, saleId: sale.id };
    } catch (error) {
      console.error('Error al crear la venta:', error);
      throw error;
    }
  },

  async getSalesByUser(userId: string) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          *,
          product:products (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};