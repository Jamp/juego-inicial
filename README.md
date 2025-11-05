# 🎮 Juegos Educativos para Niños 3-5 años

Una colección de mini-juegos interactivos y educativos diseñados para niños de 3 a 5 años. Desarrollado con Vue 3, Vite y Tailwind CSS.

## ✨ Características

- 🎯 **6 Mini-Juegos Educativos** - Variedad de actividades de aprendizaje
- 🎨 **Diseño Colorido y Atractivo** - Interfaz visual diseñada para niños
- 🔊 **Efectos de Sonido** - Retroalimentación auditiva con sonidos sintéticos
- ⭐ **Refuerzo Positivo** - Sistema de celebración sin penalizaciones
- ∞ **Modo Infinito** - Los juegos nunca terminan, no se puede perder
- 📱 **100% Responsive** - Funciona en móviles, tablets y desktop
- 🏠 **Navegación Sencilla** - Menú principal y botón de volver en cada juego

## 🎮 Los 6 Mini-Juegos

### 1. 🔷 Reconocimiento de Formas
Aprende a identificar diferentes formas geométricas: círculo, triángulo, cuadrado y estrella.

### 2. 🎨 Reconocimiento de Colores
Identifica y asocia colores con objetos. Aprende rojo, azul, amarillo, verde, naranja y morado.

### 3. 🔢 Contar Objetos
Practica contar del 1 al 10 con objetos animados y coloridos.

### 4. 🐾 Asociación de Animales con Sonidos
Relaciona animales con sus sonidos característicos. Incluye perro, gato, vaca, pájaro, oveja y cerdo.

### 5. 🔷 Patrones
Desarrolla el pensamiento lógico completando secuencias de patrones.

### 6. 🃏 Memoria Visual
Juego clásico de memoria adaptado para niños pequeños con solo 4 pares.

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (versión 16 o superior)
- pnpm (gestor de paquetes recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd juego-inicial

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El juego estará disponible en `http://localhost:5173/`

### Compilar para Producción

```bash
pnpm build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 🛠️ Tecnologías Utilizadas

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Herramienta de compilación rápida
- **Tailwind CSS** - Framework de CSS utility-first
- **VueUse** - Colección de composables de Vue
- **Web Audio API** - Para efectos de sonido sintéticos

## 📁 Estructura del Proyecto

```
juego-inicial/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes Vue
│   │   ├── games/       # Los 6 mini-juegos
│   │   ├── MainMenu.vue # Menú principal
│   │   └── GameLayout.vue # Layout compartido
│   ├── composables/     # Lógica reutilizable
│   │   ├── useGameState.js # Estado del juego
│   │   └── useSounds.js    # Sistema de sonidos
│   ├── App.vue          # Componente raíz
│   ├── main.js          # Punto de entrada
│   └── style.css        # Estilos globales
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
└── tailwind.config.js   # Configuración de Tailwind
```

## 🎯 Características de Diseño Pedagógico

- **Sin Penalizaciones**: Los niños pueden intentar las veces que quieran sin consecuencias negativas
- **Refuerzo Positivo Constante**: Cada acierto se celebra con animaciones y sonidos
- **Interfaz Intuitiva**: Botones grandes y fáciles de presionar
- **Colores Vibrantes**: Diseño atractivo que mantiene la atención
- **Feedback Inmediato**: Respuesta instantánea a cada interacción
- **Progresión Automática**: Los juegos avanzan automáticamente al completar una ronda

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Dispositivos móviles iOS y Android
- ✅ Tablets

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para el aprendizaje de los más pequeños.

---

**¡Diviértete aprendiendo!** 🎉
