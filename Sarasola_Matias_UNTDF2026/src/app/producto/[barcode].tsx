import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';

export default function ProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  return (
    <ScrollView style={styles.scroll}>

      <View style={[styles.dashed, styles.image]}>
        <Text style={styles.label}>[Imagen del producto {barcode}]</Text>
      </View>

      <View style={[styles.dashed, styles.info]}>
        <Text style={styles.label}>[Nombre, marca y scores]</Text>
      </View>

      <View style={[styles.dashed, styles.ingredients]}>
        <Text style={styles.label}>[Ingredientes y alérgenos]</Text>
      </View>

      <View style={[styles.dashed, styles.nutrition]}>
        <Text style={styles.label}>[Tabla nutricional]</Text>
      </View>

      <View style={[styles.dashed, styles.recipe]}>
        <Text style={styles.label}>[Receta sugerida]</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: tema.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: tema.colors.textSecondary,
    fontSize: tema.text.base,
    textAlign: 'center',
  },
  image: {
    height: 220,
  },
  info: {
    margin: tema.spacing.md,
    height: 120,
  },
  ingredients: {
    margin: tema.spacing.md,
    height: 100,
  },
  nutrition: {
    margin: tema.spacing.md,
    height: 160,
  },
  recipe: {
    margin: tema.spacing.md,
    height: 100,
  },
});
