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