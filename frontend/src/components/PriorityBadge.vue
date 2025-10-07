<template>
  <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
    {{ priorityText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true
  }
})

const priorityConfig = {
  low: {
    text: 'Baja',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800'
  },
  medium: {
    text: 'Media',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800'
  },
  high: {
    text: 'Alta',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800'
  },
  critical: {
    text: 'Crítica',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800'
  }
}

const priorityText = computed(() => {
  return priorityConfig[props.priority]?.text || 'Desconocida'
})

const badgeClasses = computed(() => {
  const config = priorityConfig[props.priority]
  return `${config?.bgClass || 'bg-gray-100'} ${config?.textClass || 'text-gray-800'}`
})
</script>