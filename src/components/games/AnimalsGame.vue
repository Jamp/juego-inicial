<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'

// Importar imágenes de animales
import dogImg from '../../assets/images/dog.png'
import catImg from '../../assets/images/cat.png'
import cowImg from '../../assets/images/cow.png'
import chickenImg from '../../assets/images/chicken.png'
import sheepImg from '../../assets/images/sheep.png'
import porkImg from '../../assets/images/pork.png'

// Icono del título (usar la misma imagen del menú)
const titleIcon = dogImg

const gameState = inject('gameState')
const sounds = inject('sounds')

const animals = [
  {
    id: 'dog',
    image: dogImg,
    name: 'Perro',
    sound: 'dog',
    text: 'Guau guau!'
  },
  {
    id: 'cat',
    image: catImg,
    name: 'Gato',
    sound: 'cat',
    text: 'Miau!'
  },
  {
    id: 'cow',
    image: cowImg,
    name: 'Vaca',
    sound: 'cow',
    text: 'Muuu!'
  },
  {
    id: 'bird',
    image: chickenImg,
    name: 'Pollito',
    sound: 'bird',
    text: 'Pio pio!'
  },
  {
    id: 'sheep',
    image: sheepImg,
    name: 'Oveja',
    sound: 'sheep',
    text: 'Beee!'
  },
  {
    id: 'pig',
    image: porkImg,
    name: 'Cerdito',
    sound: 'pig',
    text: 'Oink oink!'
  }
]

const currentAnimal = ref(null)
const previousAnimal = ref(null)
const options = ref([])
const showFeedback = ref(false)
const showSoundText = ref(false)
const questionKey = ref(0)

const generateRound = () => {
  showFeedback.value = false
  showSoundText.value = false
  questionKey.value++

  // Elegir animal aleatorio diferente al anterior
  let newAnimal
  do {
    newAnimal = animals[Math.floor(Math.random() * animals.length)]
  } while (previousAnimal.value && newAnimal.id === previousAnimal.value.id)

  previousAnimal.value = currentAnimal.value
  currentAnimal.value = newAnimal

  // Crear 4 opciones aleatorias incluyendo la correcta
  const wrongAnimals = animals.filter(a => a.id !== currentAnimal.value.id)
  const selectedWrong = wrongAnimals.sort(() => Math.random() - 0.5).slice(0, 3)
  options.value = [currentAnimal.value, ...selectedWrong].sort(() => Math.random() - 0.5)
}

const playAnimalSound = () => {
  if (!currentAnimal.value) return

  sounds.playClick()
  showSoundText.value = true

  // Reproducir el sonido del animal
  sounds.animalSounds[currentAnimal.value.sound]()

  setTimeout(() => {
    showSoundText.value = false
  }, 1500)
}

const selectAnimal = (animal) => {
  sounds.playClick()

  if (animal.id === currentAnimal.value.id) {
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
  <GameLayout title="Sonidos de Animales" :title-icon="titleIcon" bg-color="bg-gradient-to-br from-yellow-100 to-green-100">
    <Transition name="question" mode="out-in">
      <div :key="questionKey" class="flex flex-col items-center justify-start gap-4 md:gap-8 h-full">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-xl md:text-3xl font-bold text-gray-700 mb-2 md:mb-4">
          ¿Qué animal hace este sonido?
        </p>

        <!-- Botón de reproducir sonido -->
        <button
          @click="playAnimalSound"
          class="game-button bg-gradient-to-br from-orange-400 to-pink-500 text-white px-6 md:px-12 py-4 md:py-8 rounded-2xl md:rounded-3xl shadow-2xl text-4xl md:text-7xl hover:scale-110"
        >
          🔊
        </button>

        <!-- Texto del sonido -->
        <Transition name="sound-text">
          <div v-if="showSoundText" class="mt-2 md:mt-4 text-2xl md:text-4xl font-bold text-gray-700">
            {{ currentAnimal?.text }}
          </div>
        </Transition>
      </div>

      <!-- Opciones de animales -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl px-2">
        <button
          v-for="animal in options"
          :key="animal.id"
          @click="selectAnimal(animal)"
          :class="[
            showFeedback && animal.id === currentAnimal.id ? 'ring-4 md:ring-8 ring-green-500 celebrate correct-answer-glow z-10 relative' : ''
          ]"
          style="z-index: var(--z-base)"
          class="game-button bg-white rounded-xl md:rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-8"
        >
          <img :src="animal.image" :alt="animal.name" class="w-16 h-16 md:w-24 md:h-24 object-contain" />
          <span class="text-sm md:text-xl font-bold text-gray-700">
            {{ animal.name }}
          </span>
        </button>
      </div>

      <!-- Mensaje de ayuda -->
      <div class="text-center text-gray-600 text-sm md:text-lg">
        <p>👆 Toca el altavoz para escuchar el sonido</p>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="showFeedback" class="text-2xl md:text-5xl font-bold text-green-600 flex items-center gap-2 md:gap-3 mt-2">
          <span class="text-3xl md:text-6xl">🎊</span>
          ¡Correcto!
          <span class="text-3xl md:text-6xl">🎊</span>
        </div>
      </Transition>
      </div>
    </Transition>
  </GameLayout>
</template>

<style scoped>
.sound-text-enter-active,
.sound-text-leave-active {
  transition: all 0.3s ease;
}

.sound-text-enter-from {
  transform: scale(0);
  opacity: 0;
}

.sound-text-leave-to {
  transform: scale(1.5);
  opacity: 0;
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
