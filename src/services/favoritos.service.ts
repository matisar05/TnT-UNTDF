import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITOS_KEY = "productosFavoritos";

export interface ProductoFavorito {
  barcode: string;
  nombre: string;
  marca: string;
  puntuacion: number;
  imagenUrl?: string;
}

export async function getFavoritos(): Promise<ProductoFavorito[]> {
  const raw = await AsyncStorage.getItem(FAVORITOS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as ProductoFavorito[];
}

export async function addFavorito(producto: ProductoFavorito): Promise<void> {
  const favoritos = await getFavoritos();
  if (!favoritos.some((f) => f.barcode === producto.barcode)) {
    favoritos.push(producto);
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
  }
}

export async function removeFavorito(barcode: string): Promise<void> {
  const favoritos = await getFavoritos();
  const filtrados = favoritos.filter((f) => f.barcode !== barcode);
  await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(filtrados));
}
