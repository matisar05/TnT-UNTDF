import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/src/data/tema";
import { buildRoute, RUTAS } from "@/src/navigation/routes";
import { getProductoPorBarcode } from "@/src/services/productos.service";
import { transformarProductoBusqueda } from "@/src/transformers/search-products.transformer";
import { Producto } from "@/src/data/productos";

type EstadoScan = "esperando" | "cargando" | "encontrado" | "no_encontrado";

function extraerImagenUrl(imagen: Producto["imagen"]): string {
  if (imagen && typeof imagen === "object" && "uri" in imagen) {
    return String(imagen.uri);
  }
  return "";
}

export function PantallaCamara() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [estado, setEstado] = useState<EstadoScan>("esperando");
  const [producto, setProducto] = useState<Producto | null>(null);
  const escaneandoRef = useRef(false);

  async function handleBarcodeScanned({ data: barcode }: { data: string }) {
    if (escaneandoRef.current) return;
    escaneandoRef.current = true;
    setEstado("cargando");

    try {
      const result = await getProductoPorBarcode(barcode);
      if (result.status === 1 && result.product) {
        setProducto(transformarProductoBusqueda(result.product));
        setEstado("encontrado");
      } else {
        setEstado("no_encontrado");
      }
    } catch {
      setEstado("no_encontrado");
    }
  }

  function reiniciar() {
    escaneandoRef.current = false;
    setEstado("esperando");
    setProducto(null);
  }

  function irAProducto() {
    if (!producto) return;
    router.push(
      buildRoute(RUTAS.PRODUCTO, {
        barcode: producto.barcode,
        nombre: producto.nombre,
        marca: producto.marca,
        puntuacion: String(producto.puntuacion),
        nutriscore: producto.nutriscore ?? "",
        imagenUrl: extraerImagenUrl(producto.imagen),
        ingredientes: JSON.stringify(producto.ingredientes ?? []),
        alergenos: JSON.stringify(producto.alergenos ?? []),
        infoNutricional: JSON.stringify(producto.infoNutricional ?? null),
        receta: producto.receta ?? "",
      })
    );
  }

  if (!permission) {
    return (
      <View style={styles.contenedor}>
        <Stack.Screen options={{ title: "Camara" }} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.contenedor, styles.centrado]}>
        <Stack.Screen options={{ title: "Camara" }} />
        <Ionicons
          name="camera-outline"
          size={64}
          color={tema.colors.textSecondary}
        />
        {permission.canAskAgain ? (
          <>
            <Text style={styles.textoPermiso}>
              Steaming Up necesita acceso a la camara para escanear codigos de
              barras.
            </Text>
            <Pressable style={styles.boton} onPress={requestPermission}>
              <Text style={styles.textoBoton}>Permitir camara</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.textoPermiso}>
              Los permisos de tu camara estan desactivados.
            </Text>
            <Pressable
              style={[styles.boton, styles.botonSecundario]}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.textoBoton}>Abrir configuracion</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: "Escanear" }} />

      <CameraView
        style={styles.camara}
        onBarcodeScanned={
          estado === "esperando" ? handleBarcodeScanned : undefined
        }
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
        }}
      />

      <View style={styles.panel}>
        {estado === "esperando" && (
          <Text style={styles.instruccion}>
            Apunta la camara a un codigo de barras
          </Text>
        )}

        {estado === "cargando" && (
          <ActivityIndicator size="large" color={tema.colors.primary} />
        )}

        {estado === "encontrado" && producto && (
          <View style={styles.resultado}>
            <View style={styles.infoProducto}>
              <Text style={styles.marcaResultado}>{producto.marca}</Text>
              <Text style={styles.nombreResultado} numberOfLines={2}>
                {producto.nombre}
              </Text>
            </View>
            <View style={styles.acciones}>
              <Pressable style={styles.botonSecundarioSmall} onPress={reiniciar}>
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color={tema.colors.textSecondary}
                />
              </Pressable>
              <Pressable style={styles.boton} onPress={irAProducto}>
                <Text style={styles.textoBoton}>Ver Producto</Text>
              </Pressable>
            </View>
          </View>
        )}

        {estado === "no_encontrado" && (
          <View style={styles.resultado}>
            <Text style={styles.noEncontrado}>No se encontro el producto</Text>
            <Pressable
              style={[styles.boton, styles.botonSecundario]}
              onPress={reiniciar}
            >
              <Text style={styles.textoBoton}>Escanear de nuevo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
  },
  camara: {
    flex: 8,
  },
  panel: {
    flex: 2,
    backgroundColor: tema.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: tema.colors.border,
  },
  instruccion: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    textAlign: "center",
  },
  resultado: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoProducto: {
    flex: 1,
  },
  marcaResultado: {
    fontSize: 10,
    color: tema.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  nombreResultado: {
    fontSize: 14,
    fontWeight: "600",
    color: tema.colors.text,
    marginTop: 2,
  },
  acciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  centrado: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 32,
  },
  textoPermiso: {
    fontSize: 15,
    color: tema.colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
  boton: {
    backgroundColor: tema.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botonSecundario: {
    backgroundColor: tema.colors.border,
  },
  botonSecundarioSmall: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: tema.colors.border,
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noEncontrado: {
    fontSize: 14,
    color: tema.colors.textSecondary,
    flex: 1,
  },
});
