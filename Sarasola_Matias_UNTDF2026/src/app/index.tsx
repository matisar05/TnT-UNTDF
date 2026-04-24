import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tema } from '../constants/tema';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      <View style={styles.hero}>

        <View style={styles.dashed}>
          <Text style={styles.heroLabel}>[¡Bienvenido "usuario X"!]</Text>
        </View>

        <View style={[styles.dashed, styles.mt8]}>
          <Text style={styles.heroLabel}>[Barra de búsqueda]</Text>
        </View>

        <View style={[styles.dashed, styles.row, styles.mt8]}>
          <View style={styles.cell}>
            <Text style={styles.heroLabel}>[Perfil]</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.heroLabel}>[Config]</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.heroLabel}>[Historial]</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.heroLabel}>[Info]</Text>
          </View>
        </View>

      </View>

      <View style={[styles.dashed, styles.banner]}>
        <Text style={styles.label}>[Banner Foro/Noticias]</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Favoritos</Text>
        <View style={[styles.dashed, styles.horizontalList]}>
          <Text style={styles.label}>[Lista horizontal de favoritos]</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={[styles.dashed, styles.grid]}>
          <Text style={styles.label}>[Grid de categorías]</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabCell} 
          onPress={() => {
            // No redirigir si ya estamos en home
            // En Expo Router, '/' es la ruta de index.tsx
          }}
        >
          <Text style={[styles.tabLabel, { color: tema.colors.primary, fontWeight: 'bold' }]}>[Home]</Text>
        </TouchableOpacity>
        <View style={styles.tabCell}>
          <Text style={styles.tabLabel}>[Cámara]</Text>
        </View>
        <TouchableOpacity 
          style={styles.tabCell} 
          onPress={() => router.navigate('/listas')}
        >
          <Text style={styles.tabLabel}>[Listas]</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  content: {
    paddingBottom: 80,
  },

  hero: {
    backgroundColor: tema.colors.primary,
    padding: 20,
    paddingTop: 40,
  },

  banner: {
    margin: 16,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: tema.colors.text,
    marginBottom: 8,
  },
  horizontalList: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

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

  dashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    color: tema.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  heroLabel: {
    color: tema.colors.bannerText,
    fontSize: 13,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    margin: 2,
  },
  mt8: {
    marginTop: 8,
  },
});
