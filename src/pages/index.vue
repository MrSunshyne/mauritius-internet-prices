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
  <div v-else>
    <!-- {{ headers }} -->
    <div class="grid md:grid-cols-2 gap-8 py-8 relative">
      <Top :items="items" unit="Rs" :sortBy="'Cost per GB'" :count="5" />
      <Top :items="items" unit="GB" :sortBy="'Volume (GB)'" :count="5" />
      <Top :items="items" unit="Rs" :sortBy="'Cost(Rs) per day'" :count="5" />
      <Filters class="col-span-2" v-model:filters="filters" :items="items" />
      <TableComparison class="col-span-2" :headers="headers" :rows="filteredItems" />
    </div>
  </div>
</template>   

<route lang="yaml">
meta: 
  layout: default
</route>
    