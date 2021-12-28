<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-xl font-medium">Operators</h2>
      <div class="flex gap-8">
        <div
          @click="filters.Operator = Operator"
          class="text-2xl font-bold shadow-md px-8 py-4 rounded-lg bg-gray-600 hover:shadow-lg transition-all cursor-pointer"
          v-for="Operator in Operators"
          :class="{
            'bg-red-500': Operator === filters.Operator
          }"
        >{{ Operator }}</div>
        <button @click="filters.Operator = null">Reset</button>
      </div>
    </div>
    <div class="space-y-2">
      <h2 class="text-xl font-medium">Packages</h2>
      <div class="flex gap-4 flex-wrap">
        <div
          @click="filters.Package = Package"
          class="text-lg font-bold shadow-md px-8 py-4 rounded-lg bg-gray-600 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
          v-for="Package in Packages"
          :class="{
            'bg-red-500': Package === filters.Package
          }"
        >{{ Package }}</div>
        <button @click="filters.Package = null">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { PropType } from 'vue';
import { Row } from '@/types';
const props = defineProps({
  items: {
    type: Array as PropType<Row[]>,
    default: () => [],
  },
  filters: {
    type: Object as any,
  }
})

const Operators = computed(() => {
  let results = new Set();
  let items = props.items
  for (let index = 0; index < items.length; index++) {
    results.add(items[index]["Operator"])
  }
  return results
})

const Packages = computed(() => {
  let results = new Set();
  let items = props.items
  for (let index = 0; index < items.length; index++) {
    results.add(items[index]["Package"])
  }
  return results
})
</script> 