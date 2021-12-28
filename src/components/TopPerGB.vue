<template>
  <div>
    <div>Top Per GB</div>
    <div>
      <div v-for="row in sortedData">{{ row.Operator }} {{ row.Package }} {{ row["Cost per GB"] }}</div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { Prop, PropType } from 'vue';
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

</script>  