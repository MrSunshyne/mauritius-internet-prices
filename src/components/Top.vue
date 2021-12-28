<template>
  <div
    class="relative space-y-8 bg-gray-900 backdrop-blur-lg bg-opacity-50 rounded-lg shadow-lg p-8"
  >
    <div class="text-2xl font-bold">Top {{ sortBy }}</div>
    <div class="text-lg flex flex-col gap-4">
      <div v-for="row in sortedData" class="grid grid-cols-3 bg-gray-500 bg-opacity-10 rounded-md">
        <div>{{ row.Operator }}</div>
        <div>{{ row.Package }}</div>
        <div>{{ getProperty(row, props.sortBy) }} {{ props.unit }}</div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { PropType } from 'vue';
import { Row } from '@/types';

const props = defineProps({
  items: {
    type: Array as PropType<Row[]>,
    default: () => [],
  },
  sortBy: {
    type: String,
    default: 'Cost per GB'
  },
  count: {
    type: Number,
    default: 5
  },
  unit: {
    type: String,
    default: ''
  }
})

const sortedData = computed(() => {
  const data = [...props.items]
  data.sort((a, b) => {
    if (parseInt(a[props.sortBy]) < parseInt(b[props.sortBy])) {
      return -1
    }
    if (parseInt(a[props.sortBy]) > parseInt(b[props.sortBy])) {
      return 1
    }
    return 0
  })
  return data.splice(0, props.count)
})

function getProperty(row: Row, property: string) {
  return row[property]
}

</script>   