export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  tag: string;
  icono: string;
  color: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: '1', nombre: 'Bebidas', slug: 'bebidas', tag: 'beverages', icono: 'wine-outline', color: '#3498DB' },
  { id: '2', nombre: 'Lácteos', slug: 'lacteos', tag: 'dairies', icono: 'water-outline', color: '#F1C40F' },
  { id: '3', nombre: 'Panadería', slug: 'panaderia', tag: 'breads', icono: 'pizza-outline', color: '#E67E22' },
  { id: '4', nombre: 'Frutas y Verduras', slug: 'frutas-verduras', tag: 'fruits-vegetables', icono: 'leaf-outline', color: '#2ECC71' },
  { id: '5', nombre: 'Carnes', slug: 'carnes', tag: 'meats', icono: 'restaurant-outline', color: '#E74C3C' },
  { id: '6', nombre: 'Congelados', slug: 'congelados', tag: 'frozen-foods', icono: 'snow-outline', color: '#9B59B6' },
  { id: '7', nombre: 'Almacén', slug: 'almacen', tag: 'groceries', icono: 'basket-outline', color: '#1ABC9C' },
  { id: '8', nombre: 'Snacks y Dulces', slug: 'snacks-dulces', tag: 'snacks', icono: 'ice-cream-outline', color: '#E91E63' },
];
