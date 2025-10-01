import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../../shared/config/colors';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ placeholder, ...props }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={Colors.textPlaceholder}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});