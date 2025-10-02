<template>
  <div class="bg-white rounded-lg shadow p-6 card-hover">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconClasses">
          <component :is="iconComponent" class="h-6 w-6" />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900">
              {{ value }}
            </div>
            <div 
              v-if="trend" 
              :class="trendClasses"
              class="ml-2 flex items-baseline text-sm font-semibold"
            >
              {{ trend }}
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  trend: {
    type: String,
    default: null
  }
})

const iconComponent = computed(() => {
  const icons = {
    'exclamation-triangle': ExclamationTriangleIcon,
    'clock': ClockIcon,
    'check-circle': CheckCircleIcon,
    'chart-bar': ChartBarIcon
  }
  return icons[props.icon] || ChartBarIcon
})

const iconClasses = computed(() => {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  }
  
  return `h-12 w-12 rounded-md flex items-center justify-center ${colorClasses[props.color] || colorClasses.blue}`
})

const trendClasses = computed(() => {
  if (!props.trend) return ''
  
  const isPositive = props.trend.startsWith('+')
  const isNegative = props.trend.startsWith('-')
  
  if (isPositive) {
    return 'text-green-600'
  } else if (isNegative) {
    return 'text-red-600'
  }
  return 'text-gray-600'
})
</script>