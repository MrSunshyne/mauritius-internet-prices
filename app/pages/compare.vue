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
  title: 'Comparative Analysis — The Data Report',
  description: 'Detailed side-by-side comparison of all available prepaid mobile data plans in Mauritius.',
})
</script>

<template>
  <main class="content">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Comparative <span class="italic">Analysis</span></h1>
        <p class="page-subtitle">A granular breakdown of {{ filteredPlans.length }} plans based on current market data.</p>
      </div>
      <button class="filter-toggle" @click="showFilters = !showFilters">
        {{ showFilters ? 'Hide' : 'Show' }} Parameters
      </button>
    </header>

    <div class="layout" :class="{ 'filters-hidden': !showFilters }">
      <aside v-show="showFilters" class="sidebar-filters">
        <div class="filter-section">
          <h3 class="section-label">Operators</h3>
          <div class="operator-list">
            <label
              v-for="op in operators"
              :key="op.slug"
              class="operator-checkbox"
              :style="{ '--c': op.color }"
            >
              <input
                type="checkbox"
                :checked="selectedOperators.includes(op.slug)"
                @change="toggleOperator(op.slug)"
              >
              <span class="custom-checkbox"></span>
              <span class="op-name">{{ op.name }}</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="section-label">Duration</h3>
          <div class="duration-list">
            <button 
              v-for="d in ['all', 'daily', 'weekly', 'monthly', 'long']" 
              :key="d" 
              :class="{ active: durationFilter === d }" 
              @click="durationFilter = (d as any)"
            >
              {{ d.charAt(0).toUpperCase() + d.slice(1) }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="section-label">Price Ceiling: <span class="range-val">Rs {{ maxPrice.toLocaleString() }}</span></h3>
          <input
            v-model.number="maxPrice"
            type="range"
            :min="0"
            :max="maxPriceLimit"
            :step="5"
            class="editorial-range"
          >
        </div>

        <div class="filter-section">
          <label class="toggle-row">
            <span>Exclude Unlimited</span>
            <input v-model="hideUnlimited" type="checkbox">
          </label>
          <label class="toggle-row">
            <span>Include Technical Notes</span>
            <input v-model="showNotes" type="checkbox">
          </label>
        </div>

        <button class="reset-btn" @click="resetFilters">
          Reset Parameters
        </button>
      </aside>

      <section class="content-table">
        <div class="table-meta">
          <div class="results-count">{{ filteredPlans.length }} entries identified</div>
          <div class="sort-controls">
            <span class="sort-label">Sort by:</span>
            <div class="sort-chips">
              <button v-for="s in ['price', 'volume', 'costPerGb', 'duration']" :key="s" :class="{ active: sortField === s }" @click="toggleSort(s as any)">
                {{ s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}{{ sortIcon(s as any) }}
              </button>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Plan Name</th>
                <th class="num">Duration</th>
                <th class="num">Volume</th>
                <th class="num">Daily</th>
                <th class="num">Price</th>
                <th class="num">Value (Rs/GB)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in filteredPlans" :key="plan.id">
                <td>
                  <span class="op-tag" :style="{ '--c': operatorColor(plan.operatorSlug) }">
                    {{ plan.operator }}
                  </span>
                </td>
                <td class="plan-info">
                  <div class="plan-name">{{ plan.name }}</div>
                  <div v-if="showNotes && plan.notes" class="plan-notes">{{ plan.notes }}</div>
                </td>
                <td class="num">{{ formatDuration(plan.durationDays) }}</td>
                <td class="num tabular">
                  <span v-if="plan.volumeGb === null" class="unlimited">Unlimited</span>
                  <template v-else>{{ formatVolume(plan) }}</template>
                </td>
                <td class="num tabular">
                  <span v-if="plan.dailyCap" class="cap-tag">{{ plan.dailyCap }}GB Cap</span>
                  <template v-else>{{ formatVolumePerDay(plan) }}</template>
                </td>
                <td class="num price-cell">{{ formatPrice(plan.priceMur) }}</td>
                <td class="num tabular bold">{{ formatCostPerGb(plan) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          <p>No data matches the selected parameters.</p>
          <button @click="resetFilters">Clear filters</button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Content Area */
.content {
  max-width: 1400px;
  padding: 80px 60px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 24px;
  gap: 24px;
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

.filter-toggle {
  background: var(--text);
  color: var(--bg);
  border: none;
  padding: 12px 24px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 60px;
  align-items: start;
}

.layout.filters-hidden {
  grid-template-columns: 1fr;
}

/* Filter Sidebar Styling */
.sidebar-filters {
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: sticky;
  top: 104px;
}

.section-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin-bottom: 20px;
  display: block;
}

.operator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operator-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.operator-checkbox input { display: none; }

.custom-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border);
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

.op-name {
  position: relative;
  padding-left: 12px;
}

.op-name::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--c);
}

.duration-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
}

.duration-list button {
  padding: 12px 16px;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-subtle);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.duration-list button:last-child { border-bottom: none; }

.duration-list button.active {
  background: var(--text);
  color: var(--bg);
}

.editorial-range {
  width: 100%;
  accent-color: var(--text);
  cursor: pointer;
}

.range-val { color: var(--text); font-family: var(--font-mono); }

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  cursor: pointer;
}

.reset-btn {
  padding: 16px;
  border: 1px solid var(--border);
  background: transparent;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
}

.reset-btn:hover {
  background: var(--surface-raised);
}

/* Content & Table Styling */
.table-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.results-count {
  font-size: 14px;
  font-weight: 700;
  font-style: italic;
  font-family: var(--font-serif);
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); }

.sort-chips { display: flex; border: 1px solid var(--border); }

.sort-chips button {
  padding: 8px 12px;
  border: none;
  border-right: 1px solid var(--border-subtle);
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.sort-chips button:last-child { border-right: none; }

.sort-chips button.active { background: var(--surface-raised); }

.table-container {
  border-top: 2px solid var(--border);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  padding: 20px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.data-table td {
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.data-table tr:hover td {
  background: var(--surface-raised);
}

.op-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--c);
}

.plan-name { font-weight: 700; font-size: 15px; white-space: nowrap; }
.plan-notes { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

.num { text-align: right; }
.tabular { font-family: var(--font-mono); font-size: 13px; }
.price-cell { font-weight: 800; font-size: 16px; text-align: right; white-space: nowrap; }
.bold { font-weight: 800; }

.unlimited { color: #2563eb; font-weight: 800; text-transform: uppercase; font-size: 11px; }
.cap-tag { color: #d97706; font-weight: 800; font-size: 11px; }

.empty-state {
  padding: 100px 0;
  text-align: center;
}

.empty-state p {
  font-family: var(--font-serif);
  font-size: 24px;
  font-style: italic;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .layout { grid-template-columns: 1fr; gap: 40px; }
  .sidebar-filters { position: static; }
}

@media (max-width: 900px) {
  .content { padding: 40px 24px; }
}

@media (max-width: 768px) {
  .page-title { font-size: 36px; }
  .data-table { font-size: 12px; }
  .data-table th, .data-table td { padding: 12px 8px; }
  .price-cell { font-size: 14px; }
}
</style>
