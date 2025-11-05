import { ref } from 'vue'

export function useSounds() {
  const audioContext = ref(null)

  // Crear contexto de audio en la primera interacción
  const initAudio = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Función para crear sonidos sintéticos
  const playTone = (frequency, duration = 0.2, type = 'sine') => {
    initAudio()
    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, audioContext.value.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + duration)

    oscillator.start(audioContext.value.currentTime)
    oscillator.stop(audioContext.value.currentTime + duration)
  }

  // Sonidos para diferentes acciones
  const playSuccess = () => {
    playTone(523.25, 0.1) // C5
    setTimeout(() => playTone(659.25, 0.1), 100) // E5
    setTimeout(() => playTone(783.99, 0.2), 200) // G5
  }

  const playClick = () => {
    playTone(800, 0.05, 'square')
  }

  const playCorrect = () => {
    playTone(880, 0.15) // A5
    setTimeout(() => playTone(1046.5, 0.2), 150) // C6
  }

  const playWin = () => {
    playTone(523.25, 0.1)
    setTimeout(() => playTone(659.25, 0.1), 100)
    setTimeout(() => playTone(783.99, 0.1), 200)
    setTimeout(() => playTone(1046.5, 0.3), 300)
  }

  // Sonidos de animales
  const animalSounds = {
    dog: () => {
      playTone(200, 0.1)
      setTimeout(() => playTone(180, 0.15), 150)
    },
    cat: () => {
      playTone(800, 0.1)
      setTimeout(() => playTone(900, 0.15), 120)
    },
    cow: () => {
      playTone(150, 0.3)
    },
    bird: () => {
      playTone(1200, 0.05)
      setTimeout(() => playTone(1400, 0.05), 80)
      setTimeout(() => playTone(1600, 0.1), 160)
    },
    sheep: () => {
      playTone(300, 0.2)
      setTimeout(() => playTone(280, 0.2), 250)
    },
    pig: () => {
      playTone(250, 0.15)
      setTimeout(() => playTone(220, 0.15), 180)
    }
  }

  return {
    playSuccess,
    playClick,
    playCorrect,
    playWin,
    animalSounds,
    initAudio
  }
}
