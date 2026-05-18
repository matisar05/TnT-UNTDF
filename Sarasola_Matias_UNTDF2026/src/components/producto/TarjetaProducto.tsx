import { useRouter } from "expo-router";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/src/data/tema";
import { buildRoute, RUTAS } from "@/src/navigation/routes";

interface PropsTarjetaProducto {
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion?: number;
  imagen?: ImageSourcePropType;
}

export const TarjetaProducto = ({ nombre, marca, barcode, puntuacion = 85, imagen }: PropsTarjetaProducto) => {
  const router = useRouter();

  const irAProducto = () => {
    router.push(buildRoute(RUTAS.PRODUCTO, { barcode }));
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.contenedor, pressed && { opacity: 0.8 }]}
      onPress={irAProducto}
      android_ripple={{ color: tema.colors.primary + '20', borderless: false }}
    >
      <View style={styles.contenedorImagen}>
        {imagen ? (
          <Image source={imagen} style={styles.imagen} />
        ) : (
          <View style={styles.placeholderImagen}>
            <Ionicons name="fast-food-outline" size={32} color={tema.colors.border} />
          </View>
        )}
      </View>

      <View style={styles.contenedorInfo}>
        <Text style={styles.marca}>{marca}</Text>
        <Text style={styles.nombre} numberOfLines={2}>{nombre}</Text>

        <View style={styles.pie}>
          <View style={styles.contenedorPuntaje}>
            <View style={[styles.puntoPuntaje, { backgroundColor: puntuacion > 70 ? "#2ECC71" : "#F1C40F" }]} />
            <Text style={styles.textoPuntaje}>{puntuacion}/100</Text>
          </View>
          <Ionicons name="heart-outline" size={20} color={tema.colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: tema.colors.card,
    borderRadius: tema.radius.md,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contenedorImagen: {
    width: 110,
    height: 110,
    backgroundColor: "#F9F9F9",
  },
  imagen: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholderImagen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  marca: {
    fontSize: 10,
    color: tema.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  nombre: {
    fontSize: 15,
    fontWeight: "600",
    color: tema.colors.text,
    marginTop: 2,
  },
  pie: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  contenedorPuntaje: {
    flexDirection: "row",
    alignItems: "center",
  },
  puntoPuntaje: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  textoPuntaje: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    fontWeight: "500",
  },
});
