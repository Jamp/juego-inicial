import { ref } from 'vue'

export function useGameState() {
  const currentGame = ref(null)
  const score = ref(0)
  const celebrations = ref(0)

  const startGame = (gameName) => {
    currentGame.value = gameName
    score.value = 0
  }

  const goToMenu = () => {
    currentGame.value = null
  }

  const celebrate = () => {
    celebrations.value++
    score.value++
  }

  return {
    currentGame,
    score,
    celebrations,
    startGame,
    goToMenu,
    celebrate
  }
}
