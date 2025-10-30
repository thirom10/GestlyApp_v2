import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../../shared/config/colors';
import { useAuthContext } from '../../shared/context/AuthContext';
import { salesService } from '../../shared/services/salesService';

interface Sale {
  id: string;
  total_amount: number;
  created_at: string;
  sale_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      name: string;
    };
  }>;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ReportsScreen() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { user } = useAuthContext();
  const slideAnim = useRef(new Animated.Value(screenHeight * 0.5)).current; // Inicialmente en la mitad de la pantalla
  
  // Variables para el gesto de deslizamiento
  const lastGestureY = useRef(0);
  const SWIPE_THRESHOLD = 50; // Píxeles mínimos para activar el cambio

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      generateChartData();
    }
  }, [sales, chartPeriod]);

  const loadSales = async () => {
    try {
      if (!user?.id) return;
      
      setLoading(true);
      const salesData = await salesService.getSalesByUser(user.id);
      setSales(salesData || []);
    } catch (error) {
      console.error('Error al cargar las ventas:', error);
      Alert.alert('Error', 'No se pudieron cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (sales.length === 0) return;

    const now = new Date();
    const data: { [key: string]: number } = {};
    
    if (chartPeriod === 'weekly') {
      // Generar datos semanales (últimas 7 semanas)
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        const weekKey = `Sem ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
        data[weekKey] = 0;
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.created_at);
        const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(daysDiff / 7);
        
        if (weekIndex < 7) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (weekIndex * 7));
          const weekKey = `Sem ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
          if (data[weekKey] !== undefined) {
            data[weekKey] += sale.total_amount;
          }
        }
      });
    } else {
      // Generar datos mensuales (últimos 6 meses)
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = monthDate.toLocaleDateString('es-ES', { month: 'short' });
        data[monthKey] = 0;
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.created_at);
        const monthKey = saleDate.toLocaleDateString('es-ES', { month: 'short' });
        if (data[monthKey] !== undefined) {
          data[monthKey] += sale.total_amount;
        }
      });
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    setChartData({
      labels,
      datasets: [{
        data: values,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 3,
      }],
    });
  };

  // PanResponder para manejar gestos de deslizamiento
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Activar el responder si el movimiento es principalmente vertical
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Guardar la posición inicial
        lastGestureY.current = gestureState.y0;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calcular nueva posición basada en el estado actual
        const currentPosition = isExpanded ? screenHeight * 0.1 : screenHeight * 0.5;
        let newValue = currentPosition + gestureState.dy;
        
        // Limitar el movimiento según el estado actual con interpolación suave
        let clampedValue;
        if (isExpanded) {
          // Si está expandida, solo puede moverse hacia abajo hasta la posición inicial
          clampedValue = Math.max(screenHeight * 0.1, Math.min(screenHeight * 0.5, newValue));
        } else {
          // Si está contraída, solo puede moverse hacia arriba hasta expandirse
          clampedValue = Math.max(screenHeight * 0.1, Math.min(screenHeight * 0.5, newValue));
        }
        
        // Aplicar resistencia en los extremos para una sensación más natural
        const resistance = 0.3;
        if (newValue < screenHeight * 0.1) {
          const overshoot = screenHeight * 0.1 - newValue;
          clampedValue = screenHeight * 0.1 - (overshoot * resistance);
        } else if (newValue > screenHeight * 0.5) {
          const overshoot = newValue - screenHeight * 0.5;
          clampedValue = screenHeight * 0.5 + (overshoot * resistance);
        }
        
        slideAnim.setValue(clampedValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const deltaY = gestureState.dy;
        
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          if (deltaY > 0 && isExpanded) {
            // Deslizar hacia abajo desde expandida - contraer a posición inicial
            contractSection();
          } else if (deltaY < 0 && !isExpanded) {
            // Deslizar hacia arriba desde contraída - expandir
            expandSection();
          } else {
            // Movimiento no válido, volver a posición actual
            const currentValue = isExpanded ? screenHeight * 0.1 : screenHeight * 0.5;
            Animated.spring(slideAnim, {
              toValue: currentValue,
              useNativeDriver: false,
              tension: 120,
              friction: 8,
              velocity: gestureState.vy,
            }).start();
          }
        } else {
          // Si no se alcanzó el umbral, volver a la posición actual
          const currentValue = isExpanded ? screenHeight * 0.1 : screenHeight * 0.5;
          Animated.spring(slideAnim, {
            toValue: currentValue,
            useNativeDriver: false,
            tension: 120,
            friction: 8,
            velocity: gestureState.vy,
          }).start();
        }
      },
    })
  ).current;

  const expandSection = () => {
    setIsExpanded(true);
    Animated.spring(slideAnim, {
      toValue: screenHeight * 0.1, // Expandir hasta casi la parte superior
      useNativeDriver: false,
      tension: 80,
      friction: 10,
      velocity: 0,
    }).start();
  };

  const contractSection = () => {
    setIsExpanded(false);
    Animated.spring(slideAnim, {
      toValue: screenHeight * 0.5, // Contraer a la mitad de la pantalla
      useNativeDriver: false,
      tension: 80,
      friction: 10,
      velocity: 0,
    }).start();
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

  const getTotalItems = (saleItems: Sale['sale_items']) => {
    return saleItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSalePress = (sale: Sale) => {
    router.push({
      pathname: '/sale-detail',
      params: { saleId: sale.id }
    });
  };

  const renderSaleCard = ({ item }: { item: Sale }) => (
    <TouchableOpacity 
      style={styles.saleCard}
      onPress={() => handleSalePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{formatCurrency(item.total_amount)}</Text>
          <Text style={styles.itemsText}>{getTotalItems(item.sale_items)} productos</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChart = () => {
    if (chartData.labels.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Ventas por {chartPeriod === 'weekly' ? 'Semana' : 'Mes'}</Text>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, chartPeriod === 'weekly' && styles.periodButtonActive]}
              onPress={() => setChartPeriod('weekly')}
            >
              <Text style={[styles.periodButtonText, chartPeriod === 'weekly' && styles.periodButtonTextActive]}>
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, chartPeriod === 'monthly' && styles.periodButtonActive]}
              onPress={() => setChartPeriod('monthly')}
            >
              <Text style={[styles.periodButtonText, chartPeriod === 'monthly' && styles.periodButtonTextActive]}>
                Mensual
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={200}
          chartConfig={{
            backgroundColor: Colors.surface,
            backgroundGradientFrom: Colors.surface,
            backgroundGradientTo: Colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => Colors.textSecondary,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: Colors.primary,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando reportes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Reportes de Ventas</Text>
        <TouchableOpacity onPress={loadSales} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {sales.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No hay ventas registradas</Text>
          <Text style={styles.emptySubtitle}>
            Las ventas que realices aparecerán aquí
          </Text>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {/* Gráfico */}
          <Animated.View 
            style={[
              styles.chartSection,
              {
                height: Animated.subtract(slideAnim, 100),
              }
            ]}
          >
            {renderChart()}
          </Animated.View>

          {/* Sección deslizable de cards */}
          <Animated.View
            style={[
              styles.slidableSection,
              {
                top: slideAnim,
                height: Animated.subtract(screenHeight, slideAnim),
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Barra de arrastre */}
            <View style={styles.dragHandle}>
              <View style={styles.dragBar} />
              <Text style={styles.dragText}>
                {isExpanded ? 'Desliza hacia abajo para contraer' : 'Desliza hacia arriba para expandir'}
              </Text>
            </View>

            {/* Lista de ventas */}
            <FlatList
              data={sales}
              renderItem={renderSaleCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={isExpanded}
            />
          </Animated.View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  chartSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
  },
  chartContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: Colors.textPrimary,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  slidableSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textTertiary,
    borderRadius: 2,
    marginBottom: 8,
  },
  dragText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  saleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  itemsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
});