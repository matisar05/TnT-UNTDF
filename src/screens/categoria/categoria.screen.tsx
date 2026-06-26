import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TarjetaProducto } from "@/src/components/producto/TarjetaProducto";
import { useProductos } from "@/src/hooks/useProductos";
import { tema } from "@/src/data/tema";

type ParamsCategoria = {
  slug: string;
  tag: string;
};

export function PantallaCategoria() {
  const { slug, tag } = useLocalSearchParams<ParamsCategoria>();

  const titulo = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
    : "Categoría";

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductos(tag ?? slug ?? "");

  const productos = data?.pages.flatMap((p) => p.productos) ?? [];

  if (isLoading) {
    return (
      <View style={styles.contenedor}>
        <Stack.Screen options={{ title: titulo }} />
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={tema.colors.primary} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.contenedor}>
        <Stack.Screen options={{ title: titulo }} />
        <View style={styles.centrado}>
          <Text style={styles.errorTitulo}>Error al cargar productos</Text>
          <Text style={styles.errorDetalle}>{(error as Error).message}</Text>
        </View>
      </View>
    );
  }

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
            nutriscore={item.nutriscore}
            imagen={item.imagen}
            ingredientes={item.ingredientes}
            alergenos={item.alergenos}
            infoNutricional={item.infoNutricional}
            receta={item.receta}
          />
        )}
        contentContainerStyle={styles.contenidoLista}
ListHeaderComponent={
          <Text style={styles.cantidadResultados}>
            {productos.length} productos cargados
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>No se encontraron productos</Text>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              style={styles.loader}
              color={tema.colors.primary}
            />
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  contenidoLista: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cantidadResultados: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginBottom: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E74C3C",
    marginBottom: 8,
  },
  errorDetalle: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    textAlign: "center",
  },
  vacio: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    textAlign: "center",
    marginTop: 32,
  },
  loader: {
    marginVertical: 20,
  },
});
