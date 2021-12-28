<template>
  <main class="app text-gray-100 pb-16 bg-gray-900 relative">
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 -left-4 w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-exclusion filter blur-xl opacity-30 animate-blob"
      ></div>
      <div
        class="absolute top-0 left-[300px] w-[500px] h-[500px] bg-green-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute top-[300px] left-[300px] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"
      ></div>
      <div
        class="absolute top-[300px] left-20 w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"
      ></div>
    </div>
    <SiteHeader />

    <div class="container mx-auto relative">
      <router-view />
    </div>
    <Footer />
  </main>
</template>

<style>
.app {
  background-color: #000000;
  opacity: 1;
  background-image: linear-gradient(#141414 2px, transparent 2px),
    linear-gradient(90deg, #141414 2px, transparent 2px),
    linear-gradient(#141414 1px, transparent 1px),
    linear-gradient(90deg, #141414 1px, #000000 1px);
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
}
</style> 