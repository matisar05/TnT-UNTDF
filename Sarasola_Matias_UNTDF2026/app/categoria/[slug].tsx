import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TarjetaProducto } from "@/src/components/producto/TarjetaProducto";
import { PRODUCTOS_POR_CATEGORIA } from "@/src/data/productos";

type ParamsCategoria = {
  slug: string;
};

export default function PantallaCategoria() {
  const { slug } = useLocalSearchParams<ParamsCategoria>();

  const titulo = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
    : "Categoría";

  const productos = slug && PRODUCTOS_POR_CATEGORIA[slug]
    ? PRODUCTOS_POR_CATEGORIA[slug]
    : PRODUCTOS_POR_CATEGORIA.default;

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: titulo }} />
      <FlashList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TarjetaProducto
            nombre={item.nombre}
            marca={item.marca}
            barcode={item.barcode}
            puntuacion={item.puntuacion}
            imagen={item.imagen}
          />
        )}
        contentContainerStyle={styles.contenidoLista}
        ListHeaderComponent={
          <Text style={styles.cantidadResultados}>
            {productos.length} productos encontrados
          </Text>
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
    paddingBottom: 40,
  },
  cantidadResultados: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 16,
    marginTop: 16,
    fontWeight: "500",
  },
});
