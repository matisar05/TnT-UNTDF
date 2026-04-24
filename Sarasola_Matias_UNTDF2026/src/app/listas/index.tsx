import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TarjetaCategoria } from '../../components/categoria/TarjetaCategoria';
import { tema } from '../../constants/tema';

const CATEGORIAS = [
  { id: '1', nombre: 'Bebidas', slug: 'bebidas', icono: 'wine-outline', color: '#3498DB' },
  { id: '2', nombre: 'Lácteos', slug: 'lacteos', icono: 'water-outline', color: '#F1C40F' },
  { id: '3', nombre: 'Panadería', slug: 'panaderia', icono: 'pizza-outline', color: '#E67E22' },
  { id: '4', nombre: 'Frutas y Verduras', slug: 'frutas-verduras', icono: 'leaf-outline', color: '#2ECC71' },
  { id: '5', nombre: 'Carnes', slug: 'carnes', icono: 'restaurant-outline', color: '#E74C3C' },
  { id: '6', nombre: 'Congelados', slug: 'congelados', icono: 'snow-outline', color: '#9B59B6' },
  { id: '7', nombre: 'Almacén', slug: 'almacen', icono: 'basket-outline', color: '#1ABC9C' },
  { id: '8', nombre: 'Snacks y Dulces', slug: 'snacks-dulces', icono: 'ice-cream-outline', color: '#E91E63' },
];

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
              icono={item.icono as any}
              color={item.color}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: tema.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 100, // Espacio para el tab bar si fuera necesario
  },
});
