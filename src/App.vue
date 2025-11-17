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
</style>
