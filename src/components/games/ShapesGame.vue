<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'
import ShapeIcon from './ShapeIcon.vue'
import shapeImg from '../../assets/images/shape.png'

const gameState = inject('gameState')
const sounds = inject('sounds')

const titleIcon = shapeImg

const shapes = [
  {
    id: 'circle',
    name: 'Círculo',
    color: '#FF6B6B' // Rojo vibrante
  },
  {
    id: 'square',
    name: 'Cuadrado',
    color: '#4ECDC4' // Turquesa
  },
  {
    id: 'triangle',
    name: 'Triángulo',
    color: '#FFE66D' // Amarillo brillante
  },
  {
    id: 'rectangle',
    name: 'Rectángulo',
    color: '#FF9F1C' // Naranja
  },
  {
    id: 'pentagon',
    name: 'Pentágono',
    color: '#A78BFA' // Púrpura
  },
  {
    id: 'hexagon',
    name: 'Hexágono',
    color: '#34D399' // Verde esmeralda
  },
  {
    id: 'diamond',
    name: 'Diamante',
    color: '#F472B6' // Rosa
  },
  {
    id: 'star',
    name: 'Estrella',
    color: '#FBBF24' // Amarillo dorado
  },
  {
    id: 'heart',
    name: 'Corazón',
    color: '#EF4444' // Rojo corazón
  },
  {
    id: 'oval',
    name: 'Óvalo',
    color: '#60A5FA' // Azul cielo
  }
]

const currentShape = ref(null)
const previousShapes = ref([])
const HISTORY_SIZE = 3
const options = ref([])
const showFeedback = ref(false)
const questionKey = ref(0)

const generateRound = () => {
  showFeedback.value = false
  questionKey.value++

  // Elegir una forma aleatoria diferente a las últimas 3
  let newShape
  do {
    newShape = shapes[Math.floor(Math.random() * shapes.length)]
  } while (previousShapes.value.some(prev => prev.id === newShape.id))

  previousShapes.value = [newShape, ...previousShapes.value].slice(0, HISTORY_SIZE)
  currentShape.value = newShape

  // Seleccionar 4 opciones: la correcta + 3 aleatorias diferentes
  const wrongOptions = shapes
    .filter(s => s.id !== newShape.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  options.value = [newShape, ...wrongOptions].sort(() => Math.random() - 0.5)

  // Reproducir audio de la forma después de un pequeño delay (para dar tiempo a la animación)
  setTimeout(() => {
    sounds.playShapeSound(newShape.id)
  }, 400)
}

const selectShape = (shape) => {
  sounds.playClick()

  if (shape.id === currentShape.value.id) {
    // Correcto!
    showFeedback.value = true
    sounds.playCorrect()
    gameState.celebrate()

    // Reproducir audio de refuerzo positivo (repetir el nombre de la forma)
    setTimeout(() => {
      sounds.playShapeSound(shape.id)
    }, 300)

    // Siguiente ronda después de un momento
    setTimeout(() => {
      generateRound()
    }, 1500)
  } else {
    // Animación de intento (sin penalización)
    sounds.playClick()
  }
}

onMounted(() => {
  generateRound()
})
</script>

<template>
  <GameLayout title="Encuentra la Forma" :title-icon="titleIcon" bg-color="bg-gradient-to-br from-purple-100 to-pink-100">
    <Transition name="question" mode="out-in">
      <div :key="questionKey" class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-xl md:text-3xl font-bold text-gray-700 mb-2 md:mb-4">
          Encuentra esta forma:
        </p>

        <!-- Forma objetivo -->
        <div class="inline-block bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl">
          <div class="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center shape-target">
            <ShapeIcon
              v-if="currentShape"
              :shape="currentShape.id"
              :color="currentShape.color"
              class="w-full h-full animate-shape-in"
            />
          </div>
          <p class="text-lg md:text-3xl font-bold mt-3 md:mt-6 text-gray-700">
            {{ currentShape?.name }}
          </p>
        </div>
      </div>

      <!-- Opciones -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-5xl px-2">
        <button
          v-for="shape in options"
          :key="shape.id"
          @click="selectShape(shape)"
          :class="[
            showFeedback && shape.id === currentShape.id ? 'ring-4 md:ring-8 ring-green-500 scale-105 celebrate z-10 relative' : ''
          ]"
          class="game-button bg-white aspect-square rounded-xl md:rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-2 md:gap-4 p-4 md:p-6">
          <div class="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
            <ShapeIcon
              :shape="shape.id"
              :color="shape.color"
              class="w-full h-full"
            />
          </div>
          <span class="text-sm md:text-xl font-bold text-gray-700">
            {{ shape.name }}
          </span>
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-2xl md:text-5xl font-bold text-green-600 flex items-center gap-2 md:gap-3 mt-2">
          <span class="text-3xl md:text-6xl">🎉</span>
          ¡Muy bien!
          <span class="text-3xl md:text-6xl">🎉</span>
        </div>
      </Transition>
      </div>
    </Transition>
  </GameLayout>
</template>

<style scoped>
.shape-target {
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-button:active {
  transform: scale(0.95);
}

.celebrate {
  animation: celebrate-pulse 0.6s ease-in-out;
}

@keyframes celebrate-pulse {
  0%, 100% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.15);
  }
}

.animate-shape-in {
  animation: shape-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes shape-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Transiciones de pregunta - Sistema de transiciones suaves */
.question-leave-active {
  transition: all 300ms cubic-bezier(0.4, 0, 1, 1);
}

.question-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.question-enter-active {
  transition: all 400ms cubic-bezier(0, 0, 0.2, 1);
}

.question-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

/* Accesibilidad - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .question-leave-active,
  .question-enter-active {
    transition: opacity 200ms ease;
  }

  .question-leave-to,
  .question-enter-from {
    transform: none;
  }
}
</style>
