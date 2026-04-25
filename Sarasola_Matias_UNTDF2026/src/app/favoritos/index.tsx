import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';
import { TabBar } from '../../components/layout/TabBar';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={[styles.dashed, styles.header]}>
          <Text style={styles.label}>[Header Mis Favoritos]</Text>
        </View>

        <View style={[styles.dashed, styles.list]}>
          <Text style={styles.label}>[Lista de favoritos]</Text>
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.colors.background,
  },
  scroll: {
    flex: 1,
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
  header: {
    height: 100,
  },
  list: {
    margin: tema.spacing.md,
    height: 400,
  },
});
