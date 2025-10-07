<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>