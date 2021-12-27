<script setup lang="ts">

import useSheet from '@/logic/useGoogleSheet'
import TableComparison from '@/components/TableComparison.vue';
import Operators from '@/components/Operators.vue';
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue';
const API_KEY = 'AIzaSyClsialqDzA0V4_fuxURgwjTEaCxU788xs'
const SHEET_ID = '1i1_6IOA4wdm5Cl-hXRf46Dkwqz5bMcN3KdFcaGahbV0'
const { headers, items, loading } = useSheet(API_KEY, SHEET_ID);


</script> 

<template>
  <pre v-if="loading && !items">loading...</pre>
  <div v-else>
    <!-- {{ headers }} -->
    <div class="flex flex-col gap-8 py-8">
      <Operators :items="items" />
      <TableComparison :headers="headers" :rows="items"></TableComparison>
      <FrequentlyAskedQuestions />
    </div>
  </div>
</template>   

<route lang="yaml">
meta:
  layout: default
</route>
