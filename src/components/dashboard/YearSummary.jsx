import { useMemo, useState } from 'react'
import { formatCurrency } from '../../utils/format'
import { categoryBreakdown, summarize } from '../../utils/filterExpenses'
import { CategoryBreakdown } from './CategoryBreakdown'
import { MonthlyChart } from './MonthlyChart'

// Panel desplegable de total por año.
// Muestra la data del año seleccionado en el selector (o el año actual si no
// se selecciona ninguno), y su contenido cambia según la sección activa:
//   resumen    → ingresos / egresos / balance del año
//   categorias → desglose por categoría del año
//   grafico    → gráfico del año
export function YearSummary({ movements, categories, activeSection }) {
  const [open, setOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const years = useMemo(() => {
    const set = new Set(movements.map((m) => new Date(`${m.date}T00:00:00`).getFullYear()))
    set.add(currentYear)
    return [...set].sort((a, b) => b - a)
  }, [movements, currentYear])

  const yearMovements = useMemo(
    () => movements.filter((m) => new Date(`${m.date}T00:00:00`).getFullYear() === year),
    [movements, year],
  )

  const summary = useMemo(() => summarize(yearMovements), [yearMovements])

  const breakdown = useMemo(
    () => categoryBreakdown(yearMovements, categories),
    [yearMovements, categories],
  )

  return (
    <section style={styles.card}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={styles.header}>
        <span style={styles.title}>Total por año</span>
        <span style={styles.chevron}>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div style={styles.body}>
          <div style={styles.yearRow}>
            <label style={styles.yearLabel} htmlFor="year-select">
              Año
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={styles.select}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {activeSection === 'resumen' && (
            <>
              <div style={styles.row}>
                <span style={styles.label}>Ingresos</span>
                <span style={{ ...styles.amount, color: 'var(--income)' }}>
                  {formatCurrency(summary.income)}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Egresos</span>
                <span style={{ ...styles.amount, color: 'var(--expense)' }}>
                  {formatCurrency(summary.expense)}
                </span>
              </div>
              <div style={{ ...styles.row, ...styles.balanceRow }}>
                <span style={styles.label}>Balance</span>
                <span
                  style={{
                    ...styles.balance,
                    color: summary.balance >= 0 ? 'var(--income)' : 'var(--expense)',
                  }}
                >
                  {formatCurrency(summary.balance)}
                </span>
              </div>
            </>
          )}

          {activeSection === 'categorias' && (
            <CategoryBreakdown breakdown={breakdown} embedded />
          )}

          {activeSection === 'grafico' && <MonthlyChart breakdown={breakdown} />}
        </div>
      )}
    </section>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    padding: '14px 16px',
    cursor: 'pointer',
    color: 'var(--text)',
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
  },
  chevron: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  body: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderTop: '1px solid var(--border)',
    paddingTop: 12,
  },
  yearRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  yearLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  select: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 10px',
    color: 'var(--text)',
    fontSize: 13,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  amount: {
    fontWeight: 600,
    fontSize: 14,
  },
  balanceRow: {
    borderTop: '1px solid var(--border)',
    paddingTop: 10,
  },
  balance: {
    fontWeight: 700,
    fontSize: 16,
  },
}
