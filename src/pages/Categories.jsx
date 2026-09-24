import { useState } from 'react'
import { DEFAULT_CATEGORY_IDS } from '../types/expense'
import { useExpenses } from '../context/ExpensesContext'

const DEFAULT_COLORS = ['#f87171', '#f59e0b', '#38bdf8', '#a78bfa', '#4ade80', '#fb923c', '#2dd4bf', '#f472b6']

export function Categories() {
  const { categories, allMovements, addCategory, updateCategory, deleteCategory, loading, error } = useExpenses()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(DEFAULT_COLORS[0])

  const usageCount = (catId) => allMovements.filter((m) => m.categoryIds.includes(catId)).length

  function openCreate() {
    setEditingCategory(null)
    setName('')
    setColor(DEFAULT_COLORS[0])
    setModalOpen(true)
  }

  function openEdit(category) {
    setEditingCategory(category)
    setName(category.name)
    setColor(category.color)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    if (editingCategory) {
      updateCategory(editingCategory.id, { name: trimmed, color })
    } else {
      addCategory({ name: trimmed, color })
    }
    setModalOpen(false)
  }

  function handleDelete(category) {
    if (window.confirm(`¿Eliminar la categoría "${category.name}"? Se quitará de los movimientos que la usan.`)) {
      deleteCategory(category.id)
    }
  }

  const isDefault = (id) => id === DEFAULT_CATEGORY_IDS.INCOME || id === DEFAULT_CATEGORY_IDS.EXPENSE

  return (
    <>
      {loading && <p style={styles.status}>Cargando datos…</p>}
      {error && <p style={styles.statusError}>Error: {error}</p>}

      <div style={styles.header}>
        <h2 style={styles.title}>Categorías</h2>
        <button type="button" onClick={openCreate} style={styles.addBtn}>
          + Nueva
        </button>
      </div>

      <section style={styles.card}>
        {categories.length === 0 && <p style={styles.empty}>No hay categorías todavía.</p>}

        <ul style={styles.list}>
          {categories.map((cat) => (
            <li key={cat.id} style={styles.item}>
              <span style={{ ...styles.dot, background: cat.color }} />
              <div style={styles.info}>
                <p style={styles.name}>{cat.name}</p>
                <p style={styles.meta}>
                  {usageCount(cat.id)} {usageCount(cat.id) === 1 ? 'movimiento' : 'movimientos'}
                  {isDefault(cat.id) ? ' · por defecto' : ''}
                </p>
              </div>
              <div style={styles.itemActions}>
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  style={styles.iconBtn}
                  aria-label={`Editar ${cat.name}`}
                  title="Editar"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
                {!isDefault(cat.id) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    style={styles.iconBtn}
                    aria-label={`Eliminar ${cat.name}`}
                    title="Eliminar"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {modalOpen && (
        <div style={styles.overlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={styles.closeBtn}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.field}>
                <span style={styles.label}>Nombre</span>
                <input
                  type="text"
                  placeholder="Ej. Mascotas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </label>

              <div style={styles.field}>
                <span style={styles.label}>Color</span>
                <div style={styles.colors}>
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        ...styles.colorSwatch,
                        background: c,
                        ...(color === c ? styles.colorSwatchActive : {}),
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingCategory ? 'Guardar cambios' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
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
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
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
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: 14,
  },
  meta: {
    margin: 0,
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  itemActions: {
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
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 100,
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  input: {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'var(--text)',
  },
  colors: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
  },
  colorSwatchActive: {
    borderColor: 'var(--text)',
    transform: 'scale(1.1)',
  },
  actions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 16px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    cursor: 'pointer',
    color: '#0f172a',
    fontWeight: 600,
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
