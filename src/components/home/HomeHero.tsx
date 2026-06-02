import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tema } from "@/src/data/tema";

export const HomeHero = () => {
  return (
    <LinearGradient
      colors={["#E67E22", "#F39C12"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroe}
    >
      <View style={styles.saludo}>
        <Text style={styles.textoSaludo}>¡Bienvenido!</Text>
      </View>

      <View style={[styles.barraBusqueda, styles.mt8]}>
        <Text style={styles.textoBusqueda}>Buscar producto...</Text>
      </View>

      <View style={[styles.accionesRapidas, styles.mt8]}>
        <View style={styles.celda}>
          <Text style={styles.textoCelda}>Perfil</Text>
        </View>
        <View style={styles.celda}>
          <Text style={styles.textoCelda}>Historial</Text>
        </View>
        <View style={styles.celda}>
          <Text style={styles.textoCelda}>Config</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroe: {
    backgroundColor: tema.colors.primary,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  saludo: {
    padding: 8,
  },
  textoSaludo: {
    color: tema.colors.bannerText,
    fontSize: 22,
    fontWeight: "bold",
  },
  barraBusqueda: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  textoBusqueda: {
    color: tema.colors.textSecondary,
    fontSize: 14,
  },
  accionesRapidas: {
    flexDirection: "row",
  },
  celda: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    margin: 2,
  },
  textoCelda: {
    color: tema.colors.bannerText,
    fontSize: 12,
    textAlign: "center",
  },
  mt8: {
    marginTop: 8,
  },
});
