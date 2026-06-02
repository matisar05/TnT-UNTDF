import { useQuery } from "@tanstack/react-query";
import { getProductosPorCategoria } from "@/src/services/productos.service";
import { transformarProductoBusqueda } from "@/src/transformers/search-products.transformer";
import { Producto } from "@/src/data/productos";

export function useProductos(categoria: string) {
  const response = useQuery({
    queryKey: ["products", categoria],
    staleTime: 2_000,
    queryFn: async function (): Promise<Producto[]> {
      const data = await getProductosPorCategoria(categoria);
      return data.products.map(transformarProductoBusqueda);
    },
  });

  return response;
}
