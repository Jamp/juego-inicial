import { ref } from 'vue'

// Importar archivos de audio de animales (sonidos reales)
import dogRealSound from '../assets/sounds/animals/dog.mp3'
import catRealSound from '../assets/sounds/animals/cat.mp3'
import cowRealSound from '../assets/sounds/animals/cow.mp3'
import birdRealSound from '../assets/sounds/animals/bird.mp3'
import sheepRealSound from '../assets/sounds/animals/sheep.mp3'
import pigRealSound from '../assets/sounds/animals/pig.mp3'

// Importar archivos de audio de nombres de animales (voces)
import dogVoiceSound from '../assets/sounds/processed/perro.mp3'
import catVoiceSound from '../assets/sounds/processed/gato.mp3'
import cowVoiceSound from '../assets/sounds/processed/vaca.mp3'
import birdVoiceSound from '../assets/sounds/processed/pollo.mp3'
import sheepVoiceSound from '../assets/sounds/processed/oveja.mp3'
import pigVoiceSound from '../assets/sounds/processed/cerdo.mp3'

// Importar archivos de audio de formas geométricas
import circleSound from '../assets/sounds/voices/circulo.mp3'
import squareSound from '../assets/sounds/voices/cuadrado.mp3'
import rectangleSound from '../assets/sounds/voices/rectangulo.mp3'
import pentagonSound from '../assets/sounds/voices/pentagono.mp3'
import hexagonSound from '../assets/sounds/voices/hexagono.mp3'
import diamondSound from '../assets/sounds/voices/diamante.mp3'
import heartSound from '../assets/sounds/voices/corazon.mp3'
import ovalSound from '../assets/sounds/voices/ovalo.mp3'
import triangleSound from '../assets/sounds/voices/triangulo.mp3'
import starSound from '../assets/sounds/voices/estrella.mp3'

// Importar archivos de audio de colores
import redSound from '../assets/sounds/processed/rojo.mp3'
import blueSound from '../assets/sounds/processed/azul.mp3'
import yellowSound from '../assets/sounds/processed/amarillo.mp3'
import greenSound from '../assets/sounds/processed/verde.mp3'
import orangeSound from '../assets/sounds/processed/naranja.mp3'
import purpleSound from '../assets/sounds/processed/morado.mp3'

// Importar archivos de audio de feedback/celebración
import correctoSound from '../assets/sounds/processed/correcto.mp3'
import excelenteSound from '../assets/sounds/processed/excelente.mp3'
import genialSound from '../assets/sounds/processed/genial.mp3'
import muyBienSound from '../assets/sounds/processed/muy-bien.mp3'
import perfectoSound from '../assets/sounds/processed/perfecto.mp3'
import completadoSound from '../assets/sounds/processed/completado.mp3'

// Importar archivos de audio de números
import unoSound from '../assets/sounds/processed/uno.mp3'
import dosSound from '../assets/sounds/processed/dos.mp3'
import tresSound from '../assets/sounds/processed/tres.mp3'
import cuatroSound from '../assets/sounds/processed/cuatro.mp3'
import cincoSound from '../assets/sounds/processed/cinco.mp3'

// Importar archivos de audio de instrucciones de juegos
import reconoceFormasSound from '../assets/sounds/processed/reconoce-formas.mp3'
import aprendeColoresSound from '../assets/sounds/processed/aprende-los-colores.mp3'
import cuentaObjetosSound from '../assets/sounds/processed/cuenta-los-objetos.mp3'
import sonidoAnimalesSound from '../assets/sounds/processed/sonido-de-animales.mp3'
import completaPatronSound from '../assets/sounds/processed/completa-el-patron.mp3'
import encuentraParesSound from '../assets/sounds/processed/encuentra-los-pares.mp3'

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

  // Función para reproducir archivos de audio con promesa (para secuencias)
  const playAudioFileAsync = (src) => {
    return new Promise((resolve) => {
      const audio = new Audio(src)
      audio.volume = 0.7
      audio.onended = () => resolve()
      audio.onerror = () => resolve() // Resolver incluso si hay error
      audio.play().catch(err => {
        console.log('Error playing audio:', err)
        resolve()
      })
    })
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

  // Mapa de sonidos de celebración por ID
  const celebrationSoundsMap = {
    'correcto': correctoSound,
    'excelente': excelenteSound,
    'genial': genialSound,
    'muy-bien': muyBienSound,
    'perfecto': perfectoSound
  }

  // Reproducir sonido de celebración específico
  const playCelebration = (soundId) => {
    const sound = celebrationSoundsMap[soundId]
    if (sound) {
      playAudioFile(sound)
    } else {
      // Fallback: usar correcto si no se encuentra el sonido
      playAudioFile(correctoSound)
    }
  }

  // Mantener playCorrect para compatibilidad (ahora solo reproduce correcto)
  const playCorrect = () => {
    playAudioFile(correctoSound)
  }

  const playCompleted = () => {
    playAudioFile(completadoSound)
  }

  const playWin = () => {
    playTone(523.25, 0.1)
    setTimeout(() => playTone(659.25, 0.1), 100)
    setTimeout(() => playTone(783.99, 0.1), 200)
    setTimeout(() => playTone(1046.5, 0.3), 300)
  }

  // Sonidos reales de animales (para el botón 🔊)
  const animalRealSounds = {
    dog: () => playAudioFile(dogRealSound),
    cat: () => playAudioFile(catRealSound),
    cow: () => playAudioFile(cowRealSound),
    bird: () => playAudioFile(birdRealSound),
    sheep: () => playAudioFile(sheepRealSound),
    pig: () => playAudioFile(pigRealSound)
  }

  // Voces de nombres de animales (para cuando se acierta)
  const animalVoiceSounds = {
    dog: () => playAudioFile(dogVoiceSound),
    cat: () => playAudioFile(catVoiceSound),
    cow: () => playAudioFile(cowVoiceSound),
    bird: () => playAudioFile(birdVoiceSound),
    sheep: () => playAudioFile(sheepVoiceSound),
    pig: () => playAudioFile(pigVoiceSound)
  }

  // Sonidos de formas geométricas
  const shapeSounds = {
    circle: () => playAudioFile(circleSound),
    square: () => playAudioFile(squareSound),
    triangle: () => playAudioFile(triangleSound),
    rectangle: () => playAudioFile(rectangleSound),
    pentagon: () => playAudioFile(pentagonSound),
    hexagon: () => playAudioFile(hexagonSound),
    diamond: () => playAudioFile(diamondSound),
    star: () => playAudioFile(starSound),
    heart: () => playAudioFile(heartSound),
    oval: () => playAudioFile(ovalSound)
  }

  // Sonidos de colores
  const colorSounds = {
    red: () => playAudioFile(redSound),
    blue: () => playAudioFile(blueSound),
    yellow: () => playAudioFile(yellowSound),
    green: () => playAudioFile(greenSound),
    orange: () => playAudioFile(orangeSound),
    purple: () => playAudioFile(purpleSound)
  }

  // Sonidos de números
  const numberSounds = {
    1: () => playAudioFile(unoSound),
    2: () => playAudioFile(dosSound),
    3: () => playAudioFile(tresSound),
    4: () => playAudioFile(cuatroSound),
    5: () => playAudioFile(cincoSound)
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

  // Reproducir sonido de forma async (para secuencias)
  const playShapeSoundAsync = async (shapeId) => {
    const audioMap = {
      circle: circleSound,
      square: squareSound,
      triangle: triangleSound,
      rectangle: rectangleSound,
      pentagon: pentagonSound,
      hexagon: hexagonSound,
      diamond: diamondSound,
      star: starSound,
      heart: heartSound,
      oval: ovalSound
    }

    const src = audioMap[shapeId]
    if (src) {
      await playAudioFileAsync(src)
    }
  }

  // Reproducir sonido de color
  const playColorSound = (colorId) => {
    const soundFunction = colorSounds[colorId]
    if (soundFunction) {
      soundFunction()
    } else {
      // Fallback: sonido sintético suave para colores sin audio
      playTone(650, 0.15, 'sine')
    }
  }

  // Reproducir sonido de color async (para secuencias)
  const playColorSoundAsync = async (colorId) => {
    const audioMap = {
      red: redSound,
      blue: blueSound,
      yellow: yellowSound,
      green: greenSound,
      orange: orangeSound,
      purple: purpleSound
    }

    const src = audioMap[colorId]
    if (src) {
      await playAudioFileAsync(src)
    }
  }

  // Reproducir sonido de número
  const playNumberSound = (number) => {
    const soundFunction = numberSounds[number]
    if (soundFunction) {
      soundFunction()
    } else {
      // Fallback: sonido sintético suave para números sin audio
      playTone(700, 0.15, 'sine')
    }
  }

  // Reproducir sonido de número async (para secuencias)
  const playNumberSoundAsync = async (number) => {
    const audioMap = {
      1: unoSound,
      2: dosSound,
      3: tresSound,
      4: cuatroSound,
      5: cincoSound
    }

    const src = audioMap[number]
    if (src) {
      await playAudioFileAsync(src)
    }
  }

  // Reproducir sonido de voz de animal async (para secuencias)
  const playAnimalVoiceSoundAsync = async (animalId) => {
    const audioMap = {
      dog: dogVoiceSound,
      cat: catVoiceSound,
      cow: cowVoiceSound,
      bird: birdVoiceSound,
      sheep: sheepVoiceSound,
      pig: pigVoiceSound
    }

    const src = audioMap[animalId]
    if (src) {
      await playAudioFileAsync(src)
    }
  }

  // Instrucciones de juegos
  const gameInstructions = {
    shapes: () => playAudioFile(reconoceFormasSound),
    colors: () => playAudioFile(aprendeColoresSound),
    counting: () => playAudioFile(cuentaObjetosSound),
    animals: () => playAudioFile(sonidoAnimalesSound),
    patterns: () => playAudioFile(completaPatronSound),
    memory: () => playAudioFile(encuentraParesSound)
  }

  // Reproducir instrucción de juego
  const playGameInstruction = (gameId) => {
    const soundFunction = gameInstructions[gameId]
    if (soundFunction) {
      soundFunction()
    }
  }

  return {
    playSuccess,
    playClick,
    playCorrect,
    playCelebration,
    playCompleted,
    playWin,
    animalRealSounds,
    animalVoiceSounds,
    playAnimalVoiceSoundAsync,
    shapeSounds,
    playShapeSound,
    playShapeSoundAsync,
    colorSounds,
    playColorSound,
    playColorSoundAsync,
    numberSounds,
    playNumberSound,
    playNumberSoundAsync,
    gameInstructions,
    playGameInstruction,
    initAudio
  }
}
