import { ref } from 'vue'

export function useGameState() {
  const currentGame = ref(null)
  const score = ref(0)
  const celebrating = ref(false)
  const celebrationKey = ref(0)

  // Array de felicitaciones con sus emojis
  const celebrations = [
    { text: '¡Correcto!', emoji: '🎊' },
    { text: '¡Excelente!', emoji: '🌟' },
    { text: '¡Genial!', emoji: '✨' },
    { text: '¡Muy bien!', emoji: '🎉' },
    { text: '¡Perfecto!', emoji: '💫' }
  ]

  const currentCelebration = ref(celebrations[0])

  const startGame = (gameName, sounds = null) => {
    // Si se proporcionan sounds, reproducir instrucción primero
    if (sounds) {
      sounds.playGameInstruction(gameName)
      // Cambiar de vista después de que empiece la instrucción
      setTimeout(() => {
        currentGame.value = gameName
        score.value = 0
        celebrating.value = false
        celebrationKey.value = 0
      }, 500)
    } else {
      // Fallback: cambiar inmediatamente (para compatibilidad)
      currentGame.value = gameName
      score.value = 0
      celebrating.value = false
      celebrationKey.value = 0
    }
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

    // Seleccionar una felicitación aleatoria
    const randomIndex = Math.floor(Math.random() * celebrations.length)
    currentCelebration.value = celebrations[randomIndex]

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
    currentCelebration,
    startGame,
    goToMenu,
    celebrate
  }
}
