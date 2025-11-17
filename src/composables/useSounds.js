import { ref } from 'vue'

// Importar archivos de audio de animales
import dogSound from '../assets/sounds/animals/dog.mp3'
import catSound from '../assets/sounds/animals/cat.mp3'
import cowSound from '../assets/sounds/animals/cow.mp3'
import birdSound from '../assets/sounds/animals/bird.mp3'
import sheepSound from '../assets/sounds/animals/sheep.mp3'
import pigSound from '../assets/sounds/animals/pig.mp3'

// Importar archivos de audio de formas geométricas
import circleSound from '../assets/sounds/voices/circulo.mp3'
import squareSound from '../assets/sounds/voices/cuadrado.mp3'
import rectangleSound from '../assets/sounds/voices/rectangulo.mp3'
import pentagonSound from '../assets/sounds/voices/pentagono.mp3'
import hexagonSound from '../assets/sounds/voices/hexagono.mp3'
import diamondSound from '../assets/sounds/voices/diamante.mp3'
import heartSound from '../assets/sounds/voices/corazon.mp3'
import ovalSound from '../assets/sounds/voices/ovalo.mp3'

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

  // Función para reproducir archivos de audio
  const playAudioFile = (src) => {
    const audio = new Audio(src)
    audio.volume = 0.7
    audio.play().catch(err => console.log('Error playing audio:', err))
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

  // Sonidos de animales usando archivos reales
  const animalSounds = {
    dog: () => playAudioFile(dogSound),
    cat: () => playAudioFile(catSound),
    cow: () => playAudioFile(cowSound),
    bird: () => playAudioFile(birdSound),
    sheep: () => playAudioFile(sheepSound),
    pig: () => playAudioFile(pigSound)
  }

  // Sonidos de formas geométricas
  const shapeSounds = {
    circle: () => playAudioFile(circleSound),
    square: () => playAudioFile(squareSound),
    rectangle: () => playAudioFile(rectangleSound),
    pentagon: () => playAudioFile(pentagonSound),
    hexagon: () => playAudioFile(hexagonSound),
    diamond: () => playAudioFile(diamondSound),
    heart: () => playAudioFile(heartSound),
    oval: () => playAudioFile(ovalSound),
    // Formas sin audio (usarán sonido sintético alternativo)
    triangle: null,
    star: null
  }

  // Reproducir sonido de forma (con fallback a sonido sintético si no existe)
  const playShapeSound = (shapeId) => {
    const soundFunction = shapeSounds[shapeId]
    if (soundFunction) {
      soundFunction()
    } else {
      // Fallback: sonido sintético suave para formas sin audio
      playTone(600, 0.15, 'sine')
    }
  }

  return {
    playSuccess,
    playClick,
    playCorrect,
    playWin,
    animalSounds,
    shapeSounds,
    playShapeSound,
    initAudio
  }
}
