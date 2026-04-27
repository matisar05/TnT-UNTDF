# Análisis Top-Down Completo: App en React Native y Expo Router

Este documento ofrece un mapa detallado del proyecto, desde la configuración global hasta los motivos técnicos exactos que justifican cada símbolo o nomenclatura utilizada. Está estructurado deductivamente (de "arriba" hacia "abajo").

---

## NIVEL 1: La Raíz del Proyecto (Configuración Global)
El directorio base contiene la configuración vital del entorno y comandos de servidor, pero no contiene código gráfico:
*   **`package.json` y `package-lock.json`**: Aquí se declaran todas las librerías instaladas (como `expo` y `react-native`), y comandos para correr la app.
*   **`app.json`**: La configuración vital de Expo (es aquí donde defines el nombre oficial de la app pre-instalación, íconos del dock, colores de logotipos en el SplashScreen, etc.).
*   **`tsconfig.json`**: Archivo rector para TypeScript. Actúa como la "policía de código" que auditará las sintaxis antes de compilar.

---

## NIVEL 2: La Puerta de Entrada (`src/`)
Todo el código de trabajo visual de la aplicación está insertado en **`src/`** (Source). Agrupar el producto informático aquí previene que los archivos del negocio se mezclen con el entorno del "Nivel 1".

#### 2.1. Las Leyes Base (`constants/` y `navigation/`)
Antes de crear componentes, debemos definir la física bajo la cual interactuarán.
*   **`src/navigation/routes.ts`**: El diccionario central. El enrutador debe saber qué destinos son válidos impidiendo enlaces ciegos.
*   **`src/constants/tema.ts`**: El banco de diseño (Design Tokens). No se escriben números "mágicos" (`padding: 16`) al crear ventanas, sino que se recurre a constantes globales (`spacing.md`) para propiciar adaptación ágil a rediseños corporativos masivos y uniformidad matemática.

#### 2.2. Los Módulos de Construcción (`components/`)
Se construyen los bloques visuales fragmentados para no abarrotar el código de sistema, creando componentes independientes e ignorantes de su entorno.
*   **`components/home/HomeHero.tsx`**: El alerta o hero banner superior.
*   **`components/categoria/TarjetaCategoria.tsx`**: Ficha aislada que requiere parámetros formales (props) para mostrar la información estática de una clase individual.
*   **`components/layout/TabBar.tsx`**: El bloque de control horizontal inferior.

#### 2.3. El Armado Final (`app/` via Expo Router)
En Expo Router, **el Sistema de Archivos es directamente el Enrutador Web y de Nivel**. Todo documento `.tsx` situado acá convierte lo codificado en una "Pantalla" en vivo sin instanciar lógica puente. Sus archivos organizan los módulos previstos en todo el punto "2".

---

## NIVEL 3: Análisis Forense de Nombrado (El Porqué de la Sintaxis)

Toda sintaxis y formato implementado en `app` o en los scripts internos nace de justificaciones arquitectónicas e informáticas irrompibles:

### 1. El Guion Bajo (`_layout.tsx`)
*   **Significado:** *"Soy un envoltorio visual, no una URL navegable"*.
*   **La Razón:** Si el archivo se nombrase simplemente `layout.tsx`, el motor crearía libre e inútilmente un vínculo a `www.tuapp.com/layout`. Al prefijarle el carácter reservado (`_`), Expo lo procesa como una Capa Base (Wrapper). Desde este documento dictaminamos de manera abarcativa el "Stack" interno, color de cabeceras superiores (Header), o bloqueos universales comunes para todas las pantallas contenidas en esa respectiva carpeta hermana sin duplicar código.

### 2. La palabra mágica `index` (`index.tsx`)
*   **Significado:** *"Soy tu archivo predeterminado o la portada si entras a una carpeta genéricamente"*.
*   **La Razón:** Cuando el sistema de enrutamiento web clásico evalúa el acceso ciego al origen (`/` o un directorio de raíz como `/listas/`), el servidor apache original históricamente escaneaba un documento `index.html`. Expo Router mimetiza este actuar infalible: ante la ausencia de un producto directo, servirá globalmente bajo `/listas/` o `/` nativo al archivo `index.tsx` asumiéndolo como recepción prioritaria.

### 3. Los Corchetes en `[slug].tsx` y `[barcode].tsx`
*   **Significado:** **Segmento de Ruta Dinámica** (Variable interceptada en la URL).
*   **La Razón:** Resulta físicamente impensable compilar un archivo único (.tsx) individualmente por cada producto de la góndola mundial (Ej: `1102.tsx` y `1103.tsx`). Aplicando corchetes instruimos al motor a capturar todo texto entrante posicionado en esta URL (`/producto/779123456`) como el parámetro identificador de manera paramétrica. A esto Expo Router lo empaquetará dentro de una variable de memoria de igual nombre (p.ej. `barcode`) para procesar consultas SQL locales y renderizar el contenido temporal de forma mutante.
*   *Definición Externa: Se utiliza usualmente `slug` como un apéndice en periodismo digital y SEO para referirse a la optimización de un título legíble por texto como cadena de URL identificatoria (Ej. en vez de usar base de ID 4, usar *`pastas-frescas-al-huevo`*)*.

### 4. Mayúsculas (PascalCase) vs Formato Menor (camelCase)
*   **Archivos Base PascalCase** (ej. `HomeHero.tsx`, `TarjetaCategoria.tsx`):
    *   **Motivo de Requerimiento:** Por restricción cardinal, el framework general de React detecta "Componentes Hechos a Mano" única y exclusivamente al analizar la letra Capital (`<MiTarjeta />`). Si se programara con minúscula, asumiría imperativamente que es una clase intrínseca o sintaxis web (`<view />`, `<section />`, `<div>`) acarreando una colisión masiva. Para concordar visual y universalmente con el código interno las convenciones corporativas fuerzan bautizar el archivo exactamente como su importación de componente exportado principal.
*   **Archivos de Variable Base camelCase** (ej. `routes.ts`, `tema.ts`):
    *   **Motivo de Flexibilidad:** Se conciben puramente como lógica TypeScript fundacional. Estos no imprimen bloques visuales. Acatan a una orden convencional de programación basada en variables de bajo alcance JavaScript. Exponen listados u objetos utilitarios en ramificaciones `camelCase`. Por este motivo técnico portan únicamente extensión `.ts` normal eximiéndose del `.tsx` XML asignado a bloques de interfaz JSX gráficas.
