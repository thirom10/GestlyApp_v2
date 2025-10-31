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
  ScrollView,
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
  
  // Estados para navegación temporal
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = semana actual, -1 = semana anterior, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = mes actual, -1 = mes anterior, etc.
  const [dateRange, setDateRange] = useState<string>('');
  
  const { user } = useAuthContext();
  const slideAnim = useRef(new Animated.Value(screenHeight * 0.5)).current;
  
  // Variables para el gesto de deslizamiento del panel
  const lastGestureY = useRef(0);
  const SWIPE_THRESHOLD = 150;
  const VELOCITY_THRESHOLD = 1.2;

  // PanResponder para navegación de períodos en el gráfico
  const chartPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        const hasSignificantMovement = Math.abs(gestureState.dx) > 20;
        return isHorizontal && hasSignificantMovement;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const deltaX = gestureState.dx;
        const velocity = gestureState.vx;
        
        if (Math.abs(deltaX) > 50 || Math.abs(velocity) > 0.8) {
          if (deltaX > 0) {
            // Swipe derecha - período anterior
            navigateToPreviousPeriod();
          } else {
            // Swipe izquierda - período siguiente
            navigateToNextPeriod();
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      generateChartData();
    }
  }, [sales, chartPeriod, currentWeekOffset, currentMonthOffset]);

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

  const navigateToPreviousPeriod = () => {
    if (chartPeriod === 'weekly') {
      setCurrentWeekOffset(prev => prev - 1);
    } else {
      setCurrentMonthOffset(prev => prev - 1);
    }
  };

  const navigateToNextPeriod = () => {
    if (chartPeriod === 'weekly') {
      setCurrentWeekOffset(prev => Math.min(prev + 1, 0)); // No permitir futuro
    } else {
      setCurrentMonthOffset(prev => Math.min(prev + 1, 0)); // No permitir futuro
    }
  };

  const formatDateRange = (startDate: Date, endDate: Date): string => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  };

  const generateChartData = () => {
    if (sales.length === 0) return;

    const now = new Date();
    const data: { [key: string]: number } = {};
    let rangeText = '';
    
    if (chartPeriod === 'weekly') {
      // Calcular la fecha de inicio de la semana actual (domingo)
      const currentWeekStart = new Date(now);
      const dayOfWeek = currentWeekStart.getDay();
      currentWeekStart.setDate(now.getDate() - dayOfWeek + (currentWeekOffset * 7));
      
      // Generar datos para los 7 días de la semana seleccionada
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const weekDates: Date[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        weekDates.push(date);
        const dayName = dayNames[i];
        data[dayName] = 0;
      }
      
      // Calcular rango de fechas para mostrar
      const weekStart = weekDates[0];
      const weekEnd = weekDates[6];
      rangeText = formatDateRange(weekStart, weekEnd);
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.created_at);
        
        // Verificar si la venta está en la semana seleccionada
        weekDates.forEach((weekDate, index) => {
          if (saleDate.toDateString() === weekDate.toDateString()) {
            const dayName = dayNames[index];
            const totalProducts = sale.sale_items.reduce((total, item) => total + item.quantity, 0);
            data[dayName] += totalProducts;
          }
        });
      });
    } else {
      // Vista mensual mejorada
      const targetMonth = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset, 1);
      rangeText = formatMonthYear(targetMonth);
      
      // Obtener el primer y último día del mes
      const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      const totalDaysInMonth = monthEnd.getDate();
      
      // Dividir el mes en semanas más inteligentemente
      const weeksInMonth = [];
      let currentWeekStartDay = 1;
      let weekNumber = 1;
      
      while (currentWeekStartDay <= totalDaysInMonth) {
        const weekEndDay = Math.min(currentWeekStartDay + 6, totalDaysInMonth);
        const weekStartDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), currentWeekStartDay);
        const weekEndDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), weekEndDay);
        
        // Usar etiquetas más cortas para mejor visualización
        const weekLabel = `S${weekNumber}`;
        weeksInMonth.push({ 
          label: weekLabel, 
          start: weekStartDate, 
          end: weekEndDate,
          displayLabel: `Sem ${weekNumber}`
        });
        data[weekLabel] = 0;
        
        currentWeekStartDay = weekEndDay + 1;
        weekNumber++;
        
        // Limitar a máximo 5 semanas para evitar problemas de visualización
        if (weekNumber > 5) break;
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.created_at);
        
        weeksInMonth.forEach(week => {
          if (saleDate >= week.start && saleDate <= week.end) {
            const totalProducts = sale.sale_items.reduce((total, item) => total + item.quantity, 0);
            data[week.label] += totalProducts;
          }
        });
      });
    }

    setDateRange(rangeText);

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

  // PanResponder para manejar gestos de deslizamiento solo en la barra de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Solo activar si el movimiento es vertical y significativo
        const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 2;
        const hasSignificantMovement = Math.abs(gestureState.dy) > 10;
        return isVertical && hasSignificantMovement;
      },
      onPanResponderGrant: (evt, gestureState) => {
        lastGestureY.current = gestureState.y0;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calcular nueva posición basada en el estado actual
        const currentPosition = isExpanded ? screenHeight * 0.1 : screenHeight * 0.5;
        let newValue = currentPosition + gestureState.dy;
        
        // Aplicar límites
        const minPosition = screenHeight * 0.1;
        const maxPosition = screenHeight * 0.5;
        
        // Aplicar resistencia en los extremos
        let clampedValue;
        if (newValue < minPosition) {
          const overshoot = minPosition - newValue;
          const resistance = Math.min(0.3, overshoot / 100);
          clampedValue = minPosition - (overshoot * resistance);
        } else if (newValue > maxPosition) {
          const overshoot = newValue - maxPosition;
          const resistance = Math.min(0.3, overshoot / 100); // Corregido: era overshoot / resistance
          clampedValue = maxPosition + (overshoot * resistance);
        } else {
          clampedValue = newValue;
        }
        
        slideAnim.setValue(clampedValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const deltaY = gestureState.dy;
        const velocity = gestureState.vy;
        
        // Umbrales más razonables
        const contractThreshold = 80;
        const expandThreshold = 60;
        
        let shouldToggle = false;
        let targetExpanded = isExpanded;
        
        if (deltaY > contractThreshold && isExpanded && velocity > 0.5) {
          shouldToggle = true;
          targetExpanded = false;
        } else if (deltaY < -expandThreshold && !isExpanded && velocity < -0.5) {
          shouldToggle = true;
          targetExpanded = true;
        }
        
        // Ejecutar la animación correspondiente
        if (shouldToggle && targetExpanded !== isExpanded) {
          if (targetExpanded) {
            expandSection();
          } else {
            contractSection();
          }
        } else {
          // Volver a la posición original
          if (isExpanded) {
            expandSection();
          } else {
            contractSection();
          }
        }
      },
    })
  ).current;

  const expandSection = () => {
    setIsExpanded(true);
    Animated.spring(slideAnim, {
      toValue: screenHeight * 0.1, // Expandir hasta casi la parte superior
      useNativeDriver: false,
      tension: 120,
      friction: 8,
      velocity: 0,
    }).start();
  };

  const contractSection = () => {
    setIsExpanded(false);
    Animated.spring(slideAnim, {
      toValue: screenHeight * 0.5, // Contraer a la mitad de la pantalla
      useNativeDriver: false,
      tension: 120,
      friction: 8,
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

  const handlePeriodChange = (period: 'weekly' | 'monthly') => {
    setChartPeriod(period);
    // Resetear offsets al cambiar de período
    setCurrentWeekOffset(0);
    setCurrentMonthOffset(0);
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

    // Calcular el valor máximo para el eje Y (ahora son productos, no dinero)
    const maxValue = Math.max(...chartData.datasets[0].data);
    const minValue = Math.min(...chartData.datasets[0].data);
    
    // Calcular un rango apropiado para el eje Y
    const range = maxValue - minValue;
    const padding = Math.max(1, Math.ceil(range * 0.1)); // Al menos 1 de padding
    const yAxisMax = Math.ceil(maxValue + padding);
    const yAxisMin = Math.max(0, Math.floor(minValue - padding));

    // Calcular ancho dinámico basado en el número de etiquetas y el período
    const baseWidth = screenWidth - 32;
    const labelWidth = chartPeriod === 'weekly' ? 50 : 40; // Menos espacio para etiquetas mensuales
    const calculatedWidth = Math.max(baseWidth, chartData.labels.length * labelWidth);
    const chartWidth = Math.min(calculatedWidth, baseWidth * 1.5); // Limitar el ancho máximo

    return (
      <View style={styles.chartContainer} {...chartPanResponder.panHandlers}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Productos Vendidos por {chartPeriod === 'weekly' ? 'Día' : 'Semana'}</Text>
            <Text style={styles.dateRangeText}>{dateRange}</Text>
          </View>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, chartPeriod === 'weekly' && styles.periodButtonActive]}
              onPress={() => handlePeriodChange('weekly')}
            >
              <Text style={[styles.periodButtonText, chartPeriod === 'weekly' && styles.periodButtonTextActive]}>
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, chartPeriod === 'monthly' && styles.periodButtonActive]}
              onPress={() => handlePeriodChange('monthly')}
            >
              <Text style={[styles.periodButtonText, chartPeriod === 'monthly' && styles.periodButtonTextActive]}>
                Mensual
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Controles de navegación */}
        <View style={styles.navigationControls}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={navigateToPreviousPeriod}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, 
              (chartPeriod === 'weekly' ? currentWeekOffset : currentMonthOffset) >= 0 && styles.navButtonDisabled
            ]}
            onPress={navigateToNextPeriod}
            disabled={(chartPeriod === 'weekly' ? currentWeekOffset : currentMonthOffset) >= 0}
          >
            <Text style={[styles.navButtonText,
              (chartPeriod === 'weekly' ? currentWeekOffset : currentMonthOffset) >= 0 && styles.navButtonTextDisabled
            ]}>Siguiente</Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={(chartPeriod === 'weekly' ? currentWeekOffset : currentMonthOffset) >= 0 ? Colors.textTertiary : Colors.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={200}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: Colors.card,
              backgroundGradientFrom: Colors.card,
              backgroundGradientTo: Colors.card,
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
              propsForLabels: {
                fontSize: chartPeriod === 'weekly' ? 10 : 9, // Texto más pequeño para vista mensual
              },
              formatYLabel: (value) => {
                const numValue = parseFloat(value);
                // Mostrar números enteros para productos
                return `${Math.round(numValue)}`;
              },
              yAxisMin: yAxisMin,
              yAxisMax: yAxisMax,
            }}
            bezier
            style={styles.chart}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withDots={true}
            withShadow={false}
            withVerticalLines={false}
            withHorizontalLines={true}
          />
        </ScrollView>
        
        <Text style={styles.swipeHint}>
          Desliza horizontalmente para navegar entre períodos
        </Text>
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
          >
            {/* Barra de arrastre */}
            <View 
              style={styles.dragHandle}
              {...panResponder.panHandlers}
            >
              <View style={styles.dragBar} />
              <Text style={styles.dragText}>
                {isExpanded ? 'Desliza hacia abajo para contraer' : 'Desliza hacia arriba para expandir'}
              </Text>
            </View>

            {/* Lista de ventas */}
            <View style={styles.listWrapper}>
              <FlatList
                 data={sales}
                 renderItem={renderSaleCard}
                 keyExtractor={(item) => item.id}
                 contentContainerStyle={styles.listContainer}
                 style={styles.flatListStyle}
                 showsVerticalScrollIndicator={true}
                 scrollEnabled={true}
                 bounces={true}
                 nestedScrollEnabled={false}
                 removeClippedSubviews={true}
                 maxToRenderPerBatch={10}
                 windowSize={10}
                 keyboardShouldPersistTaps="handled"
                 contentInsetAdjustmentBehavior="automatic"
               />
            </View>
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateRangeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
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
    color: Colors.card,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.background,
  },
  navButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: Colors.textTertiary,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartWrapper: {
    marginVertical: 8,
  },
  swipeHint: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
    overflow: 'hidden',
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragBar: {
    width: 50,
    height: 5,
    backgroundColor: Colors.textTertiary,
    borderRadius: 3,
    marginBottom: 10,
    opacity: 0.8,
  },
  dragText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 200, // Aumentado para evitar que el navegador tape el contenido
  },
  flatListStyle: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  saleCard: {
    backgroundColor: Colors.card,
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