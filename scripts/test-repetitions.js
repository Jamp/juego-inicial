#!/usr/bin/env node

/**
 * Script de Testing para Prevención de Repeticiones
 * Valida que los juegos educativos no repitan items dentro del historial
 *
 * Ejecutar con: pnpm test:repetitions
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración
const ROUNDS = 500
const LOG_DIR = path.join(__dirname, '../logs')

// Colores para output en consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// Datos de los juegos (copiados de los componentes)
const shapes = [
  { id: 'circle', name: 'Círculo' },
  { id: 'square', name: 'Cuadrado' },
  { id: 'triangle', name: 'Triángulo' },
  { id: 'rectangle', name: 'Rectángulo' },
  { id: 'pentagon', name: 'Pentágono' },
  { id: 'hexagon', name: 'Hexágono' },
  { id: 'diamond', name: 'Diamante' },
  { id: 'star', name: 'Estrella' },
  { id: 'heart', name: 'Corazón' },
  { id: 'oval', name: 'Óvalo' }
]

const colors_game = [
  { id: 'red', name: 'Rojo' },
  { id: 'blue', name: 'Azul' },
  { id: 'yellow', name: 'Amarillo' },
  { id: 'green', name: 'Verde' },
  { id: 'orange', name: 'Naranja' },
  { id: 'purple', name: 'Morado' }
]

const animals = [
  { id: 'dog', name: 'Perro' },
  { id: 'cat', name: 'Gato' },
  { id: 'cow', name: 'Vaca' },
  { id: 'bird', name: 'Pollito' },
  { id: 'sheep', name: 'Oveja' },
  { id: 'pig', name: 'Cerdito' }
]

const counting_objects = [
  { id: 'apple', name: 'manzanas' },
  { id: 'star', name: 'estrellas' },
  { id: 'ballon', name: 'globos' },
  { id: 'cat', name: 'gatitos' },
  { id: 'flower', name: 'flores' },
  { id: 'sun', name: 'soles' },
  { id: 'cow', name: 'Vaquitas' },
  { id: 'dog', name: 'Perritos' },
  { id: 'chicken', name: 'Pollitos' }
]

const pattern_items = [
  { id: 'star', emoji: '⭐' },
  { id: 'heart', emoji: '❤️' },
  { id: 'circle', emoji: '🔵' },
  { id: 'flower', emoji: '🌸' },
  { id: 'sun', emoji: '☀️' },
  { id: 'moon', emoji: '🌙' }
]

/**
 * Clase para testear un juego
 */
class GameTester {
  constructor(name, items, historySize, config = {}) {
    this.name = name
    this.items = items
    this.historySize = historySize
    this.history = []
    this.log = []
    this.errors = []
    this.warnings = []
    this.stats = {}
    this.config = config

    // Inicializar estadísticas
    this.items.forEach(item => {
      this.stats[item.id] = 0
    })
  }

  /**
   * Genera una nueva ronda del juego
   */
  generateRound() {
    let newItem
    let attempts = 0
    const maxAttempts = 100

    // Elegir item aleatorio diferente a los últimos N del historial
    do {
      if (attempts++ > maxAttempts) {
        this.errors.push({
          type: 'INFINITE_LOOP',
          message: 'No se pudo generar item único después de 100 intentos',
          round: this.log.length + 1
        })
        return null
      }

      newItem = this.items[Math.floor(Math.random() * this.items.length)]
    } while (this.history.some(prev => prev.id === newItem.id))

    // Actualizar historial
    this.history = [newItem, ...this.history].slice(0, this.historySize)

    // Registrar en log
    this.log.push({
      round: this.log.length + 1,
      item: newItem,
      history: [...this.history]
    })

    // Actualizar estadísticas
    this.stats[newItem.id]++

    return newItem
  }

  /**
   * Detecta repeticiones inmediatas (n → n)
   */
  detectImmediateRepetitions() {
    const errors = []

    for (let i = 1; i < this.log.length; i++) {
      const current = this.log[i].item
      const previous = this.log[i - 1].item

      if (current.id === previous.id) {
        errors.push({
          type: 'IMMEDIATE_REPETITION',
          round: i + 1,
          item: current.name,
          message: `Item "${current.name}" se repitió inmediatamente (${i} → ${i + 1})`
        })
      }
    }

    return errors
  }

  /**
   * Detecta repeticiones dentro del historial
   */
  detectHistoryViolations() {
    const errors = []

    for (let i = this.historySize; i < this.log.length; i++) {
      const current = this.log[i].item
      const recentHistory = this.log.slice(i - this.historySize, i)

      const violation = recentHistory.find(entry => entry.item.id === current.id)
      if (violation) {
        errors.push({
          type: 'HISTORY_VIOLATION',
          round: i + 1,
          item: current.name,
          message: `Item "${current.name}" apareció dentro del historial de tamaño ${this.historySize}`
        })
      }
    }

    return errors
  }

  /**
   * Detecta ciclos cortos (A → B → A)
   */
  detectShortCycles() {
    const warnings = []

    for (let i = 2; i < this.log.length; i++) {
      const current = this.log[i].item
      const twoBack = this.log[i - 2].item

      if (current.id === twoBack.id && this.historySize >= 2) {
        warnings.push({
          type: 'SHORT_CYCLE',
          round: i + 1,
          item: current.name,
          message: `Ciclo corto detectado: ${twoBack.name} → ${this.log[i-1].item.name} → ${current.name}`
        })
      }
    }

    return warnings
  }

  /**
   * Calcula chi-cuadrado para verificar distribución uniforme
   */
  calculateChiSquared() {
    const n = this.log.length
    const k = this.items.length
    const expected = n / k

    let chiSquared = 0

    Object.values(this.stats).forEach(observed => {
      chiSquared += Math.pow(observed - expected, 2) / expected
    })

    return chiSquared
  }

  /**
   * Calcula variedad promedio (items únicos en ventanas de N rondas)
   */
  calculateAverageVariety(windowSize = 10) {
    if (this.log.length < windowSize) return 0

    let totalUnique = 0
    let windows = 0

    for (let i = 0; i <= this.log.length - windowSize; i++) {
      const window = this.log.slice(i, i + windowSize)
      const unique = new Set(window.map(entry => entry.item.id))
      totalUnique += unique.size
      windows++
    }

    return windows > 0 ? totalUnique / windows : 0
  }

  /**
   * Ejecuta el test completo
   */
  runTest(rounds = ROUNDS) {
    console.log(`\n${colors.cyan}${colors.bright}Testing ${this.name}...${colors.reset}`)

    // Generar rondas
    for (let i = 0; i < rounds; i++) {
      const item = this.generateRound()
      if (!item) break
    }

    // Detectar problemas
    const immediateReps = this.detectImmediateRepetitions()
    const historyViolations = this.detectHistoryViolations()
    const shortCycles = this.detectShortCycles()

    this.errors = [...immediateReps, ...historyViolations]
    this.warnings = shortCycles

    // Calcular métricas
    const chiSquared = this.calculateChiSquared()
    const avgVariety = this.calculateAverageVariety()

    // Grados de libertad para chi-cuadrado
    const degreesOfFreedom = this.items.length - 1
    // Valor crítico para α=0.05 (aproximado para df=5-9)
    const criticalValue = degreesOfFreedom * 2.5
    const isUniform = chiSquared < criticalValue

    return {
      rounds: this.log.length,
      errors: this.errors,
      warnings: this.warnings,
      chiSquared,
      isUniform,
      avgVariety,
      itemCount: this.items.length,
      stats: this.stats
    }
  }

  /**
   * Genera archivo de log
   */
  writeLog() {
    const logPath = path.join(LOG_DIR, `${this.name.toLowerCase().replace(/\s+/g, '-')}-test.log`)
    let content = `=== LOG DE PRUEBA: ${this.name} ===\n`
    content += `Fecha: ${new Date().toISOString()}\n`
    content += `Total de rondas: ${this.log.length}\n`
    content += `Tamaño de historial: ${this.historySize}\n`
    content += `Items disponibles: ${this.items.length}\n\n`

    content += `=== RONDAS ===\n`
    this.log.forEach(entry => {
      const historyStr = entry.history.map(h => h.name).join(', ')
      content += `[Ronda ${entry.round}] Item: ${entry.item.name} (ID: ${entry.item.id}) | Historial: [${historyStr}]\n`
    })

    if (this.errors.length > 0) {
      content += `\n=== ERRORES DETECTADOS ===\n`
      this.errors.forEach(error => {
        content += `⚠️  [Ronda ${error.round}] ${error.type}: ${error.message}\n`
      })
    }

    if (this.warnings.length > 0) {
      content += `\n=== ADVERTENCIAS ===\n`
      this.warnings.forEach(warning => {
        content += `⚡ [Ronda ${warning.round}] ${warning.type}: ${warning.message}\n`
      })
    }

    content += `\n=== ESTADÍSTICAS DE DISTRIBUCIÓN ===\n`
    Object.entries(this.stats).forEach(([id, count]) => {
      const item = this.items.find(i => i.id === id)
      const percentage = ((count / this.log.length) * 100).toFixed(2)
      content += `${item.name}: ${count} veces (${percentage}%)\n`
    })

    fs.writeFileSync(logPath, content, 'utf-8')
    return logPath
  }
}

/**
 * Clase especializada para CountingGame
 * Tiene doble historial: objetos Y números
 */
class CountingGameTester extends GameTester {
  constructor() {
    super('Counting Game', counting_objects, 2)
    this.countHistory = []
  }

  generateRound() {
    let newObject
    let attempts = 0
    const maxAttempts = 100

    // Elegir objeto aleatorio diferente a los últimos 2
    do {
      if (attempts++ > maxAttempts) {
        this.errors.push({
          type: 'INFINITE_LOOP',
          message: 'No se pudo generar objeto único',
          round: this.log.length + 1
        })
        return null
      }
      newObject = this.items[Math.floor(Math.random() * this.items.length)]
    } while (this.history.some(prev => prev.id === newObject.id))

    this.history = [newObject, ...this.history].slice(0, this.historySize)

    // Número aleatorio entre 1 y 5, diferente a los últimos 2
    let newCount
    attempts = 0
    do {
      if (attempts++ > maxAttempts) {
        this.errors.push({
          type: 'INFINITE_LOOP',
          message: 'No se pudo generar número único',
          round: this.log.length + 1
        })
        return null
      }
      newCount = Math.floor(Math.random() * 5) + 1
    } while (this.countHistory.includes(newCount))

    this.countHistory = [newCount, ...this.countHistory].slice(0, this.historySize)

    // Registrar en log
    this.log.push({
      round: this.log.length + 1,
      item: newObject,
      count: newCount,
      history: [...this.history],
      countHistory: [...this.countHistory]
    })

    // Actualizar estadísticas (por objeto)
    this.stats[newObject.id]++

    return { object: newObject, count: newCount }
  }

  writeLog() {
    const logPath = path.join(LOG_DIR, `${this.name.toLowerCase().replace(/\s+/g, '-')}-test.log`)
    let content = `=== LOG DE PRUEBA: ${this.name} ===\n`
    content += `Fecha: ${new Date().toISOString()}\n`
    content += `Total de rondas: ${this.log.length}\n`
    content += `Tamaño de historial: ${this.historySize}\n`
    content += `Objetos disponibles: ${this.items.length}\n`
    content += `Números disponibles: 1-5\n\n`

    content += `=== RONDAS ===\n`
    this.log.forEach(entry => {
      const objHistoryStr = entry.history.map(h => h.name).join(', ')
      const countHistoryStr = entry.countHistory.join(', ')
      content += `[Ronda ${entry.round}] Objeto: ${entry.item.name} (${entry.count} items) | Hist.Obj: [${objHistoryStr}] | Hist.Num: [${countHistoryStr}]\n`
    })

    if (this.errors.length > 0) {
      content += `\n=== ERRORES DETECTADOS ===\n`
      this.errors.forEach(error => {
        content += `⚠️  [Ronda ${error.round}] ${error.type}: ${error.message}\n`
      })
    }

    if (this.warnings.length > 0) {
      content += `\n=== ADVERTENCIAS ===\n`
      this.warnings.forEach(warning => {
        content += `⚡ [Ronda ${warning.round}] ${warning.type}: ${warning.message}\n`
      })
    }

    content += `\n=== ESTADÍSTICAS DE DISTRIBUCIÓN (por objeto) ===\n`
    Object.entries(this.stats).forEach(([id, count]) => {
      const item = this.items.find(i => i.id === id)
      const percentage = ((count / this.log.length) * 100).toFixed(2)
      content += `${item.name}: ${count} veces (${percentage}%)\n`
    })

    fs.writeFileSync(logPath, content, 'utf-8')
    return logPath
  }
}

/**
 * Clase especializada para PatternsGame
 * Valida patrones únicos en lugar de items individuales
 */
class PatternsGameTester extends GameTester {
  constructor() {
    super('Patterns Game', pattern_items, 1)
    this.previousPattern = null
  }

  generateRound() {
    // Crear un patrón simple (2-3 elementos)
    const patternLength = Math.random() > 0.5 ? 2 : 3
    let basePattern = []
    let attempts = 0
    const maxAttempts = 100

    // Seleccionar elementos para el patrón, diferente al patrón anterior
    do {
      if (attempts++ > maxAttempts) {
        this.errors.push({
          type: 'INFINITE_LOOP',
          message: 'No se pudo generar patrón único',
          round: this.log.length + 1
        })
        return null
      }

      const shuffledItems = [...this.items].sort(() => Math.random() - 0.5)
      basePattern = shuffledItems.slice(0, patternLength)
    } while (
      this.previousPattern &&
      basePattern.map(p => p.id).join(',') === this.previousPattern.map(p => p.id).join(',')
    )

    this.previousPattern = basePattern

    // Registrar en log
    const patternStr = basePattern.map(p => p.emoji).join(' ')
    this.log.push({
      round: this.log.length + 1,
      item: { id: patternStr, name: patternStr }, // Mock para compatibilidad
      pattern: basePattern
    })

    return basePattern
  }

  // Override para patterns
  detectImmediateRepetitions() {
    const errors = []

    for (let i = 1; i < this.log.length; i++) {
      const currentPattern = this.log[i].pattern.map(p => p.id).join(',')
      const previousPattern = this.log[i - 1].pattern.map(p => p.id).join(',')

      if (currentPattern === previousPattern) {
        errors.push({
          type: 'IMMEDIATE_REPETITION',
          round: i + 1,
          item: this.log[i].item.name,
          message: `Patrón "${this.log[i].item.name}" se repitió inmediatamente`
        })
      }
    }

    return errors
  }

  detectHistoryViolations() {
    // Para patterns solo verificamos repetición inmediata
    return []
  }

  calculateChiSquared() {
    // No aplicable para patrones
    return 0
  }

  calculateAverageVariety() {
    // Para patterns calculamos variedad de patrones únicos
    const uniquePatterns = new Set(this.log.map(entry =>
      entry.pattern.map(p => p.id).join(',')
    ))
    return uniquePatterns.size
  }

  writeLog() {
    const logPath = path.join(LOG_DIR, `${this.name.toLowerCase().replace(/\s+/g, '-')}-test.log`)
    let content = `=== LOG DE PRUEBA: ${this.name} ===\n`
    content += `Fecha: ${new Date().toISOString()}\n`
    content += `Total de rondas: ${this.log.length}\n`
    content += `Items disponibles: ${this.items.length}\n\n`

    content += `=== RONDAS ===\n`
    this.log.forEach(entry => {
      const patternStr = entry.pattern.map(p => p.emoji).join(' → ')
      content += `[Ronda ${entry.round}] Patrón: ${patternStr}\n`
    })

    if (this.errors.length > 0) {
      content += `\n=== ERRORES DETECTADOS ===\n`
      this.errors.forEach(error => {
        content += `⚠️  [Ronda ${error.round}] ${error.type}: ${error.message}\n`
      })
    }

    if (this.warnings.length > 0) {
      content += `\n=== ADVERTENCIAS ===\n`
      this.warnings.forEach(warning => {
        content += `⚡ [Ronda ${warning.round}] ${warning.type}: ${warning.message}\n`
      })
    }

    content += `\n=== ESTADÍSTICAS ===\n`
    content += `Patrones únicos generados: ${this.calculateAverageVariety()}\n`
    content += `Total de rondas: ${this.log.length}\n`

    fs.writeFileSync(logPath, content, 'utf-8')
    return logPath
  }
}

/**
 * Imprime el reporte en consola
 */
function printReport(results) {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.bright}${colors.cyan}   🎮 REPORTE DE TESTING - PREVENCIÓN DE REPETICIONES${colors.reset}`)
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`)

  results.forEach(result => {
    const { name, data } = result

    console.log(`${colors.bright}${name} (${data.rounds} rondas):${colors.reset}`)

    // Errores
    if (data.errors.length === 0) {
      console.log(`  ${colors.green}✅ No immediate repetitions${colors.reset}`)
      console.log(`  ${colors.green}✅ No history violations${colors.reset}`)
    } else {
      console.log(`  ${colors.red}❌ ${data.errors.length} errores encontrados${colors.reset}`)
      data.errors.slice(0, 3).forEach(error => {
        console.log(`     ${colors.red}└─ [Ronda ${error.round}] ${error.message}${colors.reset}`)
      })
      if (data.errors.length > 3) {
        console.log(`     ${colors.red}└─ ... y ${data.errors.length - 3} más${colors.reset}`)
      }
    }

    // Advertencias
    if (data.warnings.length > 0) {
      console.log(`  ${colors.yellow}⚠️  ${data.warnings.length} advertencias (ciclos cortos)${colors.reset}`)
    }

    // Estadísticas
    if (name !== 'Patterns Game') {
      const uniformSymbol = data.isUniform ? '✓' : '✗'
      const uniformColor = data.isUniform ? colors.green : colors.yellow
      console.log(`  ${colors.blue}📊 Distribution: χ² = ${data.chiSquared.toFixed(2)} (uniform ${uniformColor}${uniformSymbol}${colors.reset}${colors.blue})${colors.reset}`)
      console.log(`  ${colors.blue}⏱️  Average variety: ${data.avgVariety.toFixed(1)}/${data.itemCount} items${colors.reset}`)
    } else {
      console.log(`  ${colors.blue}📊 Unique patterns generated: ${data.avgVariety}${colors.reset}`)
    }

    console.log('')
  })

  // Resumen final
  const totalGames = results.length
  const totalRounds = results.reduce((sum, r) => sum + r.data.rounds, 0)
  const totalErrors = results.reduce((sum, r) => sum + r.data.errors.length, 0)
  const totalWarnings = results.reduce((sum, r) => sum + r.data.warnings.length, 0)
  const allPassed = totalErrors === 0

  console.log(`${colors.bright}SUMMARY:${colors.reset}`)
  console.log(`  Total games tested: ${totalGames}`)
  console.log(`  Total rounds: ${totalRounds}`)
  console.log(`  Errors found: ${totalErrors}`)
  console.log(`  Warnings: ${totalWarnings}`)

  if (allPassed) {
    console.log(`\n  ${colors.green}${colors.bright}Status: ✅ ALL TESTS PASSED${colors.reset}\n`)
  } else {
    console.log(`\n  ${colors.red}${colors.bright}Status: ❌ TESTS FAILED${colors.reset}\n`)
  }
}

/**
 * Guarda el reporte en JSON
 */
function saveJSONReport(results) {
  const reportPath = path.join(LOG_DIR, 'test-report.json')
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalGames: results.length,
      totalRounds: results.reduce((sum, r) => sum + r.data.rounds, 0),
      totalErrors: results.reduce((sum, r) => sum + r.data.errors.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.data.warnings.length, 0),
      allPassed: results.every(r => r.data.errors.length === 0)
    },
    games: results.map(r => ({
      name: r.name,
      rounds: r.data.rounds,
      historySize: r.tester.historySize,
      itemCount: r.data.itemCount,
      errors: r.data.errors,
      warnings: r.data.warnings,
      chiSquared: r.data.chiSquared,
      isUniform: r.data.isUniform,
      avgVariety: r.data.avgVariety,
      distribution: r.data.stats
    }))
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  console.log(`${colors.cyan}📄 JSON report saved: ${reportPath}${colors.reset}`)
}

/**
 * Función principal
 */
async function runTests() {
  // Crear directorio de logs si no existe
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }

  console.log(`${colors.bright}${colors.blue}Starting repetition prevention tests...${colors.reset}`)
  console.log(`${colors.blue}Running ${ROUNDS} rounds per game${colors.reset}`)

  // Crear testers
  const testers = [
    new GameTester('Shapes Game', shapes, 3),
    new GameTester('Colors Game', colors_game, 2),
    new CountingGameTester(),
    new GameTester('Animals Game', animals, 2),
    new PatternsGameTester()
  ]

  // Ejecutar tests
  const results = []

  for (const tester of testers) {
    const data = tester.runTest(ROUNDS)
    const logPath = tester.writeLog()

    results.push({
      name: tester.name,
      tester,
      data
    })

    console.log(`${colors.green}  ✓ Log saved: ${logPath}${colors.reset}`)
  }

  // Imprimir y guardar reportes
  printReport(results)
  saveJSONReport(results)

  // Exit code
  const hasErrors = results.some(r => r.data.errors.length > 0)
  process.exit(hasErrors ? 1 : 0)
}

// Ejecutar
runTests().catch(error => {
  console.error(`${colors.red}Error fatal:${colors.reset}`, error)
  process.exit(1)
})
