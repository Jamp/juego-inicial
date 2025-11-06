<script setup>
import { inject } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: 'bg-white'
  }
})

const gameState = inject('gameState')
const sounds = inject('sounds')

const goBack = () => {
  sounds.playClick()
  gameState.goToMenu()
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <!-- Header con título y botón de volver -->
    <div class="flex items-center justify-between mb-6 px-4">
      <button
        @click="goBack"
        class="game-button bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
      >
        <span class="text-2xl">←</span>
        <span class="hidden sm:inline">Menú</span>
      </button>

      <h1 class="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center flex-1">
        {{ title }}
      </h1>

      <!-- Contador de puntos (decorativo) -->
      <div class="bg-white/90 px-4 md:px-6 py-3 rounded-full font-bold text-lg md:text-xl shadow-lg">
        <span class="text-yellow-500">⭐</span>
        <span class="ml-2">{{ gameState.score.value }}</span>
      </div>
    </div>

    <!-- Área del juego -->
    <div :class="bgColor" class="rounded-3xl shadow-2xl p-4 md:p-8 min-h-[60vh]">
      <slot></slot>
    </div>

    <!-- Mensajes de celebración -->
    <Transition name="celebrate">
      <div
        v-if="gameState.celebrating.value"
        :key="gameState.celebrationKey.value"
        class="fixed inset-0 pointer-events-none flex items-center justify-center"
      >
        <div class="text-8xl md:text-9xl celebrate">
          {{ ['🎉', '🌟', '⭐', '✨', '🎊'][gameState.celebrationKey.value % 5] }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.celebrate-enter-active {
  animation: celebrate-pop 0.6s ease-out;
}

.celebrate-leave-active {
  animation: celebrate-fade 0.3s ease-in;
}

@keyframes celebrate-pop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 0;
  }
}

@keyframes celebrate-fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
