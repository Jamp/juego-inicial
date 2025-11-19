# 📊 Configuración de Google Analytics 4

## Pasos para obtener tu ID de medición

### 1. Crear cuenta de Google Analytics
1. Ve a https://analytics.google.com/
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Empezar a medir"** o **"Admin"** (si ya tienes otras propiedades)

### 2. Crear una cuenta
1. Nombre de la cuenta: `Juegos Educativos` (o el que prefieras)
2. Configuración de uso compartido de datos: Selecciona las opciones que prefieras
3. Haz clic en **"Siguiente"**

### 3. Crear una propiedad
1. Nombre de la propiedad: `Juegos Educativos para Niños`
2. Zona horaria: Selecciona tu zona horaria
3. Moneda: Selecciona tu moneda
4. Haz clic en **"Siguiente"**

### 4. Información sobre tu empresa
1. Categoría del sector: `Juegos` o `Educación`
2. Tamaño de la empresa: Selecciona el que corresponda
3. Haz clic en **"Crear"**
4. Acepta los Términos de servicio

### 5. Configurar flujo de datos
1. Selecciona **"Web"**
2. URL del sitio web: Ingresa la URL donde desplegarás tu proyecto
   - Ejemplo: `https://juegos-educativos.vercel.app`
   - Ejemplo: `https://tu-dominio.com`
3. Nombre del flujo: `Sitio Web - Juegos Educativos`
4. Haz clic en **"Crear flujo"**

### 6. Obtener tu ID de medición
Después de crear el flujo de datos, verás tu **ID de medición** en la pantalla:
```
ID de medición
G-XXXXXXXXXX
```

**¡Copia este ID!** Lo necesitarás en el siguiente paso.

## Configurar el ID en tu proyecto

### Opción 1: Editar manualmente
1. Abre el archivo `index.html`
2. Busca `G-XXXXXXXXXX` (aparece 2 veces)
3. Reemplázalo con tu ID real
4. Guarda el archivo

### Opción 2: Usando buscar y reemplazar
```bash
# En la terminal, ejecuta (reemplaza con tu ID real):
find . -name "index.html" -exec sed -i '' 's/G-XXXXXXXXXX/G-TU_ID_REAL/g' {} +
```

## Verificar que funciona

### Desarrollo local
1. Ejecuta `pnpm dev`
2. Abre `http://localhost:5173`
3. Ve a Google Analytics > Informes > Tiempo real
4. Deberías ver tu visita en tiempo real

### Producción
1. Despliega tu sitio a producción
2. Visita tu sitio web público
3. Ve a Google Analytics > Informes > Tiempo real
4. Deberías ver las visitas en tiempo real

## ¿Qué datos recopila Google Analytics?

Google Analytics 4 recopilará automáticamente:
- 📊 **Número de visitantes** (usuarios únicos y sesiones)
- 🌍 **Ubicación geográfica** (país, ciudad)
- 📱 **Dispositivos** (móvil, tablet, desktop)
- 🌐 **Navegadores** (Chrome, Safari, Firefox, etc.)
- ⏱️ **Tiempo en el sitio** (duración de sesiones)
- 📄 **Páginas visitadas** (aunque este proyecto es SPA)
- 🔗 **Fuentes de tráfico** (directo, redes sociales, búsqueda, etc.)

## Eventos personalizados (opcional)

Si quieres rastrear eventos específicos (ej: cuando un niño completa un juego), puedes agregar:

```javascript
// En cualquier componente Vue
gtag('event', 'juego_completado', {
  'game_name': 'shapes',
  'score': 10
});
```

## Privacidad y GDPR

**Importante**: Este proyecto está dirigido a niños pequeños (3-5 años). Considera:
- Agregar un aviso de privacidad
- Obtener consentimiento de los padres
- Cumplir con COPPA (Children's Online Privacy Protection Act) si estás en EE.UU.
- Cumplir con GDPR si tienes usuarios en Europa

Para desactivar Analytics durante desarrollo:
```javascript
// En index.html, comenta las líneas de Google Analytics
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  // ...
</script>
-->
```

## Recursos adicionales

- [Documentación oficial de GA4](https://support.google.com/analytics/answer/9304153)
- [Guía de implementación GA4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Política de privacidad recomendada](https://support.google.com/analytics/answer/6004245)
