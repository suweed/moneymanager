// Filtros soportados por el dashboard.
// period: '' | 'dia' | 'semana' | 'mes' | 'anio' | 'todo'
//   '' = ningún filtro de periodo activo → se usa la vista del mes general
// dateFrom, dateTo: strings ISO 'YYYY-MM-DD', rango personalizado
// categoryIds: array de ids seleccionados (vacío = todas)
// minAmount, maxAmount: número o null
// sortOrder: 'asc' | 'desc'
export const DEFAULT_FILTERS = {
  period: '',
  dateFrom: '',
  dateTo: '',
  categoryIds: [],
  minAmount: '',
  maxAmount: '',
  sortOrder: 'desc',
}

function startOfPeriod(period, baseDate = new Date()) {
  const start = new Date(baseDate)
  start.setHours(0, 0, 0, 0)

  switch (period) {
    case 'dia':
      return start
    case 'semana': {
      const day = start.getDay() === 0 ? 7 : start.getDay()
      start.setDate(start.getDate() - (day - 1))
      return start
    }
    case 'mes':
      start.setDate(1)
      return start
    case 'anio':
      start.setMonth(0, 1)
      return start
    default:
      return null
  }
}

// Devuelve { start, end } del periodo (end exclusivo).
function periodRange(period, baseDate) {
  const start = startOfPeriod(period, baseDate)
  if (!start) return { start: null, end: null }
  const end = new Date(start)
  switch (period) {
    case 'dia':
      end.setDate(end.getDate() + 1)
      break
    case 'semana':
      end.setDate(end.getDate() + 7)
      break
    case 'mes':
      end.setMonth(end.getMonth() + 1)
      break
    case 'anio':
      end.setFullYear(end.getFullYear() + 1)
      break
  }
  return { start, end }
}

export function filterMovements(movements, filters, baseDate) {
  const f = { ...DEFAULT_FILTERS, ...filters }
  const hasCustomRange = Boolean(f.dateFrom || f.dateTo)

  // Sin filtro de periodo activo → vista del mes general (por defecto)
  const effectivePeriod = f.period || 'mes'

  const { start: periodStart, end: periodEnd } = hasCustomRange
    ? { start: null, end: null }
    : periodRange(effectivePeriod, baseDate)

  const rangeStart = hasCustomRange
    ? (f.dateFrom ? new Date(`${f.dateFrom}T00:00:00`) : null)
    : periodStart
  const rangeEnd = hasCustomRange && f.dateTo
    ? new Date(`${f.dateTo}T23:59:59`)
    : periodEnd

  const min = f.minAmount !== '' ? Number(f.minAmount) : null
  const max = f.maxAmount !== '' ? Number(f.maxAmount) : null

  const filtered = movements.filter((m) => {
    const movDate = new Date(`${m.date}T00:00:00`)

    if (rangeStart && movDate < rangeStart) return false
    if (rangeEnd && movDate >= rangeEnd) return false

    if (f.categoryIds.length > 0) {
      const matchesCategory = m.categoryIds.some((id) => f.categoryIds.includes(id))
      if (!matchesCategory) return false
    }

    if (min !== null && m.amount < min) return false
    if (max !== null && m.amount > max) return false

    return true
  })

  filtered.sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date)
    return f.sortOrder === 'asc' ? diff : -diff
  })

  return filtered
}

export function summarize(movements) {
  const income = movements
    .filter((m) => m.type === 'ingreso')
    .reduce((sum, m) => sum + m.amount, 0)
  const expense = movements
    .filter((m) => m.type === 'gasto')
    .reduce((sum, m) => sum + m.amount, 0)

  return { income, expense, balance: income - expense }
}

export function categoryBreakdown(movements, categories) {
  const totals = new Map()
  const incomeTotals = new Map()
  const expenseTotals = new Map()

  for (const m of movements) {
    for (const catId of m.categoryIds) {
      totals.set(catId, (totals.get(catId) || 0) + m.amount)
      if (m.type === 'ingreso') {
        incomeTotals.set(catId, (incomeTotals.get(catId) || 0) + m.amount)
      } else {
        expenseTotals.set(catId, (expenseTotals.get(catId) || 0) + m.amount)
      }
    }
  }

  const total = movements.reduce((sum, m) => sum + m.amount, 0)

  return categories
    .map((cat) => ({
      ...cat,
      amount: totals.get(cat.id) || 0,
      incomeAmount: incomeTotals.get(cat.id) || 0,
      expenseAmount: expenseTotals.get(cat.id) || 0,
      percent: total > 0 ? Math.round(((totals.get(cat.id) || 0) / total) * 100) : 0,
    }))
    .filter((cat) => cat.amount > 0)
    .sort((a, b) => b.amount - a.amount)
}
