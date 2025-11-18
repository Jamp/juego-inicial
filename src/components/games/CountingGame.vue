<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import GameLayout from '../GameLayout.vue'

// Importar imágenes
import appleImg from '../../assets/images/apple.png'
import starImg from '../../assets/images/star.png'
import ballonImg from '../../assets/images/ballon.png'
import catImg from '../../assets/images/cat.png'
import flowerImg from '../../assets/images/flower.png'
import sunImg from '../../assets/images/sun.png'
import cowImg from '../../assets/images/cow.png'
import chickenImg from '../../assets/images/chicken.png'
import dogImg from '../../assets/images/dog.png'

const gameState = inject('gameState')
const sounds = inject('sounds')

const objects = [
  {
    image: appleImg,
    name: 'manzanas'
  },
  {
    image: starImg,
    name: 'estrellas'
  },
  {
    image: ballonImg,
    name: 'globos'
  },
  {
    image: catImg,
    name: 'gatitos'
  },
  {
    image: flowerImg,
    name: 'flores'
  },
  {
    image: sunImg,
    name: 'soles'
  },
  {
    image: cowImg,
    name: 'Vaquitas'
  },
  {
    image: dogImg,
    name: 'Perritos'
  },
  {
    image: chickenImg,
    name: 'Pollitos'
  }
]

const currentObject = ref(null)
const previousObjects = ref([])
const previousCounts = ref([])
const HISTORY_SIZE = 2
const targetCount = ref(0)
const displayItems = ref([])
const options = ref([])
const showFeedback = ref(false)
const questionKey = ref(0)

const generateRound = () => {
  showFeedback.value = false
  questionKey.value++

  // Elegir objeto aleatorio diferente a los últimos 2
  let newObject
  do {
    newObject = objects[Math.floor(Math.random() * objects.length)]
  } while (previousObjects.value.some(prev => prev.name === newObject.name))

  previousObjects.value = [newObject, ...previousObjects.value].slice(0, HISTORY_SIZE)
  currentObject.value = newObject

  // Número aleatorio entre 1 y 5, diferente a los últimos 2
  let newCount
  do {
    newCount = Math.floor(Math.random() * 5) + 1
  } while (previousCounts.value.includes(newCount))

  previousCounts.value = [newCount, ...previousCounts.value].slice(0, HISTORY_SIZE)
  targetCount.value = newCount

  // Crear array de items para mostrar con posiciones aleatorias sin superposición
  const positions = []
  const minDistance = 15 // Distancia mínima entre elementos (en %)

  for (let i = 0; i < targetCount.value; i++) {
    let attempts = 0
    let position
    let isValid = false

    // Intentar encontrar una posición válida
    while (!isValid && attempts < 50) {
      position = {
        top: Math.random() * 70 + 5,
        left: Math.random() * 70 + 5
      }

      // Verificar que no esté muy cerca de otras posiciones
      isValid = positions.every(pos => {
        const distance = Math.sqrt(
          Math.pow(pos.top - position.top, 2) +
          Math.pow(pos.left - position.left, 2)
        )
        return distance >= minDistance
      })

      attempts++
    }

    positions.push(position)
  }

  displayItems.value = positions.map((pos, i) => ({
    id: i,
    top: pos.top,
    left: pos.left,
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

  // Reproducir el número después de un pequeño delay
  setTimeout(() => {
    sounds.playNumberSound(targetCount.value)
  }, 600)
}

const selectNumber = async (number) => {
  if (number === targetCount.value) {
    showFeedback.value = true
    gameState.celebrate()

    // Secuencia de sonidos: 1. Número, 2. Felicitación
    await sounds.playNumberSoundAsync(number)
    sounds.playCorrect()

    setTimeout(() => {
      generateRound()
    }, 2000)
  } else {
    // Animación de intento (sin penalización)
    sounds.playClick()
  }
}

onMounted(() => {
  // La instrucción ya se reproduce en el menú, generar ronda inmediatamente
  setTimeout(() => {
    generateRound()
  }, 500)
})
</script>

<template>
  <GameLayout title="¡A Contar!" bg-color="bg-gradient-to-br from-green-100 to-blue-100">
    <Transition name="question" mode="out-in">
      <div :key="questionKey" class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center flex items-center justify-center gap-2 md:gap-3">
        <p class="text-xl md:text-3xl font-bold text-gray-700">
          ¿Cuántos
        </p>
        <img v-if="currentObject" :src="currentObject.image" :alt="currentObject.name" class="w-8 h-8 md:w-16 md:h-16 object-contain inline-block" />
        <p class="text-xl md:text-3xl font-bold text-gray-700">
          hay?
        </p>
      </div>

      <!-- Área de objetos -->
      <div class="relative w-full max-w-2xl h-48 md:h-80 bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
        <div
          v-for="item in displayItems"
          :key="item.id"
          :style="{
            top: item.top + '%',
            left: item.left + '%',
            animationDelay: item.delay + 's'
          }"
          class="absolute pop-in"
        >
          <img v-if="currentObject" :src="currentObject.image" :alt="currentObject.name" class="w-10 h-10 md:w-16 md:h-16 object-contain" />
        </div>
      </div>

      <!-- Opciones de números -->
      <div class="flex flex-wrap justify-center gap-2 md:gap-4 max-w-xl px-2">
        <button
          v-for="number in options"
          :key="number"
          @click="selectNumber(number)"
          :class="[
            showFeedback && number === targetCount ? 'ring-4 md:ring-8 ring-green-500 celebrate z-10 relative' : ''
          ]"
          class="game-button w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center text-3xl md:text-5xl font-bold"
        >
          {{ number }}
        </button>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-2xl md:text-5xl font-bold text-green-600 flex items-center gap-2 md:gap-3 mt-2">
          <span class="text-3xl md:text-6xl">{{ gameState.currentCelebration.emoji }}</span>
          {{ gameState.currentCelebration.text }}
          <span class="text-3xl md:text-6xl">{{ gameState.currentCelebration.emoji }}</span>
        </div>
      </Transition>
      </div>
    </Transition>
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
