<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'
import patternImg from '../../assets/images/pattern.png'

const gameState = inject('gameState')
const sounds = inject('sounds')

const titleIcon = patternImg

const items = [
  {
    id: 'star',
    emoji: '⭐',
    color: 'bg-yellow-400'
  },
  {
    id: 'heart',
    emoji: '❤️',
    color: 'bg-red-400'
  },
  {
    id: 'circle',
    emoji: '🔵',
    color: 'bg-blue-400'
  },
  {
    id: 'flower',
    emoji: '🌸',
    color: 'bg-pink-400'
  },
  {
    id: 'sun',
    emoji: '☀️',
    color: 'bg-orange-400'
  },
  {
    id: 'moon',
    emoji: '🌙',
    color: 'bg-purple-400'
  }
]

const pattern = ref([])
const previousPattern = ref(null)
const missingIndex = ref(0)
const correctAnswer = ref(null)
const options = ref([])
const showFeedback = ref(false)
const questionKey = ref(0)

const generateRound = () => {
  showFeedback.value = false
  questionKey.value++

  // Crear un patrón simple (2-3 elementos que se repiten)
  const patternLength = Math.random() > 0.5 ? 2 : 3
  let basePattern = []

  // Seleccionar elementos para el patrón base, diferente al patrón anterior
  do {
    const shuffledItems = [...items].sort(() => Math.random() - 0.5)
    basePattern = []
    for (let i = 0; i < patternLength; i++) {
      basePattern.push(shuffledItems[i])
    }
  } while (previousPattern.value &&
           basePattern.map(p => p.id).join(',') === previousPattern.value)

  previousPattern.value = basePattern.map(p => p.id).join(',')

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
  <GameLayout title="Completa el Patrón" :title-icon="titleIcon" bg-color="bg-gradient-to-br from-pink-100 to-yellow-100">
    <Transition name="question" mode="out-in">
      <div :key="questionKey" class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-xl md:text-3xl font-bold text-gray-700 mb-2 md:mb-4">
          ¿Qué sigue en el patrón?
        </p>
      </div>

      <!-- Patrón -->
      <div class="bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-xl">
        <div class="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl">
          <div
            v-for="(item, index) in pattern"
            :key="index"
            :class="[
              item.color,
              index === missingIndex ? 'bg-gray-200 border-2 md:border-4 border-dashed border-gray-400' : ''
            ]"
            class="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-2xl md:text-4xl transition-all duration-300"
            :style="{ animationDelay: index * 0.05 + 's' }"
          >
            <span v-if="index !== missingIndex">{{ item.emoji }}</span>
            <span v-else class="text-3xl md:text-5xl text-gray-400">?</span>
          </div>
        </div>
      </div>

      <!-- Opciones -->
      <div class="text-center">
        <p class="text-base md:text-2xl font-bold text-gray-600">
          Elige la respuesta correcta:
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-2 md:gap-4 px-2">
        <button
          v-for="item in options"
          :key="item.id"
          @click="selectItem(item)"
          :class="[
            item.color,
            showFeedback && item.id === correctAnswer.id ? 'ring-4 md:ring-8 ring-green-400 celebrate' : ''
          ]"
          class="game-button w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center text-3xl md:text-5xl"
        >
          {{ item.emoji }}
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-2xl md:text-5xl font-bold text-green-600 flex items-center gap-2 md:gap-3 mt-2">
          <span class="text-3xl md:text-6xl">🌟</span>
          ¡Genial!
          <span class="text-3xl md:text-6xl">🌟</span>
        </div>
      </Transition>
      </div>
    </Transition>
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
