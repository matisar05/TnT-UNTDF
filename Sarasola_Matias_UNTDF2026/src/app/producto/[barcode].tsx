import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';

export default function ProductScreen() {
  return (
    <ScrollView style={styles.scroll}>

      <View style={[styles.dashed, styles.image]}>
        <Text style={styles.label}>[Imagen del producto]</Text>
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
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: tema.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  image: {
    height: 220,
  },
  info: {
    margin: 16,
    height: 120,
  },
  ingredients: {
    margin: 16,
    height: 100,
  },
  nutrition: {
    margin: 16,
    height: 160,
  },
  recipe: {
    margin: 16,
    height: 100,
  },
});
