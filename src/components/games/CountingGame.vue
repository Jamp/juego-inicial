<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import GameLayout from '../GameLayout.vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const objects = [
  { emoji: '🍎', name: 'manzanas' },
  { emoji: '⭐', name: 'estrellas' },
  { emoji: '🎈', name: 'globos' },
  { emoji: '🐱', name: 'gatitos' },
  { emoji: '🌸', name: 'flores' },
  { emoji: '🦋', name: 'mariposas' }
]

const currentObject = ref(null)
const targetCount = ref(0)
const displayItems = ref([])
const options = ref([])
const showFeedback = ref(false)

const generateRound = () => {
  showFeedback.value = false

  // Elegir objeto aleatorio
  currentObject.value = objects[Math.floor(Math.random() * objects.length)]

  // Número aleatorio entre 1 y 10
  targetCount.value = Math.floor(Math.random() * 5) + 1

  // Crear array de items para mostrar con posiciones aleatorias
  displayItems.value = Array(targetCount.value).fill(null).map((_, i) => ({
    id: i,
    top: Math.random() * 70 + 5,
    left: Math.random() * 70 + 5,
    delay: i * 0.1
  }))

  // Crear opciones de respuesta
  const correctAnswer = targetCount.value
  const wrongAnswers = []

  // Generar respuestas incorrectas
  for (let i = 1; i <= 10; i++) {
    if (i !== correctAnswer && wrongAnswers.length < 3) {
      wrongAnswers.push(i)
    }
  }

  options.value = [correctAnswer, ...wrongAnswers.slice(0, 3)]
    .sort(() => Math.random() - 0.5)
}

const selectNumber = (number) => {
  sounds.playClick()

  if (number === targetCount.value) {
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
  <GameLayout title="🔢 ¡A Contar!" bg-color="bg-gradient-to-br from-green-100 to-blue-100">
    <div class="flex flex-col items-center justify-center gap-6 md:gap-8">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-2xl md:text-3xl font-bold text-gray-700">
          ¿Cuántos <span class="text-4xl">{{ currentObject?.emoji }}</span> hay?
        </p>
      </div>

      <!-- Área de objetos -->
      <div class="relative w-full max-w-2xl h-64 md:h-80 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div
          v-for="item in displayItems"
          :key="item.id"
          :style="{
            top: item.top + '%',
            left: item.left + '%',
            animationDelay: item.delay + 's'
          }"
          class="absolute text-5xl md:text-6xl pop-in"
        >
          {{ currentObject?.emoji }}
        </div>
      </div>

      <!-- Opciones de números -->
      <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-xl">
        <button
          v-for="number in options"
          :key="number"
          @click="selectNumber(number)"
          :class="[
            showFeedback && number === targetCount ? 'ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center text-4xl md:text-5xl font-bold"
        >
          {{ number }}
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-4xl md:text-5xl font-bold text-green-600 flex items-center gap-3">
          <span class="text-5xl md:text-6xl">🎯</span>
          ¡Excelente!
          <span class="text-5xl md:text-6xl">🎯</span>
        </div>
      </Transition>
    </div>
  </GameLayout>
</template>

<style scoped>
.pop-in {
  animation: pop-in 0.5s ease-out backwards;
}

@keyframes pop-in {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
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
</style>
