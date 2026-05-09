# Análisis Completo del Repositorio del Profesor — `tnt-2206-intro`

> **Materia:** Taller de Nuevas Tecnologías — UNTDF 2026
> **Profesor:** Leonel Viera
> **Repo original:** https://github.com/vieraleonel/tnt-2206-intro
> **Stack:** React Native + Expo SDK 55 + Expo Router + TypeScript estricto

---

## 1. Estructura general del proyecto

```
tnt-2206-intro/
├── .gitignore
├── app.json
├── backup.tsx                    # Archivo didáctico de backup (no es ruta)
├── package.json
├── package-lock.json
├── readme.md
├── tsconfig.json
│
├── app/                          # File-based routing (Expo Router)
│   ├── +html.tsx                 # Root HTML para web
│   ├── +not-found.tsx            # Pantalla 404
│   ├── _layout.tsx               # Layout raíz (Stack navigator)
│   │
│   ├── (tabs)/                   # Grupo con tabs (paréntesis = invisible en URL)
│   │   ├── _layout.tsx           # Tabs navigator + configuración de íconos
│   │   ├── index.tsx             # Home
│   │   ├── clases.tsx            # Menú de ejemplos vistos en clase
│   │   └── favoritos.tsx         # Tab demo
│   │
│   ├── categorias/
│   │   └── [nombre].tsx          # Ruta dinámica con parámetro slug
│   │
│   ├── etiquetas/
│   │   └── [nombre].tsx          # Ruta dinámica con parámetro slug
│   │
│   ├── ficha/
│   │   └── [id].tsx              # Ruta dinámica con parámetro numérico
│   │
│   ├── formulario/               # Sub-navegación con stack propio
│   │   ├── _layout.tsx           # Stack layout sin header
│   │   ├── paso1.tsx             # Paso 1 del formulario
│   │   └── paso2.tsx             # Paso 2 del formulario
│   │
│   ├── marcas/
│   │   └── [nombre].tsx          # Ruta dinámica con parámetro slug
│   │
│   └── ejemplos/                 # Pantallas de ejemplo didáctico
│       ├── input-filter.tsx
│       ├── lista-flatlist.tsx
│       └── simple-state.tsx
│
├── assets/
│   └── images/                   # 6 imágenes para íconos y splash
│
└── src/                          # Código fuente no-rutas
    ├── components/
    │   └── cuadrado.tsx          # Componente reutilizable
    ├── data/
    │   ├── categorias.ts         # Datos mock de categorías
    │   ├── etiquetas.ts          # Datos mock de etiquetas
    │   └── marcas.ts             # Datos mock de marcas
    └── navigation/
        └── routes.ts             # Definición centralizada de rutas tipadas
```

### Por qué esta estructura y no otra

- **Separa `app/` de `src/`**: Expo Router usa file-based routing: cada archivo en `app/` es una pantalla/ruta. El profesor reserva `src/` para lógica, componentes reutilizables y datos que **no son rutas**. Esto evita que `app/` se contamine con archivos que no son páginas.
- **Grupos con paréntesis `(tabs)/`**: Los paréntesis en Expo Router indican *route groups*. La URL no incluye `(tabs)`, por lo que `/index` se ve como `/`. Permite agrupar pantallas bajo un mismo layout sin afectar la URL.
- **Rutas dinámicas con `[nombre]` y `[id]`**: Los corchetes definen segmentos dinámicos. `[nombre]` captura un string, `[id]` suele capturar un número. Esto permite pantallas como `/categorias/beverages` donde `beverages` es el valor del parámetro.
- **`_layout.tsx`**: Los archivos con guion bajo definen wrappers/layouts para las rutas hijas. Es el patrón de Expo Router para compartir UI entre pantallas del mismo segmento.

---

## 2. Análisis archivo por archivo

### 2.1. Archivos raíz

#### `.gitignore` — 44 líneas

```
node_modules/        → dependencias no se versionan
.expo/              → builds de Expo no se versionan
dist/, web-build/    → builds de producción no se versionan
expo-env.d.ts       → generado automáticamente
/ios, /android       → carpetas nativas generadas
.vscode/            → configuraciones de editor (personales)
```

**Buena práctica:** Ignorar todo lo generado automáticamente. Solo se versiona el código fuente. Las dependencias se reconstruyen con `npm install`. Las builds se regeneran con `expo build`.

**Por qué `expo-env.d.ts` se ignora:** Es un archivo de tipos generado por Expo. Si se versiona, puede causar conflictos porque se regenera con cada `expo start`. Lo mismo aplica a `.expo/`.

**Por qué `.vscode/` se ignora:** Las configuraciones de editor son personales. Cada desarrollador usa su propio setup. Incluirlas genera ruido en el repo.

---

#### `package.json` — 40 líneas

```json
{
  "name": "myapp",
  "main": "expo-router/entry",      // ← Expo Router como entry point
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~55.0.23",
    "expo-router": "~55.0.14",
    "react": "19.2.0",
    "react-native": "0.83.6",
    "react-native-reanimated": "4.2.1",
    "react-native-safe-area-context": "~5.6.2",
    "react-native-screens": "~4.23.0",
    "@shopify/flash-list": "2.0.2",
    "@react-navigation/native": "^7.1.33",
    // ... etc
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~5.9.2"
  },
  "private": true
}
```

**Puntos importantes:**

- **`"main": "expo-router/entry"`**: Indica que Expo Router maneja el entry point de la app. Es obligatorio para que el file-based routing funcione.
- **`"private": true`**: Evita publicar accidentalmente en npm.
- **Dependencias de navegación requeridas por Expo Router**: `react-native-safe-area-context`, `react-native-screens`, `react-native-reanimated`. Son obligatorias porque Expo Router las usa internamente para gestionar gestos, safe areas y transiciones.
- **`@shopify/flash-list`**: Alternativa performante a `FlatList` para listas largas. El profesor la usa en el ejemplo de lista.
- **Tipos solo en `devDependencies`**: Los tipos de TypeScript no se incluyen en el bundle final. Van en dev porque solo se usan en tiempo de desarrollo.

---

#### `app.json` — 42 líneas

```json
{
  "expo": {
    "name": "myApp",
    "slug": "myApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": { /* ... */ },
    "ios": { "supportsTablet": true },
    "android": { "adaptiveIcon": { /* ... */ } },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "@react-native-community/datetimepicker"
    ],
    "experiments": {
      "typedRoutes": true        // ← EXPERIMENTAL PERO CLAVE
    }
  }
}
```

**Análisis línea por línea:**

- **`orientation: "portrait"`**: Bloquea la orientación a vertical. Para una app de escaneo de productos, esto tiene sentido porque el escáner funciona mejor en portrait.
- **`scheme: "myapp"`**: Define el URI scheme para deep links (ej: `myapp://producto/123`). Fundamental si después se agregan links externos o notificaciones.
- **`userInterfaceStyle: "automatic"`**: Soporta light/dark mode automáticamente según la preferencia del sistema. No fuerza un tema.
- **`plugins: ["expo-router", ...]`**: Los plugins de Expo se ejecutan durante el prebuild para configurar módulos nativos. `expo-router` es obligatorio para el file-based routing.
- **`experiments.typedRoutes: true`**: **HABILITA RUTAS TIPADAS.** Esto hace que Expo genere automáticamente un archivo de tipos con todas las rutas disponibles, y entonces `router.push("/categorias/[nombre]")` se vuelve type-safe: TypeScript te avisa si escribís mal una ruta o si faltan parámetros.
- **Web output "static"**: Genera HTML/CSS/JS estático en vez de un servidor. Mejor para deploy.

**Buena práctica:** Separar assets en subcarpetas con nombres descriptivos (`images/`, `fonts/`, etc). El `app.json` referencia rutas específicas, no una carpeta genérica.

---

#### `tsconfig.json` — 17 líneas

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

**Análisis:**

- **`extends: "expo/tsconfig.base"`**: Extiende la configuración base de Expo. Esto asegura compatibilidad con React Native, JSX, y todas las configuraciones necesarias sin tener que escribir 50 líneas de `compilerOptions`.
- **`strict: true`**: **HABILITA MODO ESTRICTO DE TYPESCRIPT.** Esto activa `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc. Es la mejor práctica más importante en TypeScript. Fuerza a tipar todo correctamente, evitando bugs silenciosos.
- **`paths: { "@/*": ["./*"] }`**: **ALIAS DE IMPORTACIÓN.** Permite escribir `import { Cuadrado } from "@/src/components/cuadrado"` en vez de rutas relativas como `../../../src/components/cuadrado`. Esto hace que los imports sean legibles, refactorizables y no se rompan si movés archivos.
- **`include: ".expo/types/**/*.ts"`**: Incluye los tipos generados por Expo Router para las rutas tipadas (`experiments.typedRoutes`).
- **`include: "expo-env.d.ts"`**: Declaraciones de tipos para variables de entorno de Expo.

**Buena práctica:** Usar siempre `strict: true` en TypeScript. No hay excusa para tenerlo en false. Evita bugs de `null`/`undefined`, parámetros faltantes, y coerción implícita.

---

#### `readme.md` — 6 líneas

Contiene instrucciones mínimas: clonar, instalar (`npm install`), correr (`npm run android` o `npm run ios`). Simple pero suficiente. Un README no necesita ser extenso; solo tiene que permitir que otro dev levante el proyecto en 2 minutos.

---

#### `backup.tsx` — 158 líneas (NO es ruta, es material didáctico)

Este archivo está en la raíz y **no es una ruta** (no está en `app/`). Es un backup de conceptos vistos en clase. Contiene:

- **Componente `Cuadrado`**: Importado desde `@/src/components/cuadrado` con alias de ruta.
- **Tipado explícito en props**: `type MyScrollViewProps = { titulo: string; hideTitle?: boolean; }`. Usa `?` para propiedades opcionales.
- **`PropsWithChildren<T>`**: Tipo helper de React que agrega `children` al tipo de props. Buena práctica para componentes que reciben hijos.
- **`PropsWithChildren<MyScrollViewProps>`**: Tipa explícitamente el parámetro `children` sin que el dev tenga que declararlo manualmente.
- **Valor por defecto en destructuración**: `hideTitle = false` en la firma — evita `undefined` checks.
- **Tipos de retorno explícitos**: `ReactElement` declarado como tipo de retorno. No estrictamente necesario pero ayuda a la legibilidad.
- **Diferentes formas de funciones comentadas**: `pressConPosicion` muestra variantes de la misma función (arrow function, function declaration, etc.) con fines educativos — enseña closures en React.
- **`StyleSheet.create`**: Todos los estilos se definen con esta API. **NO se usan estilos inline** (excepto cuando realmente son dinámicos, como colores variables).
- **Comentarios `// Logica/Controller` y `// Vista`**: Separa visualmente la lógica de la UI en el mismo archivo. Patrón didáctico.
- **`Pressable` vs `TouchableOpacity` vs `Button`**: Muestra las alternativas de touchables en React Native.
- **ScrollView horizontal con `contentContainerStyle`**: Diferencia entre `style` (para el contenedor externo) y `contentContainerStyle` (para el contenido interno).
- **`Array.from` para renderizar listas dinámicas**: Enseña cómo generar elementos dinámicamente.

**Buena práctica — `StyleSheet.create` vs inline styles:**
- `StyleSheet.create` registra los estilos en el motor nativo una sola vez (mejor rendimiento).
- Los estilos inline (`style={{ width: 100 }}`) crean un nuevo objeto en cada render (peor rendimiento).
- Solo usar inline para estilos que dependen del estado.

---

### 2.2. Archivos de `app/` (File-based Routing)

#### `app/_layout.tsx` — 9 líneas (Root Layout)

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**Análisis:**
- **`Stack` de expo-router**: El layout raíz usa un Stack navigator. Dentro, cada pantalla se apila una sobre otra (navegación push/pop).
- **`screenOptions`**: Configuración por defecto para todas las pantallas del stack.
- **`headerBackButtonDisplayMode: "minimal"`**: El botón de "atrás" en iOS muestra solo la flecha sin texto. Más limpio visualmente.
- **`headerShown: false`** en `(tabs)`: Oculta el header del Stack para el grupo de tabs, porque los tabs ya tienen su propio header (si se quiere mostrar).

**Por qué un Stack como root:** Permite que las pantallas de detalle (como `/categorias/beverages`) se pusheen encima de los tabs, y al volver atrás se regresa a los tabs. Es el patrón estándar: Stack > Tabs > Screens.

---

#### `app/+html.tsx` — 38 líneas (Solo web)

Define la estructura HTML raíz. Solo se ejecuta en web, no en native. Configura:
- Meta tags para viewport y charset.
- `ScrollViewStyleReset` para que ScrollView funcione correctamente en web.
- CSS inline para evitar flicker en dark mode (`responsiveBackground`).

**Buena práctica:** Separar la configuración web en un archivo específico (`+html.tsx`). Expo Router sabe que este archivo es solo web y no lo carga en native.

---

#### `app/+not-found.tsx` — 38 líneas (Pantalla 404)

```tsx
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
```

**Análisis:**
- **`+not-found` con `+`**: Los archivos con `+` son especiales en Expo Router. `+not-found` se muestra cuando el usuario navega a una ruta que no existe.
- **`<Stack.Screen options={{ title: "Oops!" }} />`**: Modifica dinámicamente las opciones del Stack desde dentro de la pantalla. Patrón de Expo Router.
- **`<Link href="/">`**: Componente de Expo Router para navegación declarativa. Alternativa a `router.push()`.
- **`StyleSheet.create`**: Mismo patrón consistente en todo el proyecto.

---

#### `app/(tabs)/_layout.tsx` — 56 líneas (Tabs Layout)

```tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "green",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* ... más tabs ... */}
    </Tabs>
  );
}
```

**Análisis:**
- **Ionicons**: Usa `@expo/vector-icons` (incluido con Expo). No requiere configuración nativa extra.
- **`tabBarIcon` recibe `focused`**: Permite cambiar el ícono según si el tab está activo o no. Patrón UX estándar: ícono relleno cuando activo, outline cuando inactivo.
- **`headerShown: false`**: Oculta el header superior en los tabs. Si se quisiera header en un tab específico, se configura en la screen individual.
- **Colores de tab**: `tabBarActiveTintColor` y `tabBarInactiveTintColor` para personalizar la barra. El profesor usa rojo/verde como ejemplo didáctico.

**Buena práctica:** Tener un layout de tabs separado que solo se encarga de la configuración de la Tab Bar. Las pantallas individuales no saben que están en un Tab Navigator; solo el layout lo sabe.

---

#### `app/(tabs)/index.tsx` — 96 líneas (Home)

**Estructura:**
```
1. Importa datos mock y rutas tipadas
2. Componente principal (default export)
3. Type para items de lista
4. Type para props del subcomponente
5. Subcomponente SeccionList (interno, no exportado)
6. Estilos (StyleSheet.create al final)
```

**Análisis detallado:**

- **`import { categorias } from "@/src/data/categorias"`**: Usa el alias `@/` para importar datos mock. No usa APIs reales porque el proyecto es introductorio.
- **`import { AppRoute, buildRoute, ROUTES }`**: Importa el sistema de rutas tipadas. No usa strings sueltos para las rutas.
- **`ListItem` y `SectionListProps`**: Tipos locales definidos en el mismo archivo. No se exportan porque solo se usan acá.
- **`SeccionList`**: Componente interno que recibe `title`, `items` y `route`. Encapsula la lógica de renderizado de una sección de la home.
- **`useRouter().push()`**: Navegación programática. Se usa cuando la navegación ocurre como respuesta a un evento (onPress).
- **`buildRoute(route, { nombre: item.id })`**: Construye una ruta tipada con parámetros. Si `route` es `/categorias/[nombre]`, el resultado es un `Href` con `nombre: "beverages"`.
- **Estilos con `gap`, `flexWrap`, `borderRadius: 999`**: `gap` en React Native funciona correctamente en RN 0.71+. `borderRadius: 999` crea un pill/button redondeado.
- **`maxWidth: 420`**: Limita el ancho máximo en tablets/web para que el contenido no se estire demasiado.

**Patrón: Componente interno + Subcomponente + Estilos al final**
Este orden se repite en todo el proyecto:
1. Imports
2. Componente principal (export default)
3. Tipos locales (si los hay)
4. Subcomponentes (si los hay)
5. `StyleSheet.create` al final

Este orden garantiza que:
- El componente principal se encuentra rápido (está al principio).
- Los estilos no interrumpen la lectura del JSX.
- Si un subcomponente usa un tipo, el tipo está definido antes.

---

#### `app/(tabs)/clases.tsx` — 123 líneas (Menú de ejemplos)

Muestra cards de navegación a los distintos ejemplos vistos en clase. Cada card usa `router.push()` para navegar.

**Puntos didácticos:**
- Uso de `router.push` con rutas del sistema `ROUTES` en vez de strings.
- Uso de `fichaShowRoute(123)` como helper específico que construye la ruta con el ID numérico.
- Uso de `AntDesign` desde `@expo/vector-icons` — muestra íconos dentro de texto con JSX.
- Estilos con composición: `[styles.card, styles.greenCard]` (arreglo de estilos, el segundo sobreescribe al primero).

---

#### `app/(tabs)/favoritos.tsx` — 37 líneas

Pantalla simple de demo. Navega al `/_sitemap` (ruta de debug de Expo Router que muestra el árbol de rutas completo). Útil para debuggear la estructura de navegación.

---

#### `app/categorias/[nombre].tsx` — 35 líneas (Ruta dinámica)

```tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type CategoriaParams = {
  nombre: string;
};

export default function CategoriaScreen() {
  const { nombre } = useLocalSearchParams<CategoriaParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre }} />
      <Text style={styles.title}>Categoria</Text>
      <Text style={styles.value}>{nombre}</Text>
    </View>
  );
}
```

**Análisis línea por línea:**
- **`type CategoriaParams`**: Tipa explícitamente los parámetros de búsqueda. `useLocalSearchParams<CategoriaParams>()` hace que `nombre` sea `string` en vez de `string | string[]`. **SIN este tipo, TypeScript infiere `string | string[]` porque los search params de URL pueden repetirse.**
- **`useLocalSearchParams`**: Hook de Expo Router que lee los parámetros de la URL dinámica. Para `/categorias/beverages`, devuelve `{ nombre: "beverages" }`.
- **`<Stack.Screen options={{ title: nombre }} />`**: Configura el título del header dinámicamente con el valor del parámetro. Patrón clave de Expo Router: la pantalla puede modificar sus propias opciones de navegación.
- **`StyleSheet.create` al final**: Consistencia con el resto del proyecto.

**Patrón repetido en `etiquetas/[nombre].tsx` y `marcas/[nombre].tsx`**: Misma estructura, diferente tipo de parámetro. Esto demuestra consistencia de código: pantallas similares se escriben igual.

---

#### `app/ficha/[id].tsx` — 33 líneas (Ruta dinámica numérica)

Similar a `[nombre]` pero con `id: string`. Incluye un `console.log` para debug. Los parámetros de URL siempre son strings; si se necesita un número, se convierte con `parseInt(id, 10)`.

---

#### `app/formulario/_layout.tsx` — 5 líneas

```tsx
import { Stack } from "expo-router";

export default function FormularioLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**Análisis:** El formulario tiene su propio Stack navigator. Esto permite que `paso1` y `paso2` compartan un layout sin header, y que la navegación entre pasos sea un `replace` (no un push), para que el usuario no pueda volver atrás al paso anterior con el gesto de swipe.

---

#### `app/formulario/paso1.tsx` — 32 líneas

```tsx
const navToPaso2 = () => {
  router.replace(ROUTES.FORMULARIO_PASO_2);
};
```

**`router.replace`**: Reemplaza la pantalla actual en el stack en vez de pushear una nueva. El usuario no puede volver al paso 1 con el botón "atrás". Esto es el comportamiento esperado en formularios multi-paso: una vez que avanzás, no volvés.

---

#### `app/formulario/paso2.tsx` — 33 líneas

```tsx
const navToIndex = () => {
  router.dismissTo(ROUTES.TABS_CLASES);
};
```

**`router.dismissTo`**: Descarta todas las pantallas del stack hasta llegar a la ruta especificada. En este caso, vuelve al tab "Clases" eliminando todo el stack del formulario del medio.

**`<Link href="/">INDEX</Link>`**: Muestra navegación declarativa con `Link`. El componente `Link` renderiza un `Text` por defecto, que es presionable y navega.

---

#### `app/ejemplos/simple-state.tsx` — 41 líneas

Enseña `useState`:
```tsx
function Calcular() {
  const [resultado, setResultado] = useState<number>(0);
  return (
    <Fragment>
      <Button title="Calcular" onPress={() => setResultado(3 * 4)} />
      <Text style={{ fontSize: 25 }}>Resultado: {resultado}</Text>
    </Fragment>
  );
}
```

**Didáctica:**
- **`useState<number>(0)`**: Tipa explícitamente el estado como `number`. El valor inicial `0` ya infiere `number`, pero el tipado explícito es buena práctica para documentar la intención.
- **`<Fragment>` (equivale a `<>...</>`)**: Agrupa elementos sin agregar un nodo extra al DOM/árbol nativo.
- Estado local vs global: El estado está dentro de `Calcular`, no en el componente padre. Solo se comparte si se "levantó" (lift state up).

---

#### `app/ejemplos/lista-flatlist.tsx` — 87 líneas

Usa `FlashList` de Shopify (mejor rendimiento que `FlatList` para listas largas):

```tsx
const items: (Categoria | Etiqueta | Marca)[] = categorias
  .concat(etiquetas)
  .concat(marcas);

<FlashList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item id={item.id} nombre={item.nombre} />}
  ListEmptyComponent={<Text>No hay elementos para mostrar.</Text>}
  ListHeaderComponent={<Text>HEADER</Text>}
  ListFooterComponent={<Text>FOOTER</Text>}
  ItemSeparatorComponent={() => <View style={{...}} />}
/>
```

**Puntos didácticos:**
- **`keyExtractor`**: Cada item necesita una key única. Sin esto, React Native no puede optimizar re-renders.
- **`ListEmptyComponent`**: Se muestra cuando el array `data` está vacío. Evita pantallas en blanco sin feedback.
- **`ListHeaderComponent` / `ListFooterComponent`**: Agrega contenido fijo arriba/abajo de la lista.
- **`ItemSeparatorComponent`**: Renderiza un componente entre items. Más eficiente que agregar margen a cada item.
- **Componente `Item` separado**: Cada fila es un componente independiente con su propio `useRouter`. Esto evita recrear el hook en el closure del renderItem.
- **Comentarios con versiones alternativas comentadas**: Muestra cómo se haría con `function` en vez de arrow function, con fines didácticos.

---

#### `app/ejemplos/input-filter.tsx` — 53 líneas

Enseña filtrado en tiempo real:

```tsx
function CategoriasFiltrables() {
  const [texto, setTexto] = useState("");
  return (
    <>
      <TextInput onChangeText={setTexto} />
      <CategoriasList filtro={texto} />
    </>
  );
}

function CategoriasList({ filtro }: { filtro: string }) {
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(filtro.toLowerCase()),
  );
  return (
    <FlatList
      data={categoriasFiltradas}
      ListEmptyComponent={<Text>No se encontraron categorías</Text>}
    />
  );
}
```

**Patrón clave: Separación de responsabilidades**
- `CategoriasFiltrables` tiene el estado (input text).
- `CategoriasList` recibe el filtro por props y solo renderiza.
- Cuando el texto cambia, solo se re-renderiza `CategoriasList` (que recibe nuevas props), no todo el componente padre.

**`onChangeText={setTexto}`**: Forma abreviada. Equivale a `onChangeText={(text) => setTexto(text)}`. El profesor primero lo muestra comentado con `agregarA()` para enseñar que no se debe mutar el estado directamente.

---

### 2.3. Archivos de `src/`

#### `src/components/cuadrado.tsx` — 28 líneas

```tsx
import { FC } from "react";
import { StyleSheet, View } from "react-native";

type CuadradoProps = {
  color?: string;
};
export const Cuadrado: FC<CuadradoProps> = ({ color = "red" }) => {
  return <View style={[styles.cuadrado, { backgroundColor: color }]} />;
};
```

**Análisis:**
- **Componente tipado con `FC` (FunctionComponent)**: `FC<CuadradoProps>` es equivalente a `(props: CuadradoProps) => ReactElement`. Incluye `children` automáticamente.
- **Prop opcional `color?` con default `= "red"`**: Si no se pasa `color`, usa rojo. Si se pasa, usa el color pasado.
- **Composición de estilos con array**: `[styles.cuadrado, { backgroundColor: color }]` — el primer estilo es fijo (width/height), el segundo es dinámico (color variable). **Este es el patrón correcto para mezclar estilos estáticos y dinámicos.**
- **Comentarios con variantes alternativas**: Muestra cómo se escribiría con `function`, con destructuring explícito, etc. Material didáctico.
- **Export nombrado (`export const Cuadrado`)**: A diferencia del patrón en `app/` donde se usa `export default`. Para componentes reutilizables, el export nombrado es preferible porque:
  1. El IDE autocompleta mejor.
  2. Evita errores de nombre al importar (con default podés renombrarlo a cualquier cosa).

---

#### `src/data/categorias.ts`, `etiquetas.ts`, `marcas.ts`

Archivos de datos mock. Cada uno exporta:
1. Un `type` (interfaz del modelo)
2. Un array constante tipado con ese tipo

```ts
export type Categoria = {
  id: string;
  nombre: string;
};

export const categorias: Categoria[] = [
  { id: "beverages", nombre: "beverages" },
  // ...
];
```

**Buena práctica:**
- **Separar tipos de datos**: Cada archivo define su propio tipo. Si `Etiqueta` y `Categoria` son conceptualmente distintos, van en archivos separados, aunque tengan la misma estructura.
- **Tipar la constante explícitamente**: `categorias: Categoria[]` asegura que TypeScript valide que cada elemento cumpla la interfaz.
- **Usar `as const` NO en los datos, pero SÍ en `ROUTES`**: Las rutas usan `as const` para que TypeScript infiera literales en vez de `string`. Los datos mock no lo necesitan porque son mutables conceptualmente.

---

#### `src/navigation/routes.ts` — 37 líneas (EL ARCHIVO MÁS IMPORTANTE)

```ts
import { Href } from "expo-router";

export const ROUTES = {
  HOME: "/",
  TABS_FAVS: "/favoritos",
  TABS_CLASES: "/clases",
  ALIMENTO: "/alimento",
  FORMULARIO_PASO_1: "/formulario/paso1",
  FORMULARIO_PASO_2: "/formulario/paso2",
  CATEGORIA: "/categorias/[nombre]",
  MARCA: "/marcas/[nombre]",
  ETIQUETA: "/etiquetas/[nombre]",
  FICHA: "/ficha/[id]",
  LISTA_FLATLIST: "/ejemplos/lista-flatlist",
  SIMPLE_STATE: "/ejemplos/simple-state",
  INPUT_FILTER: "/ejemplos/input-filter",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type RouteParams = Record<string, string | number | boolean | undefined>;

export const buildRoute = (route: AppRoute, params?: RouteParams): Href => {
  if (!params) {
    return route as Href;
  }
  return {
    pathname: route,
    params,
  } as Href;
};

export function fichaShowRoute(id: number) {
  return buildRoute(ROUTES.FICHA, { id: id.toString() });
}
```

**Análisis línea por línea:**

1. **`ROUTES` como objeto constante con `as const`**:
   - Sin `as const`, TypeScript infiere `{ HOME: string; FAVS: string; ... }`. Con `as const`, infiere `{ HOME: "/"; FAVS: "/favoritos"; ... }` (literales).
   - Esto permite que `AppRoute` sea un union type de literales: `"/" | "/favoritos" | ...`, lo que da type-safety completa.

2. **`AppRoute`**:
   ```ts
   export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
   ```
   - `typeof ROUTES` obtiene el tipo del objeto: `{ HOME: "/"; FAVS: "/favoritos"; ... }`.
   - `keyof typeof ROUTES` obtiene las claves: `"HOME" | "FAVS" | ...`.
   - `(typeof ROUTES)[keyof typeof ROUTES]` indexa el tipo con sus claves y obtiene los valores: `"/" | "/favoritos" | ...`.
   - **Resultado:** Un union type de todas las rutas posibles. TypeScript solo acepta estas strings en `router.push()`.

3. **`buildRoute`**:
   - Recibe una ruta tipada (`AppRoute`) y parámetros opcionales.
   - Si no hay params, devuelve la ruta como `Href` (string).
   - Si hay params, devuelve un objeto `{ pathname, params }` que Expo Router interpreta correctamente.
   - **Tipado de retorno `Href`**: Es el tipo que Expo Router espera en `router.push()`. Asegura compatibilidad.

4. **`fichaShowRoute(id: number)`**:
   - Helper específico para la ruta de ficha con ID numérico.
   - Convierte `id: number` a `id: string` (los params de URL siempre son strings).
   - Encapsula la lógica de construcción para que el consumidor no tenga que convertir a string manualmente.

**Por qué este archivo es la mejor práctica más importante del proyecto:**
- **Single source of truth**: Todas las rutas están definidas en UN SOLO lugar.
- **Type safety**: Si escribís `ROUTES.CATEGORI` (con typo), TypeScript te marca error.
- **Refactor seguro**: Si cambiás una ruta, solo la cambiás en `ROUTES`. El tipo `AppRoute` se actualiza solo.
- **Documentación**: El objeto `ROUTES` sirve como documentación viva de todas las pantallas de la app.
- **Helpers tipados**: `buildRoute` y `fichaShowRoute` garantizan que los parámetros se pasen correctamente.

---

## 3. Buenas prácticas identificadas (resumen)

### 3.1. TypeScript

| # | Práctica | Ubicación |
|---|----------|-----------|
| 1 | **`strict: true`** en tsconfig.json | `tsconfig.json:4` |
| 2 | **Tipos explícitos en props de componentes** | `cuadrado.tsx:4`, `backup.tsx:116-119` |
| 3 | **`useLocalSearchParams<T>()` con tipo genérico** | `[nombre].tsx:9` |
| 4 | **`as const` para literales** | `routes.ts:17` |
| 5 | **`PropsWithChildren<T>` para componentes que aceptan children** | `backup.tsx:124` |
| 6 | **Union types para datos mock combinados** | `lista-flatlist.tsx:10-12` |
| 7 | **Tipos exportados junto a sus datos** | `categorias.ts:1-4` |

### 3.2. Arquitectura y estructura

| # | Práctica | Justificación |
|---|----------|---------------|
| 8 | **Separar `app/` (rutas) de `src/` (lógica)** | Evita contaminar el router con archivos no-ruta |
| 9 | **Centralizar rutas en `src/navigation/routes.ts`** | Single source of truth, type safety, refactor seguro |
| 10 | **Usar `@/*` como alias de importación** | Evita rutas relativas profundas, legible y refactorizable |
| 11 | **Separar datos mock en `src/data/`** | Cada archivo un dominio (categorías, marcas, etiquetas) |
| 12 | **Separar componentes reutilizables en `src/components/`** | Distingue pantallas (app/) de componentes genéricos |
| 13 | **Grupos con paréntesis `(tabs)/` para layouts** | No afectan la URL pero permiten layouts compartidos |
| 14 | **Layouts por segmento (`_layout.tsx`)** | Cada sección de la app puede tener su propio Stack/Tabs |

### 3.3. Navegación (Expo Router)

| # | Práctica | Justificación |
|---|----------|---------------|
| 15 | **Usar `ROUTES.XXX` en vez de strings sueltos** | Type safety, evita typos |
| 16 | **`buildRoute()` para rutas con parámetros** | Construcción tipada de rutas dinámicas |
| 17 | **Helpers específicos (`fichaShowRoute`)** | Encapsulan la lógica de tipos (number → string) |
| 18 | **`router.replace` para formularios multi-paso** | No permite volver atrás con gesto |
| 19 | **`router.dismissTo` para volver a una ruta específica** | Descarta pantallas intermedias |
| 20 | **Tipar rutas dinámicas con `type Params`** | `useLocalSearchParams<T>()` infiere tipos correctos |

### 3.4. Estilos y UI

| # | Práctica | Justificación |
|---|----------|---------------|
| 21 | **`StyleSheet.create` para estilos estáticos** | Rendimiento (registro único nativo) |
| 22 | **Inline styles solo para valores dinámicos** | `{ backgroundColor: color }` |
| 23 | **Composición con array de estilos** | `[styles.base, stylesOverride]` |
| 24 | **`maxWidth` en contenedores** | Evita estiramiento en tablets/web |

### 3.5. React y estado

| # | Práctica | Justificación |
|---|----------|---------------|
| 25 | **Separar lógica de vista con comentarios** | `// Logica` / `// Vista` |
| 26 | **Estado local en el componente que lo usa** | `useState` en el componente más bajo posible |
| 27 | **Separar componente de filtro del de renderizado** | `CategoriasFiltrables` vs `CategoriasList` |
| 28 | **`keyExtractor` en FlatList/FlashList** | Obligatorio para rendimiento y evitar bugs de keys |
| 29 | **`ListEmptyComponent` en listas** | Evita pantallas vacías sin feedback |

### 3.6. Configuración y tooling

| # | Práctica | Justificación |
|---|----------|---------------|
| 30 | **`experiments.typedRoutes: true`** | Rutas autogeneradas type-safe |
| 31 | **`private: true` en package.json`** | Evita publicación accidental en npm |
| 32 | **`.gitignore` completo** | Excluye todo lo generado (node_modules, .expo, builds, nativos, `.vscode/`) |
| 33 | **Dependencias de navegación explícitas** | `react-native-screens`, `safe-area-context`, `reanimated` en package.json; NO incluir `@react-navigation/bottom-tabs` y `@react-navigation/elements` (Expo Router los maneja internamente) |
| 34 | **README con instrucciones mínimas** | Clonar, instalar, correr en 3 pasos |
| 35 | **`main: "expo-router/entry"`** | Obligatorio para Expo Router |

---

## 4. Análisis comparativo: `Sarasola_Matias_UNTDF2026` (Steaming_UP) vs `tnt-2206-intro`

### 4.1. Tabla de cumplimiento de buenas prácticas

| # | Práctica | ¿Cumple? | Evidencia |
|---|----------|----------|-----------|
| 1 | `strict: true` | ✅ Sí | `tsconfig.json:4` |
| 2 | Tipos explícitos en props | ✅ Sí | `interface PropsTarjetaCategoria`, `type ParamsCategoria`, etc. |
| 3 | `useLocalSearchParams<T>()` tipado | ✅ Sí | `[slug].tsx:12`, `[barcode].tsx:12` |
| 4 | `as const` en rutas | ✅ Sí | `routes.ts:9` |
| 5 | `PropsWithChildren<T>` | N/A | No hay componentes que reciban children |
| 6 | Union types para datos mock | N/A | Usa otra estrategia (diccionario por categoría) |
| 7 | Tipos exportados junto a datos | ✅ Sí | `Categoria`, `Producto`, `InformacionNutricional` exportados |
| 8 | Separar `app/` de `src/` | ✅ Sí | Componentes en `src/components/`, datos en `src/data/` |
| 9 | Centralizar rutas | ✅ Sí | `src/navigation/routes.ts` con `RUTAS` y `construirRuta` |
| 10 | Alias `@/*` | ✅ Sí | `tsconfig.json:5-9` y usado en todos los imports |
| 11 | Datos mock en `src/data/` | ✅ Sí | `categorias.ts`, `productos.ts`, `tema.ts` |
| 12 | Componentes en `src/components/` | ✅ Sí | `TarjetaCategoria`, `TarjetaProducto`, `HomeHero` |
| 13 | Grupos con paréntesis `(tabs)/` | ✅ Sí | `app/(tabs)/_layout.tsx` |
| 14 | Layouts por segmento | ✅ Sí | `_layout.tsx` en raíz y en tabs |
| 15 | `RUTAS.XXX` en vez de strings | ✅ Sí | `construirRuta(RUTAS.CATEGORIA, ...)` en todas partes |
| 16 | `construirRuta()` para params | ✅ Sí | `construirRuta(RUTAS.CATEGORIA, { slug })` |
| 17 | Helpers de ruta específicos | ❌ No | Ver sección 4.2 — falta `rutaProducto(barcode)` |
| 18 | `router.replace` para formularios | N/A | No hay formulario multi-paso |
| 19 | `router.dismissTo` | N/A | No hay navegación que lo requiera |
| 20 | Tipar params de ruta con `type` | ✅ Sí | `ParamsCategoria`, `ParamsProducto` |
| 21 | `StyleSheet.create` para estáticos | ✅ Sí | Usado en todos los archivos |
| 22 | Inline solo para dinámicos | ✅ Sí | `{ backgroundColor: color }` en TarjetaCategoria |
| 23 | Composición array de estilos | ✅ Sí | `[styles.contenedorIcono, { backgroundColor: ... }]` |
| 24 | `maxWidth` en contenedores | ⚠️ Parcial | No se usa en la home ni en tabs, pero la app es mobile-first |
| 25 | Separar lógica/vista con comentarios | ❌ No | Ver sección 4.2 |
| 26 | Estado en componente más bajo | ✅ Sí | Estado bien localizado donde corresponde |
| 27 | Separar filtro de renderizado | N/A | No hay filtros implementados aún |
| 28 | `keyExtractor` en FlashList | ✅ Sí | `(item) => item.id` en todas las listas |
| 29 | `ListEmptyComponent` en listas | ❌ No | Ver sección 4.2 — listas sin estado vacío |
| 30 | `experiments.typedRoutes` | ✅ Sí | `app.json:40` |
| 31 | `private: true` | ✅ Sí | `package.json:46` |
| 32 | `.gitignore` completo | ❌ No | Ver sección 4.2 — `.vscode/` y `example/` comiteados |
| 33 | Dependencias de navegación correctas | ❌ No | Ver sección 4.2 — dependencias redundantes |
| 34 | README con instrucciones | ⚠️ Parcial | README existe pero no verificado |
| 35 | `main: "expo-router/entry"` | ✅ Sí | `package.json:3` |

### 4.2. Listado de buenas prácticas no aplicadas (con solución)

#### ❌ Gap 1 — `.vscode/` comiteado en el repositorio
**Archivo:** `.vscode/extensions.json`, `.vscode/settings.json`
**Práctica violada:** #32 — `.gitignore` completo

**Problema:** El repositorio del profesor excluye `.vscode/` en `.gitignore` (línea 44) porque son configuraciones personales de editor. El proyecto actual tiene `.vscode/` comiteado con `extensions.json` y `settings.json`. Cada dev usa su propio editor y configuraciones; forzar las propias genera conflictos.

**Solución:**
1. Agregar `.vscode/` al `.gitignore`
2. Eliminar la carpeta del tracking: `git rm --cached -r .vscode/`

---

#### ❌ Gap 2 — Carpeta `example/` con código muerto
**Archivo:** `example/` (todo el directorio)
**Práctica violada:** #8, #11 — separación limpia de código

**Problema:** La carpeta `example/` contiene código del template inicial de Expo (componentes `animated-icon`, `app-tabs`, `collapsible`, hooks de color scheme, etc.). Este código no es parte del proyecto Steaming_UP y el repositorio del profesor no contiene nada similar. Es código muerto que:
- Aumenta el tamaño del repo sin aportar valor
- Puede confundir sobre qué código está realmente en uso
- Se desactualiza con el tiempo

**Solución:** Eliminar la carpeta `example/` completamente.

---

#### ❌ Gap 3 — `icono as any` — violación de tipado estricto
**Archivo:** `src/components/categoria/TarjetaCategoria.tsx:20`
**Práctica violada:** #1, #2 — TypeScript estricto

```tsx
<Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
```

**Problema:** El uso de `as any` desactiva la verificación de tipos. `Ionicons` espera un nombre de ícono válido de su catálogo (ej: `"home" | "heart" | ...`). Al usar `as any`, TypeScript no puede avisar si se pasa un ícono inválido. El profesor **nunca** usa `as any` en su código — todo está tipado correctamente.

**Por qué se hace así y no de otra forma:** El programador probablemente tipó `icono: string` en la interfaz y TypeScript marcó error porque `string` no es asignable al union type de Ionicons. La solución correcta es tipar `icono` como el tipo real de Ionicons o usar un tipo más acotado.

**Solución:**
```tsx
// Opción A: Importar el tipo de Ionicons
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

interface PropsTarjetaCategoria {
  icono: ComponentProps<typeof Ionicons>["name"];
  // ...
}

// Opción B: Definir un union type propio con los íconos usados
type IconName = "wine-outline" | "water-outline" | "pizza-outline" | "leaf-outline" | /* ... */;

interface PropsTarjetaCategoria {
  icono: IconName;
  // ...
}
```

**Código actual que debe cambiarse:**
```diff
- <Ionicons name={icono as any} size={28} color={color || tema.colors.primary} />
+ <Ionicons name={icono} size={28} color={color || tema.colors.primary} />
```

---

#### ❌ Gap 4 — `ListEmptyComponent` ausente en FlashList
**Archivos:** 
- `app/(tabs)/listas.tsx:17`
- `app/categoria/[slug].tsx:25`

**Práctica violada:** #29 — feedback de lista vacía

**Problema:** El profesor siempre incluye `ListEmptyComponent` en sus listas (`lista-flatlist.tsx:29`, `input-filter.tsx:50`). Si una categoría no tiene productos (o el array está vacío por un bug), el usuario ve una pantalla en blanco sin ninguna indicación de qué pasa.

**Solución:**
```tsx
<FlashList
  data={CATEGORIAS}
  // ...
  ListEmptyComponent={
    <View style={styles.vacio}>
      <Text style={styles.textoVacio}>No hay categorías disponibles</Text>
    </View>
  }
/>
```

---

#### ❌ Gap 5 — Dependencias de navegación redundantes
**Archivo:** `package.json:15-17`
**Práctica violada:** #33 — dependencias correctas

**Problema:** El proyecto incluye `@react-navigation/bottom-tabs` y `@react-navigation/elements` como dependencias explícitas. El repositorio del profesor **no** incluye estos paquetes porque Expo Router maneja los tabs internamente con su propio componente `<Tabs>`. Incluir estas dependencias:
- Aumenta el `node_modules` sin necesidad
- Puede causar conflictos de versión con lo que Expo Router espera
- Da a entender que se usa React Navigation directamente cuando en realidad se usa Expo Router

```diff
# package.json
- "@react-navigation/bottom-tabs": "^7.15.5",
- "@react-navigation/elements": "^2.9.10",
  "@react-navigation/native": "^7.1.33",   // ← este sí es necesario
```

**Solución:** Eliminar `@react-navigation/bottom-tabs` y `@react-navigation/elements` del `package.json` y correr `npm install` nuevamente.

---

#### ❌ Gap 6 — Falta helper de ruta específico para productos
**Archivo:** `src/navigation/routes.ts`
**Práctica violada:** #17 — helpers específicos para rutas con parámetros

**Problema:** El profesor define `fichaShowRoute(id: number)` como helper específico para la ruta de ficha. Esto encapsula la conversión `number → string` y evita que cada pantalla que quiera navegar a una ficha tenga que recordar cómo construir la ruta. El proyecto actual construye la ruta de producto manualmente en `TarjetaProducto.tsx:19`:

```tsx
// Actualmente en TarjetaProducto.tsx
router.push(construirRuta(RUTAS.PRODUCTO, { barcode }));
```

Esto funciona, pero dispersa la lógica de construcción de rutas por toda la app. Si en el futuro cambia el parámetro de `barcode` a `id`, hay que modificar cada archivo que navega a producto.

**Solución (agregar en `routes.ts`):**
```ts
export function rutaProducto(barcode: string): Href {
  return construirRuta(RUTAS.PRODUCTO, { barcode });
}
```

Y luego usar `router.push(rutaProducto(barcode))` en los componentes.

---

#### ❌ Gap 7 — Separación lógica/vista con comentarios
**Archivos:** Todos los componentes de pantalla
**Práctica violada:** #25 — separar lógica de vista

**Problema:** El profesor separa visualmente la lógica de la vista con comentarios `// Logica/Controller` y `// Vista` (ver `backup.tsx:22` y `71`, `ficha/[id].tsx:8` y `13`). Esto ayuda a:
- Identificar rápidamente dónde está la lógica de negocio
- Mantener un orden consistente en todos los archivos
- Facilitar la revisión de código

El proyecto actual no tiene esta separación visual. Si bien no es un error, es una convención que el profesor usa consistentemente y que debería adoptarse.

**Ejemplo de cómo aplicarlo en `categoria/[slug].tsx`:**
```tsx
export default function PantallaCategoria() {
  // Logica
  const { slug } = useLocalSearchParams<ParamsCategoria>();
  const titulo = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Categoría";
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

#### ❌ Gap 8 — Uso de `index` como key en `.map()` (antipattern de React)
**Archivo:** `app/producto/[barcode].tsx:59,70`
**Práctica violada:** #28 — keys correctas en listas

```tsx
// Línea 59 — ingredientes
{producto.ingredientes.map((ingrediente, index) => (
  <View key={index} style={styles.filaIngrediente}>

// Línea 70 — alérgenos
{producto.alergenos.map((alergeno, index) => (
  <View key={index} style={styles.chipAlergeno}>
```

**Problema:** Usar el índice del array como key es un antipattern de React cuando los elementos pueden cambiar de orden, agregarse o eliminarse. Si bien en este caso los arrays son estáticos (datos mock), la práctica correcta es usar un identificador único. El profesor usa `keyExtractor={(item) => item.id}` en sus FlatList (usa `item.id`, no el índice).

**Solución:** Agregar un `id` a los ingredientes o usar el propio string como key (si son únicos):
```tsx
{producto.ingredientes.map((ingrediente, index) => (
  <View key={`${producto.barcode}-ing-${index}`} style={styles.filaIngrediente}>
```

O mejor aún: modificar el modelo de datos para que los ingredientes tengan ID.

---

### 4.3. Resumen de gaps ordenados por criticidad

| Prioridad | Gap | Tipo | Criticidad |
|-----------|-----|------|------------|
| 🔴 Alta | `icono as any` — viola TypeScript estricto | Código | **Crítico** — el profe lo marcaría como error |
| 🔴 Alta | `.vscode/` comiteado — configuraciones personales en repo | Config | **Crítico** — el profe lo excluye explícitamente |
| 🟠 Media | `example/` — código muerto del template | Estructura | **Importante** — repo con código que no se usa |
| 🟠 Media | `ListEmptyComponent` faltante en FlashList | UI/UX | **Importante** — el profe siempre lo incluye |
| 🟠 Media | `index` como key en `.map()` | React | **Importante** — antipattern documentado |
| 🟡 Baja | Dependencias `@react-navigation/bottom-tabs` y `@react-navigation/elements` | Dependencias | **Recomendado** — innecesarias con Expo Router |
| 🟡 Baja | Falta helper de ruta específico (`rutaProducto`) | Arquitectura | **Recomendado** — DRY y type safety |
| 🟢 Informativa | Comentarios `// Logica` / `// Vista` | Estilo | **Convención** — el profe lo usa |

---

### 4.4. Aspectos donde Steaming_UP supera al repo del profesor

El proyecto actual tiene algunas mejoras respecto al repo del profesor:

1. **Sistema de tema centralizado** (`src/data/tema.ts`): El profesor usa colores hardcodeados en cada pantalla. Steaming_UP define un objeto `tema` con colores y radios consistentes. Esto hace que cambiar el theme requiera tocar un solo archivo.

2. **Componentes con `interface` en vez de `type`**: Si bien ambos son válidos, `interface` es más idiomático para props de componentes en React y permite declaration merging.

3. **Uso de `android_ripple` en Pressable** (`TarjetaProducto.tsx:26`): Proporciona feedback táctil en Android respetando Material Design. El profesor no usa esta prop.

4. **Estados de carga/empty con placeholder**: La pantalla `[barcode].tsx` maneja el caso de producto no encontrado con un UI de fallback (ícono + mensaje). El profesor no muestra este patrón en sus pantallas de detalle.

5. **Uso de `Link` para navegación estática** (`index.tsx:14,25`): El componente `Link` de Expo Router es más semántico y accesible que `useRouter().push()` para navegación declarativa.

6. **`exclude: ["example"]` en tsconfig** (`tsconfig.json:17-19`): Correctamente excluye el código de ejemplo del type-checking. El profesor no tiene esto porque no tiene código de ejemplo que excluir.

---

### 4.5. Acciones correctivas recomendadas (orden de ejecución)

1. Agregar `.vscode/` al `.gitignore` y eliminar del tracking
2. Eliminar carpeta `example/`
3. Quitar `icono as any` y tipar correctamente el nombre del ícono
4. Agregar `ListEmptyComponent` a todas las FlashList
5. Eliminar dependencias `@react-navigation/bottom-tabs` y `@react-navigation/elements`
6. Agregar helper `rutaProducto(barcode)` en `routes.ts`
7. Cambiar `key={index}` por keys únicas en los `.map()` de ingredientes y alérgenos
8. Agregar comentarios `// Logica` / `// Vista` para consistencia con el estilo del profesor
