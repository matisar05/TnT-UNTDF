# Gaps de Buenas Prácticas — Steaming_UP

> Basado en la comparación con el repositorio del profesor `tnt-2206-intro` (Leonel Viera, UNTDF 2026).
> Documento de referencia para implementación futura.

---

## 🔴 Gap 1 — `icono as any` viola tipado estricto de TypeScript

**Archivo:** `src/components/categoria/TarjetaCategoria.tsx:20`
**Severidad:** Crítica — el profesor lo marcaría como error.

### Código actual

```tsx
// props: icono: string
<Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
```

### Qué está mal

`as any` desactiva la verificación de tipos. Si se pasa un string inválido como ícono (ej: `"icono-inexistente"`), TypeScript no lo detecta y la app falla en runtime con un ícono roto. El profesor jamás usa `as any`.

### Cómo arreglarlo

Cambiar el tipo de `icono` en la interfaz de `string` al tipo real de Ionicons:

```tsx
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

interface PropsTarjetaCategoria {
  nombre: string;
  slug: string;
  icono: ComponentProps<typeof Ionicons>["name"];  // ← tipado correcto
  color?: string;
  onPress: () => void;
}
```

Y quitar el `as any`:

```diff
- <Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
+ <Ionicons name={icono} size={28} color={color || tema.colors.primary} />
```

### Alternativa más simple (si importar `ComponentProps` es muy complejo)

Definir manualmente los íconos que usa la app:

```tsx
type IconName = "wine-outline" | "water-outline" | "pizza-outline" | "leaf-outline"
  | "restaurant-outline" | "snow-outline" | "basket-outline" | "ice-cream-outline";

interface PropsTarjetaCategoria {
  icono: IconName;
  // ...
}
```

---

## 🔴 Gap 2 — `.vscode/` comiteado en el repositorio

**Archivos afectados:** `.vscode/extensions.json`, `.vscode/settings.json`
**Severidad:** Crítica — el profesor lo excluye explícitamente en su `.gitignore`.

### Qué está mal

Son configuraciones personales de editor (extensiones recomendadas, autoformato al guardar). Cada desarrollador usa su propio editor y configuraciones. Comitearlas es como comitear preferencias personales.

El profesor tiene `.vscode/` en su `.gitignore` (línea 44).

### Cómo arreglarlo

**Paso 1:** Agregar al `.gitignore`:

```
# vscode
.vscode/
```

**Paso 2:** Eliminar del tracking sin borrar los archivos locales:

```powershell
git rm --cached -r .vscode/
```

**Paso 3:** Commit.

---

## 🟠 Gap 3 — Carpeta `example/` con código muerto

**Archivos afectados:** Todo el directorio `example/`
**Severidad:** Media — repo con archivos que no son del proyecto.

### Contenido innecesario

- `example/src/app/_layout.tsx`, `index.tsx`, `explore.tsx` — pantallas del template Expo
- `example/src/components/` — `animated-icon.tsx`, `app-tabs.tsx`, `collapsible.tsx`, etc.
- `example/src/constants/theme.ts` — theme del template (no el de Steaming_UP)
- `example/src/hooks/` — `use-color-scheme.ts`, `use-theme.ts`
- `example/scripts/reset-project.js` — script del template
- `example/src/global.css`

Ninguno de estos archivos es parte del proyecto Steaming_UP. El repo del profesor no tiene código de ejemplo sobrante.

### Cómo arreglarlo

```powershell
Remove-Item -Recurse -Force "example"
```

Luego commit.

---

## 🟠 Gap 4 — `ListEmptyComponent` ausente en FlashList

**Archivos:** `app/(tabs)/listas.tsx:17`, `app/categoria/[slug].tsx:25`
**Severidad:** Media — el profesor siempre lo incluye.

### Qué está mal

Si una lista se renderiza vacía (sin datos o por un bug), el usuario ve una pantalla en blanco. No sabe si es un error, si está cargando, o si simplemente no hay datos.

El profesor siempre incluye `ListEmptyComponent` (`lista-flatlist.tsx:29`, `input-filter.tsx:50`).

### Cómo arreglarlo

**En `listas.tsx`:**

```tsx
<FlashList
  data={CATEGORIAS}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => ( /* ... */ )}
  contentContainerStyle={styles.contenidoLista}
  ListEmptyComponent={
    <View style={styles.vacio}>
      <Ionicons name="folder-open-outline" size={48} color={tema.colors.textSecondary} />
      <Text style={styles.textoVacio}>No hay categorías disponibles</Text>
    </View>
  }
  ListHeaderComponent={ /* ... */ }
/>
```

**En `categoria/[slug].tsx`:**

```tsx
<FlashList
  data={productos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => ( /* ... */ )}
  contentContainerStyle={styles.contenidoLista}
  ListEmptyComponent={
    <View style={styles.vacio}>
      <Text style={styles.textoVacio}>No hay productos en esta categoría</Text>
    </View>
  }
  ListHeaderComponent={ /* ... */ }
/>
```

Agregar los estilos necesarios:

```ts
vacio: {
  alignItems: "center",
  paddingVertical: 40,
  gap: 12,
},
textoVacio: {
  fontSize: 15,
  color: tema.colors.textSecondary,
  textAlign: "center",
},
```

---

## 🟠 Gap 5 — `key={index}` en `.map()` — antipattern de React

**Archivo:** `app/producto/[barcode].tsx:59,70`
**Severidad:** Media — el profesor usa keys estables (`item.id`).

### Código actual

```tsx
// Ingredientes
{producto.ingredientes.map((ingrediente, index) => (
  <View key={index} style={styles.filaIngrediente}>

// Alérgenos
{producto.alergenos.map((alergeno, index) => (
  <View key={index} style={styles.chipAlergeno}>
```

### Qué está mal

Usar el índice del array como key es problemático cuando la lista puede cambiar (items agregados, reordenados, eliminados). React usa las keys para identificar qué elementos cambiaron. Si la key es el índice y se inserta un elemento al principio, todos los índices cambian y React re-renderiza todo innecesariamente.

### Cómo arreglarlo

Los strings de ingredientes/alérgenos son únicos dentro de su array. Se puede usar el string mismo (prefijado para evitar colisiones con otras listas):

```tsx
{producto.ingredientes.map((ingrediente) => (
  <View key={`ing-${producto.barcode}-${ingrediente}`} style={styles.filaIngrediente}>

{producto.alergenos.map((alergeno) => (
  <View key={`alg-${producto.barcode}-${alergeno}`} style={styles.chipAlergeno}>
```

---

## 🟡 Gap 6 — Dependencias de navegación redundantes

**Archivo:** `package.json:15-17`
**Severidad:** Baja — innecesarias pero no rompen nada.

### Código actual

```json
"dependencies": {
  "@react-navigation/bottom-tabs": "^7.15.5",
  "@react-navigation/elements": "^2.9.10",
  "@react-navigation/native": "^7.1.33",
```

### Qué está mal

Expo Router maneja los tabs internamente con `<Tabs>`. Los paquetes `@react-navigation/bottom-tabs` y `@react-navigation/elements` son dependencias directas de React Navigation, no de Expo Router. El profesor solo tiene `@react-navigation/native` (que sí es requerido por Expo Router).

Tener estas dependencias extra:
- Aumenta `node_modules` sin razón
- Puede causar conflictos de versión con lo que Expo Router espera
- Sugiere erróneamente que se usa React Navigation directamente

### Cómo arreglarlo

```powershell
npm uninstall @react-navigation/bottom-tabs @react-navigation/elements
```

O manualmente en `package.json`, eliminar esas líneas y correr `npm install`.

---

## 🟡 Gap 7 — Falta helper de ruta específico

**Archivo:** `src/navigation/routes.ts`
**Severidad:** Baja — mejora organizativa.

### Qué falta

El profesor define helpers específicos como `fichaShowRoute(id: number)` que encapsulan la construcción de una ruta concreta. Esto centraliza la lógica de conversión de parámetros.

Actualmente la navegación a producto se hace manualmente en cada lugar:

```tsx
// TarjetaProducto.tsx:19
router.push(construirRuta(RUTAS.PRODUCTO, { barcode }));
```

### Cómo arreglarlo

Agregar en `src/navigation/routes.ts`:

```ts
export function rutaProducto(barcode: string): Href {
  return construirRuta(RUTAS.PRODUCTO, { barcode });
}
```

Luego usar en todos los lugares que navegan a producto:

```diff
- router.push(construirRuta(RUTAS.PRODUCTO, { barcode }));
+ router.push(rutaProducto(barcode));
```

---

## 🟢 Gap 8 — Comentarios `// Logica` / `// Vista`

**Archivos:** Todas las pantallas en `app/`
**Severidad:** Informativa — convención de estilo del profesor.

### Qué falta

El profesor separa visualmente la lógica del JSX en cada pantalla con comentarios:

```tsx
export default function Pantalla() {
  // Logica
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  // Vista
  return (
    <View>...</View>
  );
}
```

Referencias: `backup.tsx:22-23,71`, `ficha/[id].tsx:12-13`, `paso1.tsx:12`.

Esto facilita encontrar dónde empieza el JSX en archivos largos y mantiene consistencia entre pantallas.

### Cómo aplicarlo

Agregar `// Logica` después de las variables/hooks/estado y `// Vista` antes del `return` en cada pantalla. Ejemplo para `categoria/[slug].tsx`:

```tsx
export default function PantallaCategoria() {
  // Logica
  const { slug } = useLocalSearchParams<ParamsCategoria>();
  const titulo = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
    : "Categoría";
  const productos = slug && PRODUCTOS_POR_CATEGORIA[slug]
    ? PRODUCTOS_POR_CATEGORIA[slug]
    : PRODUCTOS_POR_CATEGORIA.default;

  // Vista
  return (
    <View style={styles.contenedor}>
      {/* ... */}
    </View>
  );
}
```

---

## Orden recomendado de implementación

| Orden | Gap | Tiempo estimado |
|-------|-----|-----------------|
| 1 | `.vscode/` en `.gitignore` | 2 min |
| 2 | Eliminar `example/` | 1 min |
| 3 | Quitar `icono as any` + tipar | 5 min |
| 4 | `ListEmptyComponent` en FlashList | 10 min |
| 5 | `key={index}` → keys estables | 5 min |
| 6 | Eliminar dependencias redundantes | 2 min |
| 7 | Agregar `rutaProducto()` helper | 3 min |
| 8 | Comentarios `// Logica` / `// Vista` | 5 min |
