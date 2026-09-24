const SECTIONS = [
  {
    id: 'resumen',
    label: 'Ingresos y Egresos',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'categorias',
    label: 'Por categoría',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    id: 'grafico',
    label: 'Gráfico',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
  },
]

export function SectionTabs({ active, onChange }) {
  return (
    <section style={styles.panel}>
      {SECTIONS.map((s) => {
        const isActive = s.id === active
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            style={{
              ...styles.btn,
              ...(isActive ? styles.btnActive : {}),
            }}
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        )
      })}
    </section>
  )
}

const styles = {
  panel: {
    display: 'flex',
    gap: 8,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 8,
  },
  btn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    padding: '10px 4px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: 12,
  },
  btnActive: {
    background: 'var(--surface-alt)',
    color: 'var(--accent)',
  },
}
