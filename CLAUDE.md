# 🎮 Juegos Educativos para Niños - Guía para Claude Code

Este documento proporciona contexto y directrices para trabajar en este proyecto con Claude Code.

## 📋 Descripción del Proyecto

Aplicación web de mini-juegos educativos diseñados para niños de 3 a 5 años. El proyecto implementa 6 juegos diferentes con:
- **Objetivo pedagógico**: Aprendizaje sin presión ni penalizaciones
- **Refuerzo positivo**: Celebraciones visuales y sonoras en cada acierto
- **Modo infinito**: Los juegos nunca terminan, no se puede perder
- **Accesibilidad**: Interfaz simple, botones grandes, colores vibrantes

## 🛠️ Stack Tecnológico

### Core
- **Vue 3** (Composition API): Framework JavaScript principal
- **Vite**: Build tool y dev server
- **pnpm**: Gestor de paquetes (NO usar npm)

### Estilos
- **Tailwind CSS v4**: Framework de utilidades CSS
  - Usa `@import "tailwindcss"` (nueva sintaxis v4)
  - Plugin PostCSS: `@tailwindcss/postcss`
  - **IMPORTANTE**: Evitar `@apply` - usar CSS directo cuando sea posible

### Composables
- **VueUse**: Utilidades reactivas de Vue
- **Web Audio API**: Sonidos sintéticos (sin archivos de audio)

## 📁 Estructura del Proyecto

```
juego-inicial/
├── src/
│   ├── components/
│   │   ├── games/              # Los 6 mini-juegos
│   │   │   ├── ShapesGame.vue      # Reconocimiento de formas
│   │   │   ├── ColorsGame.vue      # Reconocimiento de colores
│   │   │   ├── CountingGame.vue    # Contar objetos
│   │   │   ├── AnimalsGame.vue     # Asociación animales-sonidos
│   │   │   ├── PatternsGame.vue    # Completar patrones
│   │   │   └── MemoryGame.vue      # Juego de memoria
│   │   ├── MainMenu.vue        # Menú principal
│   │   └── GameLayout.vue      # Layout compartido por todos los juegos
│   ├── composables/
│   │   ├── useGameState.js     # Estado global del juego
│   │   └── useSounds.js        # Sistema de sonidos sintéticos
│   ├── App.vue                 # Componente raíz
│   ├── main.js                 # Punto de entrada
│   └── style.css               # Estilos globales (Tailwind v4)
├── public/                     # Archivos estáticos
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── CLAUDE.md                   # Este archivo
```

## 🎯 Arquitectura y Patrones

### Sistema de Estado Global

**Archivo**: `src/composables/useGameState.js`

```javascript
// Estado compartido mediante provide/inject
const gameState = useGameState()
provide('gameState', gameState)

// Propiedades reactivas:
- currentGame: ref(null)      // Juego actual o null (menú)
- score: ref(0)                // Puntuación
- celebrating: ref(false)      // Si está mostrando celebración
- celebrationKey: ref(0)       // Key para forzar re-render

// Métodos:
- startGame(gameName)          // Inicia un juego
- goToMenu()                   // Vuelve al menú principal
- celebrate()                  // Activa celebración por 600ms
```

**⚠️ IMPORTANTE**: `celebrate()` tiene un `setTimeout` de 600ms que automáticamente oculta la celebración. NO modificar sin ajustar la animación CSS correspondiente.

### Sistema de Sonidos

**Archivo**: `src/composables/useSounds.js`

Sistema de generación de sonidos sintéticos usando Web Audio API:
- **Ventaja**: Sin archivos externos, sin dependencias
- **Frecuencias**: Diferentes tonos para diferentes acciones
- **Métodos principales**:
  - `playSuccess()`: Sonido de acierto (523.25 Hz)
  - `playClick()`: Sonido de clic (800 Hz)
  - `playWrong()`: Sonido de error (200 Hz) - uso limitado

### Layout de Juegos

**Archivo**: `src/components/GameLayout.vue`

Componente wrapper que proporciona:
1. **Header**: Botón volver + Título + Contador de estrellas
2. **Área de juego**: Slot para el contenido del juego
3. **Sistema de celebración**: Overlay con emoji animado

**Props**:
- `title` (String, required): Título del juego
- `bgColor` (String, default: 'bg-white'): Color de fondo del área

**Uso**:
```vue
<GameLayout title="Mi Juego" bgColor="bg-blue-50">
  <!-- Contenido del juego aquí -->
</GameLayout>
```

## 🎮 Los 6 Mini-Juegos

### 1. ShapesGame.vue - Reconocimiento de Formas
- Muestra una forma objetivo (círculo, triángulo, cuadrado, estrella)
- 4 botones con formas para seleccionar
- SVG inline para renderizar las formas

### 2. ColorsGame.vue - Reconocimiento de Colores
- Muestra un color objetivo y su nombre
- 6 opciones de colores con emojis
- Colores: rojo, azul, amarillo, verde, naranja, morado

### 3. CountingGame.vue - Contar Objetos
- Muestra objetos a contar (1-10)
- 4 opciones numéricas
- Emojis rotan: 🌟, 🎈, 🍎, 🎨

### 4. AnimalsGame.vue - Asociación Animales-Sonidos
- Reproducción de sonido onomatopéyico
- 6 animales: perro, gato, vaca, pájaro, oveja, cerdo
- Usa texto para describir el sonido

### 5. PatternsGame.vue - Completar Patrones
- Secuencias de formas/colores
- Usuario debe identificar el siguiente elemento
- Dificultad progresiva

### 6. MemoryGame.vue - Memoria Visual
- Juego clásico de memoria adaptado
- Solo 4 pares (8 cartas) para niños pequeños
- Emojis temáticos

## ✅ Convenciones de Código

### Vue/JavaScript
- **Composition API**: Usar `<script setup>` en todos los componentes
- **Refs reactivos**: Usar `.value` para acceder/modificar refs
- **Naming**:
  - Componentes: PascalCase (`ShapesGame.vue`)
  - Composables: camelCase con prefijo `use` (`useGameState.js`)
  - Variables: camelCase (`currentGame`, `celebrationKey`)

### CSS/Tailwind
- **Preferir Tailwind utility classes** en el template
- **CSS personalizado** solo para animaciones y estilos complejos
- **Responsividad**: Usar prefijos `sm:`, `md:`, `lg:`
- **Animaciones**: Definir en `<style scoped>` o `style.css`

### Accesibilidad y UX para Niños
- **Botones grandes**: `px-8 py-6` mínimo
- **Texto grande**: `text-3xl` o mayor
- **Feedback inmediato**: Siempre responder a clicks
- **Colores vibrantes**: Mantener paleta alegre
- **Sin penalizaciones**: Nunca mostrar "incorrecto" de forma negativa

## 🔧 Comandos Importantes

```bash
# Instalación (USAR PNPM, NO NPM)
pnpm install

# Desarrollo
pnpm dev                 # Servidor en http://localhost:5173

# Build
pnpm build              # Compila para producción en /dist

# Preview
pnpm preview            # Previsualiza build de producción
```

## 🐛 Debugging y Issues Conocidos

### Problema: Celebración se queda en pantalla
**Solución**: Ya corregido en `useGameState.js` con timeout de 600ms
- **NO modificar** el timeout sin ajustar animación CSS
- **NO usar** contador incremental, usar booleano `celebrating`

### Problema: Sonidos no funcionan
**Causa común**: Web Audio API requiere interacción del usuario
**Solución**: Los sonidos solo se activan después del primer click

### Problema: Tailwind classes no funcionan
**Verificar**:
1. `@import "tailwindcss"` está en `src/style.css`
2. `@tailwindcss/postcss` está en `postcss.config.js`
3. NO usar sintaxis v3 (`@tailwind`, `@layer`, `@apply`)

## 📝 Guías para Nuevas Funcionalidades

### Agregar un Nuevo Juego

1. **Crear componente** en `src/components/games/NuevoJuego.vue`
2. **Usar GameLayout** como wrapper
3. **Inyectar dependencias**:
   ```vue
   const gameState = inject('gameState')
   const sounds = inject('sounds')
   ```
4. **Llamar** `gameState.celebrate()` en aciertos
5. **Añadir al menú** en `MainMenu.vue`

### Modificar Sistema de Celebración

**Archivos a modificar**:
- `src/composables/useGameState.js`: Lógica del timeout
- `src/components/GameLayout.vue`: Animación y transición CSS

**Importante**: Mantener sincronizados:
- Timeout en `celebrate()`: 600ms
- Duración de animación CSS: 0.6s

### Agregar Nuevos Sonidos

**Archivo**: `src/composables/useSounds.js`

Ejemplo:
```javascript
const playNewSound = () => {
  playTone(frequency, duration, type)
}
// frequency: Hz (200-2000)
// duration: ms (50-300)
// type: 'sine', 'square', 'triangle', 'sawtooth'
```

## 🎨 Paleta de Colores del Proyecto

```css
/* Gradiente de fondo principal */
background: linear-gradient(
  to bottom right,
  rgb(192 132 252),  /* purple-400 */
  rgb(249 168 212),  /* pink-300 */
  rgb(147 197 253)   /* blue-300 */
);

/* Colores de juegos */
- Formas: bg-purple-50
- Colores: bg-pink-50
- Conteo: bg-blue-50
- Animales: bg-green-50
- Patrones: bg-yellow-50
- Memoria: bg-indigo-50
```

## 🚀 Despliegue

El proyecto es una SPA estática, se puede desplegar en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier hosting estático

**Build para producción**:
```bash
pnpm build
# Archivos listos en /dist
```

## 📚 Recursos Adicionales

- [Documentación Vue 3](https://vuejs.org/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Vite Guide](https://vite.dev/)
- [VueUse](https://vueuse.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 💡 Principios de Diseño

1. **Simplicidad primero**: Menos es más para niños pequeños
2. **Feedback positivo**: Siempre celebrar aciertos
3. **Sin frustración**: No mostrar errores de forma negativa
4. **Autonomía**: El niño puede navegar solo sin ayuda
5. **Engagement**: Colores, sonidos y animaciones mantienen interés

---

**Última actualización**: 2025-11-06
**Versión de Vue**: 3.5.22
**Versión de Tailwind**: 4.1.16
**Gestor de paquetes**: pnpm 10.19.0
