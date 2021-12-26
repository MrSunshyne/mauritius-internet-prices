<template>
  <div v-if="rows" class="w-full">
    <!-- <div class="prose">
      <pre>{{ columns }}</pre>
      <pre>{{ rows }}</pre>
    </div>-->
    <vue-good-table
      v-if="rows && Object.keys(rows).length > 0"
      theme="tailwindcss"
      :columns="columns"
      :rows="rows"
      :pagination-options="paginationOptions"
      :search-options="searchOptions"
      styleClass="vgt-table striped w-full"
    ></vue-good-table>
  </div>
</template>

<script lang="ts" setup>
import VueGoodTable from '@/components/vue3-good-table/Table.vue';

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
})

// Format Columns
let columns = computed(() => {
  // if (!headers) return []
  return props.headers.map(header => ({
    label: header,
    field: header,
  }))
})

const searchOptions = {
  enabled: true,
  placeholder: 'Search ',
}

const paginationOptions = {
  enabled: true,
  perPage: 50,
  position: 'bottom',
} 
</script>