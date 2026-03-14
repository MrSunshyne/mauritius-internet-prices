<script setup lang="ts">
import type { SortField } from '~/composables/useMobilePlans'

const {
  selectedOperators,
  durationFilter,
  maxPrice,
  maxPriceLimit,
  hideUnlimited,
  sortField,
  sortDirection,
  filteredPlans,
  operators,
  formatPrice,
  formatVolume,
  formatCostPerGb,
  formatCostPerDay,
  formatVolumePerDay,
  formatDuration,
  toggleOperator,
  toggleSort,
  resetFilters,
} = useMobilePlans()

const showFilters = ref(true)
const showNotes = ref(false)

function operatorColor(slug: string): string {
  return operators.find(op => op.slug === slug)?.color ?? '#888'
}

function sortIcon(field: SortField): string {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? ' \u2191' : ' \u2193'
}

useSeoMeta({
  title: 'Mauritius Internet Prices - Prepaid Mobile Data Comparison',
  description: 'Compare prepaid mobile internet data pack prices from my.t, Emtel, and CHILI in Mauritius. Find the best value per GB.',
})
</script>

<template>
  <main class="main">
    <div class="header-section">
      <h1 class="page-title">Compare All Plans</h1>
      <button class="filter-toggle" @click="showFilters = !showFilters">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" />
        </svg>
        {{ showFilters ? 'Hide' : 'Show' }} Filters
      </button>
    </div>

    <div class="layout" :class="{ 'filters-hidden': !showFilters }">
      <aside v-show="showFilters" class="sidebar">
        <div class="filter-section">
          <h3>Operators</h3>
          <div class="operator-list">
            <label
              v-for="op in operators"
              :key="op.slug"
              class="operator-checkbox"
            >
              <input
                type="checkbox"
                :checked="selectedOperators.includes(op.slug)"
                @change="toggleOperator(op.slug)"
              >
              <span class="custom-checkbox" :style="{ '--c': op.color }"></span>
              <span>{{ op.name }}</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h3>Duration</h3>
          <div class="duration-grid">
            <button v-for="d in ['all', 'daily', 'weekly', 'monthly', 'long']" :key="d" :class="{ active: durationFilter === d }" @click="durationFilter = (d as any)">
              {{ d.charAt(0).toUpperCase() + d.slice(1) }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Max Price: <span class="range-value">Rs {{ maxPrice.toLocaleString() }}</span></h3>
          <input
            v-model.number="maxPrice"
            type="range"
            :min="0"
            :max="maxPriceLimit"
            :step="5"
            class="price-range"
          >
        </div>

        <div class="filter-section">
          <label class="toggle-row">
            <span>Hide unlimited</span>
            <input v-model="hideUnlimited" type="checkbox" class="ios-toggle">
          </label>
          <label class="toggle-row">
            <span>Show notes</span>
            <input v-model="showNotes" type="checkbox" class="ios-toggle">
          </label>
        </div>

        <button class="reset-btn" @click="resetFilters">
          Reset Filters
        </button>
      </aside>

      <section class="content">
        <div class="results-bar">
          <span class="results-count">{{ filteredPlans.length }} plans found</span>
          <div class="sort-chips">
            <span class="sort-label">Sort by:</span>
            <button v-for="s in ['price', 'volume', 'costPerGb', 'duration']" :key="s" :class="{ active: sortField === s }" @click="toggleSort(s as any)">
              {{ s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}{{ sortIcon(s as any) }}
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="plans-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Plan Name</th>
                <th class="num">Duration</th>
                <th class="num">Volume</th>
                <th class="num">Daily</th>
                <th class="num">Price</th>
                <th class="num">Rs/GB</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in filteredPlans" :key="plan.id">
                <td>
                  <span class="op-chip" :style="{ '--c': operatorColor(plan.operatorSlug) }">
                    {{ plan.operator }}
                  </span>
                </td>
                <td class="plan-cell">
                  <div class="plan-name">{{ plan.name }}</div>
                  <div v-if="showNotes && plan.notes" class="plan-notes">{{ plan.notes }}</div>
                </td>
                <td class="num">{{ formatDuration(plan.durationDays) }}</td>
                <td class="num font-mono">
                  <span v-if="plan.volumeGb === null" class="badge-unlimited">Unlimited</span>
                  <template v-else>{{ formatVolume(plan) }}</template>
                </td>
                <td class="num font-mono">
                  <span v-if="plan.dailyCap" class="badge-cap">{{ plan.dailyCap }} GB</span>
                  <template v-else>{{ formatVolumePerDay(plan) }}</template>
                </td>
                <td class="num price-val">{{ formatPrice(plan.priceMur) }}</td>
                <td class="num font-mono">{{ formatCostPerGb(plan) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          <div class="empty-icon">!</div>
          <p>No plans match your criteria.</p>
          <button @click="resetFilters">Clear all filters</button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}

.layout.filters-hidden {
  grid-template-columns: 1fr;
}

.sidebar {
  background: var(--surface-raised);
  border-radius: var(--radius-lg);
  padding: 24px;
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.filter-section h3 {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operator-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.operator-checkbox input {
  display: none;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
}

.operator-checkbox input:checked + .custom-checkbox {
  background: var(--c);
  border-color: var(--c);
}

.operator-checkbox input:checked + .custom-checkbox::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.duration-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.duration-grid button {
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  cursor: pointer;
  transition: all 0.2s;
}

.duration-grid button.active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.price-range {
  width: 100%;
  accent-color: var(--text);
  height: 6px;
  border-radius: 100px;
  cursor: pointer;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 12px;
}

.reset-btn {
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: color-mix(in srgb, var(--border) 50%, transparent);
}

.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.results-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.sort-chips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.sort-chips button {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-chips button.active {
  border-color: var(--text);
  background: var(--accent-soft);
}

.table-container {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
}

.plans-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.plans-table th {
  padding: 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  background: var(--surface-raised);
}

.plans-table th.num { text-align: right; }

.plans-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.plans-table tr:last-child td { border-bottom: none; }

.plans-table tr:hover td { background: var(--surface-raised); }

.op-chip {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  border-radius: 6px;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}

.plan-cell { min-width: 180px; }

.plan-name { font-weight: 600; color: var(--text); }

.plan-notes { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

.num { text-align: right; }

.font-mono { font-family: var(--font-mono); font-size: 12px; }

.price-val { font-weight: 700; color: var(--text); }

.badge-unlimited { color: #2563eb; font-weight: 700; }

.badge-cap { color: #d97706; font-weight: 700; }

.empty-state {
  padding: 80px 24px;
  text-align: center;
  background: var(--surface-raised);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  background: var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--text-muted);
}

.empty-state button {
  background: none;
  border: none;
  color: var(--text);
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
}
</style>
