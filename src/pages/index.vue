<script setup lang="ts">

import useSheet from '@/logic/useGoogleSheet'
import TableComparison from '@/components/TableComparison.vue';

const API_KEY = 'AIzaSyClsialqDzA0V4_fuxURgwjTEaCxU788xs'
const SHEET_ID = '1i1_6IOA4wdm5Cl-hXRf46Dkwqz5bMcN3KdFcaGahbV0'
const { headers, items, loading } = useSheet(API_KEY, SHEET_ID);

const filters = reactive({
  Operator: null,
  Package: null
})

const filteredItems = computed(() => {
  let results = [...items]
  if (filters.Operator) {
    results = results.filter(item => item.Operator === filters.Operator)
  }
  if (filters.Package) {
    results = results.filter(item => item.Package === filters.Package)
  }


  return results

  // if (filters.operator !== '') {
  //   return items.filter(item => item.Operator === filters.operator)
  // }

  // return items
})

</script> 

<template>
  <pre v-if="loading && !items">loading...</pre>
  <template v-else>
    <!-- {{ headers }} -->
    <div class="md:grid grid-cols-2 gap-8 px-8 xl:px-0 py-8 w-full">
      <Top :items="items" unit="Rs" :sortBy="'Cost per GB'" :count="5" />
      <Top :items="items" unit="GB" :sortBy="'Volume (GB)'" :count="5" />
      <Top :items="items" unit="Rs" :sortBy="'Cost(Rs) per day'" :count="5" />

      <Filters class="col-span-2" v-model:filters="filters" :items="items" />
      <TableComparison class="col-span-2" :headers="headers" :rows="filteredItems" />
    </div>
  </template>
</template>   

<route lang="yaml">
meta: 
  layout: default
</route>
     