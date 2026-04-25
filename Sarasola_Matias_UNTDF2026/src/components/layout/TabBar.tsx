import { FC } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { tema } from '../../constants/tema';
import { ROUTES } from '../../navigation/routes';

export const TabBar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === ROUTES.HOME;
  const isListas = pathname.startsWith(ROUTES.LISTAS);
  const isCamara = pathname.startsWith(ROUTES.CAMARA);

  return (
    <View style={styles.tabBar}>
      <Pressable 
        style={styles.tabCell} 
        onPress={() => {
          // Navegar a home mediante navigate (solo si no estamos ya allí)
          router.navigate({ pathname: ROUTES.HOME });
        }}
      >
        <Text style={[
          styles.tabLabel, 
          isHome && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Home]</Text>
      </Pressable>
      <View style={styles.tabCell}>
        <Text style={[
          styles.tabLabel,
          isCamara && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Cámara]</Text>
      </View>
      <Pressable 
        style={styles.tabCell} 
        onPress={() => {
          // Navegar usando navigate para no amontonar en el stack si ya estamos ahí
          router.navigate({ pathname: ROUTES.LISTAS });
        }}
      >
        <Text style={[
          styles.tabLabel,
          isListas && { color: tema.colors.primary, fontWeight: 'bold' }
        ]}>[Listas]</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: tema.colors.card,
    borderTopWidth: 1,
    borderTopColor: tema.colors.border,
    flexDirection: 'row',
  },
  tabCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: tema.text.sm,
    color: tema.colors.textSecondary,
  },
});
