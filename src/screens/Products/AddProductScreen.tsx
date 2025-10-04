import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../shared/config/colors';
import { useProducts } from './hooks/useProducts';
import { WeightUnitPicker } from './components/WeightUnitPicker';
import { DatePicker } from './components/DatePicker';
import { showToast } from '../../shared/components/Toast';

export default function AddProductScreen() {
  const navigation = useNavigation();
  const { addProduct, loading } = useProducts();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    purchasePrice: '',
    salePrice: '',
    netWeight: '',
    weightUnit: undefined as 'ml' | 'mg' | 'l' | 'kg' | undefined,
    purchaseDate: undefined as Date | undefined,
    branch: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número válido mayor o igual a 0';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'El precio de compra debe ser mayor a 0';
    }

    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'El precio de venta debe ser mayor a 0';
    }

    if (formData.netWeight && (!formData.weightUnit || parseFloat(formData.netWeight) <= 0)) {
      newErrors.netWeight = 'Si especifica peso, debe ser válido y seleccionar unidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error('Error en el formulario', 'Por favor, corrige los errores en el formulario');
      return;
    }
    
    try {
      const productData = {
        name: formData.name.trim(),
        stock: parseInt(formData.stock),
        purchase_price: parseFloat(formData.purchasePrice),
        sale_price: parseFloat(formData.salePrice),
        net_weight: formData.netWeight ? parseFloat(formData.netWeight) : undefined,
        weight_unit: formData.weightUnit,
        purchase_date: formData.purchaseDate?.toISOString().split('T')[0],
        branch: formData.branch.trim() || undefined,
      };

      const success = await addProduct(productData);
      
      if (success) {
          showToast.success('Producto agregado', 'Producto agregado exitosamente');
          navigation.goBack();
        } else {
          showToast.error('Error', 'Error al agregar el producto');
        }
    } catch (error) {
      showToast.error('Error', 'Error inesperado al agregar el producto');
    }
  };

  // Actualizar campo del formulario
  const updateField = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Producto</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nombre del producto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del producto *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ej: Coca Cola 500ml"
              placeholderTextColor={Colors.textPlaceholder}
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              maxLength={255}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Stock */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock *</Text>
            <TextInput
              style={[styles.input, errors.stock && styles.inputError]}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
              value={formData.stock}
              onChangeText={(text) => updateField('stock', text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
          </View>

          {/* Precios */}
          <View style={styles.priceRow}>
            <View style={[styles.inputGroup, styles.priceInput]}>
              <Text style={styles.label}>Precio de compra *</Text>
              <TextInput
                style={[styles.input, errors.purchasePrice && styles.inputError]}
                placeholder="0.00"
                placeholderTextColor={Colors.textPlaceholder}
                value={formData.purchasePrice}
                onChangeText={(text) => updateField('purchasePrice', text.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                maxLength={10}
              />
              {errors.purchasePrice && <Text style={styles.errorText}>{errors.purchasePrice}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.priceInput]}>
              <Text style={styles.label}>Precio de venta *</Text>
              <TextInput
                style={[styles.input, errors.salePrice && styles.inputError]}
                placeholder="0.00"
                placeholderTextColor={Colors.textPlaceholder}
                value={formData.salePrice}
                onChangeText={(text) => updateField('salePrice', text.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                maxLength={10}
              />
              {errors.salePrice && <Text style={styles.errorText}>{errors.salePrice}</Text>}
            </View>
          </View>

          {/* Peso neto y unidad */}
          <View style={styles.weightRow}>
            <View style={[styles.inputGroup, styles.weightInput]}>
              <Text style={styles.label}>Peso neto</Text>
              <TextInput
                style={[styles.input, errors.netWeight && styles.inputError]}
                placeholder="0.0"
                placeholderTextColor={Colors.textPlaceholder}
                value={formData.netWeight}
                onChangeText={(text) => updateField('netWeight', text.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>

            <View style={[styles.inputGroup, styles.unitInput]}>
              <Text style={styles.label}>Unidad</Text>
              <WeightUnitPicker
                selectedUnit={formData.weightUnit}
                onSelectUnit={(unit) => updateField('weightUnit', unit)}
                disabled={!formData.netWeight}
              />
            </View>
          </View>
          {errors.netWeight && <Text style={styles.errorText}>{errors.netWeight}</Text>}

          {/* Fecha de compra */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de compra</Text>
            <DatePicker
              selectedDate={formData.purchaseDate}
              onSelectDate={(date) => updateField('purchaseDate', date)}
              placeholder="Seleccionar fecha (opcional)"
            />
          </View>

          {/* Sucursal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sucursal</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sucursal Centro (opcional)"
              placeholderTextColor={Colors.textPlaceholder}
              value={formData.branch}
              onChangeText={(text) => updateField('branch', text)}
              maxLength={255}
            />
          </View>

          {/* Botón de guardar */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.saveButtonText}>Guardando...</Text>
            ) : (
              <Text style={styles.saveButtonText}>Guardar Producto</Text>
            )}
          </TouchableOpacity>

          {/* Espaciado inferior */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  weightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weightInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bottomSpacer: {
    height: 40,
  },
});