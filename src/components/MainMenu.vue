<script setup>
import { inject } from 'vue'

const gameState = inject('gameState')
const sounds = inject('sounds')

const games = [
  {
    id: 'shapes',
    name: 'Formas',
    icon: '●▲■',
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Reconoce las formas'
  },
  {
    id: 'colors',
    name: 'Colores',
    icon: '🎨',
    color: 'bg-pink-500 hover:bg-pink-600',
    description: 'Aprende los colores'
  },
  {
    id: 'counting',
    name: 'Contar',
    icon: '123',
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Cuenta los objetos'
  },
  {
    id: 'animals',
    name: 'Animales',
    icon: '🐶',
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Sonidos de animales'
  },
  {
    id: 'patterns',
    name: 'Patrones',
    icon: '🔷🔶',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: 'Completa el patrón'
  },
  {
    id: 'memory',
    name: 'Memoria',
    icon: '🃏',
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Encuentra los pares'
  }
]

const selectGame = (gameId) => {
  sounds.initAudio()
  sounds.playClick()
  gameState.startGame(gameId)
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <!-- Título principal -->
    <div class="text-center mb-8 md:mb-12">
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 bounce-soft drop-shadow-lg">
        ¡Juegos Divertidos!
      </h1>
      <p class="text-xl md:text-2xl text-white/90 drop-shadow">
        Elige un juego para empezar
      </p>
    </div>

    <!-- Grid de juegos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
      <button
        v-for="game in games"
        :key="game.id"
        @click="selectGame(game.id)"
        :class="game.color"
        class="game-button rounded-3xl p-6 md:p-8 text-white shadow-2xl transform transition-all hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/50"
      >
        <div class="text-5xl md:text-6xl mb-3 md:mb-4">{{ game.icon }}</div>
        <h2 class="text-2xl md:text-3xl font-bold mb-2">{{ game.name }}</h2>
        <p class="text-base md:text-lg opacity-90">{{ game.description }}</p>
      </button>
    </div>

    <!-- Footer -->
    <div class="text-center mt-8 md:mt-12">
      <p class="text-white/80 text-sm md:text-base">
        ¡Todos los juegos son infinitos y divertidos!
      </p>
    </div>
  </div>
</template>

<style scoped>
button {
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
