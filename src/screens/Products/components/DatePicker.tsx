import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';

interface DatePickerProps {
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  placeholder = 'Seleccionar fecha',
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === 'set' && date) {
      onSelectDate(date);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const clearDate = () => {
    onSelectDate(undefined);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dateButton,
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <View style={styles.dateContent}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={disabled ? Colors.textTertiary : Colors.textSecondary}
            style={styles.icon}
          />
          <Text style={[
            styles.dateText,
            disabled && styles.disabledText,
            !selectedDate && styles.placeholderText,
          ]}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </Text>
        </View>
        
        {selectedDate && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearDate}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'default' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          locale="es-ES"
          style={Platform.OS === 'ios' ? { backgroundColor: 'white' } : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.6,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '400',
    flex: 1,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
  placeholderText: {
    color: Colors.textPlaceholder,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});