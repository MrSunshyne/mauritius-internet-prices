import { plans, operators, type MobilePlan } from '~/data/plans'

export type SortField = 'price' | 'volume' | 'costPerGb' | 'costPerDay' | 'duration'
export type SortDirection = 'asc' | 'desc'
export type DurationFilter = 'all' | 'daily' | 'weekly' | 'monthly' | 'long'

const maxPriceLimit = Math.max(...plans.map(p => p.priceMur))
const selectedOperators = ref<string[]>(['myt', 'emtel', 'chili'])
const durationFilter = ref<DurationFilter>('all')
const maxPrice = ref(maxPriceLimit)
const hideUnlimited = ref(false)
const sortField = ref<SortField>('price')
const sortDirection = ref<SortDirection>('asc')

export function useMobilePlans() {
  function costPerGb(plan: MobilePlan): number | null {
    if (plan.volumeGb === null) return null
    if (plan.volumeGb === 0) return null
    return plan.priceMur / plan.volumeGb
  }

  function costPerDay(plan: MobilePlan): number {
    return plan.priceMur / plan.durationDays
  }

  function volumePerDay(plan: MobilePlan): number | null {
    if (plan.volumeGb === null) return null
    return plan.volumeGb / plan.durationDays
  }

  function durationCategory(days: number): DurationFilter {
    if (days <= 1) return 'daily'
    if (days <= 7) return 'weekly'
    if (days <= 30) return 'monthly'
    return 'long'
  }

  const filteredPlans = computed(() => {
    const result = plans.filter((plan) => {
      if (!selectedOperators.value.includes(plan.operatorSlug)) return false
      if (durationFilter.value !== 'all' && durationCategory(plan.durationDays) !== durationFilter.value) return false
      if (plan.priceMur > maxPrice.value) return false
      if (hideUnlimited.value && plan.volumeGb === null) return false
      return true
    })

    result.sort((a, b) => {
      let aVal: number
      let bVal: number
      switch (sortField.value) {
        case 'price':
          aVal = a.priceMur
          bVal = b.priceMur
          break
        case 'volume':
          aVal = a.volumeGb ?? Infinity
          bVal = b.volumeGb ?? Infinity
          break
        case 'costPerGb':
          aVal = costPerGb(a) ?? Infinity
          bVal = costPerGb(b) ?? Infinity
          break
        case 'costPerDay':
          aVal = costPerDay(a)
          bVal = costPerDay(b)
          break
        case 'duration':
          aVal = a.durationDays
          bVal = b.durationDays
          break
        default:
          aVal = 0
          bVal = 0
      }
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  })

  function formatPrice(price: number): string {
    return `Rs ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  function formatVolume(plan: MobilePlan): string {
    if (plan.volumeGb === null) return 'Unlimited'
    if (plan.volumeGb < 1) return `${Math.round(plan.volumeGb * 1024)} MB`
    return `${plan.volumeGb} GB`
  }

  function formatCostPerGb(plan: MobilePlan): string {
    const cost = costPerGb(plan)
    if (cost === null) return 'N/A'
    return `Rs ${cost.toFixed(2)}`
  }

  function formatCostPerDay(plan: MobilePlan): string {
    return `Rs ${costPerDay(plan).toFixed(2)}`
  }

  function formatVolumePerDay(plan: MobilePlan): string {
    const vol = volumePerDay(plan)
    if (vol === null) return 'Unlimited'
    if (vol < 1) return `${Math.round(vol * 1024)} MB`
    return `${vol.toFixed(1)} GB`
  }

  function formatDuration(days: number): string {
    if (days < 1) {
      const hours = Math.round(days * 24)
      return hours === 1 ? '1 hour' : `${hours} hours`
    }
    if (days === 1) return '1 day'
    if (days <= 7) return `${days} days`
    if (days === 30) return '1 month'
    if (days === 60) return '2 months'
    if (days === 90) return '3 months'
    return `${days} days`
  }

  function toggleOperator(slug: string) {
    const idx = selectedOperators.value.indexOf(slug)
    if (idx >= 0) {
      selectedOperators.value.splice(idx, 1)
    } else {
      selectedOperators.value.push(slug)
    }
  }

  function toggleSort(field: SortField) {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  function resetFilters() {
    selectedOperators.value = ['myt', 'emtel', 'chili']
    durationFilter.value = 'all'
    maxPrice.value = maxPriceLimit
    hideUnlimited.value = false
    sortField.value = 'price'
    sortDirection.value = 'asc'
  }

  return {
    selectedOperators,
    durationFilter,
    maxPrice,
    maxPriceLimit,
    hideUnlimited,
    sortField,
    sortDirection,
    filteredPlans,
    operators,
    costPerGb,
    costPerDay,
    volumePerDay,
    formatPrice,
    formatVolume,
    formatCostPerGb,
    formatCostPerDay,
    formatVolumePerDay,
    formatDuration,
    toggleOperator,
    toggleSort,
    resetFilters,
  }
}
