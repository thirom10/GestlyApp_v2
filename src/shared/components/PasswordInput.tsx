import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Colors } from '../config/colors';

interface PasswordInputProps extends TextInputProps {
  containerStyle?: any;
  inputStyle?: any;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  containerStyle, 
  inputStyle, 
  ...props 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        style={[styles.input, inputStyle]}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={Colors.textPlaceholder}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={togglePasswordVisibility}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isPasswordVisible ? 'eye-off' : 'eye'}
          size={20}
          color={Colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    placeholderTextColor: Colors.textPlaceholder,
  },
  eyeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PasswordInput;