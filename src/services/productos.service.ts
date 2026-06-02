export interface ProductoBusqueda {
  code: string;
  product_name_es?: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  nutriscore_grade?: string;
  ingredients_text_es?: string;
  ingredients_text?: string;
  allergens?: string;
  nutriments?: Record<string, number | undefined>;
}

export interface SearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: ProductoBusqueda[];
}

export async function getProductosPorCategoria(
  category: string,
  page = 1,
  pageSize = 20
): Promise<SearchResponse> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const params = new URLSearchParams({
    categories_tags: category,
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(`${BASE_URL}/v2/search?${params.toString()}`, {
    headers: {
      "User-Agent": "UNTDF TNT 2026",
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json();
}
