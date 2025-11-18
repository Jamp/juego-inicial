<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'
import colorsImg from '../../assets/images/colors.png'

const gameState = inject('gameState')
const sounds = inject('sounds')

const titleIcon = colorsImg

const colors = [
  {
    id: 'red',
    name: 'Rojo',
    color: 'bg-red-500'
  },
  {
    id: 'blue',
    name: 'Azul',
    color: 'bg-blue-500'
  },
  {
    id: 'yellow',
    name: 'Amarillo',
    color: 'bg-yellow-400'
  },
  {
    id: 'green',
    name: 'Verde',
    color: 'bg-green-500'
  },
  {
    id: 'orange',
    name: 'Naranja',
    color: 'bg-orange-500'
  },
  {
    id: 'purple',
    name: 'Morado',
    color: 'bg-purple-500'
  }
]

const currentColor = ref(null)
const previousColors = ref([])
const HISTORY_SIZE = 2
const options = ref([])
const showFeedback = ref(false)
const questionKey = ref(0)

const generateRound = () => {
  showFeedback.value = false
  questionKey.value++

  // Elegir un color aleatorio diferente a los últimos 2
  let newColor
  do {
    newColor = colors[Math.floor(Math.random() * colors.length)]
  } while (previousColors.value.some(prev => prev.id === newColor.id))

  previousColors.value = [newColor, ...previousColors.value].slice(0, HISTORY_SIZE)
  currentColor.value = newColor

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
  <GameLayout title="¿Qué Color Es?" :title-icon="titleIcon" bg-color="bg-gradient-to-br from-blue-100 to-purple-100">
    <Transition name="question" mode="out-in">
      <div :key="questionKey" class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-xl md:text-3xl font-bold text-gray-700 mb-2 md:mb-4">
          Encuentra el color:
        </p>

        <!-- Color objetivo -->
        <div class="inline-block bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl">
          <div class="flex flex-col items-center gap-2">
            <div :class="currentColor?.color" class="w-20 h-20 md:w-32 md:h-32 rounded-full shadow-2xl flex items-center justify-center border-4 md:border-8 border-white">
            </div>
          </div>
        </div>
      </div>

      <!-- Opciones -->
      <div class="grid grid-cols-2 gap-3 md:gap-6 w-full max-w-4xl px-2">
        <button
          v-for="color in options"
          :key="color.id"
          @click="selectColor(color)"
          :class="[
            showFeedback && color.id === currentColor.id ? 'ring-4 md:ring-8 ring-green-500 celebrate z-10 relative' : ''
          ]"
          class="game-button bg-white rounded-xl md:rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-8">
          <div :class="color.color" class="w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg border-2 md:border-4 border-gray-200 flex items-center justify-center">
          </div>
          <span class="text-base md:text-xl font-bold text-gray-700">
            {{ color.name }}
          </span>
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-2xl md:text-5xl font-bold text-green-600 flex items-center gap-2 md:gap-3 mt-2">
          <span class="text-3xl md:text-6xl">✨</span>
          ¡Perfecto!
          <span class="text-3xl md:text-6xl">✨</span>
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
