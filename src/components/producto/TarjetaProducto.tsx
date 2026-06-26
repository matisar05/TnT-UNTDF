import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { tema } from "@/src/data/tema";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { FAVORITOS_HOOK_KEY, useFavoritos } from "@/src/hooks/useFavoritos";
import {
  addFavorito,
  removeFavorito,
  ProductoFavorito,
} from "@/src/services/favoritos.service";

interface PropsTarjetaProducto {
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion?: number;
  imagen?: ImageSourcePropType;
  ingredientes?: string[];
  alergenos?: string[];
  infoNutricional?: {
    porcion: string;
    calorias: number;
    grasasTotales: number;
    grasasSaturadas: number;
    carbohidratos: number;
    azucares: number;
    proteinas: number;
    sodio: number;
  };
  receta?: string;
}

function extraerImagenUrl(imagen: unknown): string | undefined {
  if (imagen && typeof imagen === "object" && "uri" in imagen) {
    return (imagen as { uri: string }).uri;
  }
  return undefined;
}

export const TarjetaProducto = ({ nombre, marca, barcode, puntuacion = 85, imagen, ingredientes, alergenos, infoNutricional, receta }: PropsTarjetaProducto) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: favoritos } = useFavoritos();
  const esFav = favoritos?.some((f) => f.barcode === barcode) ?? false;

  async function toggleFavorito() {
    try {
      if (esFav) {
        await removeFavorito(barcode);
      } else {
        const fav: ProductoFavorito = {
          barcode,
          nombre,
          marca,
          puntuacion,
          imagenUrl: extraerImagenUrl(imagen),
        };
        await addFavorito(fav);
      }
      queryClient.invalidateQueries({ queryKey: FAVORITOS_HOOK_KEY });
    } catch (error) {
      console.error("Error al guardar/eliminar favorito", error);
    }
  }

  const irAProducto = () => {
    router.push(buildRoute(RUTAS.PRODUCTO, {
      barcode,
      nombre,
      marca,
      puntuacion: String(puntuacion),
      imagenUrl: extraerImagenUrl(imagen) ?? "",
      ingredientes: JSON.stringify(ingredientes ?? []),
      alergenos: JSON.stringify(alergenos ?? []),
      infoNutricional: JSON.stringify(infoNutricional ?? null),
      receta: receta ?? "",
    }));
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.contenedor, pressed && { opacity: 0.8 }]}
      onPress={irAProducto}
      android_ripple={{ color: tema.colors.primary + '20', borderless: false }}
    >
      <View style={styles.contenedorImagen}>
        {imagen ? (
          <Image source={imagen} style={styles.imagen} contentFit="contain" transition={200} />
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
          <Pressable
            onPress={toggleFavorito}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={esFav ? "heart" : "heart-outline"}
              size={20}
              color={esFav ? "#E74C3C" : tema.colors.textSecondary}
            />
          </Pressable>
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
