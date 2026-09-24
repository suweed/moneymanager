export function MonthYearNavigator({ viewDate, onNavigate, onToday, compact = false }) {
  const label = new Date(viewDate.year, viewDate.month - 1, 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  const now = new Date()
  const isCurrentMonth = viewDate.year === now.getFullYear() && viewDate.month === now.getMonth() + 1

  if (compact) {
    return (
      <div style={styles.compactWrap}>
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          style={styles.compactArrow}
          aria-label="Mes anterior"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={styles.compactLabel}>{label}</span>
        {!isCurrentMonth && (
          <button type="button" onClick={onToday} style={styles.compactToday}>
            Hoy
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate(1)}
          style={styles.compactArrow}
          aria-label="Mes siguiente"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div style={styles.wrap}>
      <button
        type="button"
        onClick={() => onNavigate(-1)}
        style={styles.arrowBtn}
        aria-label="Mes anterior"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div style={styles.center}>
        <span style={styles.label}>{label}</span>
        {!isCurrentMonth && (
          <button type="button" onClick={onToday} style={styles.todayBtn}>
            Hoy
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onNavigate(1)}
        style={styles.arrowBtn}
        aria-label="Mes siguiente"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}

const styles = {
  compactWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  compactArrow: {
    background: 'transparent',
    border: 'none',
    padding: 2,
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactLabel: {
    fontSize: 13,
    color: 'var(--text-muted)',
    textTransform: 'capitalize',
  },
  compactToday: {
    background: 'transparent',
    border: 'none',
    fontSize: 11,
    cursor: 'pointer',
    color: 'var(--accent)',
    padding: 0,
  },
  wrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '8px 10px',
    minWidth: 0,
  },
  arrowBtn: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    color: 'var(--text)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  todayBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 11,
    cursor: 'pointer',
    color: 'var(--accent)',
    padding: 0,
  },
}
