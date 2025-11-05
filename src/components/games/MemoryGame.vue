<script setup>
import { ref, inject, onMounted } from 'vue'
import GameLayout from '../GameLayout.vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const emojis = ['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯']

const cards = ref([])
const flippedCards = ref([])
const matchedPairs = ref([])
const canFlip = ref(true)

const generateRound = () => {
  matchedPairs.value = []
  flippedCards.value = []
  canFlip.value = true

  // Crear pares de cartas (solo 4 pares para niños pequeños)
  const selectedEmojis = emojis.slice(0, 4)
  const pairs = [...selectedEmojis, ...selectedEmojis]

  // Mezclar las cartas
  cards.value = pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }))
}

const flipCard = (card) => {
  if (!canFlip.value || card.isFlipped || card.isMatched) return

  sounds.playClick()

  // Voltear la carta
  card.isFlipped = true
  flippedCards.value.push(card)

  // Si hay 2 cartas volteadas, verificar si son iguales
  if (flippedCards.value.length === 2) {
    canFlip.value = false

    const [card1, card2] = flippedCards.value

    if (card1.emoji === card2.emoji) {
      // ¡Par encontrado!
      sounds.playCorrect()
      card1.isMatched = true
      card2.isMatched = true
      matchedPairs.value.push(card1.emoji)
      gameState.celebrate()

      // Verificar si se completó el juego
      if (matchedPairs.value.length === 4) {
        setTimeout(() => {
          sounds.playWin()
          setTimeout(() => {
            generateRound()
          }, 2000)
        }, 500)
      }

      flippedCards.value = []
      canFlip.value = true
    } else {
      // No coinciden, voltear de vuelta después de un momento
      setTimeout(() => {
        card1.isFlipped = false
        card2.isFlipped = false
        flippedCards.value = []
        canFlip.value = true
      }, 1000)
    }
  }
}

onMounted(() => {
  generateRound()
})
</script>

<template>
  <GameLayout title="🃏 Memoria" bg-color="bg-gradient-to-br from-indigo-100 to-purple-100">
    <div class="flex flex-col items-center justify-center gap-6 md:gap-8">
      <!-- Instrucción -->
      <div class="text-center">
        <p class="text-2xl md:text-3xl font-bold text-gray-700">
          Encuentra los pares iguales
        </p>
      </div>

      <!-- Tablero de cartas -->
      <div class="grid grid-cols-4 gap-3 md:gap-4 max-w-2xl">
        <button
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
          :class="[
            card.isMatched ? 'opacity-50' : '',
            card.isFlipped || card.isMatched ? 'card-flipped' : 'card-back'
          ]"
          class="game-button aspect-square rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-5xl md:text-6xl"
        >
          <div class="card-inner w-full h-full relative" :class="{ 'is-flipped': card.isFlipped || card.isMatched }">
            <!-- Parte frontal (oculta) -->
            <div class="card-front absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl">
              {{ card.emoji }}
            </div>
            <!-- Parte trasera (visible por defecto) -->
            <div class="card-back-side absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl">
              <span class="text-4xl md:text-5xl">🎴</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Progreso -->
      <div class="flex gap-3">
        <div
          v-for="(pair, index) in 4"
          :key="index"
          :class="[
            matchedPairs.length > index ? 'bg-green-400 scale-110' : 'bg-gray-300'
          ]"
          class="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        >
          <span v-if="matchedPairs.length > index" class="text-2xl md:text-3xl">✓</span>
        </div>
      </div>

      <!-- Mensaje de celebración -->
      <Transition name="bounce">
        <div v-if="matchedPairs.length === 4" class="text-4xl md:text-5xl font-bold text-green-600 flex items-center gap-3">
          <span class="text-5xl md:text-6xl">🎊</span>
          ¡Completado!
          <span class="text-5xl md:text-6xl">🎊</span>
        </div>
      </Transition>
    </div>
  </GameLayout>
</template>

<style scoped>
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.4s;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back-side {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
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
