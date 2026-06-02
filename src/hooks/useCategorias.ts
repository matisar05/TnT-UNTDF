import { useQuery } from "@tanstack/react-query";
import { getCategoriesV3 } from "@/src/services/categories";

export function useCategorias() {
  const response = useQuery({
    queryKey: ["categories"],
    staleTime: 2_000,
    queryFn: function () {
      return getCategoriesV3();
    },
  });

  return response;
}
