import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#999', textAlign: 'center' },
  profileWrapper: { alignItems: 'center', marginBottom: 30 },
  buttonsContainer: { width: '100%', alignItems: 'center' },
});
