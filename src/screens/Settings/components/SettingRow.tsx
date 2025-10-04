import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../shared/config/colors';

interface SettingRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  textColor?: string;
  showBorder?: boolean;
  borderColor?: string;
}

export default function SettingRow({ 
  icon, 
  label, 
  onPress, 
  textColor = Colors.textPrimary,
  showBorder = false,
  borderColor = Colors.error 
}: SettingRowProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        showBorder && { borderWidth: 1, borderColor }
      ]} 
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={24} color={textColor} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color={textColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 14, 
    paddingHorizontal: 12, 
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10, 
    marginBottom: 10 
  },
  label: { 
    flex: 1,
    color: Colors.textPrimary, 
    marginLeft: 12, 
    fontSize: 16 
  },
});
