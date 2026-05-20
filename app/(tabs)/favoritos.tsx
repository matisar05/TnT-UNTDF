import { StyleSheet, Text, View } from "react-native";

export default function PantallaFavoritos() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Favoritos</Text>
      <Text style={styles.descripcion}>
        Aquí aparecerán tus productos favoritos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#eff6ff",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  descripcion: {
    fontSize: 18,
    textAlign: "center",
    color: "#1e3a8a",
  },
});
