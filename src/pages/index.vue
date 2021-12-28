<script setup lang="ts">

import useSheet from '@/logic/useGoogleSheet'
import TableComparison from '@/components/TableComparison.vue';
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue';
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
    <div class="flex flex-col gap-8 py-8">
      <Filters v-model:filters="filters" :items="items" />
      <TableComparison :headers="headers" :rows="filteredItems" />
      <FrequentlyAskedQuestions />
    </div>
  </div>
</template>   

<route lang="yaml">
meta: 
  layout: default
</route>
 