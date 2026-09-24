import { useEffect } from 'react'

const MENU_ITEMS = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'movimientos',
    label: 'Todos los movimientos',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'categorias',
    label: 'Administrar categorías',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
]

export function SideMenu({ open, onClose, onNavigate }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <aside
        style={{
          ...styles.drawer,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Mis Gastos</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav style={styles.nav}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              style={styles.item}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 200,
    transition: 'opacity 0.25s ease',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 'min(300px, 85vw)',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'transparent',
    border: 'none',
    borderRadius: 10,
    padding: '12px 12px',
    cursor: 'pointer',
    color: 'var(--text)',
    fontSize: 15,
    textAlign: 'left',
  },
}
