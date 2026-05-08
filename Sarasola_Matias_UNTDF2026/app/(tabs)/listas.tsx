import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TarjetaCategoria } from "@/src/components/categoria/TarjetaCategoria";
import { CATEGORIAS } from "@/src/data/categorias";
import { construirRuta, RUTAS } from "@/src/navigation/routes";

export default function PantallaListas() {
  const router = useRouter();

  const irACategoria = (slug: string) => {
    router.push(construirRuta(RUTAS.CATEGORIA, { slug }));
  };

  return (
    <View style={styles.contenedor}>
      <FlashList
        data={CATEGORIAS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TarjetaCategoria
            nombre={item.nombre}
            slug={item.slug}
            icono={item.icono}
            color={item.color}
            onPress={() => irACategoria(item.slug)}
          />
        )}
        contentContainerStyle={styles.contenidoLista}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <Text style={styles.titulo}>Categorías</Text>
            <Text style={styles.subtitulo}>Selecciona una categoría para ver los alimentos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  contenidoLista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  encabezado: {
    marginTop: 20,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3436",
  },
  subtitulo: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
  },
});
