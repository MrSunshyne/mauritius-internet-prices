<template>
  <div class="space-y-2">
    <h2 class="text-xl font-medium">Operators</h2>
    <div class="flex gap-8">
      <div
        class="text-2xl font-bold shadow-md px-8 py-4 rounded-lg bg-white hover:shadow-lg transition-all"
        v-for="operator in operators"
      >{{ operator }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">import { PropType } from 'vue';
interface Row {
  ["Package Name"]: string
  ["Provider"]: string
  ["Duration(days)"]: string
  ["Volume (GB)"]: string
  ["Volume per day"]: string
  ["Cost(Rs)"]: string
  ["Cost(Rs) per day"]: string
  ["Cost per GB"]: string
  ["Source"]: string
}

const props = defineProps({
  items: {
    type: Array as PropType<Row[]>,
    default: () => [],
  },
})

const operators = computed(() => {
  let results = new Set();
  let items = props.items
  for (let index = 0; index < items.length; index++) {
    results.add(items[index]["Provider"])
  }
  console.log(results);
  return results
})
</script>