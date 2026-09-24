import { DEFAULT_CATEGORY_IDS } from '../../types/expense'
import { formatCurrency } from '../../utils/format'

function isDefaultCategory(cat) {
  return cat.id === DEFAULT_CATEGORY_IDS.INCOME || cat.id === DEFAULT_CATEGORY_IDS.EXPENSE
}

// Ingreso y Gasto siempre en primera y segunda posición; el resto por monto.
function sortBreakdown(breakdown) {
  return [
    ...breakdown.filter((c) => c.id === DEFAULT_CATEGORY_IDS.INCOME),
    ...breakdown.filter((c) => c.id === DEFAULT_CATEGORY_IDS.EXPENSE),
    ...breakdown.filter((c) => !isDefaultCategory(c)),
  ]
}

export function CategoryBreakdown({ breakdown, embedded = false }) {
  const sorted = sortBreakdown(breakdown)

  const content = (
    <>
      {sorted.length === 0 && <p style={styles.empty}>Sin movimientos en este filtro.</p>}

      {sorted.map((cat) => {
        if (isDefaultCategory(cat)) {
          // Ingreso / Gasto: barra completa con su color
          return (
            <div key={cat.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <span>
                  <span style={{ ...styles.dot, background: cat.color }} />
                  {cat.name}
                </span>
                <span>{formatCurrency(cat.amount)} · {cat.percent}%</span>
              </div>
              <div style={styles.track}>
                <div style={{ ...styles.fill, width: `${cat.percent}%`, background: cat.color }} />
              </div>
            </div>
          )
        }

        // Categoría etiqueta: barra en 2 partes (100% del ancho)
        // verde = ingreso, rojo = gasto, proporcional a los montos
        const totalType = cat.incomeAmount + cat.expenseAmount
        const incomeShare = totalType > 0 ? cat.incomeAmount / totalType : 0
        const expenseShare = totalType > 0 ? cat.expenseAmount / totalType : 0

        return (
          <div key={cat.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span>
                <span style={{ ...styles.dot, background: cat.color }} />
                {cat.name}
              </span>
              <span>{formatCurrency(cat.amount)} · {cat.percent}%</span>
            </div>
            <div style={styles.track}>
              <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                <div style={{ width: `${incomeShare * 100}%`, background: 'var(--income)' }} />
                <div style={{ width: `${expenseShare * 100}%`, background: 'var(--expense)' }} />
              </div>
            </div>
          </div>
        )
      })}
    </>
  )

  if (embedded) return content

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Por categoría</h2>
      {content}
    </section>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
    color: 'var(--text-muted)',
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    marginBottom: 4,
  },
  dot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 6,
  },
  track: {
    height: 6,
    borderRadius: 3,
    background: 'var(--surface-alt)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
}
