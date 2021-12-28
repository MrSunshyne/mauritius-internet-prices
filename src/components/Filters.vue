<template>
  <div>
    <Operators v-model:filters="filters" :items="items" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Row } from '@/types';

defineProps({
  filters: {
    type: Object,
  },
  items: {
    type: Array as PropType<Row[]>,
    default: () => [],
  },
})
</script>