import { FC } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';
import { ROUTES } from '../../navigation/routes';

type TarjetaCategoriaProps = {
  nombre: string;
  slug: string;
  icono: keyof typeof Ionicons.glyphMap;
  color?: string;
};

export const TarjetaCategoria: FC<TarjetaCategoriaProps> = ({ nombre, slug, icono, color }) => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push({ pathname: ROUTES.CATEGORIA, params: { slug } })}
    >
      <View style={[styles.iconContainer, { backgroundColor: color || tema.colors.primary + '20' }]}>
        <Ionicons name={icono} size={28} color={color || tema.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.subtitulo}>Ver productos</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tema.colors.textSecondary} />
    </Pressable>
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
