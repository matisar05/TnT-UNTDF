import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductosPorCategoria } from "@/src/services/productos.service";
import { transformarProductoBusqueda } from "@/src/transformers/search-products.transformer";
import { Producto } from "@/src/data/productos";

export function useProductos(categoria: string) {
  return useInfiniteQuery({
    queryKey: ["products", "pages", categoria],
    staleTime: 2_000,
    queryFn: async ({ pageParam }): Promise<{ productos: Producto[]; hayMas: boolean }> => {
      const data = await getProductosPorCategoria(categoria, pageParam, 20);
      const totalPages = Math.ceil(data.count / data.page_size);
      return {
        productos: data.products.map(transformarProductoBusqueda),
        hayMas: data.page < totalPages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hayMas ? lastPageParam + 1 : undefined,
  });
}
