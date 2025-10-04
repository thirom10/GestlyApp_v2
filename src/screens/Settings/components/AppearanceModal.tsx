import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../shared/config/colors';
import { SettingsStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

export default function AppearanceModal() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Apariencia</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, padding: 20, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { color: Colors.textPrimary, fontSize: 18, marginBottom: 12 },
  closeText: { color: Colors.primary },
});
