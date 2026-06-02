import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TarjetaCategoria } from "@/src/components/categoria/TarjetaCategoria";
import { CATEGORIAS } from "@/src/data/categorias";
import { buildRoute, RUTAS } from "@/src/navigation/routes";

export default function PantallaListas() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");

  const irACategoria = (slug: string, tag: string) => {
    router.push(buildRoute(RUTAS.CATEGORIA, { slug, tag }));
  };

  const categoriasFiltradas =
    busqueda.length > 0
      ? CATEGORIAS.filter((cat) => {
          const normalizar = (s: string) =>
            s
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase();
          return normalizar(cat.nombre).includes(normalizar(busqueda));
        })
      : CATEGORIAS;

  return (
    <View style={styles.contenedor}>
      <FlashList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TarjetaCategoria
            nombre={item.nombre}
            slug={item.slug}
            icono={item.icono}
            color={item.color}
            onPress={() => irACategoria(item.slug, item.tag)}
          />
        )}
        contentContainerStyle={styles.contenidoLista}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <Text style={styles.titulo}>Categorías</Text>
            <Text style={styles.subtitulo}>Selecciona una categoría para ver los alimentos</Text>
            <TextInput
              style={styles.buscador}
              placeholder="Buscar categoría..."
              placeholderTextColor="#B2BEC3"
              value={busqueda}
              onChangeText={setBusqueda}
              returnKeyType="search"
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>Sin resultados para "{busqueda}"</Text>
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
  buscador: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#2D3436",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  vacio: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 32,
  },
});
