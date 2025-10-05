import { supabase } from '@/src/shared/config/supabase';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  stock: number;
  purchase_price: number;
  sale_price: number;
  net_weight?: number;
  weight_unit?: 'ml' | 'mg' | 'l' | 'kg';
  purchase_date?: string;
  branch?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  stock: number;
  purchase_price: number;
  sale_price: number;
  net_weight?: number;
  weight_unit?: 'ml' | 'mg' | 'l' | 'kg';
  purchase_date?: string;
  branch?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export class ProductService {
  // Obtener todos los productos del usuario actual
  static async getUserProducts(): Promise<{ data: Product[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'Usuario no autenticado' } };
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Crear un nuevo producto
  static async createProduct(productData: CreateProductData): Promise<{ data: Product | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'Usuario no autenticado' } };
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...productData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Obtener un producto por ID
  static async getProductById(id: string): Promise<{ data: Product | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Actualizar un producto
  static async updateProduct(updateData: UpdateProductData): Promise<{ data: Product | null; error: any }> {
    try {
      const { id, ...productData } = updateData;
      
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Eliminar un producto
  static async deleteProduct(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Buscar productos por nombre
  static async searchProducts(searchTerm: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Actualizar stock de un producto
  static async updateStock(id: string, newStock: number): Promise<{ data: Product | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Obtener productos con stock bajo (menos de 10 unidades)
  static async getLowStockProducts(): Promise<{ data: Product[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10)
        .order('stock', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}