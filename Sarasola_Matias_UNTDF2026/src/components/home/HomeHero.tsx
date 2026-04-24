import { StyleSheet, Text, View } from 'react-native';
import { tema } from '../../constants/tema';

export const HomeHero = () => {
  return (
    <View style={styles.hero}>
      <View style={styles.dashed}>
        <Text style={styles.heroLabel}>[¡Bienvenido "usuario X"!]</Text>
      </View>

      <View style={[styles.dashed, styles.mt8]}>
        <Text style={styles.heroLabel}>[Barra de búsqueda]</Text>
      </View>

      <View style={[styles.dashed, styles.row, styles.mt8]}>
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
    padding: 20,
    paddingTop: 40,
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  heroLabel: {
    color: tema.colors.bannerText,
    fontSize: 13,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    margin: 2,
  },
  mt8: {
    marginTop: 8,
  },
});
