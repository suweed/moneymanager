const PERIODS = [
  { value: 'dia', label: 'Día' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'anio', label: 'Año' },
  { value: 'todo', label: 'Todo' },
]

export function FiltersBar({ filters, categories, onChange, onReset }) {
  function toggleCategory(id) {
    const selected = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id]
    onChange({ categoryIds: selected })
  }

  // Toggle de periodo: activar uno desactiva los demás; desactivar el activo
  // deja period en '' (ninguno) → se usa la vista del mes general.
  function togglePeriod(value) {
    const next = filters.period === value ? '' : value
    onChange({ period: next, dateFrom: '', dateTo: '' })
  }

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Filtros</h2>

      <div style={styles.periodRow}>
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => togglePeriod(p.value)}
            style={{
              ...styles.periodBtn,
              ...(filters.period === p.value ? styles.periodBtnActive : {}),
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={styles.row}>
        <label style={styles.field}>
          <span style={styles.label}>Desde</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.field}>
          <span style={styles.label}>Hasta</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.row}>
        <label style={styles.field}>
          <span style={styles.label}>Monto mín.</span>
          <input
            type="number"
            placeholder="0"
            value={filters.minAmount}
            onChange={(e) => onChange({ minAmount: e.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.field}>
          <span style={styles.label}>Monto máx.</span>
          <input
            type="number"
            placeholder="Sin límite"
            value={filters.maxAmount}
            onChange={(e) => onChange({ maxAmount: e.target.value })}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Categorías / etiquetas</span>
        <div style={styles.chips}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              style={{
                ...styles.chip,
                borderColor: cat.color,
                ...(filters.categoryIds.includes(cat.id)
                  ? { background: cat.color, color: '#0f172a' }
                  : {}),
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.row}>
        <label style={styles.field}>
          <span style={styles.label}>Orden por fecha</span>
          <select
            value={filters.sortOrder}
            onChange={(e) => onChange({ sortOrder: e.target.value })}
            style={styles.input}
          >
            <option value="desc">Más reciente primero</option>
            <option value="asc">Más antiguo primero</option>
          </select>
        </label>
        <button type="button" onClick={onReset} style={styles.resetBtn}>
          Limpiar filtros
        </button>
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
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: {
    fontSize: 16,
    color: 'var(--text-muted)',
  },
  periodRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  periodBtn: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    cursor: 'pointer',
  },
  periodBtnActive: {
    background: 'var(--accent)',
    color: '#0f172a',
    borderColor: 'var(--accent)',
  },
  row: {
    display: 'flex',
    gap: 12,
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  input: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 10px',
    color: 'var(--text)',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '5px 12px',
    fontSize: 12,
    cursor: 'pointer',
  },
  resetBtn: {
    alignSelf: 'flex-end',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
}
