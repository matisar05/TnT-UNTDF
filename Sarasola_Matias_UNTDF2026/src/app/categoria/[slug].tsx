import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';
import { TarjetaProducto } from '../../components/producto/TarjetaProducto';
import { PRODUCTOS_POR_CATEGORIA } from '../../constants/productos';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const titulo = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') 
    : 'Categoría';

  const productos = (slug && PRODUCTOS_POR_CATEGORIA[slug]) 
    ? PRODUCTOS_POR_CATEGORIA[slug] 
    : PRODUCTOS_POR_CATEGORIA.default;

  return (
    <View style={styles.containerPrincipal}>
      <Stack.Screen options={{ title: titulo }} />
      <View style={styles.container}>
        <View style={[styles.dashed, styles.search]}>
          <Text style={styles.label}>[Barra de búsqueda]</Text>
        </View>

        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TarjetaProducto
              nombre={item.nombre}
              marca={item.marca}
              barcode={item.barcode}
              puntuacion={item.puntuacion}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.resultCount}>{productos.length} productos encontrados</Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: tema.spacing.lg,
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: tema.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: tema.colors.textSecondary,
    fontSize: tema.text.base,
    textAlign: 'center',
  },
  search: {
    height: 44,
    marginVertical: tema.spacing.md,
  },
  listContent: {
    paddingBottom: tema.spacing.xl,
  },
  resultCount: {
    fontSize: tema.text.sm,
    color: tema.colors.textSecondary,
    marginBottom: tema.spacing.md,
    fontWeight: '500',
  },
});
