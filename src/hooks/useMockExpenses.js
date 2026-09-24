import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api/client'
import {
  DEFAULT_FILTERS,
  categoryBreakdown,
  filterMovements,
  summarize,
} from '../utils/filterExpenses'

// Hook que conecta el frontend con la API real (server/).
// Mantiene la misma interfaz que el hook mock para no tocar la UI.
export function useMockExpenses() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })
  const [movements, setMovements] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [movs, cats] = await Promise.all([api.getMovements(), api.getCategories()])
        if (!active) return
        setMovements(movs)
        setCategories(cats)
        setError(null)
      } catch (e) {
        if (!active) return
        setError(e.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = () => setReloadKey((k) => k + 1)

  const filteredMovements = useMemo(() => {
    // El navegador de mes/año (vista general) afecta el periodo por defecto
    // ('') y los periodos 'mes' y 'anio'. Para 'dia'/'semana'/'todo' o rango
    // personalizado se usa la fecha de hoy.
    const baseDate =
      filters.period === '' || filters.period === 'mes' || filters.period === 'anio'
        ? new Date(viewDate.year, viewDate.month - 1, 1)
        : new Date()
    return filterMovements(movements, filters, baseDate)
  }, [movements, filters, viewDate])

  const summary = useMemo(() => summarize(filteredMovements), [filteredMovements])

  const breakdown = useMemo(
    () => categoryBreakdown(filteredMovements, categories),
    [filteredMovements, categories],
  )

  function updateFilters(partial) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    const now = new Date()
    setViewDate({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }

  function navigateMonth(delta) {
    setViewDate((prev) => {
      const d = new Date(prev.year, prev.month - 1 + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    })
  }

  function goToToday() {
    const now = new Date()
    setViewDate({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }

  async function addMovement(data) {
    const created = await api.createMovement(data)
    setMovements((prev) => [created, ...prev])
    return created
  }

  async function updateMovement(id, data) {
    const updated = await api.updateMovement(id, data)
    setMovements((prev) => prev.map((m) => (m.id === id ? updated : m)))
    return updated
  }

  async function deleteMovement(id) {
    await api.deleteMovement(id)
    setMovements((prev) => prev.filter((m) => m.id !== id))
  }

  async function addCategory({ name, color }) {
    const created = await api.createCategory({ name, color })
    setCategories((prev) => [...prev, created])
    return created
  }

  async function updateCategory(id, data) {
    const updated = await api.updateCategory(id, data)
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }

  async function deleteCategory(id) {
    await api.deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setMovements((prev) =>
      prev.map((m) => ({
        ...m,
        categoryIds: m.categoryIds.filter((catId) => catId !== id),
      })),
    )
  }

  return {
    categories,
    movements: filteredMovements,
    allMovements: movements,
    summary,
    breakdown,
    filters,
    viewDate,
    loading,
    error,
    reload,
    updateFilters,
    resetFilters,
    navigateMonth,
    goToToday,
    addMovement,
    addCategory,
    updateCategory,
    deleteCategory,
    updateMovement,
    deleteMovement,
  }
}
