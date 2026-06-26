import { getFavoritos } from "@/src/services/favoritos.service";
import { useQuery } from "@tanstack/react-query";

export const FAVORITOS_HOOK_KEY = ["favoritos"];

export function useFavoritos() {
  const response = useQuery({
    queryKey: FAVORITOS_HOOK_KEY,
    queryFn: getFavoritos,
  });

  return response;
}
