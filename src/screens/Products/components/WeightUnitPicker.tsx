import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';

interface WeightUnitPickerProps {
  selectedUnit: 'ml' | 'mg' | 'l' | 'kg' | undefined;
  onSelectUnit: (unit: 'ml' | 'mg' | 'l' | 'kg') => void;
  disabled?: boolean;
}

const weightUnits = [
  { value: 'ml', label: 'ml' },
  { value: 'mg', label: 'mg' },
  { value: 'l', label: 'l' },
  { value: 'kg', label: 'kg' },
] as const;

export const WeightUnitPicker: React.FC<WeightUnitPickerProps> = ({
  selectedUnit,
  onSelectUnit,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectUnit = (unit: 'ml' | 'mg' | 'l' | 'kg') => {
    onSelectUnit(unit);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          disabled && styles.disabled,
          isOpen && styles.selectorOpen,
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={[
          styles.selectorText,
          disabled && styles.disabledText,
        ]}>
          {selectedUnit || 'Unidad'}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={disabled ? Colors.textTertiary : Colors.textSecondary}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {weightUnits.map((unit) => (
            <TouchableOpacity
              key={unit.value}
              style={[
                styles.option,
                selectedUnit === unit.value && styles.selectedOption,
              ]}
              onPress={() => handleSelectUnit(unit.value)}
            >
              <Text style={[
                styles.optionText,
                selectedUnit === unit.value && styles.selectedOptionText,
              ]}>
                {unit.label}
              </Text>
              {selectedUnit === unit.value && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 80,
  },
  selectorOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  disabledText: {
    color: Colors.textTertiary,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    zIndex: 10000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '20',
  },
  optionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});