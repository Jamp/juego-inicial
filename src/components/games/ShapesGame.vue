<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const shapes = [
  { id: 'circle', name: 'Círculo', icon: '●', color: 'bg-red-400' },
  { id: 'triangle', name: 'Triángulo', icon: '▲', color: 'bg-blue-400' },
  { id: 'square', name: 'Cuadrado', icon: '■', color: 'bg-green-400' },
  { id: 'star', name: 'Estrella', icon: '★', color: 'bg-yellow-400' }
]

const currentShape = ref(null)
const options = ref([])
const showFeedback = ref(false)

const generateRound = () => {
  showFeedback.value = false

  // Elegir una forma aleatoria
  currentShape.value = shapes[Math.floor(Math.random() * shapes.length)]

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
  <GameLayout title="🔷 Encuentra la Forma" bg-color="bg-gradient-to-br from-purple-100 to-pink-100">
    <div class="flex flex-col items-center justify-center gap-8 md:gap-12">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          Encuentra esta forma:
        </p>

        <!-- Forma objetivo -->
        <div class="inline-block bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div :class="currentShape?.color" class="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center">
            <span class="text-8xl md:text-9xl text-white drop-shadow-lg">
              {{ currentShape?.icon }}
            </span>
          </div>
          <p class="text-xl md:text-2xl font-bold mt-4 text-gray-700">
            {{ currentShape?.name }}
          </p>
        </div>
      </div>

      <!-- Opciones -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl">
        <button
          v-for="shape in options"
          :key="shape.id"
          @click="selectShape(shape)"
          :class="[
            shape.color,
            showFeedback && shape.id === currentShape.id ? 'ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button aspect-square rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-3 p-4 md:p-6"
        >
          <span class="text-6xl md:text-7xl text-white drop-shadow-lg">
            {{ shape.icon }}
          </span>
          <span class="text-lg md:text-xl font-bold text-white drop-shadow">
            {{ shape.name }}
          </span>
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-4xl md:text-5xl font-bold text-green-600 flex items-center gap-3">
          <span class="text-5xl md:text-6xl">🎉</span>
          ¡Muy bien!
          <span class="text-5xl md:text-6xl">🎉</span>
        </div>
      </Transition>
    </div>
  </GameLayout>
</template>

<style scoped>
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
