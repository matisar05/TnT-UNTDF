import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';

export default function FavoritesScreen() {
  return (
    <ScrollView style={styles.scroll}>

      <View style={[styles.dashed, styles.header]}>
        <Text style={styles.label}>[Header Mis Favoritos]</Text>
      </View>

      <View style={[styles.dashed, styles.list]}>
        <Text style={styles.label}>[Lista de favoritos]</Text>
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
  header: {
    height: 100,
  },
  list: {
    margin: 16,
    height: 400,
  },
});
