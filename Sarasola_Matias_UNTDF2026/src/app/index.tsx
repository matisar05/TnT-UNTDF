import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema } from '../constants/tema';
import { TabBar } from '../components/layout/TabBar';
import { HomeHero } from '../components/home/HomeHero';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <HomeHero />

        <View style={styles.banner}>
          <Text style={styles.bannerText}>[Banner Foro/Noticias]</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Favoritos</Text>
          <View style={styles.horizontalPlaceholder}>
            <Text style={styles.placeholderText}>[Lista horizontal de favoritos]</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías Destacadas</Text>
          <View style={styles.gridPlaceholder}>
            <Text style={styles.placeholderText}>[Grid de categorías]</Text>
          </View>
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
  content: {
    paddingBottom: tema.spacing.xl * 2, // 80 -> xl(40) * 2
  },
  banner: {
    margin: tema.spacing.md,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tema.colors.border,
    borderStyle: 'dashed',
  },
  bannerText: {
    color: tema.colors.textSecondary,
    fontSize: tema.text.base,
  },
  section: {
    margin: tema.spacing.md,
  },
  sectionTitle: {
    fontSize: tema.text.lg,
    fontWeight: '600',
    color: tema.colors.text,
    marginBottom: tema.spacing.sm,
  },
  horizontalPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tema.colors.border,
    borderStyle: 'dashed',
  },
  gridPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tema.colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: tema.colors.textSecondary,
    fontSize: tema.text.base,
  },
});

