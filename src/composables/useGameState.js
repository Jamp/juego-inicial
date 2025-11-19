import { ref } from 'vue'

export function useGameState() {
  const currentGame = ref(null)
  const score = ref(0)
  const celebrating = ref(false)
  const celebrationKey = ref(0)

  // Array de felicitaciones con sus emojis y sonidos
  const celebrations = [
    { text: '¡Correcto!', emoji: '🎊', sound: 'correcto' },
    { text: '¡Excelente!', emoji: '🌟', sound: 'excelente' },
    { text: '¡Genial!', emoji: '✨', sound: 'genial' },
    { text: '¡Muy bien!', emoji: '🎉', sound: 'muy-bien' },
    { text: '¡Perfecto!', emoji: '💫', sound: 'perfecto' }
  ]

  const currentCelebration = ref(celebrations[0])
  const isLoadingGame = ref(false)

  const startGame = (gameName, sounds = null) => {
    // Si se proporcionan sounds, reproducir instrucción primero
    if (sounds) {
      isLoadingGame.value = true
      sounds.playGameInstruction(gameName)
      // Cambiar de vista después de que termine la instrucción (~2 segundos)
      setTimeout(() => {
        currentGame.value = gameName
        score.value = 0
        celebrating.value = false
        celebrationKey.value = 0
        // Esperar más tiempo antes de desactivar el loading para que el juego esté completamente listo
        // El juego espera 800ms en onMounted + 400-600ms de audio = ~1400ms total
        setTimeout(() => {
          isLoadingGame.value = false
        }, 1500)
      }, 2000)
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

  const celebrate = (sounds = null) => {
    score.value++
    celebrating.value = true
    celebrationKey.value++

    // Seleccionar una felicitación aleatoria
    const randomIndex = Math.floor(Math.random() * celebrations.length)
    currentCelebration.value = celebrations[randomIndex]

    // Reproducir el audio correspondiente si se proporcionó el objeto sounds
    if (sounds && sounds.playCelebration) {
      sounds.playCelebration(currentCelebration.value.sound)
    }

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
    isLoadingGame,
    startGame,
    goToMenu,
    celebrate
  }
}
