import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { tema } from "@/src/data/tema";

const NUTRISCORE: Record<string, { bg: string; texto: string; letra: string }> = {
  a: { bg: "#038141", texto: "#FFFFFF", letra: "A" },
  b: { bg: "#85BB2F", texto: "#FFFFFF", letra: "B" },
  c: { bg: "#FECB02", texto: "#2D3436", letra: "C" },
  d: { bg: "#EE8100", texto: "#FFFFFF", letra: "D" },
  e: { bg: "#E63E11", texto: "#FFFFFF", letra: "E" },
};

interface Props {
  barcode: string;
  nombre: string;
  marca: string;
  puntuacion: number;
  nutriscore?: string;
  imagenUrl?: string;
}

export const TarjetaFavorito = ({
  barcode,
  nombre,
  marca,
  puntuacion,
  nutriscore,
  imagenUrl,
}: Props) => {
  const router = useRouter();
  const ns = nutriscore ? NUTRISCORE[nutriscore] : undefined;

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
      style={({ pressed }) => [styles.tarjeta, pressed && { opacity: 0.8 }]}
      onPress={irAProducto}
    >
      <View style={styles.contenedorImagen}>
        {imagenUrl ? (
          <ExpoImage
            source={{ uri: imagenUrl }}
            style={styles.imagen}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderImagen}>
            <Ionicons
              name="fast-food-outline"
              size={28}
              color={tema.colors.border}
            />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.marca} numberOfLines={1}>
          {marca}
        </Text>
        <Text style={styles.nombre} numberOfLines={2}>
          {nombre}
        </Text>
        <View style={styles.filaPuntaje}>
          <View style={[styles.badgeNutriscore, { backgroundColor: ns?.bg ?? "#B2BEC3" }]}>
            <Text style={[styles.textoNutriscore, { color: ns?.texto ?? "#FFFFFF" }]}>
              {ns?.letra ?? "N/D"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    width: 150,
    backgroundColor: tema.colors.card,
    borderRadius: tema.radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contenedorImagen: {
    width: "100%",
    height: 100,
    backgroundColor: "#F9F9F9",
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  placeholderImagen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 8,
    gap: 2,
  },
  marca: {
    fontSize: 8,
    color: tema.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  nombre: {
    fontSize: 11,
    fontWeight: "600",
    color: tema.colors.text,
  },
  filaPuntaje: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  badgeNutriscore: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    minWidth: 26,
    alignItems: "center",
  },
  textoNutriscore: {
    fontSize: 10,
    fontWeight: "700",
  },
});
