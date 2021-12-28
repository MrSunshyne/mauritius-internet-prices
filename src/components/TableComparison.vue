<template>
  <div v-if="rows && rows.length > 0" class="w-full">
    <div class="prose">
      <!-- <pre>{{ columns }}</pre> -->
      <!-- <pre>{{ rows }}</pre> -->
    </div>
    <vue-good-table
      v-if="rows && Object.keys(rows).length > 0"
      theme="tailwindcss"
      :columns="columns"
      :rows="rows"
      :pagination-options="paginationOptions"
      :search-options="searchOptions"
      styleClass="vgt-table striped w-full "
    >
      <template v-slot:table-row="props">
        <span v-if="props.column.field === 'Source'">
          <a target="_blank" :href="props.row.Source">View</a>
        </span>
      </template>
    </vue-good-table>
  </div>
  <div v-else>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="text-center flex flex-col items-center justify-center text-3xl">
      <carbon-moon />
      <h3 class="mt-2 font-medium text-gray-100">Nothing matches</h3>
      <p class="mt-1 text-gray-200">Try another filter?</p>
    </div>
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

let FieldsShouldBeNumberType = [
  "Duration(days)",
  "Volume (GB)",
  "Volume per day",
  "Cost(Rs)",
  "Cost(Rs) per day",
  "Cost per GB"];

// Format Columns
let columns = computed(() => {

  return props.headers.map(header => ({
    label: header,
    field: header,
    type: FieldsShouldBeNumberType.includes(header as string) ? 'number' : 'text',
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