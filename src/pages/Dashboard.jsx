import { useState } from 'react'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { FiltersBar } from '../components/dashboard/FiltersBar'
import { IncomeExpenseComparison } from '../components/dashboard/IncomeExpenseComparison'
import { MonthlyChart } from '../components/dashboard/MonthlyChart'
import { MovementFormModal } from '../components/dashboard/MovementFormModal'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { SectionTabs } from '../components/dashboard/SectionTabs'
import { YearSummary } from '../components/dashboard/YearSummary'
import { useExpenses } from '../context/ExpensesContext'

const RECENT_LIMIT = 5

export function Dashboard() {
  const { categories, movements, allMovements, summary, breakdown, filters, updateFilters, resetFilters, addMovement, addCategory, updateMovement, deleteMovement, loading, error } =
    useExpenses()

  const [activeSection, setActiveSection] = useState('resumen')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState(null)

  const activeFilterCount =
    (filters.period !== '' ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    filters.categoryIds.length +
    (filters.minAmount !== '' ? 1 : 0) +
    (filters.maxAmount !== '' ? 1 : 0) +
    (filters.sortOrder !== 'desc' ? 1 : 0)

  const recent = movements.slice(0, RECENT_LIMIT)

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

      <div style={styles.topRow}>
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
      </div>

      {filtersOpen && (
        <FiltersBar
          filters={filters}
          categories={categories}
          onChange={updateFilters}
          onReset={resetFilters}
        />
      )}

      {/* Panel 1: contenido dinámico según la opción seleccionada */}
      <div style={styles.mainPanel}>
        {activeSection === 'resumen' && <IncomeExpenseComparison summary={summary} />}
        {activeSection === 'categorias' && <CategoryBreakdown breakdown={breakdown} />}
        {activeSection === 'grafico' && <MonthlyChart breakdown={breakdown} />}
      </div>

      {/* Panel desplegable: total por año (afectado por la sección activa) */}
      <YearSummary
        movements={allMovements}
        categories={categories}
        activeSection={activeSection}
      />

      {/* Panel 2: opciones de secciones */}
      <SectionTabs active={activeSection} onChange={setActiveSection} />

      {/* Panel 3: últimos movimientos (siempre visible) */}
      <RecentTransactions
        movements={recent}
        categories={categories}
        title="Últimos movimientos"
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
  topRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  filtersToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
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
  mainPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
