export interface InformacionNutricional {
  porcion: string;
  calorias: number;
  grasasTotales: number;
  grasasSaturadas: number;
  carbohidratos: number;
  azucares: number;
  proteinas: number;
  sodio: number;
}

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  barcode: string;
  puntuacion: number;
  imagen?: string;
  ingredientes: string[];
  alergenos: string[];
  infoNutricional: InformacionNutricional;
  receta?: string;
}

export const PRODUCTOS_POR_CATEGORIA: Record<string, Producto[]> = {
  bebidas: [
    {
      id: 'b1',
      nombre: 'Agua Mineral 1.5L',
      marca: 'Villavicencio',
      barcode: '779123400001',
      puntuacion: 95,
      imagen: 'https://picsum.photos/seed/agua/400/400',
      ingredientes: ['Agua mineral natural', 'Bicarbonato de sodio', 'Cloruro de sodio', 'Sulfato de magnesio'],
      alergenos: ['Ninguno'],
      infoNutricional: {
        porcion: '500 ml',
        calorias: 0,
        grasasTotales: 0,
        grasasSaturadas: 0,
        carbohidratos: 0,
        azucares: 0,
        proteinas: 0,
        sodio: 15,
      },
    },
    {
      id: 'b2',
      nombre: 'Coca Cola Original 2.25L',
      marca: 'Coca Cola',
      barcode: '779123400002',
      puntuacion: 30,
      imagen: 'https://picsum.photos/seed/cocacola/400/400',
      ingredientes: ['Agua carbonatada', 'Azúcar', 'Colorante caramelo', 'Ácido fosfórico', 'Aromatizantes naturales', 'Cafeína'],
      alergenos: ['Ninguno'],
      infoNutricional: {
        porcion: '200 ml',
        calorias: 84,
        grasasTotales: 0,
        grasasSaturadas: 0,
        carbohidratos: 21,
        azucares: 21,
        proteinas: 0,
        sodio: 27,
      },
    },
    {
      id: 'b3',
      nombre: 'Jugo de Naranja 1L',
      marca: 'Cepita',
      barcode: '779123400003',
      puntuacion: 65,
      imagen: 'https://picsum.photos/seed/jugonaranja/400/400',
      ingredientes: ['Agua', 'Jugo de naranja concentrado', 'Azúcar', 'Ácido cítrico', 'Vitamina C'],
      alergenos: ['Ninguno'],
      infoNutricional: {
        porcion: '200 ml',
        calorias: 90,
        grasasTotales: 0,
        grasasSaturadas: 0,
        carbohidratos: 22,
        azucares: 18,
        proteinas: 0.5,
        sodio: 10,
      },
    },
  ],
  lacteos: [
    {
      id: 'l1',
      nombre: 'Leche Entera 1L',
      marca: 'La Serenísima',
      barcode: '7791234567890',
      puntuacion: 85,
      imagen: 'https://picsum.photos/seed/leche/400/400',
      ingredientes: ['Leche entera', 'Vitamina A', 'Vitamina D'],
      alergenos: ['Lactosa', 'Proteína de leche'],
      infoNutricional: {
        porcion: '200 ml',
        calorias: 120,
        grasasTotales: 6,
        grasasSaturadas: 4,
        carbohidratos: 10,
        azucares: 10,
        proteinas: 6,
        sodio: 95,
      },
      receta: 'Licuado de banana: licuar 200 ml de leche con 1 banana madura, 1 cdita de miel y hielo a gusto.',
    },
    {
      id: 'l2',
      nombre: 'Yogur de Frutilla',
      marca: 'Yogurísimo',
      barcode: '7791234567891',
      puntuacion: 72,
      imagen: 'https://picsum.photos/seed/yogur/400/400',
      ingredientes: ['Leche entera', 'Azúcar', 'Frutilla', 'Cultivos lácticos', 'Almidón modificado'],
      alergenos: ['Lactosa', 'Proteína de leche'],
      infoNutricional: {
        porcion: '190 g',
        calorias: 130,
        grasasTotales: 3.5,
        grasasSaturadas: 2.2,
        carbohidratos: 21,
        azucares: 18,
        proteinas: 5,
        sodio: 75,
      },
    },
    {
      id: 'l3',
      nombre: 'Queso Crema 290g',
      marca: 'Casancrem',
      barcode: '7791234567892',
      puntuacion: 68,
      imagen: 'https://picsum.photos/seed/quesocrema/400/400',
      ingredientes: ['Leche entera', 'Crema de leche', 'Sal', 'Estabilizantes', 'Cultivos lácticos'],
      alergenos: ['Lactosa', 'Proteína de leche'],
      infoNutricional: {
        porcion: '30 g',
        calorias: 90,
        grasasTotales: 8,
        grasasSaturadas: 5.5,
        carbohidratos: 1,
        azucares: 1,
        proteinas: 2.5,
        sodio: 130,
      },
    },
  ],
  panaderia: [
    {
      id: 'p1',
      nombre: 'Pan de Molde Blanco',
      marca: 'Bimbo',
      barcode: '779123400011',
      puntuacion: 55,
      imagen: 'https://picsum.photos/seed/panmolde/400/400',
      ingredientes: ['Harina de trigo enriquecida', 'Agua', 'Azúcar', 'Aceite vegetal', 'Levadura', 'Sal', 'Conservantes'],
      alergenos: ['Gluten', 'Trigo'],
      infoNutricional: {
        porcion: '50 g (2 rebanadas)',
        calorias: 140,
        grasasTotales: 2,
        grasasSaturadas: 0.5,
        carbohidratos: 26,
        azucares: 3,
        proteinas: 4,
        sodio: 220,
      },
    },
    {
      id: 'p2',
      nombre: 'Galletitas de Agua',
      marca: 'Traviata',
      barcode: '779123400012',
      puntuacion: 70,
      imagen: 'https://picsum.photos/seed/galletitas/400/400',
      ingredientes: ['Harina de trigo', 'Aceite vegetal', 'Sal', 'Extracto de malta', 'Bicarbonato de sodio'],
      alergenos: ['Gluten', 'Trigo'],
      infoNutricional: {
        porcion: '30 g (6 galletitas)',
        calorias: 130,
        grasasTotales: 4,
        grasasSaturadas: 0.8,
        carbohidratos: 21,
        azucares: 1,
        proteinas: 3,
        sodio: 280,
      },
    },
  ],
  default: [
    {
      id: 'd1',
      nombre: 'Producto Genérico',
      marca: 'Marca Base',
      barcode: '000000000000',
      puntuacion: 50,
      ingredientes: ['Información no disponible'],
      alergenos: ['Información no disponible'],
      infoNutricional: {
        porcion: 'N/D',
        calorias: 0,
        grasasTotales: 0,
        grasasSaturadas: 0,
        carbohidratos: 0,
        azucares: 0,
        proteinas: 0,
        sodio: 0,
      },
    },
  ]
};

export const obtenerProductoPorBarcode = (barcode: string): Producto | undefined => {
  for (const categoria of Object.values(PRODUCTOS_POR_CATEGORIA)) {
    const encontrado = categoria.find((p) => p.barcode === barcode);
    if (encontrado) return encontrado;
  }
  return undefined;
};
