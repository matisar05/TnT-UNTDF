# Análisis Extremo: Todos los Archivos, Línea por Línea (Directorio src/)

Este es el manifiesto completo arquitectónico. Se analiza el 100% de los códigos base y bloques lógicos de la aplicación.

---

## 1. `src/navigation/routes.ts`

```typescript
export const ROUTES = {
  HOME: '/',
  LISTAS: '/listas',
  CAMARA: '/camara',
  CATEGORIA: '/categoria/[slug]',
  PRODUCTO: '/producto/[barcode]',
  FAVORITOS: '/favoritos',
} as const;
```

**Análisis Detallado:**
*   `export const ROUTES`: Declaramos una constante global pública. Es la enciclopedia de hacia dónde se puede viajar. Se evita hacer variables separadas para empaquetarlo bajo el namespace `ROUTES`.
*   `HOME: '/'` a `FAVORITOS: '/favoritos'`: Relaciona en formato clave-valor (KVP) una variable semántica visual (`FAVORITOS`) con su verdadera URL implícita del sistema de archivos (`/favoritos`). Esto se hace para la des-acoplación técnica: los navegadores consumen la variable, si la ruta del archivo real cambia mañana a `/favs`, cambiamos solo este string y toda la app sobrevive intacta.
*   `as const`: Sella atómica y herméticamente el objeto. Transforma los tipos sueltos (`string`) en Tipos Literales Estrictos. Garantiza que TypeScript rechace cualquier intento de reasignación durante el ciclo de vida del frontend en cualquier otro archivo.

---

## 2. `src/constants/tema.ts`

```typescript
export const tema = {
  colors: {
    primary: '#E67E22', 
    background: '#F8F9FA',
    text: '#2D3436',
    border: '#DFE6E9',
    bannerText: '#FFFFFF',
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 20, xl: 40,
  },
  text: {
    sm: 12, base: 14, lg: 16, xl: 24,
  }
};
```

**Análisis Detallado:**
*   `export const tema = { ... }`: El Single Source of Truth (Única fuente de la verdad) para el diseño UI/UX. Agrupa todas las heurísticas gráficas.
*   `colors`: Agrupa los códigos HEX puros. Nunca se pone `"orange"` o *"white"*; se enclavan colores de gama corporativa (como el naranja Hex `#E67E22`).
*   `spacing`: Utiliza la progresión métrica base 4 (Grid de 4pts). Se usa en márgenes. Evita la polución visual porque un desarrollador ya no puede tipear arbitrariamente `padding: 13`.
*   `text`: Define la escala tipográfica escalonada desde 12 hasta 24pts garantizando armoniosas jerarquías de lectura.

---

## 3. `src/app/_layout.tsx`

```tsx
import { Stack } from 'expo-router';
import { tema } from '../constants/tema';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.colors.primary },
        headerTintColor: tema.colors.bannerText,
        headerTitleStyle: { color: tema.colors.bannerText },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'MaGui-S.A', headerShown: false }} />
      <Stack.Screen name="categoria/[slug]" options={{ title: 'Categoría' }} />
      <Stack.Screen name="listas/index" options={{ title: 'Listas Generales' }} />
      <Stack.Screen name="favoritos/index" options={{ title: 'Mis Favoritos' }} />
      <Stack.Screen name="producto/[barcode]" options={{ title: 'Detalle de Producto' }} />
    </Stack>
  );
}
```

**Análisis Detallado:**
*   `import { Stack }`: Importa el contenedor nativo de "modo pila" de Expo, que simula la tarjeta deslizante predeterminada de los teléfonos móviles con botones nativos de "Atrás".
*   `<Stack screenOptions={...}>`: Esta etiqueta inyecta las directrices a **todas** las pantallas contenidas en toda la app de un solo golpe.
    *   `headerStyle: { backgroundColor: tema.colors.primary }`: Pinta la cinta adhesiva o cabecera superior natural del móvil de color Naranja Base.
    *   `headerTintColor`: Asegura que los íconos del sistema pre-dibujados de flecha hacia atrás (<) sean color blanco brillante.
    *   `headerTitleStyle`: Fuerza el color del título al centro en blanco brillante.
*   `<Stack.Screen name="..." />`: Las cinco líneas inferiores funcionan como pre-declaraciones. En sí mismas no renderizan el contenido de la pantalla, pero configuran su comportamiento en caso de que alguien rutee hacia ellas. 
*   `options={{ headerShown: false }}` (en index): Elimina la barra naranja predeterminada solo en el Inicio (`index`), porque nosotros decidimos construir nuestro propio cartel superior grande a mano (`<HomeHero />`) que sería arruinado por una barra base encima de él.

---

## 4. `src/app/index.tsx` (Pantalla Home)

```tsx
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { HomeHero } from '../components/home/HomeHero';
import { TabBar } from '../components/layout/TabBar';
import { tema } from '../constants/tema';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HomeHero />
        
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
           {/* Contenido placeholder anterior */}
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Favoritos Recientes</Text>
           {/* Contenido placeholder */}
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.colors.background },
  scrollContent: { paddingBottom: 100 },
  section: { padding: tema.spacing.md, gap: tema.spacing.md },
  sectionTitle: { fontSize: tema.text.lg, fontWeight: 'bold', color: tema.colors.text }
});
```

**Análisis Detallado:**
*   `export default function HomeScreen()`: Componente funcional del índice principal. Note el "export default", que habilita que Expo tome posesión y lo convierta en ruta raíz `/`.
*   `<View style={styles.container}>`: La caja invisible maestra. Usar `flex: 1` es imperativo en React Native: le ordena a la caja expandirse para consumir el 100% de la pantalla del dispositivo físico ignorando los márgenes muertos. Fija el color de pared general de la app sacado del diccionario `tema`.
*   `<ScrollView>`: Es un lienzo infinito de rodillo vertical. Requerido porque si el usuario tiene pantalla chica, los elementos se recortarían sin poder hacer "scroll".
*   `contentContainerStyle={styles.scrollContent}`: Le decimos al "Adentro" del lienzo giratorio que pise un *padding* inferior de 100 píxeles. Esto se realiza como contramedida técnica: como el `<TabBar />` flotante se superpone y obstruye el final del rodillo, inyectamos espacio muerto para que el final del texto quede visible más arriba de la barra táctil.
*   `<HomeHero />` y `<TabBar />`: Invocación a componentes mudos o "Dumb Components". Esta página asume el rol de ensamblador arquitectónico ("Smart").
*   `styles.section`: Usamos el motor Flex para las áreas con `padding` a fin de que respiren hacia los bordes del celular, limitados lógicamente contra la resolución general del dispositivo, y sumando el `gap` para dispersar hijos.

---

## 5. `src/app/categoria/[slug].tsx`

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';
import { tema } from '../../constants/tema';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const titulo = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : 'Categoría';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: titulo }} />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Productos de la categoría: {slug}</Text>
      </View>
      <TabBar />
    </View>
  );
}
//... styles omitidos (container flex 1 y padding)
```

**Análisis Detallado:**
*   `const { slug } = useLocalSearchParams<{ slug: string }>();`: Destrucción algorítmica y Hook Base. Extrae asincrónicamente el parámetro de red emitido en la URL de entrada. Protege la firma asegurando al compilador que `slug` no será un objeto indefinido o número mediante inferencia escalar `<{ slug: string }>`.
*   `const titulo = slug ? ...`: Filtro de saneamiento visual a prueba de robos. El slug entra en formato sucio url codificado (ej: `cereales-dulces`). Se valida la existencia para prevenir colapsos. `.charAt(0).toUpperCase()` engrandece la "C". `.slice(1)` adhiere el resto "ereales-dulces", y `.replace('-', ' ')` quita el guion. Output: *"Cereales dulces"*. Un diseño de procesamiento "al vuelo" que no requiere llamados a Bases de Datos.
*   `<Stack.Screen options={{ title: titulo }} />`: Esta etiqueta sobrescribe mágicamente y en tiempo de renderizado el Texto impreso en el Nivel Superior nativo del OS (Header), sustituyendo su nombre por la constante variable procesada un segundo antes.
*   `{slug}`: Inyectado finalmente in situ de muestra en texto primitivo en placa base para uso depurador.

---

## 6. `src/app/producto/[barcode].tsx`

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { tema } from '../../constants/tema';

export default function ProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Detalle del Producto Barcode: {barcode}</Text>
    </View>
  );
}
```

**Análisis Detallado:**
*   `[barcode].tsx`: Como ruta dinámica su responsabilidad es aislar un código numérico o matricial (Ej. 779342..). 
*   `useLocalSearchParams<{ barcode: string }>`: Captura el parámetro inyectado. La decisión de modelarlo como cadena `string` (en vez de `number`) es una práctica defensiva superior crítica: los números de barras a veces empiezan con ceros contiguos (00123) que los procesadores int como JS truncan destruyendo la base. Dejarlos como string preserva su integridad intacta.
*   *(Layout simple de esqueleto usado como placeholder pre-implementación profunda real de lógicas extra de cámara, flex: 1).*

---

## 7. `src/app/listas/index.tsx`

```tsx
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { TabBar } from '../../components/layout/TabBar';
import { TarjetaCategoria } from '../../components/categoria/TarjetaCategoria';
import { tema } from '../../constants/tema';
import { CATEGORIAS } from '../../constants/mockData'; 
// (Asumimos el mock interno importado o generado en scope)

export default function ListasScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={CATEGORIAS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TarjetaCategoria
            nombre={item.nombre}
            slug={item.slug}
            icono={item.icono as unknown as keyof typeof import('@expo/vector-icons').Ionicons.glyphMap}
            color={item.color}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <TabBar />
    </View>
  );
}
const styles = StyleSheet.create({ // ... });
```

**Análisis Detallado:**
*   `<FlatList />`: El titán estructural listador. A diferencia de `.map` o `ScrollView`, FlatList opera bajo el algoritmo "Ventana Virtual": destruye módulos que salen de pantalla e instancia en base real solo los 6 componentes limitantes de pantalla. Esto garantiza fluidez gráfica continua en 60 FPS sin sobrecargar la RAM del núcleo.
*   `data={CATEGORIAS}`: Acopla la inyección en array del objeto masivo.
*   `keyExtractor={(item) => item.id}`: Impone React Reconciliation Rule. Otorga matrícula e identidad unívoca de puntero de rediseño cada iteración.
*   `renderItem={({ item }) => <TarjetaCategoria ... />`: Es el dibujante o puntero generador iterativo. Pasa a una Tarjeta muda todas sus variables en forma paramétrica pura como "Props".
*   `icono={item.icono as unknown as ...}`: Intercepción forzada transicional del compilador TSLint de Type. Cuando la Data no está verificada externamente (traída de BackEnd), Typescript se niega a pasar un string impuro como Icono. Interceptar forzadamente con un casting doble engaña y restabiliza el nodo obligando a su lectura desde el diccionario.

---

## 8. `src/app/favoritos/index.tsx`

```tsx
import { View, StyleSheet, Text } from 'react-native';
import { TabBar } from '../../components/layout/TabBar';
import { tema } from '../../constants/tema';

export default function FavoritosScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Lista de Favoritos Vacía</Text>
      </View>
      <TabBar />
    </View>
  );
}
//... styles default
```
**Análisis Detallado:**
*   Ruta Estática Pura de destino (Se resuelve como web`/favoritos`). 
*   Estructura minimalista envolviendo lógica de marcador base donde recae temporalmente interfaz nula a la espera de un FlatList particular para favoritos atados a estado asincrónico local de AsyncStorage futuro. El contenedor de Content invoca `justifyContent: 'center'` asegurando un pin central matemático a la vista.

---

## 9. `src/components/home/HomeHero.tsx`

```tsx
import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../constants/tema';

export const HomeHero: FC = () => {
  return (
    <View style={styles.hero}>
      <View style={styles.headerRow}>
         <View style={styles.userContainer}>
            <Text style={styles.saludo}>Hola,</Text>
             <Text style={styles.nombre}>Juan Perez</Text>
         </View>
         <View style={styles.notificationsPill}>
             <Ionicons name="notifications-outline" size={20} color={tema.colors.primary} />
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: tema.colors.primary,
    padding: tema.spacing.lg,
    paddingTop: tema.spacing.xl, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // ... ommiting redundant texts
});
```

**Análisis Detallado:**
*   `export const HomeHero: FC = () =>`: No acepta parámetros (`FC` nulo), se diseña como panel puramente estático independiente y decorador visual superior.
*   `styles.hero { borderBottomLeftRadius: 30 ... }`: Moldeo estético circular artificial. En vez de una caja recta, suavizamos asimétricamente los bordes del lado inferior simulando un "Drop Card" o diseño curvo en caída sin alterar su conexión superior.
*   `styles.headerRow { flexDirection: 'row', justifyContent: 'space-between' }`: El núcleo maestro del enmaquetado Flex. `flexDirection: 'row'` quiebra la gravedad vertical estándar de React Mobile orientando las cajas paralela y horizontalmente (Izquierda/Derecha). `justifyContent: 'space-between'` fuerza al bloque A y al B hacia sus contra-extremos geográficos generando un vacío infinito magnético entre el cartel del Nombre Izquierdo y el ícono de las notificaciones lado total derecho de forma autónomamente fluida.

---

## 10. `src/components/layout/TabBar.tsx`

```tsx
import { FC } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../navigation/routes';
import { tema } from '../../constants/tema';

export const TabBar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === ROUTES.HOME;
  const isListas = pathname.startsWith(ROUTES.LISTAS);
  // .. omit de camara

  return (
    <View style={styles.container}>
      <Pressable style={styles.tabItem} onPress={() => router.push(ROUTES.HOME)}>
        <Ionicons name={isHome ? "home" : "home-outline"} size={24} color={isHome ? tema.colors.primary : tema.colors.text} />
        <Text style={[styles.tabLabel, isHome && styles.activeTabLabel]}>Inicio</Text>
      </Pressable>
      
      {/*... omit camara ...*/}

      <Pressable style={styles.tabItem} onPress={() => router.push(ROUTES.LISTAS)}>
        <Ionicons name={isListas ? "list" : "list-outline"} ... />
      </Pressable>
    </View>
  );
};
```

**Análisis Detallado:**
*   `const isListas = pathname.startsWith(ROUTES.LISTAS);`: Expresión lógica difusa. No chequea matemáticamente el igual absoluto directo (`===`), sino un "comienza con". Justificativa arquitectónica extrema: al acceder temporalmente a la ruta hija oculta parametrizada como `/listas/categoria/carnes`, el igual estricto (`=== "/listas"`) colapsaría y apagaría el Tab. El usar `startsWith` preserva iluminado el botón general aun buceando lógicamente en niveles inferiores anidados y ramas subyacentes.
*   `<Ionicons name={isHome ? "home" : "home-outline"}>`: Ternario visual en el dibujo íconico. Evalúa al vuelo si está activo alterando la topología renderizando un logo macizo sin huecos vs siluetas vacías contorneadas, creando la ilusión viva sin código condicional gigante.
*   `style={[styles.tabLabel, isHome && styles.activeTabLabel]}`: Ensamblaje modular cruzado para Textos. Evalúa una técnica "Short Circuit Binding": Si estás en Casa añade el nodo CSS de la casa activa pisando jerárquicamente al estilo primigenio pasivo que se hallaba un bloque antes. 

---

## 11. `src/components/categoria/TarjetaCategoria.tsx`

```tsx
type TarjetaCategoriaProps = {
  nombre: string;
  slug: string;
  icono: keyof typeof Ionicons.glyphMap;
  color?: string; // Optativo
};

export const TarjetaCategoria: FC<TarjetaCategoriaProps> = ({ nombre, slug, icono, color }) => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push({ pathname: ROUTES.CATEGORIA, params: { slug } })}
    >
      <View style={[styles.iconContainer, color ? { backgroundColor: color + '20' } : null]}>
        <Ionicons name={icono} size={24} color={color || tema.colors.primary} />
      </View>
      <Text style={styles.nombre}>{nombre}</Text>
      <Ionicons name="chevron-forward" size={20} color={tema.colors.border} />
    </Pressable>
  );
};
```

**Análisis Detallado:**
*   `color?: string;`: Uso del operador de Propiedad Opcional de Type (?). Desobliga terminantemente la exigencia de proveerlo, permitiéndo invocar el componente asimétrico.
*   `color ? { backgroundColor: color + '20' } : null`: Manipulador cúbico de Hexadecimal Alpha. Operando con el Hex entrante (`#FF0000`) le inyectamos como postfix estático los números char `'20'`, que en la tabla alpha de CSS Hex significa "Reducir la Opacidad Transparencia al 12%". El diseñador logra crear nubes opalescentes suaves del mismo tinte automáticamente sin requerir pasar 2 parámetros (`colorFuerte` y `colorSuave`). En caso negativo revierte al primitivo Nulo (`null`).
*   `color={color || tema.colors.primary}`: Operador JS *OR Default Fallback* lógico (`||`). Si la variable del color entró como vacía (undefined) se apaga la izquierda, gatillándolo ineludiblemente contra tu color de escape arquitectónico (el primario institucional corporativo que emana del tema.ts).
*   `chevron-forward`: Elemento decorador secundario final flecha hacia lado derecho insinuando la interactividad móvil transicional pre-empuje del Router.

---

## 12. `src/components/producto/TarjetaProducto.tsx`

```tsx
type TarjetaProductoProps = {
  nombre: string;
  precio: number;
  barcode: string;
  puntuacion?: number;
  imagen?: string;
};

export const TarjetaProducto: FC<TarjetaProductoProps> = ({
  nombre,
  precio,
  barcode,
  puntuacion = 85, // Default parametrizado local
  imagen
}) => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push({ pathname: ROUTES.PRODUCTO, params: { barcode } })}
    >
      <View style={styles.imageContainer}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="fast-food-outline" size={32} color={tema.colors.border} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nombre} numberOfLines={2}>{nombre}</Text>
        <Text style={styles.precio}>${precio.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
};
// ... omitiendo el styleSheet
```

**Análisis Detallado:**
*   `puntuacion = 85`: A diferencia del `color ||` de la vieja placa, aquí asimilamos un "Default Parámetro Formal Destructivo" directamente en el arco o esqueleto de los parámetros entrantes del argumento JS. La tarjeta internamente si le omites esa prop inicializa segura y amarrada a un score matemático de `85` inmutable per se.
*   `{imagen ? ( <Image /> ) : ( <Placeholder /> ) }`: Operador condicional puro de Render Switch. Si nos arrojan un link en bruto de AmazonS3 remoto o base relacional externa se acciona la etiqueta `<Image />` precompilada del sistema reescribiéndole su "source" de carga remota `({uri: imagen})`. Caso defectuoso emite la zona central neutral protectora con caja ploma y alimento silueteado preservando y bloqueando la rotura del recuadro grid.
*   `numberOfLines={2} `: Mecanismo blindador anti-desbordamientos (Overflow Protection Native). Ordena asertivamente a la máquina de React Engine que bajo caso hipotético donde un Humano malicioso te remita un nombre ridículamente largo (`"Papas fritas clásicas sin sal con gusto exquisito especializadas en hornos..."`), trunque automáticamente con suspensivos mágicos (`...`) antes de pisar el reglón subsecuente tres cortando o desarmando la armonía dimensional de la tarjeta completa.
*   `precio.toFixed(2)`: Instancia de conversión o casteo directo con forzado decímal final matemático para exhibir dos flotantes obligatorios de centavos ("$120.00" conservando un espectro visual alineado mercantilmente).
