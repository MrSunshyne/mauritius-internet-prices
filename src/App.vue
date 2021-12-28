<script setup lang="ts">
import { useQueryProvider } from 'vue-query'

useQueryProvider()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss" src="./sass/styles.scss"></style>
<style>
/* html.dark .bg-white {
  @apply bg-gray-600;
}

html.dark .bg-gray-50 {
  @apply bg-gray-700;
}

html.dark .bg-gray-100 {
  @apply bg-gray-800;
}

html.dark .bg-gray-200 {
  @apply bg-gray-900;
} */
</style>