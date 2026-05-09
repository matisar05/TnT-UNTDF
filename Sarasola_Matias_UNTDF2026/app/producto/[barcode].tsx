import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/src/data/tema";
import { obtenerProductoPorBarcode } from "@/src/data/productos";

type ParamsProducto = {
  barcode: string;
};

export default function PantallaProducto() {
  const { barcode } = useLocalSearchParams<ParamsProducto>();

  const producto = barcode ? obtenerProductoPorBarcode(barcode) : undefined;

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

  const puntuacionColor = producto.puntuacion > 70 ? "#2ECC71" : "#F1C40F";

  return (
    <ScrollView style={styles.scroll}>
      <Stack.Screen options={{ title: producto.nombre }} />

      <View style={styles.contenedorImagen}>
        {producto.imagen ? (
          <Image source={{ uri: producto.imagen }} style={styles.imagen} />
        ) : (
          <View style={styles.placeholderImagen}>
            <Ionicons name="fast-food-outline" size={64} color={tema.colors.border} />
          </View>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.marca}>{producto.marca}</Text>
        <Text style={styles.nombre}>{producto.nombre}</Text>

        <View style={styles.filaPuntuacion}>
          <View style={[styles.puntoPuntaje, { backgroundColor: puntuacionColor }]} />
          <Text style={styles.textoPuntaje}>
            Puntuación nutricional: {producto.puntuacion}/100
          </Text>
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
    height: 260,
    backgroundColor: "#F9F9F9",
  },
  imagen: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  filaPuntuacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  puntoPuntaje: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  textoPuntaje: {
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
