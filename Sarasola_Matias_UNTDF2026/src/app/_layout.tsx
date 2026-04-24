import { Stack } from 'expo-router';
import { tema } from '../constants/tema';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.colors.primary },
        headerTintColor: tema.colors.bannerText,
        headerTitleStyle: { color: tema.colors.bannerText },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'MaGui-S.A', headerShown: false }} />
      <Stack.Screen name="categoria/[slug]" options={{ title: 'Categoría' }} />
      <Stack.Screen name="listas/index" options={{ title: 'Listas' }} />
      <Stack.Screen name="producto/[barcode]" options={{ title: 'Producto' }} />
      <Stack.Screen name="favoritos/index" options={{ title: 'Mis Favoritos' }} />
    </Stack>
  );
}
