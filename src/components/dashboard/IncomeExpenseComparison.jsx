import { formatCurrency } from '../../utils/format'

export function IncomeExpenseComparison({ summary }) {
  const { income, expense, balance } = summary
  const max = Math.max(income, expense, 1)

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Ingresos vs Egresos</h2>

      <div style={styles.row}>
        <span style={styles.label}>Ingresos</span>
        <span style={{ ...styles.amount, color: 'var(--income)' }}>{formatCurrency(income)}</span>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${(income / max) * 100}%`, background: 'var(--income)' }} />
      </div>

      <div style={{ ...styles.row, marginTop: 12 }}>
        <span style={styles.label}>Egresos</span>
        <span style={{ ...styles.amount, color: 'var(--expense)' }}>{formatCurrency(expense)}</span>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${(expense / max) * 100}%`, background: 'var(--expense)' }} />
      </div>

      <div style={styles.balanceRow}>
        <span style={styles.label}>Balance neto</span>
        <span style={{ ...styles.balance, color: balance >= 0 ? 'var(--income)' : 'var(--expense)' }}>
          {formatCurrency(balance)}
        </span>
      </div>
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
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: 'var(--text-muted)',
  },
  amount: {
    fontWeight: 600,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    background: 'var(--surface-alt)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  balanceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid var(--border)',
  },
  balance: {
    fontSize: 18,
    fontWeight: 700,
  },
}
