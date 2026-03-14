<script setup lang="ts">
import { plans, operators, type MobilePlan } from '~/data/plans'

const { formatPrice, formatVolume, formatDuration, formatCostPerGb, costPerGb, costPerDay } = useMobilePlans()

const hoveredPlanId = ref<string | number | null>(null)

function setHover(id: string | number | null) {
  hoveredPlanId.value = id
}

function operatorColor(slug: string): string {
  return operators.find(op => op.slug === slug)?.color ?? '#888'
}

// Only consider plans with measurable volume for ranked categories
const measurablePlans = plans.filter(p => p.volumeGb !== null && p.volumeGb > 0)

// Best Value per GB — lowest cost per GB (exclude tiny packs < 1 GB)
const bestValuePerGb = [...measurablePlans]
  .filter(p => p.volumeGb! >= 1)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

// Best Daily Plans — daily packs sorted by value (cost per GB for measurable, then price)
const bestDaily = [...plans]
  .filter(p => p.durationDays <= 1)
  .sort((a, b) => {
    const aGb = costPerGb(a)
    const bGb = costPerGb(b)
    if (aGb !== null && bGb !== null) return aGb - bGb
    if (aGb !== null) return -1
    if (bGb !== null) return 1
    return a.priceMur - b.priceMur
  })
  .slice(0, 3)

// Best Monthly Plans — monthly packs (30 days) sorted by cost per GB
const bestMonthly = [...measurablePlans]
  .filter(p => p.durationDays === 30 && p.volumeGb! >= 10)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

// Best for Heavy Users — most total data volume
const bestHeavyUsers = [...measurablePlans]
  .sort((a, b) => b.volumeGb! - a.volumeGb!)
  .slice(0, 3)

// Cheapest Plans — lowest absolute price
const cheapestPlans = [...plans]
  .filter(p => p.volumeGb === null || p.volumeGb >= 1)
  .sort((a, b) => a.priceMur - b.priceMur)
  .slice(0, 3)

// Best Long-term — 60+ day plans by cost per GB
const bestLongTerm = [...measurablePlans]
  .filter(p => p.durationDays >= 60)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

// Overall Winner — best monthly plan that balances value, volume, and flexibility
// Score: weighted combination of cost/GB (lower is better), volume (higher is better), duration sweet spot (30 days ideal)
const overallWinner = [...measurablePlans]
  .filter(p => p.volumeGb! >= 50 && p.durationDays >= 7)
  .sort((a, b) => {
    const aCpg = costPerGb(a) ?? Infinity
    const bCpg = costPerGb(b) ?? Infinity
    // Prefer lower cost/GB, tiebreak by higher volume
    if (Math.abs(aCpg - bCpg) > 0.2) return aCpg - bCpg
    return b.volumeGb! - a.volumeGb!
  })[0]

useSeoMeta({
  title: 'Mauritius Internet Prices - Best Prepaid Mobile Data Plans',
  description: 'Find the best prepaid mobile data plans in Mauritius. Compare my.t, Emtel, and CHILI side by side.',
})
</script>

<template>
  <main class="main">
    <header class="summary">
      <div class="summary-tag">Data last verified March 2026</div>
      <h1 class="summary-title">Mobile Data Comparison</h1>
      <p class="summary-desc">
        A factual comparison of <strong>{{ plans.length }}</strong> prepaid mobile data plans from all major Mauritian operators.
      </p>
    </header>

    <div class="bento">
      <!-- Top Value Recommendation -->
      <section 
        class="bento-highlight"
        :class="{ 'is-hovered': hoveredPlanId === overallWinner.id }"
        @mouseenter="setHover(overallWinner.id)"
        @mouseleave="setHover(null)"
      >
        <div class="highlight-header">
          <div class="highlight-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Top Value Plan
          </div>
          <span class="operator-tag" :style="{ '--c': operatorColor(overallWinner.operatorSlug) }">
            {{ overallWinner.operator }}
          </span>
        </div>
        
        <div class="highlight-main">
          <div class="highlight-info">
            <h2 class="plan-name-large">{{ overallWinner.name }}</h2>
            <div class="plan-price-large">{{ formatPrice(overallWinner.priceMur) }}</div>
          </div>
          
          <div class="highlight-stats">
            <div class="stat-box">
              <span class="stat-value">{{ formatVolume(overallWinner) }}</span>
              <span class="stat-label">Total Data</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">{{ formatDuration(overallWinner.durationDays) }}</span>
              <span class="stat-label">Validity</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">{{ formatCostPerGb(overallWinner) }}</span>
              <span class="stat-label">Cost per GB</span>
            </div>
          </div>
        </div>
        
        <p class="data-reason">
          Ranked #1 based on cost per gigabyte (MUR {{ costPerGb(overallWinner)?.toFixed(2) }}/GB) for plans with at least 30 days validity.
        </p>
      </section>

      <!-- Best Value per GB -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">Value Leaders</h3>
          <p class="card-desc">Lowest cost per GB</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in bestValuePerGb" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatCostPerGb(plan) }}/GB</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Best Monthly -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">30-Day Packs</h3>
          <p class="card-desc">Ranked by volume/price</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in bestMonthly" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatPrice(plan.priceMur) }}</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatVolume(plan) }} &middot; {{ formatCostPerGb(plan) }}/GB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Most Data -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">High Volume</h3>
          <p class="card-desc">Largest data allowance</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in bestHeavyUsers" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatVolume(plan) }}</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatPrice(plan.priceMur) }} &middot; {{ formatDuration(plan.durationDays) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Best Daily -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">Short Term</h3>
          <p class="card-desc">Daily data packages</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in bestDaily" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatPrice(plan.priceMur) }}</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatVolume(plan) }} &middot; 1 day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cheapest -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">Budget Entry</h3>
          <p class="card-desc">Lowest absolute price</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in cheapestPlans" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatPrice(plan.priceMur) }}</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatVolume(plan) }} &middot; {{ formatDuration(plan.durationDays) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Best Long-term -->
      <section class="bento-card">
        <div class="card-header">
          <h3 class="card-title">Long-term Bulk</h3>
          <p class="card-desc">60+ days validity</p>
        </div>
        <div class="plan-list">
          <div 
            v-for="(plan, i) in bestLongTerm" 
            :key="plan.id" 
            class="plan-item"
            :class="{ 'is-hovered': hoveredPlanId === plan.id }"
            @mouseenter="setHover(plan.id)"
            @mouseleave="setHover(null)"
          >
            <div class="plan-rank">{{ i + 1 }}</div>
            <div class="plan-body">
              <div class="plan-top">
                <span class="plan-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
                <span class="plan-val">{{ formatCostPerGb(plan) }}/GB</span>
              </div>
              <div class="plan-bottom">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-meta">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="cta-section">
      <NuxtLink to="/compare" class="cta-button">
        View All {{ plans.length }} Comparative Data
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
}

/* Summary Section */
.summary {
  text-align: center;
  margin-bottom: 64px;
}

.summary-tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--accent-soft);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.summary-title {
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
}

.summary-desc {
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Bento Grid */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Highlight Card */
.bento-highlight {
  grid-column: 1 / -1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-highlight.is-hovered {
  border-color: var(--text);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.highlight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.highlight-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--text);
  color: var(--bg);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.operator-tag {
  font-weight: 700;
  color: var(--c);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.highlight-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
  flex-wrap: wrap;
}

.plan-name-large {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.plan-price-large {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--text);
}

.highlight-stats {
  display: flex;
  gap: 32px 48px;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 100px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.data-reason {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.6;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

/* Category Cards */
.bento-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px;
  margin: -8px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.plan-item.is-hovered {
  background: var(--accent-soft);
  box-shadow: 0 0 0 1px var(--border);
}

.plan-rank {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all 0.2s;
}

.plan-item.is-hovered .plan-rank {
  background: var(--text);
  color: var(--bg);
}

.plan-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-top, .plan-bottom {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.plan-op {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-val {
  font-size: 13px;
  font-weight: 700;
}

.plan-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.plan-meta {
  font-size: 10px;
  color: var(--text-muted);
}

/* CTA */
.cta-section {
  margin-top: 48px;
  text-align: center;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--text);
  color: var(--bg);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.cta-button:hover {
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .bento { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .main { padding: 48px 20px; }
  .summary-title { font-size: 36px; }
  .bento { grid-template-columns: 1fr; }
  .bento-highlight { padding: 24px; }
  .plan-price-large { font-size: 48px; }
  .highlight-stats { gap: 24px; width: 100%; }
  .stat-value { font-size: 18px; }
}
</style>
