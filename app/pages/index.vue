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
    <button class="filter-toggle" @click="showFilters = !showFilters">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 3h14M4 8h8M6 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      {{ showFilters ? 'Hide' : 'Show' }} Filters
    </button>

    <div class="layout" :class="{ 'filters-hidden': !showFilters }">
      <aside v-show="showFilters" class="sidebar">
        <div class="filter-section">
          <h3>Operators</h3>
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
            <span class="operator-dot" :style="{ background: op.color }" />
            <span>{{ op.name }}</span>
          </label>
        </div>

        <div class="filter-section">
          <h3>Duration</h3>
          <div class="duration-buttons">
            <button :class="{ active: durationFilter === 'all' }" @click="durationFilter = 'all'">All</button>
            <button :class="{ active: durationFilter === 'daily' }" @click="durationFilter = 'daily'">Daily</button>
            <button :class="{ active: durationFilter === 'weekly' }" @click="durationFilter = 'weekly'">Weekly</button>
            <button :class="{ active: durationFilter === 'monthly' }" @click="durationFilter = 'monthly'">Monthly</button>
            <button :class="{ active: durationFilter === 'long' }" @click="durationFilter = 'long'">60+ days</button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Max Price</h3>
          <input
            v-model.number="maxPrice"
            type="range"
            :min="0"
            :max="maxPriceLimit"
            :step="5"
          >
          <span class="range-value">Rs {{ maxPrice.toLocaleString() }}</span>
        </div>

        <div class="filter-section">
          <label class="operator-checkbox">
            <input v-model="hideUnlimited" type="checkbox">
            <span>Hide unlimited plans</span>
          </label>
          <label class="operator-checkbox">
            <input v-model="showNotes" type="checkbox">
            <span>Show notes column</span>
          </label>
        </div>

        <button class="reset-btn" @click="resetFilters">
          Reset Filters
        </button>
      </aside>

      <section class="content">
        <div class="results-bar">
          <span class="results-count">{{ filteredPlans.length }} plans</span>
          <div class="sort-buttons">
            <span class="sort-label">Sort:</span>
            <button :class="{ active: sortField === 'price' }" @click="toggleSort('price')">
              Price{{ sortIcon('price') }}
            </button>
            <button :class="{ active: sortField === 'volume' }" @click="toggleSort('volume')">
              Volume{{ sortIcon('volume') }}
            </button>
            <button :class="{ active: sortField === 'costPerGb' }" @click="toggleSort('costPerGb')">
              Rs/GB{{ sortIcon('costPerGb') }}
            </button>
            <button :class="{ active: sortField === 'costPerDay' }" @click="toggleSort('costPerDay')">
              Rs/day{{ sortIcon('costPerDay') }}
            </button>
            <button :class="{ active: sortField === 'duration' }" @click="toggleSort('duration')">
              Duration{{ sortIcon('duration') }}
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="plans-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Plan</th>
                <th class="num sortable" @click="toggleSort('duration')">
                  Duration{{ sortIcon('duration') }}
                </th>
                <th class="num sortable" @click="toggleSort('volume')">
                  Volume{{ sortIcon('volume') }}
                </th>
                <th class="num">Vol/day</th>
                <th class="num sortable" @click="toggleSort('price')">
                  Price{{ sortIcon('price') }}
                </th>
                <th class="num sortable" @click="toggleSort('costPerDay')">
                  Rs/day{{ sortIcon('costPerDay') }}
                </th>
                <th class="num sortable" @click="toggleSort('costPerGb')">
                  Rs/GB{{ sortIcon('costPerGb') }}
                </th>
                <th v-if="showNotes">Notes</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="plan in filteredPlans" :key="plan.id">
                <tr>
                  <td>
                    <span class="operator-badge" :style="{ '--c': operatorColor(plan.operatorSlug) }">
                      {{ plan.operator }}
                    </span>
                  </td>
                  <td class="plan-name">{{ plan.name }}</td>
                  <td class="num">{{ formatDuration(plan.durationDays) }}</td>
                  <td class="num">
                    <span v-if="plan.volumeGb === null" class="unlimited-tag">Unlimited</span>
                    <template v-else>{{ formatVolume(plan) }}</template>
                  </td>
                  <td class="num">
                    <span v-if="plan.dailyCap" class="daily-cap-tag">{{ plan.dailyCap }} GB/day</span>
                    <template v-else>{{ formatVolumePerDay(plan) }}</template>
                  </td>
                  <td class="num price-cell">
                    <strong>{{ formatPrice(plan.priceMur) }}</strong>
                  </td>
                  <td class="num">{{ formatCostPerDay(plan) }}</td>
                  <td class="num">{{ formatCostPerGb(plan) }}</td>
                  <td v-if="showNotes" class="notes-cell">{{ plan.notes }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          No plans match your filters. Try adjusting your criteria.
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  align-items: start;
}

.layout.filters-hidden {
  grid-template-columns: 1fr;
}

.sidebar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  position: sticky;
  top: 72px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.operator-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
}

.operator-checkbox input {
  accent-color: var(--text);
}

.operator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.duration-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.duration-buttons button {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.duration-buttons button.active {
  background: var(--active-btn-bg);
  color: var(--active-btn-text);
  border-color: var(--active-btn-bg);
}

.filter-section input[type="range"] {
  width: 100%;
  accent-color: var(--text);
}

.range-value {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.reset-btn {
  width: 100%;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.reset-btn:hover {
  background: var(--bg);
}

.content {
  min-width: 0;
}

.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  flex-wrap: wrap;
}

.results-count {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.sort-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-right: 4px;
}

.sort-buttons button {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
  white-space: nowrap;
}

.sort-buttons button.active {
  background: var(--active-btn-bg);
  color: var(--active-btn-text);
  border-color: var(--active-btn-bg);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.plans-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.plans-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.plans-table th {
  background: var(--table-header);
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  user-select: none;
}

.plans-table th.sortable {
  cursor: pointer;
}

.plans-table th.sortable:hover {
  color: var(--text);
}

.plans-table th.num,
.plans-table td.num {
  text-align: right;
}

.plans-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--row-border);
  vertical-align: middle;
}

.plans-table tr:last-child td {
  border-bottom: none;
}

.plans-table tr:hover td {
  background: var(--row-hover);
}

.operator-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  white-space: nowrap;
}

.plan-name {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.unlimited-tag {
  display: inline-block;
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  background: var(--unlimited-bg);
  color: var(--unlimited-text);
}

.daily-cap-tag {
  display: inline-block;
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  background: var(--daily-cap-bg);
  color: var(--daily-cap-text);
}

.price-cell {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.notes-cell {
  font-size: 11px;
  color: var(--text-muted);
  max-width: 200px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .sort-buttons {
    flex-wrap: wrap;
  }
}
</style>
