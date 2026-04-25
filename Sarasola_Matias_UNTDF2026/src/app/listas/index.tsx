import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TarjetaCategoria } from '../../components/categoria/TarjetaCategoria';
import { tema } from '../../constants/tema';
import { CATEGORIAS } from '../../constants/categorias';

import { TabBar } from '../../components/layout/TabBar';

export default function ListasScreen() {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Categorías</Text>
          <Text style={styles.subtitle}>Selecciona una categoría para ver los alimentos</Text>
        </View>

        <FlatList
          data={CATEGORIAS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TarjetaCategoria
              nombre={item.nombre}
              slug={item.slug}
              icono={item.icono as unknown as keyof typeof import('@expo/vector-icons').Ionicons.glyphMap}
              color={item.color}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: tema.spacing.lg,
  },
  header: {
    marginTop: tema.spacing.lg,
    marginBottom: tema.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: tema.colors.text,
  },
  subtitle: {
    fontSize: tema.text.base,
    color: tema.colors.textSecondary,
    marginTop: tema.spacing.xs,
  },
  listContent: {
    paddingBottom: 100, // Espacio para el tab bar si fuera necesario
  },
});
