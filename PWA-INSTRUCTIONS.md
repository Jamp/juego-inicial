# 🎮 Instrucciones PWA - Juegos Educativos

## ✅ Lo que se ha configurado:

1. **Fuente Baloo 2**: Aplicada a toda la interfaz del sistema
2. **PWA Completa**: La app funciona sin internet después de la primera visita
3. **Íconos generados**: 
   - icon-192.png
   - icon-512.png
   - apple-touch-icon.png
   - icon.svg

## 🚀 Cómo probar la PWA:

### En desarrollo:
```bash
pnpm dev
```
- Abre http://localhost:5173
- La app cargará normalmente

### En producción (para probar PWA):
```bash
# 1. Construir la app
pnpm build

# 2. Ver la versión de producción
pnpm preview
```

### Probar funcionalidad offline:

1. Abre la app en el navegador (Chrome/Edge recomendados)
2. Abre las DevTools (F12)
3. Ve a la pestaña "Application" > "Service Workers"
4. Verás el service worker registrado
5. Activa el modo "Offline" en la pestaña "Network"
6. Recarga la página - ¡debería seguir funcionando!

### Instalar la app:

#### En escritorio (Chrome/Edge):
- Verás un ícono de instalación en la barra de direcciones
- Haz clic en "Instalar"
- La app se abrirá en una ventana independiente

#### En móvil (iOS Safari):
- Abre la app en Safari
- Toca el botón "Compartir"
- Selecciona "Agregar a pantalla de inicio"
- La app aparecerá como un ícono en tu pantalla de inicio

#### En móvil (Android Chrome):
- Verás un banner de "Agregar a pantalla de inicio"
- Toca "Agregar"
- La app se instalará como una app nativa

## 📦 Qué se cachea para uso offline:

- ✅ Todos los archivos JavaScript y CSS
- ✅ Archivos HTML
- ✅ Imágenes y SVGs
- ✅ **Archivos de audio de animales (.mp3)**
- ✅ **Google Fonts (Baloo 2)**
- ✅ Íconos de la PWA

## 🔧 Regenerar íconos:

Si quieres cambiar el diseño del ícono:

1. Edita `public/icon.svg`
2. Ejecuta:
```bash
node generate-icons.mjs
```

## 📱 Características PWA:

- ✨ Instalable en dispositivos móviles y escritorio
- 🔌 Funciona completamente offline
- 🚀 Carga instantánea después de la primera visita
- 📲 Se ve y funciona como una app nativa
- 🎨 Tema personalizado (#667eea)
- 🔄 Auto-actualización cuando hay nueva versión

## 🎯 Acceso desde otros dispositivos:

Con `host: true` en vite.config.js, puedes acceder desde otros dispositivos en la misma red:

```bash
pnpm dev
```

Verás algo como:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

Usa la URL de "Network" desde tu tablet o teléfono.

---

¡Tu app ahora es una PWA completa! 🎉
