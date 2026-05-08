export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  icono: string;
  color: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: '1', nombre: 'Bebidas', slug: 'bebidas', icono: 'wine-outline', color: '#3498DB' },
  { id: '2', nombre: 'Lácteos', slug: 'lacteos', icono: 'water-outline', color: '#F1C40F' },
  { id: '3', nombre: 'Panadería', slug: 'panaderia', icono: 'pizza-outline', color: '#E67E22' },
  { id: '4', nombre: 'Frutas y Verduras', slug: 'frutas-verduras', icono: 'leaf-outline', color: '#2ECC71' },
  { id: '5', nombre: 'Carnes', slug: 'carnes', icono: 'restaurant-outline', color: '#E74C3C' },
  { id: '6', nombre: 'Congelados', slug: 'congelados', icono: 'snow-outline', color: '#9B59B6' },
  { id: '7', nombre: 'Almacén', slug: 'almacen', icono: 'basket-outline', color: '#1ABC9C' },
  { id: '8', nombre: 'Snacks y Dulces', slug: 'snacks-dulces', icono: 'ice-cream-outline', color: '#E91E63' },
];
