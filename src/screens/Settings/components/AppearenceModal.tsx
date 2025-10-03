import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../shared/config/colors';
//import { useTheme } from '../../../shared/hooks/useTheme'; --> Función futura...

export default function AppearanceModal({ visible, onClose }: any) {
  //const { themes, current, setTheme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Cambiar Apariencia</Text>
          {/* {Object.keys(themes).map((k) => (
            <TouchableOpacity key={k} style={styles.option} onPress={() => { setTheme(k); onClose(); }}>
              <Text style={[styles.optionText, current === k && { fontWeight: '700' }]}>{k}</Text>
            </TouchableOpacity>
          ))} */}
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { backgroundColor: Colors.background, padding: 20, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { color: Colors.textPrimary, fontSize: 18, marginBottom: 12 },
  option: { paddingVertical: 12 },
  optionText: { color: Colors.textPrimary },
  close: { marginTop: 10, alignSelf: 'flex-end' },
  closeText: { color: Colors.primary },
});
