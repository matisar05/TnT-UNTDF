import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

export function useRefreshOnFocus(queryKey: string[]) {
  const queryClient = useQueryClient();
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      // Salteamos el refetch en el primer focus (montaje inicial)
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // Volvemos a traer las queries activas que estén stale
      queryClient.refetchQueries({
        queryKey: queryKey,
        stale: true,
        type: "active",
      });
    }, [queryClient]),
  );
}
