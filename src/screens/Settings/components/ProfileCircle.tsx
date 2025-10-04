import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress?: () => void;
};

export const ProfileCircle: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={localStyles.circle} onPress={onPress} activeOpacity={0.7}>
      <Text style={localStyles.text}>Foto</Text>
    </TouchableOpacity>
  );
};

export default ProfileCircle;

const localStyles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#888',
    fontSize: 14,
  },
});

