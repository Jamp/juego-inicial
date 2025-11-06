import { ref } from 'vue'

export function useGameState() {
  const currentGame = ref(null)
  const score = ref(0)
  const celebrating = ref(false)
  const celebrationKey = ref(0)

  const startGame = (gameName) => {
    currentGame.value = gameName
    score.value = 0
    celebrating.value = false
    celebrationKey.value = 0
  }

  const goToMenu = () => {
    currentGame.value = null
    celebrating.value = false
    celebrationKey.value = 0
  }

  const celebrate = () => {
    score.value++
    celebrating.value = true
    celebrationKey.value++

    // Ocultar automáticamente después de la animación (600ms)
    setTimeout(() => {
      celebrating.value = false
    }, 600)
  }

  return {
    currentGame,
    score,
    celebrating,
    celebrationKey,
    startGame,
    goToMenu,
    celebrate
  }
}
