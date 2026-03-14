<script setup lang="ts">
const { operators } = useMobilePlans()

useSeoMeta({
  title: 'Service Providers — The Data Report',
  description: 'Analysis of the main mobile network operators in Mauritius: my.t, Emtel, and CHILI.',
})
</script>

<template>
  <main class="content">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Service <span class="italic">Providers</span></h1>
        <p class="page-subtitle">A directory of the primary telecommunication entities operating in the Mauritian market.</p>
      </div>
    </header>

    <div class="operator-list">
      <div
        v-for="op in operators"
        :key="op.slug"
        class="operator-section"
        :style="{ '--c': op.color }"
      >
        <div class="op-sidebar">
          <span class="op-slug">{{ op.slug }}</span>
          <div class="op-color-bar"></div>
        </div>
        
        <div class="op-content">
          <header class="op-header">
            <h2 class="op-name">{{ op.name }}</h2>
            <span class="op-fullname">{{ op.fullName }}</span>
          </header>
          
          <p class="op-description">{{ op.description }}</p>
          
          <footer class="op-footer">
            <a :href="op.website" target="_blank" rel="noopener noreferrer" class="op-link">
              Operator Pricing Reference &rarr;
            </a>
          </footer>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Content Area */
.content {
  max-width: 1000px;
  padding: 80px 60px;
}

.page-header {
  margin-bottom: 80px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 24px;
}

.page-title {
  font-family: var(--font-serif);
  font-size: 48px;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.page-title .italic { font-style: italic; }

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.operator-list {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.operator-section {
  display: flex;
  gap: 40px;
}

.op-sidebar {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.op-slug {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.op-color-bar {
  height: 4px;
  width: 100%;
  background: var(--c);
}

.op-content {
  flex: 1;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
}

.op-header {
  margin-bottom: 24px;
}

.op-name {
  font-family: var(--font-serif);
  font-size: 32px;
  line-height: 1;
  margin-bottom: 4px;
}

.op-fullname {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.op-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 32px;
}

.op-link {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-color: var(--border-subtle);
  transition: all 0.2s;
}

.op-link:hover {
  text-decoration-color: var(--c);
}

@media (max-width: 900px) {
  .content { padding: 40px 24px; }
}

@media (max-width: 768px) {
  .page-title { font-size: 36px; }
  .operator-section { flex-direction: column; gap: 20px; }
  .op-sidebar { width: 100%; }
  .op-description { font-size: 16px; }
  .operator-list { gap: 60px; }
}
</style>
