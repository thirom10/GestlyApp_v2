import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../shared/config/colors';
import { useAuthContext } from '../../shared/context/AuthContext';
import { FeaturedCard, LowStockItem, StatCard } from './components';
import { homeService } from './homeService';

export default function HomeScreen() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ id: string; label: string; value: string; change: number; positive: boolean }[]>([]);
  const [mostSoldProduct, setMostSoldProduct] = useState<{ id?: string; name: string; subtitle: string } | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<{ id: string; name: string; remain: number; icon: string }[]>([]);

  const handleStockUpdate = async (productId: string, addedQuantity: number) => {
    try {
      // Encontrar el producto actual para obtener su stock
      const currentProduct = lowStockProducts.find(p => p.id === productId);
      if (!currentProduct) {
        throw new Error('Producto no encontrado');
      }
      
      const newStock = currentProduct.remain + addedQuantity;
      const success = await homeService.updateProductStock(productId, newStock);
      if (success) {
        // Actualizar el estado local
        setLowStockProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, remain: newStock }
              : product
          )
        );
        console.log('Stock actualizado exitosamente');
      } else {
        throw new Error('Error al actualizar stock');
      }
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Obtener estadísticas
        const statsData = await homeService.getStats(user.id);
        setStats([
          { 
            id: '1', 
            label: 'Ganancias (Mes)', 
            value: `$${statsData.monthlyRevenue.toFixed(2)}`, 
            change: statsData.monthlyChange, 
            positive: statsData.monthlyChange >= 0 
          },
          { 
            id: '2', 
            label: 'Ganancias (Semana)', 
            value: `$${statsData.weeklyRevenue.toFixed(2)}`, 
            change: statsData.weeklyChange, 
            positive: statsData.weeklyChange >= 0 
          },
        ]);

        // Obtener producto más vendido
        const featuredProduct = await homeService.getMostSoldProduct(user.id);
        if (featuredProduct) {
          setMostSoldProduct({
            id: featuredProduct.id,
            name: featuredProduct.name,
            subtitle: `${featuredProduct.totalSold || 0} unidades vendidas`
          });
        }

        // Obtener productos con bajo stock
        const lowStockData = await homeService.getLowStockProducts(user.id, 3);
        setLowStockProducts(
          lowStockData.map(product => ({
            id: product.id,
            name: product.name,
            remain: product.stock,
            icon: 'cart'
          }))
        );
      } catch (error) {
        console.error('Error al cargar datos de Home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeSmall}>Bienvenido de nuevo, <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Usuario'}</Text></Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <StatCard key={stat.id} item={stat} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Producto Más Vendido</Text>
          {mostSoldProduct ? (
            <FeaturedCard product={mostSoldProduct} />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No hay productos vendidos aún</Text>
            </View>
          )}

          <View style={styles.lowHeaderRow}>
            <Text style={styles.sectionTitle}>Bajo Stock</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {lowStockProducts.length > 0 ? (
            <FlatList
              data={lowStockProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <LowStockItem 
                  item={item} 
                  onStockUpdated={handleStockUpdate}
                />
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No hay productos en inventario</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  welcomeSmall: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  lowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 80,
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: 16,
  }
});