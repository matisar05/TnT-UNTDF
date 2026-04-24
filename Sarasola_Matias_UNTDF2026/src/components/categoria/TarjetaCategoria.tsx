import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';

interface TarjetaCategoriaProps {
  nombre: string;
  slug: string;
  icono: keyof typeof Ionicons.prototype.getRawProps;
  color?: string;
}

export const TarjetaCategoria = ({ nombre, slug, icono, color }: TarjetaCategoriaProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/categoria/${slug}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color || tema.colors.primary + '20' }]}>
        <Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.subtitulo}>Ver productos</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tema.colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.colors.card,
    padding: 16,
    borderRadius: tema.radius.md,
    marginBottom: 12,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Sombra para Android
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: tema.colors.text,
  },
  subtitulo: {
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginTop: 2,
  },
});
