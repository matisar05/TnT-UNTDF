import { ProductoBusqueda } from "@/src/services/productos.service";
import { Producto } from "@/src/data/productos";

function nutriscoreAPuntuacion(grade?: string): number {
  if (!grade) return 0;
  const mapa: Record<string, number> = {
    a: 90, b: 70, c: 50, d: 30, e: 10,
  };
  return mapa[grade.toLowerCase()] ?? 0;
}

function parsearLista(texto?: string): string[] {
  if (!texto) return [];
  return texto
    .split(/[,;.]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && !s.startsWith("_"))
    .slice(0, 20);
}

function parsearAlergenos(texto?: string): string[] {
  if (!texto) return [];
  return texto
    .split(/[,;.]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10);
}

export function transformarProductoBusqueda(api: ProductoBusqueda): Producto {
  const n = api.nutriments ?? {};

  const energia =
    n["energy-kcal_serving"] ?? n["energy-kcal_100g"] ?? 0;
  const grasas =
    n["fat_serving"] ?? n["fat_100g"] ?? 0;
  const grasasSaturadas =
    n["saturated-fat_serving"] ?? n["saturated-fat_100g"] ?? 0;
  const carbohidratos =
    n["carbohydrates_serving"] ?? n["carbohydrates_100g"] ?? 0;
  const azucares =
    n["sugars_serving"] ?? n["sugars_100g"] ?? 0;
  const proteinas =
    n["proteins_serving"] ?? n["proteins_100g"] ?? 0;
  const sodioG =
    n["sodium_serving"] ?? n["sodium_100g"] ?? 0;

  return {
    id: api.code,
    nombre: api.product_name_es || api.product_name || "Sin nombre",
    marca: api.brands || "Marca desconocida",
    barcode: api.code,
    puntuacion: nutriscoreAPuntuacion(api.nutriscore_grade),
    nutriscore: api.nutriscore_grade?.toLowerCase(),
    imagen: api.image_url ? { uri: api.image_url } : undefined,
    ingredientes: parsearLista(
      api.ingredients_text_es || api.ingredients_text
    ),
    alergenos: parsearAlergenos(api.allergens),
    infoNutricional: {
      porcion: "100 g",
      calorias: Math.round(energia),
      grasasTotales: Math.round(grasas * 10) / 10,
      grasasSaturadas: Math.round(grasasSaturadas * 10) / 10,
      carbohidratos: Math.round(carbohidratos * 10) / 10,
      azucares: Math.round(azucares * 10) / 10,
      proteinas: Math.round(proteinas * 10) / 10,
      sodio: Math.round(sodioG * 1000),
    },
  };
}
