<script setup lang="ts">
import { plans, operators, type MobilePlan } from '~/data/plans'

const { formatPrice, formatVolume, formatDuration, formatCostPerGb, costPerGb, costPerDay } = useMobilePlans()

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
    <!-- Overall Winner -->
    <div class="bento">
      <div class="bento-winner">
        <div class="winner-label">Overall Best Plan</div>
        <div class="winner-content">
          <div class="winner-header">
            <span class="operator-badge large" :style="{ '--c': operatorColor(overallWinner.operatorSlug) }">
              {{ overallWinner.operator }}
            </span>
            <span class="winner-plan-name">{{ overallWinner.name }}</span>
          </div>
          <div class="winner-price">{{ formatPrice(overallWinner.priceMur) }}</div>
          <div class="winner-stats">
            <div class="winner-stat">
              <span class="winner-stat-value">{{ formatVolume(overallWinner) }}</span>
              <span class="winner-stat-label">Data</span>
            </div>
            <div class="winner-stat">
              <span class="winner-stat-value">{{ formatDuration(overallWinner.durationDays) }}</span>
              <span class="winner-stat-label">Validity</span>
            </div>
            <div class="winner-stat">
              <span class="winner-stat-value">{{ formatCostPerGb(overallWinner) }}</span>
              <span class="winner-stat-label">per GB</span>
            </div>
          </div>
          <p class="winner-reason">
            Best balance of price, data volume, and value per GB across all operators.
          </p>
        </div>
      </div>

      <!-- Best Value per GB -->
      <div class="bento-card">
        <h2 class="card-title">Best Value per GB</h2>
        <p class="card-subtitle">Lowest cost per gigabyte</p>
        <div class="card-plans">
          <div v-for="(plan, i) in bestValuePerGb" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatCostPerGb(plan) }}/GB</strong>
              <span class="plan-detail">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Monthly -->
      <div class="bento-card">
        <h2 class="card-title">Best Monthly Plans</h2>
        <p class="card-subtitle">Top 30-day packs (10 GB+)</p>
        <div class="card-plans">
          <div v-for="(plan, i) in bestMonthly" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatPrice(plan.priceMur) }}</strong>
              <span class="plan-detail">{{ formatVolume(plan) }} &middot; {{ formatCostPerGb(plan) }}/GB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Daily -->
      <div class="bento-card">
        <h2 class="card-title">Best Daily Plans</h2>
        <p class="card-subtitle">For casual day-to-day use</p>
        <div class="card-plans">
          <div v-for="(plan, i) in bestDaily" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatPrice(plan.priceMur) }}</strong>
              <span class="plan-detail">{{ formatVolume(plan) }} &middot; 1 day</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cheapest -->
      <div class="bento-card">
        <h2 class="card-title">Cheapest Plans</h2>
        <p class="card-subtitle">Lowest absolute price (1 GB+)</p>
        <div class="card-plans">
          <div v-for="(plan, i) in cheapestPlans" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatPrice(plan.priceMur) }}</strong>
              <span class="plan-detail">{{ formatVolume(plan) }} &middot; {{ formatDuration(plan.durationDays) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Data -->
      <div class="bento-card">
        <h2 class="card-title">Most Data</h2>
        <p class="card-subtitle">For heavy data users</p>
        <div class="card-plans">
          <div v-for="(plan, i) in bestHeavyUsers" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatVolume(plan) }}</strong>
              <span class="plan-detail">{{ formatPrice(plan.priceMur) }} &middot; {{ formatDuration(plan.durationDays) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Long-term -->
      <div class="bento-card">
        <h2 class="card-title">Best Long-term</h2>
        <p class="card-subtitle">60+ day bulk plans</p>
        <div class="card-plans">
          <div v-for="(plan, i) in bestLongTerm" :key="plan.id" class="plan-row">
            <span class="rank" :class="`rank-${i + 1}`">{{ i + 1 }}</span>
            <div class="plan-info">
              <span class="operator-badge small" :style="{ '--c': operatorColor(plan.operatorSlug) }">{{ plan.operator }}</span>
              <span class="plan-label">{{ plan.name }}</span>
            </div>
            <div class="plan-meta">
              <strong>{{ formatCostPerGb(plan) }}/GB</strong>
              <span class="plan-detail">{{ formatVolume(plan) }} &middot; {{ formatPrice(plan.priceMur) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-row">
      <NuxtLink to="/compare" class="cta-link">
        View all 27 plans in the full comparison table
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 24px 48px;
}

.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* Winner card spans full width */
.bento-winner {
  grid-column: 1 / -1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
}

.bento-winner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #eab308, #f59e0b);
}

.winner-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f59e0b;
  margin-bottom: 16px;
}

.winner-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.winner-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.winner-plan-name {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.winner-price {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.winner-stats {
  display: flex;
  gap: 32px;
  margin-top: 4px;
}

.winner-stat {
  display: flex;
  flex-direction: column;
}

.winner-stat-value {
  font-size: 16px;
  font-weight: 600;
}

.winner-stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.winner-reason {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Category cards */
.bento-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 2px;
}

.card-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.card-plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.rank {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--bg);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.rank-1 {
  background: #fef3c7;
  color: #92400e;
  border-color: #fbbf24;
}

html.dark .rank-1 {
  background: #422006;
  color: #fbbf24;
  border-color: #92400e;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.plan-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.plan-meta {
  margin-left: auto;
  text-align: right;
  flex-shrink: 0;
}

.plan-meta strong {
  display: block;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.plan-detail {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Badges */
.operator-badge {
  display: inline-block;
  font-weight: 600;
  border-radius: 4px;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  white-space: nowrap;
}

.operator-badge.large {
  padding: 3px 10px;
  font-size: 13px;
}

.operator-badge.small {
  padding: 1px 6px;
  font-size: 11px;
}

/* CTA */
.cta-row {
  margin-top: 24px;
  text-align: center;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  transition: all 0.15s;
}

.cta-link:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

@media (max-width: 900px) {
  .bento {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .bento {
    grid-template-columns: 1fr;
  }

  .winner-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  .winner-price {
    font-size: 28px;
  }
}
</style>
