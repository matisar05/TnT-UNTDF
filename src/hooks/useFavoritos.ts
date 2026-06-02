import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  getFavoritos,
  ProductoFavorito,
} from "@/src/services/favoritos.service";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<ProductoFavorito[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelado = false;
      getFavoritos().then((data) => {
        if (!cancelado) setFavoritos(data);
      });
      return () => {
        cancelado = true;
      };
    }, [])
  );

  const esFavorito = useCallback(
    (barcode: string) => favoritos.some((f) => f.barcode === barcode),
    [favoritos]
  );

  return { favoritos, esFavorito };
}
