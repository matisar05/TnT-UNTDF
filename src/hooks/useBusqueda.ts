import { useInfiniteQuery } from "@tanstack/react-query";
import { buscarProductos } from "@/src/services/productos.service";
import { transformarProductoBusqueda } from "@/src/transformers/search-products.transformer";
import { Producto } from "@/src/data/productos";

export const BUSQUEDA_HOOK_KEY = "busqueda";

export function useBusqueda(query: string) {
  return useInfiniteQuery({
    queryKey: [BUSQUEDA_HOOK_KEY, query],
    queryFn: async ({
      pageParam,
    }): Promise<{ productos: Producto[]; hayMas: boolean }> => {
      const data = await buscarProductos(query, pageParam);
      const totalPages = Math.ceil(data.count / data.page_size);
      return {
        productos: data.products.map(transformarProductoBusqueda),
        hayMas: data.page < totalPages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hayMas ? lastPageParam + 1 : undefined,
    enabled: query.trim().length > 1,
  });
}
