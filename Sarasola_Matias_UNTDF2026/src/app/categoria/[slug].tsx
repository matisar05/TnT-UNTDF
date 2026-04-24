import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';
import { TarjetaProducto } from '../../components/producto/TarjetaProducto';

// Datos de ejemplo según la categoría
const PRODUCTOS_POR_CATEGORIA: Record<string, any[]> = {
  bebidas: [
    { id: 'b1', nombre: 'Agua Mineral 1.5L', marca: 'Villavicencio', barcode: '779123400001', puntuacion: 95 },
    { id: 'b2', nombre: 'Coca Cola Original 2.25L', marca: 'Coca Cola', barcode: '779123400002', puntuacion: 30 },
    { id: 'b3', nombre: 'Jugo de Naranja 1L', marca: 'Cepita', barcode: '779123400003', puntuacion: 65 },
  ],
  lacteos: [
    { id: 'l1', nombre: 'Leche Entera 1L', marca: 'La Serenísima', barcode: '7791234567890', puntuacion: 85 },
    { id: 'l2', nombre: 'Yogur de Frutilla', marca: 'Yogurísimo', barcode: '7791234567891', puntuacion: 72 },
    { id: 'l3', nombre: 'Queso Crema 290g', marca: 'Casancrem', barcode: '7791234567892', puntuacion: 68 },
  ],
  panaderia: [
    { id: 'p1', nombre: 'Pan de Molde Blanco', marca: 'Bimbo', barcode: '779123400011', puntuacion: 55 },
    { id: 'p2', nombre: 'Galletitas de Agua', marca: 'Traviata', barcode: '779123400012', puntuacion: 70 },
  ],
  default: [
    { id: 'd1', nombre: 'Producto Genérico', marca: 'Marca Base', barcode: '000000000000', puntuacion: 50 },
  ]
};

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  // Capitalizar el slug para el título
  const titulo = typeof slug === 'string' 
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') 
    : 'Categoría';

  // Obtener los productos correspondientes al slug
  const productos = (typeof slug === 'string' && PRODUCTOS_POR_CATEGORIA[slug]) 
    ? PRODUCTOS_POR_CATEGORIA[slug] 
    : PRODUCTOS_POR_CATEGORIA.default;

  return (
    <View style={styles.safeArea}>
      <Stack.Screen options={{ title: titulo }} />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={tema.colors.textSecondary} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Buscar en {titulo.toLowerCase()}...</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: tema.colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: tema.colors.textSecondary,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 40,
  },
  resultCount: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
});
