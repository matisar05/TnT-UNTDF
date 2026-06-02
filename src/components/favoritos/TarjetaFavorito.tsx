import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { tema } from "@/src/data/tema";

interface Props {
  barcode: string;
  nombre: string;
  marca: string;
  puntuacion: number;
  imagenUrl?: string;
}

export const TarjetaFavorito = ({
  barcode,
  nombre,
  marca,
  puntuacion,
  imagenUrl,
}: Props) => {
  const router = useRouter();

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
          <View
            style={[
              styles.puntoPuntaje,
              {
                backgroundColor:
                  puntuacion > 70 ? "#2ECC71" : "#F1C40F",
              },
            ]}
          />
          <Text style={styles.textoPuntaje}>{puntuacion}/100</Text>
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
  puntoPuntaje: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  textoPuntaje: {
    fontSize: 10,
    color: tema.colors.textSecondary,
    fontWeight: "500",
  },
});
