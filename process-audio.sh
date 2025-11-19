#!/bin/bash

# Script para procesar archivos de audio .m4a
# - Limpia nombres (trim + slugify)
# - Convierte a mp3
# - Elimina silencios al inicio y final

set -e

# Cambiar al directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
SOURCE_DIR="src/assets/sounds/raw"
OUTPUT_DIR="src/assets/sounds/processed"

# Crear directorio de salida si no existe
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}🎵 Procesando archivos de audio...${NC}\n"

# Contador
count=0
total=$(find "$SOURCE_DIR" -name "*.m4a" | wc -l | tr -d ' ')

# Función para slugify (convertir nombre a formato URL-amigable)
slugify() {
    python3 -c "
import sys, re, unicodedata
# Normalizar a NFC (macOS usa NFD)
text = unicodedata.normalize('NFC', sys.argv[1].strip())
# Reemplazar acentos
replacements = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
    'ñ': 'n', 'Ñ': 'n'
}
for old, new in replacements.items():
    text = text.replace(old, new)
text = text.lower()
text = re.sub(r'[^a-z0-9]+', '-', text)
text = text.strip('-')
print(text)
" "$1"
}

# Procesar cada archivo .m4a
for file in "$SOURCE_DIR"/*.m4a; do
    # Verificar que el archivo existe
    if [ ! -f "$file" ]; then
        continue
    fi

    count=$((count + 1))

    # Obtener nombre base sin extensión y sin ruta
    basename=$(basename "$file" .m4a)

    # Limpiar espacios en blanco al inicio y final
    cleaned_name=$(echo "$basename" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # Aplicar slugify
    slugified_name=$(slugify "$cleaned_name")

    # Nombre del archivo de salida
    output_file="$OUTPUT_DIR/${slugified_name}.mp3"

    echo -e "${YELLOW}[$count/$total]${NC} Procesando: ${GREEN}$basename${NC}"
    echo "         → ${BLUE}${slugified_name}.mp3${NC}"

    # Convertir a mp3 y eliminar silencios
    # -i: archivo de entrada
    # -af: filtros de audio optimizados
    #   - silenceremove con stop_periods=-1 para procesar todo el audio
    # -codec:a libmp3lame: usar encoder mp3
    # -b:a 128k: bitrate constante
    # -ac 1: mono (más rápido y suficiente para voz)
    # -ar 44100: sample rate estándar
    # -y: sobrescribir sin preguntar
    ffmpeg -i "$file" \
        -af "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:stop_periods=-1:stop_duration=0.1:stop_threshold=-40dB" \
        -codec:a libmp3lame \
        -b:a 128k \
        -ac 1 \
        -ar 44100 \
        -y \
        "$output_file" \
        -loglevel error -stats

    echo ""
done

echo -e "\n${GREEN}✅ Procesamiento completado!${NC}"
echo -e "${BLUE}📁 Archivos guardados en: $OUTPUT_DIR${NC}"
echo -e "${GREEN}🎉 Total: $count archivos procesados${NC}\n"
