export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion: number;
  imagen?: string;
}

export const PRODUCTOS_POR_CATEGORIA: Record<string, Producto[]> = {
  bebidas: [
    { id: 'b1', nombre: 'Agua Mineral 1.5L', marca: 'Villavicencio', barcode: '779123400001', puntuacion: 95 },
    { id: 'b2', nombre: 'Coca Cola Original 2.25L', marca: 'Coca Cola', barcode: '779123400002', puntuacion: 30 },
    { id: 'b3', nombre: 'Jugo de Naranja 1L', marca: 'Cepita', barcode: '779123400003', puntuacion: 65 },
  ],
  lacteos: [
    { id: 'l1', nombre: 'Leche Entera 1L', marca: 'La Serenísima', barcode: '7791234567890', puntuacion: 85 },
    { id: 'l2', nombre: 'Yogur de Frutilla', marca: 'Yogurísimo', barcode: '7791234567891', puntuacion: 72 },
    { id: 'l3', nombre: 'Queso Crema 290g', marca: 'Casancrem', barcode: '7791234567892', puntuacion: 68 },
  ],
  panaderia: [
    { id: 'p1', nombre: 'Pan de Molde Blanco', marca: 'Bimbo', barcode: '779123400011', puntuacion: 55 },
    { id: 'p2', nombre: 'Galletitas de Agua', marca: 'Traviata', barcode: '779123400012', puntuacion: 70 },
  ],
  default: [
    { id: 'd1', nombre: 'Producto Genérico', marca: 'Marca Base', barcode: '000000000000', puntuacion: 50 },
  ]
};
