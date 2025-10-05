import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export const SettingsButton: React.FC<Props> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[localStyles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={localStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SettingsButton;

const localStyles = StyleSheet.create({
  button: {
    width: '80%',
    paddingVertical: 14,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
