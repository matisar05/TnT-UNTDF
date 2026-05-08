import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ParamsProducto = {
  barcode: string;
};

export default function PantallaProducto() {
  const { barcode } = useLocalSearchParams<ParamsProducto>();
  console.log("Barcode: ", barcode);

  return (
    <ScrollView style={styles.scroll}>
      <Stack.Screen options={{ title: barcode ?? "Producto" }} />

      <View style={[styles.punteado, styles.imagen]}>
        <Text style={styles.etiqueta}>[Imagen del producto]</Text>
      </View>

      <View style={[styles.punteado, styles.info]}>
        <Text style={styles.etiqueta}>[Nombre, marca y scores]</Text>
      </View>

      <View style={[styles.punteado, styles.ingredientes]}>
        <Text style={styles.etiqueta}>[Ingredientes y alérgenos]</Text>
      </View>

      <View style={[styles.punteado, styles.nutricion]}>
        <Text style={styles.etiqueta}>[Tabla nutricional]</Text>
      </View>

      <View style={[styles.punteado, styles.receta]}>
        <Text style={styles.etiqueta}>[Receta sugerida]</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  punteado: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },
  etiqueta: {
    color: "#7F8C8D",
    fontSize: 13,
    textAlign: "center",
  },
  imagen: {
    height: 220,
  },
  info: {
    margin: 16,
    height: 120,
  },
  ingredientes: {
    margin: 16,
    height: 100,
  },
  nutricion: {
    margin: 16,
    height: 160,
  },
  receta: {
    margin: 16,
    height: 100,
  },
});
