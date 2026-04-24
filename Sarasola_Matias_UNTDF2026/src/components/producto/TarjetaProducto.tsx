import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';

interface TarjetaProductoProps {
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion?: number;
  imagen?: string;
}

export const TarjetaProducto = ({ nombre, marca, barcode, puntuacion = 85, imagen }: TarjetaProductoProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/producto/${barcode}`)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="fast-food-outline" size={32} color={tema.colors.border} />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.marca}>{marca}</Text>
        <Text style={styles.nombre} numberOfLines={2}>{nombre}</Text>
        
        <View style={styles.footer}>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreDot, { backgroundColor: puntuacion > 70 ? '#2ECC71' : '#F1C40F' }]} />
            <Text style={styles.scoreText}>{puntuacion}/100</Text>
          </View>
          <Ionicons name="heart-outline" size={20} color={tema.colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tema.colors.card,
    borderRadius: tema.radius.md,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  marca: {
    fontSize: 10,
    color: tema.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: tema.colors.text,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  scoreText: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    fontWeight: '500',
  },
});
