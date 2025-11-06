<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'
import shapeImg from '../../assets/images/shape.png'

const gameState = inject('gameState')
const sounds = inject('sounds')

const titleIcon = shapeImg

const shapes = [
  {
    id: 'circle',
    name: 'Círculo',
    icon: '⬤',
    color: 'bg-red-400'
  },
  {
    id: 'triangle',
    name: 'Triángulo',
    icon: '▲',
    color: 'bg-blue-400'
  },
  {
    id: 'square',
    name: 'Cuadrado',
    icon: '■',
    color: 'bg-green-400'
  },
  {
    id: 'star',
    name: 'Estrella',
    icon: '★',
    color: 'bg-yellow-400'
  }
]

const currentShape = ref(null)
const previousShape = ref(null)
const options = ref([])
const showFeedback = ref(false)

const generateRound = () => {
  showFeedback.value = false

  // Elegir una forma aleatoria diferente a la anterior
  let newShape
  do {
    newShape = shapes[Math.floor(Math.random() * shapes.length)]
  } while (previousShape.value && newShape.id === previousShape.value.id)

  previousShape.value = currentShape.value
  currentShape.value = newShape

  // Crear opciones (mezclar todas las formas)
  options.value = [...shapes].sort(() => Math.random() - 0.5)
}

const selectShape = (shape) => {
  sounds.playClick()

  if (shape.id === currentShape.value.id) {
    // Correcto!
    showFeedback.value = true
    sounds.playCorrect()
    gameState.celebrate()

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
    <div class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-xl md:text-3xl font-bold text-gray-700 mb-2 md:mb-4">
          Encuentra esta forma:
        </p>

        <!-- Forma objetivo -->
        <div class="inline-block bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl">
          <div :class="currentShape?.color" class="w-20 h-20 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shape-target">
            <span class="text-6xl md:text-8xl text-white drop-shadow-lg leading-none">
              {{ currentShape?.icon }}
            </span>
          </div>
          <p class="text-base md:text-2xl font-bold mt-2 md:mt-4 text-gray-700">
            {{ currentShape?.name }}
          </p>
        </div>
      </div>

      <!-- Opciones -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl px-2">
        <button
          v-for="shape in options"
          :key="shape.id"
          @click="selectShape(shape)"
          :class="[
            shape.color,
            showFeedback && shape.id === currentShape.id ? 'ring-4 md:ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button aspect-square rounded-xl md:rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-6"
        >
          <span class="text-4xl md:text-6xl text-white drop-shadow-lg">
            {{ shape.icon }}
          </span>
          <span class="text-sm md:text-xl font-bold text-white drop-shadow">
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
  </GameLayout>
</template>

<style scoped>
.shape-target {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shape-target span {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
</style>
