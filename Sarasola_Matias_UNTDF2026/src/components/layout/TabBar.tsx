import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tema } from '../../constants/tema';

export const TabBar = () => {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabCell} 
        onPress={() => {
          // Navegar a home solo si no estamos ya allí
          router.navigate('/');
        }}
      >
        <Text style={[styles.tabLabel, { color: tema.colors.primary, fontWeight: 'bold' }]}>[Home]</Text>
      </TouchableOpacity>
      <View style={styles.tabCell}>
        <Text style={styles.tabLabel}>[Cámara]</Text>
      </View>
      <TouchableOpacity 
        style={styles.tabCell} 
        onPress={() => router.push('/listas')}
      >
        <Text style={styles.tabLabel}>[Listas]</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: tema.colors.card,
    borderTopWidth: 1,
    borderTopColor: tema.colors.border,
    flexDirection: 'row',
  },
  tabCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: tema.colors.textSecondary,
  },
});
