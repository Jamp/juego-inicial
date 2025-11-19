Detalles a corregir
---

- [x] Bug #1 - RESUELTO
Tarea: En el juego de los animales el sonido que se tenía antes es un track de como suena el animal y debe ser repoducido cuando se le hace click al al botón con 🔊 y este audio nuevo(que es la voz de una persona debe ser repoducido) debe ser reproducido cuando se presione correctamente el botón con animal
**Solución**: Se separaron los sonidos en `useSounds.js` en `animalRealSounds` (ladridos, maullidos) y `animalVoiceSounds` (voces diciendo el nombre). El botón 🔊 reproduce el sonido real, y al acertar se reproduce la voz.

- [x] Bug #2 - RESUELTO
Tarea: Al hacer click en el menú principal las "instruciones de juego", deben ser reproducidas primero y luego se carga la nueva vista del juego seleccionado
**Solución**: Se modificó `useGameState.startGame()` para aceptar el parámetro `sounds` y reproducir la instrucción antes de cambiar de vista. Se actualizó `MainMenu.vue` para pasar sounds al iniciar juego.

- [x] Bug #3 - RESUELTO
Tarea: En los juegos de formas, colores, contar y animales cuyo botones tienen sonido, cuando el jugador acierta se reproduce los sonidos de "boton" y las felicitaciones al mismo tiempo por lo que no se escucha bien, creo que primero debemos reproducir el sonido del botón esperar que termine y luego las felicitaciones y luego una nueva juego
**Solución**: Se crearon funciones async en `useSounds.js` (`playShapeSoundAsync`, `playColorSoundAsync`, `playNumberSoundAsync`, `playAnimalVoiceSoundAsync`) que devuelven promesas. Los juegos ahora esperan que termine el primer sonido con `await` antes de reproducir la felicitación.

- [x] Bug #4 - RESUELTO
Tarea: Las felicitaciones de acerta en un juego debería cambiar de forma aleatoria en todos los, se debería tener un array con todas las felicitaciones y cuando se acierte allí se elige uno al azar y se poner en la pantalla y se reproduce el sonido esto no está sucediendo de hecho viendo el código estoy notando que las felicitaciones están hardcodeadas en el la vista del juego
**Solución**: Se agregó un array de celebraciones con texto y emoji en `useGameState.js`. El método `celebrate()` ahora selecciona una celebración aleatoria y la guarda en `currentCelebration`. Todos los juegos usan `{{ gameState.currentCelebration.text }}` y `{{ gameState.currentCelebration.emoji }}` en lugar de texto hardcodeado.

- [x] Bug #5 - RESUELTO
Tarea: Está relacionada con el Bug #4 ya se hizo un array con las felicitaciones pero primero no se están mostrando los textos en pantalla cuando se acierta en los juegos y array debe contener el objeto de felicitaciones como lo planteaste está bien emoji, texto pero también debes agregar "sonido" que es el audio que se va reproducir y que está asociado a esa felicitaciones
**Solución**: Se agregó el campo "sound" al array de celebraciones en `useGameState.js` (correcto, excelente, genial, muy-bien, perfecto). Se creó la función `playCelebration(soundId)` en `useSounds.js` con un mapa de sonidos. Todos los juegos ahora usan `sounds.playCelebration(gameState.currentCelebration.value.sound)` para reproducir el audio específico de cada celebración aleatoria.

- [x] Bug #6 - RESUELTO
Tarea: Se debe tener una especie de "WaitingState" o "InitState" que sea como un cargando al entrar a la vista de juego que muestre mientras aún se reproducen las instrucciones porque sino va seguir pasando lo bug que tenemos ahora que de repente se muestra un vista incompletado de juego como si la app estuviera rota, adjunto un screenshot en ![alt text](<Captura de pantalla 2025-11-18 a la(s) 18.07.18.png>)
**Solución**: Se agregó `isLoadingGame` ref en `useGameState.js`. El método `startGame()` activa el estado de carga por 2 segundos (duración de las instrucciones). Se creó un overlay de carga en `App.vue` con fondo gradiente, emoji animado 🎮, texto "Cargando..." y puntos animados. El overlay se muestra mientras `isLoadingGame` es true, evitando que se vea la vista incompleta del juego.

- [x] Bug #7 - RESUELTO (Corrección de Bug #6)
Tarea: El Bug #6 seguía ocurriendo DESPUÉS de que desaparecía la pantalla de carga. La pantalla de "Cargando..." funcionaba, pero el juego todavía mostraba una vista incompleta después de ocultarse el overlay.
**Problema identificado**: Desincronización de tiempos:
  - Overlay de carga: 2000ms (instrucción) + 300ms (transición) = 2300ms
  - `onMounted` en juegos: `setTimeout(generateRound, 500ms)`
  - El overlay se ocultaba ANTES de que `generateRound()` terminara de ejecutarse y reproducir el audio
**Solución**:
  1. Aumentado el `setTimeout` en `onMounted` de todos los juegos de 500ms a 800ms para dar más margen
  2. Aumentado el timeout final en `startGame()` de 300ms a 1500ms (calculado: 800ms onMounted + 400-600ms audio = ~1400ms)
  3. Ahora el overlay se mantiene visible hasta que el juego está completamente listo con audio reproducido

- [x] Bug #8 - RESUELTO
Tarea: El texto de celebraciones NO se mostraba al acertar en los juegos, a pesar de haber implementado el sistema de celebraciones aleatorias del Bug #5.
**Problema identificado**: Error de acceso a refs en templates de Vue. Los componentes usaban `{{ gameState.currentCelebration.text }}` y `{{ gameState.currentCelebration.emoji }}`, pero `currentCelebration` es un `ref`, por lo que se requiere `.value` para acceder a sus propiedades.
**Solución**: Corregido el acceso en templates de TODOS los juegos:
  - Antes: `{{ gameState.currentCelebration.text }}`
  - Después: `{{ gameState.currentCelebration.value.text }}`
  - Antes: `{{ gameState.currentCelebration.emoji }}`
  - Después: `{{ gameState.currentCelebration.value.emoji }}`
  - Archivos modificados: ShapesGame.vue, ColorsGame.vue, CountingGame.vue, AnimalsGame.vue, PatternsGame.vue, MemoryGame.vue

- [x] Bug #9 - RESUELTO
Tarea: Cuando el usuario acertaba y luego salía del juego (botón volver), se escuchaba el audio del siguiente juego que iba a generarse.
**Problema identificado**: Los `setTimeout` en las funciones de selección (selectShape, selectColor, etc.) NO se limpiaban al desmontar el componente. Si el usuario salía antes de 2 segundos, el timeout seguía ejecutándose y llamaba a `generateRound()` reproduciendo el audio.
**Solución**: Implementado sistema de limpieza de timeouts en TODOS los juegos:
  1. Agregado `activeTimeouts` ref array para rastrear todos los timeouts activos
  2. Cada `setTimeout` ahora guarda su ID: `const timeoutId = setTimeout(...); activeTimeouts.value.push(timeoutId)`
  3. Agregado `onBeforeUnmount` que limpia TODOS los timeouts: `activeTimeouts.value.forEach(id => clearTimeout(id))`
  4. Esto previene que se ejecuten acciones cuando el componente ya no está montado
  - Archivos modificados: ShapesGame.vue, ColorsGame.vue, CountingGame.vue, AnimalsGame.vue, PatternsGame.vue, MemoryGame.vue
