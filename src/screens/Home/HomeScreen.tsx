import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../shared/config/colors';
import { FeaturedCard, LowStockItem, StatCard } from './components';

// Mock data (mover a un servicio después)
const stats = [
  { id: '1', label: 'Ganancias (Mes)', value: '$727', change: 12, positive: true },
  { id: '2', label: 'Ganancias (Semana)', value: '$10000', change: -3, positive: false },
];

const featured = {
  id: 'f1',
  name: 'Alfajor de Chocolate',
  subtitle: '25 vendidos este mes',
};

const lowStock = [
  { id: 's1', name: 'Galletitas', remain: 5, icon: 'cart' },
  { id: 's2', name: 'Gaseosa Cola', remain: 2, icon: 'cart' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeSmall}>Bienvenido de nuevo,</Text>
          <Text style={styles.userName}>Usuario</Text>
        </View>
        <TouchableOpacity style={styles.bellWrap} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <StatCard key={stat.id} item={stat} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Producto Más Vendido</Text>
      <FeaturedCard product={featured} />

      <View style={styles.lowHeaderRow}>
        <Text style={styles.sectionTitle}>Bajo Stock</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lowStock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LowStockItem item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  welcomeSmall: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  lowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 13,
  },
  listContainer: {
    paddingBottom: 40,
  },
});