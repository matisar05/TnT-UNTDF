import { Href } from "expo-router";

export const RUTAS = {
  INICIO: "/",
  LISTAS: "/listas",
  FAVORITOS: "/favoritos",
  CATEGORIA: "/categoria/[slug]",
  PRODUCTO: "/producto/[barcode]",
} as const;

export type RutaApp = (typeof RUTAS)[keyof typeof RUTAS];
type ParamsRuta = Record<string, string | number | boolean | undefined>;

export const construirRuta = (ruta: RutaApp, params?: ParamsRuta): Href => {
  if (!params) {
    return ruta as Href;
  }

  return {
    pathname: ruta,
    params,
  } as Href;
};
