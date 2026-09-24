import { useState } from 'react'
import { DEFAULT_CATEGORY_IDS, MOVEMENT_TYPES } from '../../types/expense'
import { formatCurrency } from '../../utils/format'

export function MovementFormModal({ categories, onClose, onSubmit, onCreateCategory, initialMovement }) {
  const [type, setType] = useState(initialMovement?.type ?? MOVEMENT_TYPES.EXPENSE)
  const [amount, setAmount] = useState(initialMovement ? formatCurrency(initialMovement.amount) : '')
  const [date, setDate] = useState(initialMovement?.date ?? new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState(initialMovement?.description ?? '')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialMovement?.categoryIds ?? [])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('#38bdf8')

  function toggleCategory(id) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  async function handleCreateCategory() {
    const name = newCatName.trim()
    if (!name) return
    const category = await onCreateCategory({ name, color: newCatColor })
    setSelectedCategoryIds((prev) => [...prev, category.id])
    setNewCatName('')
    setShowNewCategory(false)
  }

  function handleAmountChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setAmount(digits ? formatCurrency(Number(digits)) : '')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amountNum = Number(amount.replace(/\D/g, ''))
    if (!amountNum || amountNum <= 0) return

    const defaultCat =
      type === MOVEMENT_TYPES.INCOME ? DEFAULT_CATEGORY_IDS.INCOME : DEFAULT_CATEGORY_IDS.EXPENSE
    const categoryIds = Array.from(new Set([defaultCat, ...selectedCategoryIds]))

    onSubmit({
      type,
      amount: amountNum,
      date,
      description: description.trim() || 'Sin descripción',
      categoryIds,
    })
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{initialMovement ? 'Editar registro' : 'Nuevo registro'}</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.typeRow}>
            <button
              type="button"
              onClick={() => setType(MOVEMENT_TYPES.EXPENSE)}
              style={{
                ...styles.typeBtn,
                ...(type === MOVEMENT_TYPES.EXPENSE ? styles.typeBtnExpense : {}),
              }}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType(MOVEMENT_TYPES.INCOME)}
              style={{
                ...styles.typeBtn,
                ...(type === MOVEMENT_TYPES.INCOME ? styles.typeBtnIncome : {}),
              }}
            >
              Ingreso
            </button>
          </div>

          <label style={styles.field}>
            <span style={styles.label}>Monto</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="$ 0"
              value={amount}
              onChange={handleAmountChange}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Fecha</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Descripción</span>
            <input
              type="text"
              placeholder="Ej. Supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
          </label>

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
                    ...(selectedCategoryIds.includes(cat.id)
                      ? { background: cat.color, color: '#0f172a' }
                      : {}),
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {!showNewCategory ? (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              style={styles.newCatToggle}
            >
              + Crear nueva categoría
            </button>
          ) : (
            <div style={styles.newCatBox}>
              <label style={styles.field}>
                <span style={styles.label}>Nombre de la categoría</span>
                <input
                  type="text"
                  placeholder="Ej. Mascotas"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label style={styles.field}>
                <span style={styles.label}>Color</span>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  style={styles.colorInput}
                />
              </label>
              <div style={styles.newCatActions}>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  style={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  style={styles.createBtn}
                >
                  Crear
                </button>
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitBtn}>
              {initialMovement ? 'Guardar cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
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
    maxWidth: 480,
    maxHeight: '90svh',
    overflowY: 'auto',
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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
  typeRow: {
    display: 'flex',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--surface-alt)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  typeBtnExpense: {
    background: 'var(--expense)',
    borderColor: 'var(--expense)',
    color: '#0f172a',
  },
  typeBtnIncome: {
    background: 'var(--income)',
    borderColor: 'var(--income)',
    color: '#0f172a',
  },
  field: {
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
    padding: '10px 12px',
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
    padding: '6px 12px',
    fontSize: 12,
    cursor: 'pointer',
  },
  newCatToggle: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px dashed var(--border)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    color: 'var(--accent)',
  },
  newCatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: 'var(--surface-alt)',
    borderRadius: 10,
    padding: 12,
  },
  colorInput: {
    width: '100%',
    height: 40,
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    cursor: 'pointer',
  },
  newCatActions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
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
  createBtn: {
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    cursor: 'pointer',
    color: '#0f172a',
    fontWeight: 600,
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
}
