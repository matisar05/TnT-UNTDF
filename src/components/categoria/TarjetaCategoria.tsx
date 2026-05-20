import { tema } from "@/src/data/tema";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PropsTarjetaCategoria {
  nombre: string;
  slug: string;
  icono: string;
  color?: string;
  onPress: () => void;
}

export const TarjetaCategoria = ({ nombre, icono, color, onPress }: PropsTarjetaCategoria) => {
  return (
    <Pressable
      style={styles.contenedor}
      onPress={onPress}
    >
      <View style={[styles.contenedorIcono, { backgroundColor: color || tema.colors.primary + '20' }]}>
        <Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
      </View>
      <View style={styles.contenedorTexto}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.subtitulo}>Ver productos</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tema.colors.textSecondary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.colors.card,
    padding: 16,
    borderRadius: tema.radius.md,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contenedorIcono: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contenedorTexto: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: tema.colors.text,
  },
  subtitulo: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginTop: 2,
  },
});
