<script setup lang="ts">

import useSheet from '@/logic/useGoogleSheet'
import TableComparison from '@/components/TableComparison.vue';
const API_KEY = 'AIzaSyClsialqDzA0V4_fuxURgwjTEaCxU788xs'
const SHEET_ID = '1i1_6IOA4wdm5Cl-hXRf46Dkwqz5bMcN3KdFcaGahbV0'
const { headers, items, loading } = useSheet(API_KEY, SHEET_ID);


</script> 

<template>
  <pre v-if="loading && !items">loading...</pre>
  <div v-else>
    <!-- {{ headers }} -->
    <TableComparison :headers="headers" :rows="items"></TableComparison>
  </div>
</template>   

<route lang="yaml">
meta:
  layout: default
</route>
