<script setup>
import { provide } from 'vue'
import { useGameState } from './composables/useGameState'
import { useSounds } from './composables/useSounds'
import MainMenu from './components/MainMenu.vue'
import ShapesGame from './components/games/ShapesGame.vue'
import ColorsGame from './components/games/ColorsGame.vue'
import CountingGame from './components/games/CountingGame.vue'
import AnimalsGame from './components/games/AnimalsGame.vue'
import PatternsGame from './components/games/PatternsGame.vue'
import MemoryGame from './components/games/MemoryGame.vue'

const gameState = useGameState()
const sounds = useSounds()

// Proveer el estado y sonidos a todos los componentes hijos
provide('gameState', gameState)
provide('sounds', sounds)
</script>

<template>
  <div class="w-full flex items-center justify-center p-4">
    <Transition name="fade" mode="out-in">
      <MainMenu v-if="!gameState.currentGame.value" />
      <ShapesGame v-else-if="gameState.currentGame.value === 'shapes'" />
      <ColorsGame v-else-if="gameState.currentGame.value === 'colors'" />
      <CountingGame v-else-if="gameState.currentGame.value === 'counting'" />
      <AnimalsGame v-else-if="gameState.currentGame.value === 'animals'" />
      <PatternsGame v-else-if="gameState.currentGame.value === 'patterns'" />
      <MemoryGame v-else-if="gameState.currentGame.value === 'memory'" />
    </Transition>

    <!-- Overlay de carga al seleccionar juego -->
    <Transition name="loading-fade">
      <div v-if="gameState.isLoadingGame.value"
           class="fixed inset-0 bg-gradient-to-br from-purple-400/95 via-pink-300/95 to-blue-300/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-4 md:gap-6">
          <div class="text-6xl md:text-8xl animate-bounce">🎮</div>
          <p class="text-2xl md:text-4xl font-bold text-gray-700 animate-pulse">Cargando...</p>
          <div class="flex gap-2">
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transición del overlay de carga */
.loading-fade-enter-active {
  transition: all 0.3s ease-out;
}

.loading-fade-leave-active {
  transition: all 0.3s ease-in;
}

.loading-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
