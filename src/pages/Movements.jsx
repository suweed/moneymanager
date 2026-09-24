import { useState } from 'react'
import { FiltersBar } from '../components/dashboard/FiltersBar'
import { MovementFormModal } from '../components/dashboard/MovementFormModal'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { useExpenses } from '../context/ExpensesContext'

export function Movements() {
  const { categories, movements, filters, updateFilters, resetFilters, addMovement, addCategory, updateMovement, deleteMovement, loading, error } =
    useExpenses()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState(null)

  const activeFilterCount =
    (filters.period !== 'mes' ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    filters.categoryIds.length +
    (filters.minAmount !== '' ? 1 : 0) +
    (filters.maxAmount !== '' ? 1 : 0) +
    (filters.sortOrder !== 'desc' ? 1 : 0)

  function openAddModal() {
    setEditingMovement(null)
    setModalOpen(true)
  }

  function openEditModal(movement) {
    setEditingMovement(movement)
    setModalOpen(true)
  }

  function handleDelete(movement) {
    if (window.confirm(`¿Eliminar "${movement.description}"?`)) {
      deleteMovement(movement.id)
    }
  }

  async function handleSubmit(data) {
    if (editingMovement) {
      await updateMovement(editingMovement.id, data)
    } else {
      await addMovement(data)
    }
    setModalOpen(false)
  }

  return (
    <>
      {loading && <p style={styles.status}>Cargando datos…</p>}
      {error && <p style={styles.statusError}>Error: {error}</p>}

      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        style={styles.filtersToggle}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filtros
        {activeFilterCount > 0 && <span style={styles.badge}>{activeFilterCount}</span>}
      </button>

      {filtersOpen && (
        <FiltersBar
          filters={filters}
          categories={categories}
          onChange={updateFilters}
          onReset={resetFilters}
        />
      )}

      <RecentTransactions
        movements={movements}
        categories={categories}
        title="Todos los movimientos"
        action={
          <button type="button" onClick={openAddModal} style={styles.addBtn}>
            + Agregar
          </button>
        }
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <MovementFormModal
          categories={categories}
          initialMovement={editingMovement}
          onClose={() => setModalOpen(false)}
          onCreateCategory={addCategory}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}

const styles = {
  filtersToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer',
    color: 'var(--text)',
  },
  badge: {
    background: 'var(--accent)',
    color: '#0f172a',
    borderRadius: '50%',
    minWidth: 18,
    height: 18,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    padding: '0 4px',
  },
  addBtn: {
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#0f172a',
  },
  status: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  statusError: {
    color: 'var(--expense)',
    fontSize: 14,
  },
}
