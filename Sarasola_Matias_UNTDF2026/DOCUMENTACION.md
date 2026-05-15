# Steaming_up — App de escaneo de alimentos

## Estructura de archivos

```
Sarasola_Matias_UNTDF2026/
├── app.json                          # Configuración de Expo
├── tsconfig.json                     # TypeScript strict, alias @/
├── package.json                      # Dependencias (Expo 55, React Native 0.83)
├── expo-env.d.ts                     # Tipos nativos de Expo
│
├── app/                              # Router basado en archivos (expo-router)
│   ├── _layout.tsx                   # Layout raíz (Stack navigator)
│   ├── +html.tsx                     # HTML wrapper solo para web
│   ├── +not-found.tsx                # Pantalla 404
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Layout de tabs (3 pestañas)
│   │   ├── index.tsx                 # Pantalla "Inicio"
│   │   ├── listas.tsx                # Pantalla "Listas" (categorías)
│   │   └── favoritos.tsx             # Pantalla "Favoritos" (placeholder)
│   ├── categoria/
│   │   └── [slug].tsx                # Dinámica: productos de una categoría
│   └── producto/
│       └── [barcode].tsx             # Dinámica: detalle de un producto
│
├── src/
│   ├── data/
│   │   ├── productos.ts              # Datos mock y tipos de Producto
│   │   ├── categorias.ts             # Lista de 8 categorías
│   │   └── tema.ts                   # Colores y radios del theme
│   ├── navigation/
│   │   └── routes.ts                 # Rutas tipadas + helper construirRuta()
│   └── components/
│       ├── home/
│       │   └── HomeHero.tsx           # Banner naranja de Inicio
│       ├── categoria/
│       │   └── TarjetaCategoria.tsx   # Tarjeta de categoría individual
│       └── producto/
│           └── TarjetaProducto.tsx    # Tarjeta de producto individual
│
└── assets/
    └── images/
        ├── icon.png, splash-icon.png  # App icons
        └── productos/                 # 8 fotos reales de productos
            ├── agua_villavicencio.jpg
            ├── coca_cola.jpg
            ├── jugo_cepita.jpg
            ├── leche_serenisima.jpg
            ├── yogur_yogurisimo.jpg
            ├── queso_casancrem.jpg
            ├── pan_bimbo.jpg
            └── galletitas_traviata.jpg
```

---

## Capa 1: Configuración

### `app.json`

Define:
- **Nombre:** `Steaming_up`
- **Orientación:** portrait
- **Iconos:** iOS, Android (adaptive), Web (favicon)
- **Plugin:** `expo-router` (file-based routing)
- **Splash screen:** fondo azul `#208AEF`
- **Experiments:** `typedRoutes: true`, `reactCompiler: true`

### `tsconfig.json`

Extiende `expo/tsconfig.base`. Strict mode activado. Alias `@/*` → `./*` para imports limpios (`@/src/data/productos`).

### `package.json`

- Expo SDK 55 + React Native 0.83
- Entry point: `expo-router/entry`
- Navegación: `@react-navigation/bottom-tabs`, `@react-navigation/native`
- Listas: `@shopify/flash-list`
- Animaciones: `react-native-reanimated`
- Web: `react-native-web`

---

## Capa 2: Layout raíz y navegación

### `app/_layout.tsx`

Stack navigator raíz. Envuelve todo. Declara el grupo `(tabs)` con `headerShown: false`.

```
Stack
 └── (tabs)              ← header oculto, las tabs lo manejan
      ├── index           → "Inicio"
      ├── listas          → "Listas"
      └── favoritos       → "Favoritos"
 └── categoria/[slug]     ← se pushea encima del Stack
 └── producto/[barcode]   ← se pushea encima del Stack
```

### `app/+html.tsx`

Solo para web. Renderiza `<html>`, `<head>` con meta viewport responsive, `<ScrollViewStyleReset />` (quita estilos por defecto del navegador), y `<body>` con fondo adaptativo a dark mode.

### `app/+not-found.tsx`

Ruta no encontrada → "This screen doesn't exist" + link a `/`.

---

## Capa 3: Las 3 pestañas

### `app/(tabs)/_layout.tsx`

| Tab | Ruta | Ícono | Color activo |
|-----|------|-------|-------------|
| Inicio | `/` | `home` / `home-outline` | naranja `#E67E22` |
| Listas | `/listas` | `list` / `list-outline` | naranja |
| Favoritos | `/favoritos` | `heart` / `heart-outline` | naranja |

TabBar: fondo blanco, borde naranja claro, sin header propio.

---

## Capa 4: Pantallas

### Inicio — `app/(tabs)/index.tsx`

```tsx
<ScrollView>
  <HeroeInicio />
  <View>
    <Text>Categorías Destacadas</Text>
    <Link href="/listas">Todas las Categorías</Link>
  </View>
  <View>
    <Text>Mis Favoritos</Text>
    <Link href="/favoritos">Ver Favoritos</Link>
  </View>
</ScrollView>
```

### `HeroeInicio` — `src/components/home/HomeHero.tsx`

Banner naranja (`#E67E22`) con:
- Texto blanco "¡Bienvenido!"
- Input de búsqueda falso (texto gris "Buscar producto...")
- 4 celdas: Perfil, Historial, Info, Config (solo UI, no funcionales)

### Listas — `app/(tabs)/listas.tsx`

```tsx
<FlashList
  data={CATEGORIAS}                     // 8 categorías de categorias.ts
  renderItem={({ item }) => (
    <TarjetaCategoria
      nombre={item.nombre}              // "Bebidas", "Lácteos", etc.
      slug={item.slug}
      icono={item.icono}
      color={item.color}
      onPress={() => irACategoria(item.slug)}  // → /categoria/bebidas
    />
  )}
/>
```

### Favoritos — `app/(tabs)/favoritos.tsx`

Placeholder: fondo azul claro, "Aquí aparecerán tus productos favoritos." Sin lógica todavía.

---

## Capa 5: Rutas dinámicas

### Categoría — `app/categoria/[slug].tsx`

```tsx
const { slug } = useLocalSearchParams<ParamsCategoria>();   // "bebidas"
const productos = PRODUCTOS_POR_CATEGORIA[slug] ?? PRODUCTOS_POR_CATEGORIA.default;

<FlashList
  data={productos}
  renderItem={({ item }) => (
    <TarjetaProducto
      nombre={item.nombre}
      marca={item.marca}
      barcode={item.barcode}
      puntuacion={item.puntuacion}
      imagen={item.imagen}             // require() de la foto real
    />
  )}
/>
```

3 categorías con datos reales (`bebidas`, `lacteos`, `panaderia`). Las otras 5 caen al `default`.

### Producto — `app/producto/[barcode].tsx`

```tsx
const producto = obtenerProductoPorBarcode(barcode);

<ScrollView>
  <Image source={producto.imagen} resizeMode="contain" />   // maxWidth:500px
  <Marca />
  <Nombre />
  <Puntuacion />
  <Ingredientes />       // lista con bullet •
  <Alergenos />          // chips naranjas con ícono warning
  <InfoNutricional />    // tabla con filas
  <Receta />             // solo si existe (Leche tiene)
</ScrollView>
```

---

## Capa 6: Componentes reutilizables

### TarjetaCategoria — `src/components/categoria/TarjetaCategoria.tsx`

```
┌──────────────────────────────────────┐
│ ┌──────┐                             │
│ │ icon │  Bebidas              flecha│
│ │  28px│  Ver productos              │
│ └──────┘                             │
└──────────────────────────────────────┘
```

### TarjetaProducto — `src/components/producto/TarjetaProducto.tsx`

```
┌──────────────────────────────────────┐
│ ┌────────┐  COCA COLA               │
│ │  foto  │  Coca Cola Original 2.25L │
│ │ 110x110│  ● 30/100          ♡      │
│ │ contain│                           │
│ └────────┘                           │
└──────────────────────────────────────┘
```

- `resizeMode: "contain"` → la foto completa cabe sin deformarse
- Sin imagen → ícono `fast-food-outline` gris
- `onPress` → `/producto/[barcode]`

---

## Capa 7: Datos

### `src/data/productos.ts`

```ts
interface InformacionNutricional {
  porcion, calorias, grasasTotales, grasasSaturadas,
  carbohidratos, azucares, proteinas, sodio
}

interface Producto {
  id, nombre, marca, barcode, puntuacion (0-100),
  imagen?: ImageSourcePropType,    // require() de la foto
  ingredientes: string[],
  alergenos: string[],
  infoNutricional: InformacionNutricional,
  receta?: string                  // solo Leche tiene
}

PRODUCTOS_POR_CATEGORIA: Record<string, Producto[]> = {
  bebidas:   [Agua Villavicencio, Coca Cola, Cepita Naranja],
  lacteos:   [Leche La Serenísima, Yogurísimo, Casancrem],
  panaderia: [Pan Bimbo, Galletitas Traviata],
  default:   [Producto Genérico],
}
```

| # | Nombre | Marca | Categoría | Puntuación |
|---|--------|-------|-----------|------------|
| 1 | Agua Mineral 1.5L | Villavicencio | Bebidas | 95 |
| 2 | Coca Cola Original 2.25L | Coca Cola | Bebidas | 30 |
| 3 | Jugo de Naranja 1L | Cepita | Bebidas | 65 |
| 4 | Leche Entera 1L | La Serenísima | Lácteos | 85 |
| 5 | Yogur de Frutilla | Yogurísimo | Lácteos | 72 |
| 6 | Queso Crema 290g | Casancrem | Lácteos | 68 |
| 7 | Pan de Molde Blanco | Bimbo | Panadería | 55 |
| 8 | Galletitas de Agua | Traviata | Panadería | 70 |

### `src/data/categorias.ts`

8 categorías con `id`, `nombre`, `slug`, `icono` (Ionicons), `color`. Solo 3 tienen productos reales.

### `src/data/tema.ts`

```ts
colors: {
  primary: '#E67E22',        // naranja
  background: '#FFF9F0',     // crema
  card: '#FFFFFF',           // blanco
  text: '#2D3436',           // gris oscuro
  textSecondary: '#7F8C8D',  // gris medio
  border: '#FAD390',         // naranja claro
}
radius: { sm: 8, md: 14, lg: 20 }
```

---

## Capa 8: Utilidades

### `src/navigation/routes.ts`

```ts
RUTAS = {
  INICIO: "/",
  LISTAS: "/listas",
  FAVORITOS: "/favoritos",
  CATEGORIA: "/categoria/[slug]",
  PRODUCTO: "/producto/[barcode]",
}

construirRuta(RUTAS.PRODUCTO, { barcode: "779123400002" })
// → { pathname: "/producto/[barcode]", params: { barcode: "779123400002" } }
```

---

## Flujo completo

```
app/_layout.tsx (Stack)
 │
 └── app/(tabs)/_layout.tsx (Tabs: Inicio | Listas | Favoritos)
      │
      ├── index.tsx ── HeroeInicio + links a /listas y /favoritos
      │
      ├── listas.tsx ── FlashList(CATEGORIAS) ── TarjetaCategoria(onPress)
      │                    │
      │                    └── router.push → /categoria/[slug].tsx
      │                          │
      │                          └── FlashList(PRODUCTOS_POR_CATEGORIA[slug])
      │                                │
      │                                └── TarjetaProducto(nombre, marca, imagen, ...)
      │                                      │
      │                                      └── onPress → /producto/[barcode].tsx
      │                                            │
      │                                            └── ScrollView con:
      │                                                 - Imagen (contain, maxWidth:500)
      │                                                 - Datos, Ingredientes, Alérgenos
      │                                                 - Tabla Nutricional, Receta
      │
      └── favoritos.tsx ── Placeholder "Aquí aparecerán tus productos favoritos"
```
