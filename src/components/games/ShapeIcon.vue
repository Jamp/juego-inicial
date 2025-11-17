<script setup>
import { computed } from 'vue'

const props = defineProps({
  shape: {
    type: String,
    required: true,
    validator: (value) => [
      'circle',
      'square',
      'triangle',
      'rectangle',
      'pentagon',
      'hexagon',
      'diamond',
      'star',
      'heart',
      'oval'
    ].includes(value)
  },
  color: {
    type: String,
    default: '#FF6B6B'
  },
  size: {
    type: [String, Number],
    default: '100%'
  }
})

const shapeSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <!-- Círculo -->
  <svg
    v-if="shape === 'circle'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Círculo"
  >
    <circle
      cx="50"
      cy="50"
      r="45"
      :fill="color"
      stroke="white"
      stroke-width="3"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Cuadrado -->
  <svg
    v-else-if="shape === 'square'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cuadrado"
  >
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="8"
      :fill="color"
      stroke="white"
      stroke-width="3"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Triángulo -->
  <svg
    v-else-if="shape === 'triangle'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Triángulo"
  >
    <polygon
      points="50,8 92,92 8,92"
      :fill="color"
      stroke="white"
      stroke-width="3"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Rectángulo -->
  <svg
    v-else-if="shape === 'rectangle'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Rectángulo"
  >
    <rect
      x="10"
      y="25"
      width="80"
      height="50"
      rx="6"
      :fill="color"
      stroke="white"
      stroke-width="3"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Pentágono -->
  <svg
    v-else-if="shape === 'pentagon'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Pentágono"
  >
    <polygon
      points="50,5 95,40 78,92 22,92 5,40"
      :fill="color"
      stroke="white"
      stroke-width="3"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Hexágono -->
  <svg
    v-else-if="shape === 'hexagon'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Hexágono"
  >
    <polygon
      points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
      :fill="color"
      stroke="white"
      stroke-width="3"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Rombo/Diamante -->
  <svg
    v-else-if="shape === 'diamond'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Diamante"
  >
    <polygon
      points="50,5 90,50 50,95 10,50"
      :fill="color"
      stroke="white"
      stroke-width="3"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Estrella -->
  <svg
    v-else-if="shape === 'star'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Estrella"
  >
    <polygon
      points="50,5 61,35 92,35 67,54 78,85 50,66 22,85 33,54 8,35 39,35"
      :fill="color"
      stroke="white"
      stroke-width="2.5"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Corazón -->
  <svg
    v-else-if="shape === 'heart'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Corazón"
  >
    <path
      d="M50,92 C50,92 8,65 8,40 C8,28 15,20 25,20 C35,20 42,26 50,35 C58,26 65,20 75,20 C85,20 92,28 92,40 C92,65 50,92 50,92 Z"
      :fill="color"
      stroke="white"
      stroke-width="3"
      stroke-linejoin="round"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>

  <!-- Óvalo -->
  <svg
    v-else-if="shape === 'oval'"
    :width="shapeSize"
    :height="shapeSize"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Óvalo"
  >
    <ellipse
      cx="50"
      cy="50"
      rx="45"
      ry="35"
      :fill="color"
      stroke="white"
      stroke-width="3"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    />
  </svg>
</template>

<style scoped>
svg {
  display: block;
}
</style>
