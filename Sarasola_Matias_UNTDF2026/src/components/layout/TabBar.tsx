import { useRouter, usePathname } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tema } from '../../constants/tema';

export const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isListas = pathname.startsWith('/listas');
  const isCamara = pathname.startsWith('/camara'); // For future implementation

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabCell} 
        onPress={() => {
          // Navegar a home mediante navigate (solo si no estamos ya allí)
          router.navigate('/');
        }}
      >
        <Text style={[
          styles.tabLabel, 
          isHome && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Home]</Text>
      </TouchableOpacity>
      <View style={styles.tabCell}>
        <Text style={[
          styles.tabLabel,
          isCamara && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Cámara]</Text>
      </View>
      <TouchableOpacity 
        style={styles.tabCell} 
        onPress={() => {
          // Navegar usando navigate para no amontonar en el stack si ya estamos ahí
          router.navigate('/listas');
        }}
      >
        <Text style={[
          styles.tabLabel,
          isListas && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Listas]</Text>
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
