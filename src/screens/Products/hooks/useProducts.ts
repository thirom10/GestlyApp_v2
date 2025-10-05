import { useState, useEffect, useCallback } from 'react';
import { ProductService, Product, CreateProductData } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar productos
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await ProductService.getUserProducts();
      
      if (error) {
        setError(error.message || 'Error al cargar productos');
        return;
      }
      
      setProducts(data || []);
    } catch (err) {
      setError('Error inesperado al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar productos (para pull-to-refresh)
  const refreshProducts = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const { data, error } = await ProductService.getUserProducts();
      
      if (error) {
        setError(error.message || 'Error al refrescar productos');
        return;
      }
      
      setProducts(data || []);
    } catch (err) {
      setError('Error inesperado al refrescar productos');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Agregar producto
  const addProduct = useCallback(async (productData: CreateProductData): Promise<boolean> => {
    try {
      setError(null);
      
      const { data, error } = await ProductService.createProduct(productData);
      
      if (error) {
        setError(error.message || 'Error al crear producto');
        return false;
      }
      
      if (data) {
        setProducts(prev => [data, ...prev]);
        return true;
      }
      
      return false;
    } catch (err) {
      setError('Error inesperado al crear producto');
      return false;
    }
  }, []);

  // Eliminar producto
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await ProductService.deleteProduct(id);
      
      if (error) {
        setError(error.message || 'Error al eliminar producto');
        return false;
      }
      
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err) {
      setError('Error inesperado al eliminar producto');
      return false;
    }
  }, []);

  // Buscar productos
  const searchProducts = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!searchTerm.trim()) {
        await loadProducts();
        return;
      }
      
      const { data, error } = await ProductService.searchProducts(searchTerm);
      
      if (error) {
        setError(error.message || 'Error al buscar productos');
        return;
      }
      
      setProducts(data || []);
    } catch (err) {
      setError('Error inesperado al buscar productos');
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  // Actualizar stock
  const updateStock = useCallback(async (id: string, newStock: number): Promise<boolean> => {
    try {
      setError(null);
      
      const { data, error } = await ProductService.updateStock(id, newStock);
      
      if (error) {
        setError(error.message || 'Error al actualizar stock');
        return false;
      }
      
      if (data) {
        setProducts(prev => 
          prev.map(product => 
            product.id === id ? { ...product, stock: newStock } : product
          )
        );
        return true;
      }
      
      return false;
    } catch (err) {
      setError('Error inesperado al actualizar stock');
      return false;
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refreshing,
    loadProducts,
    refreshProducts,
    addProduct,
    deleteProduct,
    searchProducts,
    updateStock,
    clearError: () => setError(null),
  };
};