<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <header class="bg-gray-800 relative z-100 bg-opacity-70">
    <nav class="container mx-auto" aria-label="Top">
      <div
        class="w-full py-6 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between border-b border-gray-500 gap-4 lg:border-none"
      >
        <div class="flex items-center">
          <router-link :to="{ name: 'index' }" class="text-2xl text-white">Mauritius Internet Prices</router-link>
          <div class="hidden ml-10 space-x-8 lg:block">
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.route"
              class="text-base font-medium text-white hover:text-gray-50"
            >{{ link.name }}</router-link>
          </div>
        </div>
        <div class="space-x-4 flex items-center">
          <!-- <button
            class="icon-btn mx-2 !outline-none text-white"
            title="button.toggle_dark"
            @click="toggleDark()"
          >
            <carbon-moon v-if="isDark" />
            <carbon-sun v-else />
          </button>-->

          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1i1_6IOA4wdm5Cl-hXRf46Dkwqz5bMcN3KdFcaGahbV0/edit#gid=0"
            class="inline-block bg-gray-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
          >Data Source</a>
          <a
            target="_blank"
            href="https://github.com/MrSunshyne/mauritius-internet-prices"
            class="inline-block bg-gray-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
          >Work In Progress. Contribute?</a>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        <a
          v-for="link in navigation"
          :key="link.name"
          :href="link.href"
          class="text-base font-medium text-white hover:text-gray-50"
        >{{ link.name }}</a>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
// import { isDark, toggleDark } from '@/logic'

const navigation = [
  { name: 'FAQ', route: { name: 'faq' } },
  // { name: 'Pricing', href: '#' },
  // { name: 'Docs', href: '#' },
  // { name: 'Company', href: '#' },
]


</script>