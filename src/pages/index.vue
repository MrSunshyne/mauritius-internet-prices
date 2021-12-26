<script setup lang="ts">

import useSheet from '@/logic/useGoogleSheet'
const API_KEY = 'AIzaSyClsialqDzA0V4_fuxURgwjTEaCxU788xs'
const SHEET_ID = '1i1_6IOA4wdm5Cl-hXRf46Dkwqz5bMcN3KdFcaGahbV0'
const { headers, items, loading } = useSheet(API_KEY, SHEET_ID);

</script>

<template>
  <div class="prose">
    <pre v-if="loading">loading...</pre>
    <div v-else>
      <pre>{{ headers }}</pre>
      <pre>{{ items }}</pre>
    </div>
  </div>
</template>   

<route lang="yaml">
meta:
  layout: default
</route>
