<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const items = [
  { id: 'star', emoji: '⭐', color: 'bg-yellow-400' },
  { id: 'heart', emoji: '❤️', color: 'bg-red-400' },
  { id: 'circle', emoji: '🔵', color: 'bg-blue-400' },
  { id: 'flower', emoji: '🌸', color: 'bg-pink-400' },
  { id: 'sun', emoji: '☀️', color: 'bg-orange-400' },
  { id: 'moon', emoji: '🌙', color: 'bg-purple-400' }
]

const pattern = ref([])
const missingIndex = ref(0)
const correctAnswer = ref(null)
const options = ref([])
const showFeedback = ref(false)

const generateRound = () => {
  showFeedback.value = false

  // Crear un patrón simple (2-3 elementos que se repiten)
  const patternLength = Math.random() > 0.5 ? 2 : 3
  const basePattern = []

  // Seleccionar elementos para el patrón base
  const shuffledItems = [...items].sort(() => Math.random() - 0.5)
  for (let i = 0; i < patternLength; i++) {
    basePattern.push(shuffledItems[i])
  }

  // Repetir el patrón 2-3 veces
  const repetitions = Math.floor(Math.random() * 2) + 2
  pattern.value = []
  for (let i = 0; i < repetitions; i++) {
    pattern.value.push(...basePattern)
  }

  // Elegir un índice aleatorio para ocultar (no el primero para darles una pista)
  missingIndex.value = Math.floor(Math.random() * (pattern.value.length - 1)) + 1
  correctAnswer.value = pattern.value[missingIndex.value]

  // Crear opciones de respuesta
  const wrongItems = items.filter(item => !basePattern.find(p => p.id === item.id))
  const selectedWrong = wrongItems.sort(() => Math.random() - 0.5).slice(0, 3)
  options.value = [correctAnswer.value, ...selectedWrong].sort(() => Math.random() - 0.5)
}

const selectItem = (item) => {
  sounds.playClick()

  if (item.id === correctAnswer.value.id) {
    showFeedback.value = true
    sounds.playWin()
    gameState.celebrate()

    setTimeout(() => {
      generateRound()
    }, 2000)
  }
}

onMounted(() => {
  generateRound()
})
</script>

<template>
  <GameLayout title="🔷 Completa el Patrón" bg-color="bg-gradient-to-br from-pink-100 to-yellow-100">
    <div class="flex flex-col items-center justify-center gap-6 md:gap-8">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          ¿Qué sigue en el patrón?
        </p>
      </div>

      <!-- Patrón -->
      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div class="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl">
          <div
            v-for="(item, index) in pattern"
            :key="index"
            :class="[
              item.color,
              index === missingIndex ? 'bg-gray-200 border-4 border-dashed border-gray-400' : ''
            ]"
            class="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg flex items-center justify-center text-3xl md:text-4xl transition-all duration-300"
            :style="{ animationDelay: index * 0.05 + 's' }"
          >
            <span v-if="index !== missingIndex">{{ item.emoji }}</span>
            <span v-else class="text-4xl md:text-5xl text-gray-400">?</span>
          </div>
        </div>
      </div>

      <!-- Opciones -->
      <div class="text-center mb-2">
        <p class="text-xl md:text-2xl font-bold text-gray-600">
          Elige la respuesta correcta:
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-3 md:gap-4">
        <button
          v-for="item in options"
          :key="item.id"
          @click="selectItem(item)"
          :class="[
            item.color,
            showFeedback && item.id === correctAnswer.id ? 'ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center text-4xl md:text-5xl"
        >
          {{ item.emoji }}
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-4xl md:text-5xl font-bold text-green-600 flex items-center gap-3">
          <span class="text-5xl md:text-6xl">🌟</span>
          ¡Genial!
          <span class="text-5xl md:text-6xl">🌟</span>
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
