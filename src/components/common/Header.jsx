import { MonthYearNavigator } from '../dashboard/MonthYearNavigator'

export function Header({ onMenuClick, viewDate, onNavigate, onToday }) {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button
          type="button"
          onClick={onMenuClick}
          style={styles.menuBtn}
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Mis Gastos</h1>
          <MonthYearNavigator
            compact
            viewDate={viewDate}
            onNavigate={onNavigate}
            onToday={onToday}
          />
        </div>
      </div>
      <span style={styles.version}>v5</span>
    </header>
  )
}

const styles = {
  header: {
    padding: '20px 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  menuBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 8,
    cursor: 'pointer',
    color: 'var(--text)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
  },
  version: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '2px 10px',
    fontSize: 12,
    color: 'var(--text-muted)',
  },
}
