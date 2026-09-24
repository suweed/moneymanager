import { formatCurrency, formatDate } from '../../utils/format'

export function RecentTransactions({ movements, categories, title = 'Movimientos', action, onEdit, onDelete }) {
  function categoryNames(ids) {
    return ids
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        {action}
      </div>

      {movements.length === 0 && <p style={styles.empty}>No hay movimientos con estos filtros.</p>}

      <ul style={styles.list}>
        {movements.map((m) => (
          <li key={m.id} style={styles.item}>
            <div style={styles.info}>
              <p style={styles.description}>{m.description}</p>
              <p style={styles.meta}>{formatDate(m.date)} · {categoryNames(m.categoryIds)}</p>
            </div>
            <div style={styles.right}>
              <span style={{ ...styles.amount, color: m.type === 'ingreso' ? 'var(--income)' : 'var(--expense)' }}>
                {m.type === 'ingreso' ? '+' : '-'}{formatCurrency(m.amount)}
              </span>
              <div style={styles.actions}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(m)}
                    style={styles.iconBtn}
                    aria-label="Editar"
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(m)}
                    style={styles.iconBtn}
                    aria-label="Eliminar"
                    title="Eliminar"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
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
    color: 'var(--text-muted)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    display: 'flex',
    gap: 4,
  },
  iconBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: 5,
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    margin: 0,
    fontSize: 14,
  },
  meta: {
    margin: 0,
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'capitalize',
  },
  amount: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}
