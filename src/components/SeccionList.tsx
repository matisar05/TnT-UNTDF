import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RutaApp, buildRoute } from "@/src/navigation/routes";
import { tema } from "@/src/data/tema";

type ListItem = {
  id: string;
  nombre: string;
};

type Props = {
  titulo: string;
  items: ListItem[];
  ruta: RutaApp;
};

export const SeccionList = ({ titulo, items, ruta }: Props) => {
  const router = useRouter();

  const irAItem = (item: ListItem) => {
    router.push(buildRoute(ruta, { nombre: item.id }));
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.chips}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => irAItem(item)}
            style={({ pressed }) => [
              styles.chip,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.textoChip}>{item.nombre}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: tema.colors.text,
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: tema.colors.card,
    borderWidth: 1,
    borderColor: tema.colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  textoChip: {
    fontSize: 14,
    color: tema.colors.text,
  },
});
