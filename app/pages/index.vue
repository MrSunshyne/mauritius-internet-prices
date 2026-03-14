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

// Data Logic
const measurablePlans = plans.filter(p => p.volumeGb !== null && p.volumeGb > 0)

const bestValuePerGb = [...measurablePlans]
  .filter(p => p.volumeGb! >= 1)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

const bestDaily = [...plans]
  .filter(p => p.durationDays <= 1)
  .sort((a, b) => {
    const aGb = costPerGb(a); const bGb = costPerGb(b)
    if (aGb !== null && bGb !== null) return aGb - bGb
    if (aGb !== null) return -1
    if (bGb !== null) return 1
    return a.priceMur - b.priceMur
  })
  .slice(0, 3)

const bestMonthly = [...measurablePlans]
  .filter(p => p.durationDays === 30 && p.volumeGb! >= 10)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

const bestHeavyUsers = [...measurablePlans]
  .sort((a, b) => b.volumeGb! - a.volumeGb!)
  .slice(0, 3)

const cheapestPlans = [...plans]
  .filter(p => p.volumeGb === null || p.volumeGb >= 1)
  .sort((a, b) => a.priceMur - b.priceMur)
  .slice(0, 3)

const bestLongTerm = [...measurablePlans]
  .filter(p => p.durationDays >= 60)
  .sort((a, b) => (costPerGb(a) ?? Infinity) - (costPerGb(b) ?? Infinity))
  .slice(0, 3)

const overallWinner = [...measurablePlans]
  .filter(p => p.volumeGb! >= 50 && p.durationDays >= 7)
  .sort((a, b) => {
    const aCpg = costPerGb(a) ?? Infinity
    const bCpg = costPerGb(b) ?? Infinity
    if (Math.abs(aCpg - bCpg) > 0.2) return aCpg - bCpg
    return b.volumeGb! - a.volumeGb!
  })[0]

// Rotating Stats Logic
const activeStatIndex = ref(0)
const stats = [
  { label: 'Average Cost per GB', value: 'Rs 4.50' },
  { label: 'Cheapest Entry', value: 'Rs 5.00' },
  { label: 'Market Cap (Data)', value: '1.0 TB' },
  { label: 'Active Data Plans', value: plans.length.toString() }
]

onMounted(() => {
  setInterval(() => {
    activeStatIndex.value = (activeStatIndex.value + 1) % stats.length
  }, 4000)
})

useSeoMeta({
  title: 'Mauritius Internet Prices — The Data Report',
  description: 'A comprehensive analysis and comparison of prepaid mobile data plans in Mauritius.',
})
</script>

<template>
  <main class="content">
    <header class="editorial-header">
      <h1 class="big-title">The State of <span class="italic">Mobile Data</span> in Mauritius.</h1>
      <div class="header-meta">
        <p class="abstract">
          A comprehensive analysis of {{ plans.length }} prepaid packages across my.t, Emtel, and Chili. 
          Objectively ranked for value, volume, and longevity.
        </p>
        <div class="current-stat">
          <Transition name="slide-up" mode="out-in">
            <div :key="activeStatIndex" class="stat-inner">
              <span class="stat-label">{{ stats[activeStatIndex].label }}</span>
              <span class="stat-big">{{ stats[activeStatIndex].value }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <section class="feature-story">
      <div class="feature-label">Top Value Plan</div>
      <div class="feature-grid" :class="{ 'is-active': hoveredPlanId === overallWinner.id }" @mouseenter="setHover(overallWinner.id)" @mouseleave="setHover(null)">
        <div class="feature-main">
          <span class="op-label" :style="{ color: operatorColor(overallWinner.operatorSlug) }">{{ overallWinner.operator }}</span>
          <h2 class="feature-name">{{ overallWinner.name }}</h2>
          <div class="feature-price">{{ formatPrice(overallWinner.priceMur) }}</div>
        </div>
        <div class="feature-details">
          <div class="detail-row">
            <span class="d-label">Volume</span>
            <span class="d-value">{{ formatVolume(overallWinner) }}</span>
          </div>
          <div class="detail-row">
            <span class="d-label">Duration</span>
            <span class="d-value">{{ formatDuration(overallWinner.durationDays) }}</span>
          </div>
          <div class="detail-row">
            <span class="d-label">Value</span>
            <span class="d-value">{{ formatCostPerGb(overallWinner) }}/GB</span>
          </div>
          <p class="feature-reason">
            Ranked #1 based on cost per gigabyte (MUR {{ costPerGb(overallWinner)?.toFixed(2) }}/GB) for plans with at least 30 days validity.
          </p>
        </div>
      </div>
    </section>

    <section class="analytical-grid">
      <!-- 1. Value Leaders -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">Value Leaders</h3>
          <p class="box-desc">Lowest cost per gigabyte.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in bestValuePerGb" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatCostPerGb(plan) }}/GB</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</div>
          </div>
        </div>
      </div>

      <!-- 2. 30-Day Packs -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">30-Day Packs</h3>
          <p class="box-desc">Top performers for monthly validity.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in bestMonthly" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatPrice(plan.priceMur) }}</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatVolume(plan) }} &middot; {{ formatCostPerGb(plan) }}/GB</div>
          </div>
        </div>
      </div>

      <!-- 3. Short Term -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">Short Term</h3>
          <p class="box-desc">Efficiency for 24h access needs.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in bestDaily" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatPrice(plan.priceMur) }}</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatVolume(plan) }} &middot; 24h</div>
          </div>
        </div>
      </div>

      <!-- 4. High Volume -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">High Volume</h3>
          <p class="box-desc">Maximum data allowance.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in bestHeavyUsers" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatVolume(plan) }}</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatPrice(plan.priceMur) }} &middot; {{ formatDuration(plan.durationDays) }}</div>
          </div>
        </div>
      </div>

      <!-- 5. Budget Entry -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">Budget Entry</h3>
          <p class="box-desc">Lowest barrier to entry.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in cheapestPlans" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatPrice(plan.priceMur) }}</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatVolume(plan) }} &middot; {{ formatDuration(plan.durationDays) }}</div>
          </div>
        </div>
      </div>

      <!-- 6. Long Term -->
      <div class="data-box">
        <div class="box-header">
          <h3 class="box-title">Long-term Bulk</h3>
          <p class="box-desc">Analysis of extended validity.</p>
        </div>
        <div class="plan-list">
          <div v-for="plan in bestLongTerm" :key="plan.id" class="box-item" :class="{ 'is-hovered': hoveredPlanId === plan.id }" @mouseenter="setHover(plan.id)" @mouseleave="setHover(null)">
            <div class="item-top">
              <span class="item-op" :style="{ color: operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="item-val">{{ formatCostPerGb(plan) }}/GB</span>
            </div>
            <div class="item-name">{{ plan.name }}</div>
            <div class="item-meta">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="editorial-footer">
      <NuxtLink to="/compare" class="read-more">
        Read the full comparison table ({{ plans.length }} plans) &rarr;
      </NuxtLink>
    </footer>
  </main>
</template>

<style scoped>
/* Content Area */
.content {
  max-width: 1200px;
  padding: 80px 60px;
}

.editorial-header {
  margin-bottom: 80px;
}

.big-title {
  font-family: var(--font-serif);
  font-size: clamp(48px, 10vw, 100px);
  line-height: 0.9;
  font-weight: 400;
  letter-spacing: -0.05em;
  margin-bottom: 40px;
}

.italic { font-style: italic; }

.header-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
  border-top: 1px solid var(--border);
  padding-top: 24px;
  flex-wrap: wrap;
}

.abstract {
  flex: 1;
  max-width: 500px;
  font-size: 18px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.current-stat {
  min-height: 80px;
  display: flex;
  align-items: flex-end;
  text-align: right;
}

.stat-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stat-big {
  display: block;
  font-size: clamp(32px, 8vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Feature Story */
.feature-story {
  margin-bottom: 100px;
}

.feature-label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  border-bottom: 2px solid var(--border);
  display: inline-block;
  margin-bottom: 24px;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 60px;
  padding: 60px;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-grid.is-active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
  transform: scale(1.02);
}

.op-label {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  display: block;
}

.feature-name {
  font-family: var(--font-serif);
  font-size: 42px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.feature-price {
  font-size: 80px;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.feature-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 8px;
}
.is-active .detail-row { border-color: rgba(255,255,255,0.1); }
html.dark .is-active .detail-row { border-color: rgba(0,0,0,0.1); }

.d-label { font-size: 12px; font-weight: 700; text-transform: uppercase; }
.d-value { font-weight: 800; }

.feature-reason {
  font-size: 14px;
  line-height: 1.6;
  margin-top: auto;
}

/* Analytical Grid */
.analytical-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 100px;
}

.data-box {
  background: var(--surface-raised);
  padding: 40px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.data-box:nth-child(even) {
  background: var(--surface);
}

.data-box:hover {
  transform: translateY(-4px);
}

.box-header {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}

.box-title {
  font-family: var(--font-serif);
  font-size: 24px;
  line-height: 1;
  margin-bottom: 8px;
}

.box-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.box-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.box-item:last-child {
  border-bottom: none;
}

.box-item.is-hovered {
  background: var(--accent-soft);
  padding-left: 12px;
  margin-left: -12px;
  margin-right: -12px;
  padding-right: 12px;
}

/* Box Item Content */
.item-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  align-items: baseline;
}

.item-op {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-val {
  font-size: 16px;
  font-weight: 800;
}

.item-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.item-meta {
  font-size: 12px;
  color: var(--text-muted);
}

/* Footer */
.editorial-footer {
  text-align: center;
  border-top: 1px solid var(--border);
  padding-top: 40px;
}

.read-more {
  font-family: var(--font-serif);
  font-size: 24px;
  font-style: italic;
  color: var(--text);
}

@media (max-width: 1100px) {
  .analytical-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .content { padding: 40px 24px; }
}

@media (max-width: 768px) {
  .feature-grid { grid-template-columns: 1fr; padding: 32px; gap: 40px; }
  .feature-price { font-size: 60px; }
  .analytical-grid { grid-template-columns: 1fr; }
  
  .header-meta {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 32px;
  }
  
  .abstract {
    min-width: 100%;
    font-size: 16px;
    max-width: 100%;
  }
  
  .current-stat {
    border-top: 1px solid var(--border-subtle);
    padding-top: 24px;
    width: 100%;
    min-height: auto;
    justify-content: center;
    text-align: center;
  }

  .stat-inner {
    align-items: center;
  }
}
</style>
