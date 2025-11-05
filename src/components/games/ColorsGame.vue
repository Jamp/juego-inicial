<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const colors = [
  { id: 'red', name: 'Rojo', color: 'bg-red-500', emoji: '🍎' },
  { id: 'blue', name: 'Azul', color: 'bg-blue-500', emoji: '💙' },
  { id: 'yellow', name: 'Amarillo', color: 'bg-yellow-400', emoji: '🌟' },
  { id: 'green', name: 'Verde', color: 'bg-green-500', emoji: '🍀' },
  { id: 'orange', name: 'Naranja', color: 'bg-orange-500', emoji: '🧡' },
  { id: 'purple', name: 'Morado', color: 'bg-purple-500', emoji: '💜' }
]

const currentColor = ref(null)
const options = ref([])
const showFeedback = ref(false)

const generateRound = () => {
  showFeedback.value = false

  // Elegir un color aleatorio
  currentColor.value = colors[Math.floor(Math.random() * colors.length)]

  // Crear 4 opciones aleatorias incluyendo la correcta
  const wrongColors = colors.filter(c => c.id !== currentColor.value.id)
  const selectedWrong = wrongColors.sort(() => Math.random() - 0.5).slice(0, 3)
  options.value = [currentColor.value, ...selectedWrong].sort(() => Math.random() - 0.5)
}

const selectColor = (color) => {
  sounds.playClick()

  if (color.id === currentColor.value.id) {
    showFeedback.value = true
    sounds.playCorrect()
    gameState.celebrate()

    setTimeout(() => {
      generateRound()
    }, 1500)
  }
}

onMounted(() => {
  generateRound()
})
</script>

<template>
  <GameLayout title="🎨 ¿Qué Color Es?" bg-color="bg-gradient-to-br from-blue-100 to-purple-100">
    <div class="flex flex-col items-center justify-center gap-8 md:gap-12">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          Encuentra el color:
        </p>

        <!-- Color objetivo -->
        <div class="inline-block bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div class="flex flex-col items-center gap-4">
            <div :class="currentColor?.color" class="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl flex items-center justify-center border-8 border-white">
              <span class="text-6xl md:text-7xl">{{ currentColor?.emoji }}</span>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-gray-700">
              {{ currentColor?.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Opciones -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl">
        <button
          v-for="color in options"
          :key="color.id"
          @click="selectColor(color)"
          :class="[
            showFeedback && color.id === currentColor.id ? 'ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-3 p-6 md:p-8"
        >
          <div :class="color.color" class="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-lg border-4 border-gray-200 flex items-center justify-center">
            <span class="text-4xl md:text-5xl">{{ color.emoji }}</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-700">
            {{ color.name }}
          </span>
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-4xl md:text-5xl font-bold text-green-600 flex items-center gap-3">
          <span class="text-5xl md:text-6xl">✨</span>
          ¡Perfecto!
          <span class="text-5xl md:text-6xl">✨</span>
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
