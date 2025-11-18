# Scripts de Testing

## test-repetitions.js

Script de testing automatizado para validar la prevención de repeticiones en los mini-juegos educativos.

### Objetivo

Simular cientos de rondas de cada juego para verificar que:
- No se repitan items inmediatamente (n → n)
- No se repitan items dentro del historial definido
- La distribución de items sea aproximadamente uniforme
- No existan ciclos cortos problemáticos

### Ejecución

```bash
pnpm test:repetitions
```

### Configuración

El script está configurado para ejecutar **500 rondas** por juego. Puedes modificar esto en la constante `ROUNDS` dentro del archivo.

### Juegos Testeados

1. **Shapes Game** - 10 formas, historial de 3
2. **Colors Game** - 6 colores, historial de 2
3. **Counting Game** - 9 objetos + 5 números, historial de 2 para ambos
4. **Animals Game** - 6 animales, historial de 2
5. **Patterns Game** - Patrones únicos de 2-3 elementos

### Salidas Generadas

#### 1. Console Output

Reporte formateado con colores que muestra:
- Estado de cada juego (✅ o ❌)
- Número de errores y advertencias
- Estadísticas de distribución (chi-cuadrado)
- Variedad promedio de items
- Resumen final

#### 2. Archivos de Log

Ubicación: `/logs/*.log`

Cada juego genera su propio archivo de log con:
- Todas las rondas ejecutadas
- Historial en cada paso
- Errores detectados (si hay)
- Advertencias (ciclos cortos)
- Estadísticas de distribución

Ejemplo de entrada en el log:
```
[Ronda 42] Item: Círculo (ID: circle) | Historial: [Círculo, Hexágono, Triángulo]
```

#### 3. Reporte JSON

Ubicación: `/logs/test-report.json`

Reporte estructurado en JSON con:
- Timestamp de ejecución
- Resumen consolidado
- Datos detallados por juego
- Distribución completa de items
- Métricas estadísticas

### Validaciones Realizadas

#### Errores Críticos (FAIL)

1. **Repetición inmediata** - El mismo item aparece en rondas consecutivas
2. **Violación de historial** - Un item aparece antes de que se limpie del historial
3. **Loop infinito** - No se puede generar un item válido después de 100 intentos

#### Advertencias (WARNING)

1. **Ciclos cortos** - Patrones A → B → A (solo si historial ≥ 2)

### Métricas Estadísticas

#### Chi-Cuadrado (χ²)

Mide si la distribución de items es uniforme (todos aparecen con frecuencia similar).

- **Valor bajo** (< 2*items): Distribución uniforme ✓
- **Valor alto**: Algunos items aparecen mucho más que otros

#### Variedad Promedio

Promedio de items únicos en ventanas de 10 rondas.

- **Alto** (~90% de items totales): Buena variedad
- **Bajo**: Poca variedad, experiencia repetitiva

### Interpretación de Resultados

#### ✅ ALL TESTS PASSED

Todos los juegos cumplen con:
- 0 repeticiones inmediatas
- 0 violaciones de historial
- Distribución aproximadamente uniforme

#### ❌ TESTS FAILED

Al menos un juego tiene errores críticos. Revisar los logs detallados para:
- Identificar qué rondas fallaron
- Ver el historial en el momento del error
- Diagnosticar el problema en la lógica de `generateRound()`

### Casos de Uso

#### Desarrollo

Ejecutar antes de hacer commits de cambios en la lógica de generación de rondas:

```bash
pnpm test:repetitions
```

#### CI/CD

Agregar al pipeline para validar automáticamente:

```yaml
- name: Test repetitions
  run: pnpm test:repetitions
```

#### Debugging

Si un juego falla, revisar el log específico:

```bash
cat logs/shapes-game-test.log
```

Buscar las rondas marcadas con ⚠️ para ver exactamente qué falló.

### Modificar el Script

#### Cambiar número de rondas

```javascript
const ROUNDS = 1000 // Default: 500
```

#### Agregar un nuevo juego

```javascript
// 1. Definir los datos del juego
const newGameItems = [
  { id: 'item1', name: 'Item 1' },
  // ...
]

// 2. Crear el tester
const newGameTester = new GameTester('New Game', newGameItems, HISTORY_SIZE)

// 3. Agregarlo a la lista de testers
const testers = [
  // ... otros testers
  newGameTester
]
```

#### Modificar validaciones

Las validaciones principales están en:
- `detectImmediateRepetitions()`
- `detectHistoryViolations()`
- `detectShortCycles()`

### Limitaciones Conocidas

1. **No ejecuta UI real** - Solo replica la lógica de `generateRound()`
2. **Patterns Game** - Solo valida unicidad del patrón, no la dificultad
3. **Estadísticas** - Chi-cuadrado usa valor crítico aproximado

### Dependencias

- Node.js (ES Modules)
- Módulos nativos: `fs`, `path`
- Sin dependencias externas

### Troubleshooting

#### Error: "Cannot find module"

Asegúrate de que el archivo tiene extensión `.js` y que `package.json` tiene `"type": "module"`.

#### Los logs se ven sin colores

Los colores funcionan en terminales compatibles. En CI/CD es normal que no se vean.

#### Chi-cuadrado alto pero sin errores

Es normal, especialmente con pocas rondas. El test solo falla en repeticiones reales, no en distribución imperfecta.

---

**Última actualización**: 2025-11-17
**Versión**: 1.0.0
