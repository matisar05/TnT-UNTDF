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

interface SearchALiciousResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  hits: ProductoBusqueda[];
}

const SEARCH_API_URL = "https://search.openfoodfacts.org/search";

function getSearchUrl(params: URLSearchParams): string {
  if (
    typeof window !== "undefined" &&
    typeof window.location?.origin === "string" &&
    window.location.origin.startsWith("http")
  ) {
    return `${window.location.origin}/__openfoodfacts_search?${params.toString()}`;
  }

  return `${SEARCH_API_URL}?${params.toString()}`;
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

// Buscar productos por texto libre
export async function buscarProductos(
  query: string,
  page = 1,
  pageSize = 10
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    page_size: String(pageSize),
    langs: "es,en",
  });

  const response = await fetch(getSearchUrl(params), {
    headers: { "User-Agent": "UNTDF TNT 2026" },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  const data = (await response.json()) as SearchALiciousResponse;

  return {
    count: data.count,
    page: data.page,
    page_count: data.page_count,
    page_size: data.page_size,
    products: data.hits,
  };
}

// Buscar producto por codigo de barras (para la camara)
export interface ProductoBarcode {
  status: 0 | 1;
  product?: ProductoBusqueda;
}

export async function getProductoPorBarcode(
  barcode: string
): Promise<ProductoBarcode> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const response = await fetch(`${BASE_URL}/v0/product/${barcode}.json`, {
    headers: { "User-Agent": "UNTDF TNT 2026" },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  return response.json();
}
