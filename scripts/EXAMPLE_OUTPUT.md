# Ejemplo de Output del Script de Testing

## Console Output

```
> juego-inicial@0.0.0 test:repetitions /Users/jamp/Projects/personal/juego-inicial
> node scripts/test-repetitions.js

Starting repetition prevention tests...
Running 500 rounds per game

Testing Shapes Game...
  ✓ Log saved: /Users/jamp/Projects/personal/juego-inicial/logs/shapes-game-test.log

Testing Colors Game...
  ✓ Log saved: /Users/jamp/Projects/personal/juego-inicial/logs/colors-game-test.log

Testing Counting Game...
  ✓ Log saved: /Users/jamp/Projects/personal/juego-inicial/logs/counting-game-test.log

Testing Animals Game...
  ✓ Log saved: /Users/jamp/Projects/personal/juego-inicial/logs/animals-game-test.log

Testing Patterns Game...
  ✓ Log saved: /Users/jamp/Projects/personal/juego-inicial/logs/patterns-game-test.log

═══════════════════════════════════════════════════
   🎮 REPORTE DE TESTING - PREVENCIÓN DE REPETICIONES
═══════════════════════════════════════════════════

Shapes Game (500 rondas):
  ✅ No immediate repetitions
  ✅ No history violations
  📊 Distribution: χ² = 0.40 (uniform ✓)
  ⏱️  Average variety: 7.7/10 items

Colors Game (500 rondas):
  ✅ No immediate repetitions
  ✅ No history violations
  📊 Distribution: χ² = 0.57 (uniform ✓)
  ⏱️  Average variety: 5.6/6 items

Counting Game (500 rondas):
  ✅ No immediate repetitions
  ✅ No history violations
  📊 Distribution: χ² = 6.48 (uniform ✓)
  ⏱️  Average variety: 6.9/9 items

Animals Game (500 rondas):
  ✅ No immediate repetitions
  ✅ No history violations
  📊 Distribution: χ² = 0.66 (uniform ✓)
  ⏱️  Average variety: 5.6/6 items

Patterns Game (500 rondas):
  ✅ No immediate repetitions
  ✅ No history violations
  📊 Unique patterns generated: 121

SUMMARY:
  Total games tested: 5
  Total rounds: 2500
  Errors found: 0
  Warnings: 0

  Status: ✅ ALL TESTS PASSED

📄 JSON report saved: /Users/jamp/Projects/personal/juego-inicial/logs/test-report.json
```

## Ejemplo de Log File (shapes-game-test.log)

```
=== LOG DE PRUEBA: Shapes Game ===
Fecha: 2025-11-18T02:22:06.134Z
Total de rondas: 500
Tamaño de historial: 3
Items disponibles: 10

=== RONDAS ===
[Ronda 1] Item: Círculo (ID: circle) | Historial: [Círculo]
[Ronda 2] Item: Pentágono (ID: pentagon) | Historial: [Pentágono, Círculo]
[Ronda 3] Item: Rectángulo (ID: rectangle) | Historial: [Rectángulo, Pentágono, Círculo]
[Ronda 4] Item: Triángulo (ID: triangle) | Historial: [Triángulo, Rectángulo, Pentágono]
[Ronda 5] Item: Hexágono (ID: hexagon) | Historial: [Hexágono, Triángulo, Rectángulo]
[Ronda 6] Item: Círculo (ID: circle) | Historial: [Círculo, Hexágono, Triángulo]
[Ronda 7] Item: Cuadrado (ID: square) | Historial: [Cuadrado, Círculo, Hexágono]
[Ronda 8] Item: Pentágono (ID: pentagon) | Historial: [Pentágono, Cuadrado, Círculo]
...

=== ESTADÍSTICAS DE DISTRIBUCIÓN ===
Círculo: 48 veces (9.60%)
Cuadrado: 49 veces (9.80%)
Triángulo: 47 veces (9.40%)
Rectángulo: 54 veces (10.80%)
Pentágono: 47 veces (9.40%)
Hexágono: 55 veces (11.00%)
Diamante: 53 veces (10.60%)
Estrella: 48 veces (9.60%)
Corazón: 52 veces (10.40%)
Óvalo: 47 veces (9.40%)
```

## Ejemplo de Log con Doble Historial (counting-game-test.log)

```
=== LOG DE PRUEBA: Counting Game ===
Fecha: 2025-11-18T02:22:06.138Z
Total de rondas: 500
Tamaño de historial: 2
Objetos disponibles: 9
Números disponibles: 1-5

=== RONDAS ===
[Ronda 1] Objeto: gatitos (1 items) | Hist.Obj: [gatitos] | Hist.Num: [1]
[Ronda 2] Objeto: soles (2 items) | Hist.Obj: [soles, gatitos] | Hist.Num: [2, 1]
[Ronda 3] Objeto: manzanas (3 items) | Hist.Obj: [manzanas, soles] | Hist.Num: [3, 2]
[Ronda 4] Objeto: globos (1 items) | Hist.Obj: [globos, manzanas] | Hist.Num: [1, 3]
[Ronda 5] Objeto: gatitos (5 items) | Hist.Obj: [gatitos, globos] | Hist.Num: [5, 1]
...

=== ESTADÍSTICAS DE DISTRIBUCIÓN (por objeto) ===
manzanas: 64 veces (12.80%)
estrellas: 66 veces (13.20%)
globos: 49 veces (9.80%)
gatitos: 49 veces (9.80%)
flores: 48 veces (9.60%)
soles: 51 veces (10.20%)
Vaquitas: 57 veces (11.40%)
Perritos: 53 veces (10.60%)
Pollitos: 63 veces (12.60%)
```

## Ejemplo de Log para Patterns (patterns-game-test.log)

```
=== LOG DE PRUEBA: Patterns Game ===
Fecha: 2025-11-18T02:22:06.141Z
Total de rondas: 500
Items disponibles: 6

=== RONDAS ===
[Ronda 1] Patrón: 🌸 → 🌙 → ⭐
[Ronda 2] Patrón: ☀️ → 🌸
[Ronda 3] Patrón: ☀️ → 🔵 → 🌙
[Ronda 4] Patrón: 🌸 → 🔵 → ☀️
[Ronda 5] Patrón: 🌸 → ☀️
[Ronda 6] Patrón: ❤️ → 🌙
[Ronda 7] Patrón: ☀️ → 🔵
[Ronda 8] Patrón: ⭐ → 🌸 → ❤️
...

=== ESTADÍSTICAS ===
Patrones únicos generados: 118
Total de rondas: 500
```

## Ejemplo de JSON Report (test-report.json)

```json
{
  "timestamp": "2025-11-18T02:22:06.142Z",
  "summary": {
    "totalGames": 5,
    "totalRounds": 2500,
    "totalErrors": 0,
    "totalWarnings": 0,
    "allPassed": true
  },
  "games": [
    {
      "name": "Shapes Game",
      "rounds": 500,
      "historySize": 3,
      "itemCount": 10,
      "errors": [],
      "warnings": [],
      "chiSquared": 1.8,
      "isUniform": true,
      "avgVariety": 7.545824847250509,
      "distribution": {
        "circle": 48,
        "square": 49,
        "triangle": 47,
        "rectangle": 54,
        "pentagon": 47,
        "hexagon": 55,
        "diamond": 53,
        "star": 48,
        "heart": 52,
        "oval": 47
      }
    },
    {
      "name": "Colors Game",
      "rounds": 500,
      "historySize": 2,
      "itemCount": 6,
      "errors": [],
      "warnings": [],
      "chiSquared": 1.864,
      "isUniform": true,
      "avgVariety": 5.54989816700611,
      "distribution": {
        "red": 93,
        "blue": 78,
        "yellow": 82,
        "green": 84,
        "orange": 78,
        "purple": 85
      }
    }
  ]
}
```

## Ejemplo con Errores (simulado)

Si hubiera errores, el output sería:

```
Shapes Game (500 rondas):
  ❌ 3 errores encontrados
     └─ [Ronda 42] Item "Círculo" se repitió inmediatamente (41 → 42)
     └─ [Ronda 108] Item "Estrella" apareció dentro del historial de tamaño 3
     └─ [Ronda 256] Item "Hexágono" se repitió inmediatamente (255 → 256)
  ⚠️  12 advertencias (ciclos cortos)
  📊 Distribution: χ² = 15.23 (uniform ✗)
  ⏱️  Average variety: 4.2/10 items

...

SUMMARY:
  Total games tested: 5
  Total rounds: 2500
  Errors found: 3
  Warnings: 12

  Status: ❌ TESTS FAILED
```

Y en el log:

```
=== ERRORES DETECTADOS ===
⚠️  [Ronda 42] IMMEDIATE_REPETITION: Item "Círculo" se repitió inmediatamente (41 → 42)
⚠️  [Ronda 108] HISTORY_VIOLATION: Item "Estrella" apareció dentro del historial de tamaño 3
⚠️  [Ronda 256] IMMEDIATE_REPETITION: Item "Hexágono" se repitió inmediatamente (255 → 256)

=== ADVERTENCIAS ===
⚡ [Ronda 67] SHORT_CYCLE: Ciclo corto detectado: Círculo → Cuadrado → Círculo
⚡ [Ronda 89] SHORT_CYCLE: Ciclo corto detectado: Triángulo → Estrella → Triángulo
...
```

## Archivos Generados

Después de ejecutar el script, se generan los siguientes archivos en `/logs`:

```
logs/
├── animals-game-test.log      (31 KB)
├── colors-game-test.log       (32 KB)
├── counting-game-test.log     (44 KB)
├── patterns-game-test.log     (20 KB)
├── shapes-game-test.log       (43 KB)
└── test-report.json           (2.3 KB)
```

---

**Nota**: Los archivos de log se regeneran en cada ejecución del script. Los valores exactos de chi-cuadrado y distribución variarán debido a la aleatoriedad, pero deberían ser consistentemente uniformes.
