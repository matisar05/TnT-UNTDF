import { HomeHero } from "@/src/components/home/HomeHero";
import { TarjetaFavorito } from "@/src/components/favoritos/TarjetaFavorito";
import { useFavoritos } from "@/src/hooks/useFavoritos";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PantallaInicio() {
  const { favoritos } = useFavoritos();
  const ultimos5 = favoritos.slice(-5).reverse();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <HomeHero />

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Categorías Destacadas</Text>
        <Link href={buildRoute(RUTAS.LISTAS)} style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>
            Todas las Categorías{"\n"}
            <Text style={styles.subTarjeta}>Explorar productos</Text>
          </Text>
        </Link>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Mis Favoritos</Text>
        <Link href={buildRoute(RUTAS.FAVORITOS)} style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>
            Ver Favoritos{"\n"}
            <Text style={styles.subTarjeta}>Productos guardados</Text>
          </Text>
        </Link>

        {ultimos5.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewScroll}
            contentContainerStyle={styles.previewContent}
          >
            {ultimos5.map((item) => (
              <TarjetaFavorito key={item.barcode} {...item} />
            ))}
          </ScrollView>
        )}
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
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
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
  previewScroll: {
    marginTop: 12,
  },
  previewContent: {
    gap: 10,
    paddingRight: 0,
  },
});
