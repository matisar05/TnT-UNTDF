import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/src/data/tema";
import { obtenerProductoPorBarcode, Producto } from "@/src/data/productos";
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

type ParamsProducto = {
  barcode: string;
  nombre?: string;
  marca?: string;
  puntuacion?: string;
  nutriscore?: string;
  imagenUrl?: string;
  ingredientes?: string;
  alergenos?: string;
  infoNutricional?: string;
  receta?: string;
};

function extraerImagenUrl(imagen: unknown): string | undefined {
  if (imagen && typeof imagen === "object" && "uri" in imagen) {
    return (imagen as { uri: string }).uri;
  }
  return undefined;
}

function productoDesdeParams(params: ParamsProducto): Producto {
  const imgUrl = params.imagenUrl;
  const info = params.infoNutricional
    ? JSON.parse(params.infoNutricional)
    : null;
  return {
    id: params.barcode,
    nombre: params.nombre ?? "Sin nombre",
    marca: params.marca ?? "",
    barcode: params.barcode,
    puntuacion: Number(params.puntuacion ?? 0),
    nutriscore: params.nutriscore || undefined,
    imagen: imgUrl ? { uri: imgUrl } : undefined,
    ingredientes: JSON.parse(params.ingredientes ?? "[]"),
    alergenos: JSON.parse(params.alergenos ?? "[]"),
    infoNutricional: info || {
      porcion: "N/D",
      calorias: 0,
      grasasTotales: 0,
      grasasSaturadas: 0,
      carbohidratos: 0,
      azucares: 0,
      proteinas: 0,
      sodio: 0,
    },
    receta: params.receta || undefined,
  };
}

export function PantallaProducto() {
  const params = useLocalSearchParams<ParamsProducto>();
  const { barcode } = params;

  const producto: Producto | undefined = barcode
    ? (obtenerProductoPorBarcode(barcode) ?? productoDesdeParams(params))
    : undefined;

  const queryClient = useQueryClient();
  const { data: favoritos } = useFavoritos();
  const favorito = favoritos?.some((f) => f.barcode === barcode) ?? false;

  async function toggleFavorito() {
    if (!producto) return;
    try {
      if (favorito) {
        await removeFavorito(producto.barcode);
      } else {
        const fav: ProductoFavorito = {
          barcode: producto.barcode,
          nombre: producto.nombre,
          marca: producto.marca,
          puntuacion: producto.puntuacion,
          nutriscore: producto.nutriscore,
          imagenUrl: extraerImagenUrl(producto.imagen),
        };
        await addFavorito(fav);
      }
      queryClient.invalidateQueries({ queryKey: FAVORITOS_HOOK_KEY });
    } catch (error) {
      console.error("Error al guardar/eliminar favorito", error);
    }
  }

  if (!producto) {
    return (
      <View style={styles.contenedor}>
        <Stack.Screen options={{ title: "Producto" }} />
        <View style={styles.noEncontrado}>
          <Ionicons name="alert-circle-outline" size={48} color={tema.colors.textSecondary} />
          <Text style={styles.textoNoEncontrado}>Producto no encontrado</Text>
          <Text style={styles.codigoNoEncontrado}>Código: {barcode ?? "N/D"}</Text>
        </View>
      </View>
    );
  }

  const ns = producto.nutriscore ? NUTRISCORE[producto.nutriscore] : undefined;

  return (
    <ScrollView style={styles.scroll}>
      <Stack.Screen
        options={{
          title: producto.nombre,
          headerRight: () => (
            <Pressable onPress={toggleFavorito} hitSlop={8}>
              <Ionicons
                name={favorito ? "heart" : "heart-outline"}
                size={22}
                color={favorito ? "#E74C3C" : tema.colors.textSecondary}
              />
            </Pressable>
          ),
        }}
      />

      <View style={styles.contenedorImagen}>
        {producto.imagen ? (
          <ExpoImage source={producto.imagen} style={styles.imagen} contentFit="contain" transition={300} />
        ) : (
          <View style={styles.placeholderImagen}>
            <Ionicons name="fast-food-outline" size={64} color={tema.colors.border} />
          </View>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.marca}>{producto.marca}</Text>
        <Text style={styles.nombre}>{producto.nombre}</Text>

        <View style={styles.filaNutriscore}>
          <View style={[styles.badgeNutriscore, { backgroundColor: ns?.bg ?? "#B2BEC3" }]}>
            <Text style={[styles.textoNutriscore, { color: ns?.texto ?? "#FFFFFF" }]}>
              {ns?.letra ?? "Sin score"}
            </Text>
          </View>
          <Text style={styles.etiquetaNutriscore}>Nutri-Score</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Ingredientes</Text>
        {producto.ingredientes.map((ingrediente, index) => (
          <View key={index} style={styles.filaIngrediente}>
            <Text style={styles.punto}>•</Text>
            <Text style={styles.textoIngrediente}>{ingrediente}</Text>
          </View>
        ))}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Alérgenos</Text>
        <View style={styles.contenedorAlergenos}>
          {producto.alergenos.map((alergeno, index) => (
            <View key={index} style={styles.chipAlergeno}>
              <Ionicons name="warning-outline" size={14} color={tema.colors.primary} />
              <Text style={styles.textoChip}>{alergeno}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Información Nutricional</Text>
        <Text style={styles.porcion}>Porción: {producto.infoNutricional.porcion}</Text>

        <View style={styles.tablaNutricional}>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Calorías</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.calorias} kcal</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Grasas Totales</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.grasasTotales} g</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Grasas Saturadas</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.grasasSaturadas} g</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Carbohidratos</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.carbohidratos} g</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Azúcares</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.azucares} g</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Proteínas</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.proteinas} g</Text>
          </View>
          <View style={styles.filaTabla}>
            <Text style={styles.celdaConcepto}>Sodio</Text>
            <Text style={styles.celdaValor}>{producto.infoNutricional.sodio} mg</Text>
          </View>
        </View>
      </View>

      {producto.receta && (
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Receta Sugerida</Text>
          <View style={styles.contenedorReceta}>
            <Ionicons name="restaurant-outline" size={20} color={tema.colors.primary} />
            <Text style={styles.textoReceta}>{producto.receta}</Text>
          </View>
        </View>
      )}

      <View style={styles.espacioFinal} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  contenedor: {
    flex: 1,
    backgroundColor: tema.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  noEncontrado: {
    alignItems: "center",
    padding: 32,
  },
  textoNoEncontrado: {
    fontSize: 18,
    fontWeight: "600",
    color: tema.colors.text,
    marginTop: 12,
  },
  codigoNoEncontrado: {
    fontSize: 13,
    color: tema.colors.textSecondary,
    marginTop: 4,
  },
  contenedorImagen: {
    width: "100%",
    height: 300,
    maxWidth: 500,
    alignSelf: "center",
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
  seccion: {
    backgroundColor: tema.colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: tema.radius.md,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  marca: {
    fontSize: 11,
    color: tema.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nombre: {
    fontSize: 22,
    fontWeight: "700",
    color: tema.colors.text,
  },
  filaNutriscore: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  badgeNutriscore: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 44,
    alignItems: "center",
  },
  textoNutriscore: {
    fontSize: 16,
    fontWeight: "800",
  },
  etiquetaNutriscore: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    fontWeight: "500",
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: "700",
    color: tema.colors.text,
    marginBottom: 12,
  },
  filaIngrediente: {
    flexDirection: "row",
    marginBottom: 6,
  },
  punto: {
    fontSize: 14,
    color: tema.colors.primary,
    marginRight: 8,
    lineHeight: 20,
  },
  textoIngrediente: {
    fontSize: 14,
    color: tema.colors.text,
    lineHeight: 20,
    flex: 1,
  },
  contenedorAlergenos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipAlergeno: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tema.colors.border,
    gap: 6,
  },
  textoChip: {
    fontSize: 13,
    color: tema.colors.text,
    fontWeight: "500",
  },
  porcion: {
    fontSize: 13,
    color: tema.colors.textSecondary,
    marginBottom: 12,
    fontWeight: "500",
  },
  tablaNutricional: {
    borderTopWidth: 1,
    borderTopColor: tema.colors.border,
  },
  filaTabla: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: tema.colors.border,
  },
  celdaConcepto: {
    fontSize: 14,
    color: tema.colors.text,
  },
  celdaValor: {
    fontSize: 14,
    fontWeight: "600",
    color: tema.colors.text,
  },
  contenedorReceta: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  textoReceta: {
    fontSize: 14,
    color: tema.colors.text,
    lineHeight: 20,
    flex: 1,
  },
  espacioFinal: {
    height: 32,
  },
});
