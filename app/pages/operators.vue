<script setup lang="ts">
const { operators } = useMobilePlans()

useSeoMeta({
  title: 'Operators - Mauritius Internet Prices',
  description: 'Learn about mobile operators in Mauritius: my.t (Mauritius Telecom), Emtel, and CHILI (MTML).',
})
</script>

<template>
  <main class="main">
    <header class="hero">
      <h1 class="hero-title">Mobile Operators</h1>
      <p class="hero-subtitle">
        The three main telecommunication providers in Mauritius, offering a wide range of prepaid mobile data services.
      </p>
    </header>

    <div class="operator-grid">
      <a
        v-for="op in operators"
        :key="op.slug"
        :href="op.website"
        target="_blank"
        rel="noopener noreferrer"
        class="operator-card"
        :style="{ '--c': op.color }"
      >
        <div class="card-header">
          <span class="operator-name">{{ op.name }}</span>
          <div class="external-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3h7m0 0v7m0-7L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <h2 class="full-name">{{ op.fullName }}</h2>
        <p class="description">{{ op.description }}</p>
        <div class="visit-link">Visit Website</div>
      </a>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
}

.hero {
  text-align: center;
  margin-bottom: 64px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.operator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.operator-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.operator-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--c);
  opacity: 0.6;
}

.operator-card:hover {
  transform: translateY(-4px);
  border-color: var(--c);
  box-shadow: 0 20px 40px -20px color-mix(in srgb, var(--c) 20%, transparent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operator-name {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c);
}

.external-icon {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.operator-card:hover .external-icon {
  transform: translate(2px, -2px);
  color: var(--c);
}

.full-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}

.description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.visit-link {
  margin-top: auto;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.visit-link::after {
  content: ' \2192';
  transition: transform 0.2s;
}

.operator-card:hover .visit-link::after {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .operator-grid {
    grid-template-columns: 1fr;
  }
  
  .operator-card {
    padding: 32px;
  }
}
</style>
