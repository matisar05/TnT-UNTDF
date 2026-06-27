import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TarjetaProducto } from "@/src/components/producto/TarjetaProducto";
import { useBusqueda } from "@/src/hooks/useBusqueda";
import { tema } from "@/src/data/tema";
import { Producto } from "@/src/data/productos";

export function PantallaBusqueda() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBusqueda(query);

  const productos: Producto[] = data?.pages.flatMap((p) => p.productos) ?? [];

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: "Buscar" }} />

      <View style={styles.contenedorInput}>
        <TextInput
          style={styles.input}
          placeholder="Buscar producto..."
          placeholderTextColor={tema.colors.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => setQuery(input.trim())}
          returnKeyType="search"
          autoFocus
        />
      </View>

      {isLoading && (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={tema.colors.primary} />
        </View>
      )}

      {isError && (
        <View style={styles.centrado}>
          <Text style={styles.errorTexto}>{(error as Error).message}</Text>
        </View>
      )}

      {!isLoading && !isError && query.length > 1 && (
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
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <Text style={styles.resultados}>
              {productos.length} resultados para "{query}"
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
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  contenedorInput: {
    padding: 16,
    backgroundColor: tema.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: tema.colors.border,
  },
  input: {
    backgroundColor: tema.colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: tema.colors.text,
    borderWidth: 1,
    borderColor: tema.colors.border,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  resultados: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  vacio: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    textAlign: "center",
    marginTop: 32,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTexto: {
    fontSize: 14,
    color: "#E74C3C",
    textAlign: "center",
    padding: 20,
  },
  loader: {
    marginVertical: 16,
  },
});
