import { HeroeInicio } from "@/src/components/home/HomeHero";
import { construirRuta, RUTAS } from "@/src/navigation/routes";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PantallaInicio() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <HeroeInicio />

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Categorías Destacadas</Text>
        <View style={styles.filaTarjeta}>
          <Link href={construirRuta(RUTAS.LISTAS)} style={styles.tarjeta}>
            <Text style={styles.tituloTarjeta}>
              Todas las Categorías{"\n"}
              <Text style={styles.subTarjeta}>Explorar productos</Text>
            </Text>
          </Link>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Mis Favoritos</Text>
        <Link href={construirRuta(RUTAS.FAVORITOS)} style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>
            Ver Favoritos{"\n"}
            <Text style={styles.subTarjeta}>Productos guardados</Text>
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  content: {
    paddingBottom: 20,
  },
  seccion: {
    margin: 16,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  filaTarjeta: {
    gap: 12,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tituloTarjeta: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  subTarjeta: {
    fontSize: 13,
    color: "#7F8C8D",
    marginTop: 8,
  },
});
