import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { FAVORITOS_HOOK_KEY, useFavoritos } from "@/src/hooks/useFavoritos";
import { useRefreshOnFocus } from "@/src/hooks/useRefreshOnFocus";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { tema } from "@/src/data/tema";

const MAX_VISIBLES = 10;

export function PantallaFavoritos() {
  useRefreshOnFocus(FAVORITOS_HOOK_KEY);
  const { data: favoritos = [] } = useFavoritos();

  if (favoritos.length === 0) {
    return (
      <View style={styles.vacio}>
        <Ionicons name="heart-outline" size={64} color={tema.colors.border} />
        <Text style={styles.tituloVacio}>Sin favoritos</Text>
        <Text style={styles.descripcionVacio}>
          Agregá productos a favoritos desde el detalle de cada uno.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.barcode}
        numColumns={2}
        contentContainerStyle={styles.contenidoLista}
        columnWrapperStyle={styles.fila}
        renderItem={({ item }) => (
          <TarjetaFavoritoGrid {...item} />
        )}
        ListHeaderComponent={
          <Text style={styles.encabezado}>
            {favoritos.length} producto{favoritos.length !== 1 ? "s" : ""} guardado{favoritos.length !== 1 ? "s" : ""}
          </Text>
        }
        ListFooterComponent={<View style={styles.espacioFinal} />}
      />
    </View>
  );
}

function TarjetaFavoritoGrid({
  barcode,
  nombre,
  marca,
  puntuacion,
  imagenUrl,
}: {
  barcode: string;
  nombre: string;
  marca: string;
  puntuacion: number;
  imagenUrl?: string;
}) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 52) / 2;

  const irAProducto = useCallback(() => {
    router.push(buildRoute(RUTAS.PRODUCTO, {
      barcode,
      nombre,
      marca,
      puntuacion: String(puntuacion),
      imagenUrl: imagenUrl ?? "",
    }));
  }, [router, barcode, nombre, marca, puntuacion, imagenUrl]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tarjetaGrid,
        { width: cardWidth },
        pressed && { opacity: 0.8 },
      ]}
      onPress={irAProducto}
    >
      <View style={styles.contenedorImagenGrid}>
        {imagenUrl ? (
          <ExpoImage
            source={{ uri: imagenUrl }}
            style={styles.imagenGrid}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderImagenGrid}>
            <Ionicons name="fast-food-outline" size={32} color={tema.colors.border} />
          </View>
        )}
      </View>
      <View style={styles.infoGrid}>
        <Text style={styles.marcaGrid} numberOfLines={1}>{marca}</Text>
        <Text style={styles.nombreGrid} numberOfLines={2}>{nombre}</Text>
        <View style={styles.filaPuntajeGrid}>
          <View style={[styles.puntoPuntajeGrid, { backgroundColor: puntuacion > 70 ? "#2ECC71" : "#F1C40F" }]} />
          <Text style={styles.textoPuntajeGrid}>{puntuacion}/100</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  contenidoLista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  encabezado: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginBottom: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  fila: {
    gap: 12,
    marginBottom: 12,
  },
  tarjetaGrid: {
    backgroundColor: tema.colors.card,
    borderRadius: tema.radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contenedorImagenGrid: {
    width: "100%",
    height: 130,
    backgroundColor: "#F9F9F9",
  },
  imagenGrid: {
    width: "100%",
    height: "100%",
  },
  placeholderImagenGrid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoGrid: {
    padding: 10,
    gap: 3,
  },
  marcaGrid: {
    fontSize: 9,
    color: tema.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  nombreGrid: {
    fontSize: 13,
    fontWeight: "600",
    color: tema.colors.text,
  },
  filaPuntajeGrid: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  puntoPuntajeGrid: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  textoPuntajeGrid: {
    fontSize: 10,
    color: tema.colors.textSecondary,
    fontWeight: "500",
  },
  espacioFinal: {
    height: 32,
  },
  vacio: {
    flex: 1,
    backgroundColor: tema.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  tituloVacio: {
    fontSize: 20,
    fontWeight: "700",
    color: tema.colors.text,
    marginTop: 8,
  },
  descripcionVacio: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
