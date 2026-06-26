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

const NUTRISCORE: Record<string, { bg: string; texto: string; letra: string }> = {
  a: { bg: "#038141", texto: "#FFFFFF", letra: "A" },
  b: { bg: "#85BB2F", texto: "#FFFFFF", letra: "B" },
  c: { bg: "#FECB02", texto: "#2D3436", letra: "C" },
  d: { bg: "#EE8100", texto: "#FFFFFF", letra: "D" },
  e: { bg: "#E63E11", texto: "#FFFFFF", letra: "E" },
};

interface PropsTarjetaProducto {
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion?: number;
  nutriscore?: string;
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

export const TarjetaProducto = ({ nombre, marca, barcode, puntuacion = 0, nutriscore, imagen, ingredientes, alergenos, infoNutricional, receta }: PropsTarjetaProducto) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: favoritos } = useFavoritos();
  const esFav = favoritos?.some((f) => f.barcode === barcode) ?? false;
  const ns = nutriscore ? NUTRISCORE[nutriscore] : undefined;

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
          nutriscore,
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
      nutriscore: nutriscore ?? "",
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
          <View style={[styles.badgeNutriscore, { backgroundColor: ns?.bg ?? "#B2BEC3" }]}>
            <Text style={[styles.textoNutriscore, { color: ns?.texto ?? "#FFFFFF" }]}>
              {ns?.letra ?? "N/D"}
            </Text>
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
  badgeNutriscore: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 32,
    alignItems: "center",
  },
  textoNutriscore: {
    fontSize: 12,
    fontWeight: "700",
  },
});
