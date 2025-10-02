<template>
  <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
    <span :class="dotClasses" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusConfig = {
  open: {
    text: 'Abierta',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
    dotClass: 'bg-yellow-400'
  },
  in_progress: {
    text: 'En Progreso',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    dotClass: 'bg-blue-400'
  },
  resolved: {
    text: 'Resuelta',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    dotClass: 'bg-green-400'
  },
  closed: {
    text: 'Cerrada',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    dotClass: 'bg-gray-400'
  }
}

const statusText = computed(() => {
  return statusConfig[props.status]?.text || 'Desconocido'
})

const badgeClasses = computed(() => {
  const config = statusConfig[props.status]
  return `${config?.bgClass || 'bg-gray-100'} ${config?.textClass || 'text-gray-800'}`
})

const dotClasses = computed(() => {
  return statusConfig[props.status]?.dotClass || 'bg-gray-400'
})
</script>