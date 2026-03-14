<script setup lang="ts">
const { operators } = useMobilePlans()

useSeoMeta({
  title: 'Operators - Mauritius Internet Prices',
  description: 'Learn about mobile operators in Mauritius: my.t (Mauritius Telecom), Emtel, and CHILI (MTML).',
})
</script>

<template>
  <main class="main">
    <div class="operators-section">
      <h2>About the Operators</h2>
      <div class="operator-cards">
        <a
          v-for="op in operators"
          :key="op.slug"
          :href="op.website"
          target="_blank"
          rel="noopener noreferrer"
          class="operator-card"
          :style="{ '--accent': op.color }"
        >
          <h3>{{ op.name }}</h3>
          <span class="operator-fullname">{{ op.fullName }}</span>
          <p>{{ op.description }}</p>
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.operators-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.operator-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.operator-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition: border-color 0.15s, box-shadow 0.15s;
  text-decoration: none;
  color: inherit;
}

.operator-card:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 15%, transparent);
}

.operator-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}

.operator-fullname {
  display: inline-block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.operator-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
