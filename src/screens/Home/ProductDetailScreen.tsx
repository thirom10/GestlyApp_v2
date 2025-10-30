import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../shared/config/colors';
import { productService, ProductSaleHistory } from './productService';
import { useAuthContext } from '../../shared/context/AuthContext';

export default function ProductDetailScreen() {
  const [saleHistory, setSaleHistory] = useState<ProductSaleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');
  const { user } = useAuthContext();
  const { productId, name } = useLocalSearchParams();

  useEffect(() => {
    if (name) {
      setProductName(String(name));
    }
    loadProductHistory();
  }, [productId]);

  const loadProductHistory = async () => {
    try {
      if (!user?.id || !productId) return;
      
      setLoading(true);
      console.log('Cargando historial para producto ID:', productId, 'Usuario ID:', user.id);
      const history = await productService.getProductSaleHistory(String(productId), user.id);
      console.log('Historial recibido:', history);
      setSaleHistory(history);
    } catch (error) {
      console.error('Error al cargar el historial del producto:', error);
      Alert.alert('Error', 'No se pudo cargar el historial del producto');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  };

  const renderHistoryItem = ({ item }: { item: ProductSaleHistory }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.dateText}>
          {formatDate(item.created_at)}
        </Text>
        <Text style={styles.itemTotal}>
          {formatCurrency(item.total_price)}
        </Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.detailText}>
          Cantidad: {item.quantity}
        </Text>
        <Text style={styles.detailText}>
          Precio unitario: {formatCurrency(item.unit_price)}
        </Text>
      </View>
    </View>
  );

  const calculateTotalSales = () => {
    if (!saleHistory || saleHistory.length === 0) return 0;
    return saleHistory.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalRevenue = () => {
    if (!saleHistory || saleHistory.length === 0) return 0;
    return saleHistory.reduce((total, item) => total + item.total_price, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Producto</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.productInfoCard}>
            <Text style={styles.productName}>{productName}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{calculateTotalSales()}</Text>
                <Text style={styles.statLabel}>Unidades vendidas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCurrency(calculateTotalRevenue())}</Text>
                <Text style={styles.statLabel}>Ingresos totales</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Historial de ventas</Text>
          
          {saleHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No hay ventas registradas para este producto</Text>
            </View>
          ) : (
            <FlatList
              data={saleHistory}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfoCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  itemDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});