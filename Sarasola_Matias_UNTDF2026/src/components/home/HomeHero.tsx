import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';

export const HomeHero: FC = () => {
  return (
    <View style={styles.hero}>
      <View style={styles.dashed}>
        <Text style={styles.heroLabel}>[¡Bienvenido "usuario X"!]</Text>
      </View>

      <View style={styles.dashed}>
        <Text style={styles.heroLabel}>[Barra de búsqueda]</Text>
      </View>

      <View style={[styles.dashed, styles.row]}>
        <View style={styles.cell}>
          <Text style={styles.heroLabel}>[Perfil]</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.heroLabel}>[Config]</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.heroLabel}>[Historial]</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.heroLabel}>[Info]</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: tema.colors.primary,
    padding: tema.spacing.lg,
    paddingTop: tema.spacing.xl,
    gap: tema.spacing.sm,
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: tema.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tema.spacing.sm,
  },
  heroLabel: {
    color: tema.colors.bannerText,
    fontSize: tema.text.base,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: tema.spacing.xs,
  },
  cell: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: tema.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tema.spacing.sm,
  },
});
