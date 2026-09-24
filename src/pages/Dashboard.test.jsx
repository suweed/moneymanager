import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Layout } from '../components/common/Layout'
import { ExpensesProvider } from '../context/ExpensesContext'
import { DEFAULT_CATEGORY_IDS, MOVEMENT_TYPES } from '../types/expense'
import { categoryBreakdown } from '../utils/filterExpenses'
import { Dashboard } from './Dashboard'

// Fixtures de prueba (reemplazan a los antiguos mocks de la app)
const mockCategories = [
  { id: DEFAULT_CATEGORY_IDS.INCOME, name: 'Ingreso', color: '#22c55e' },
  { id: DEFAULT_CATEGORY_IDS.EXPENSE, name: 'Gasto', color: '#f87171' },
  { id: 'cat-comida', name: 'Comida', color: '#f59e0b' },
  { id: 'cat-transporte', name: 'Transporte', color: '#38bdf8' },
  { id: 'cat-servicios', name: 'Servicios', color: '#a78bfa' },
  { id: 'cat-salario', name: 'Salario', color: '#4ade80' },
  { id: 'cat-entretenimiento', name: 'Entretenimiento', color: '#fb923c' },
  { id: 'cat-freelance', name: 'Freelance', color: '#2dd4bf' },
  { id: 'cat-salud', name: 'Salud', color: '#f472b6' },
]

function isoDaysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

const mockMovements = [
  { id: 'm1', type: MOVEMENT_TYPES.INCOME, amount: 2500000, date: isoDaysAgo(1), description: 'Pago mensual', categoryIds: [DEFAULT_CATEGORY_IDS.INCOME, 'cat-salario'] },
  { id: 'm2', type: MOVEMENT_TYPES.EXPENSE, amount: 85000, date: isoDaysAgo(1), description: 'Supermercado', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-comida'] },
  { id: 'm3', type: MOVEMENT_TYPES.EXPENSE, amount: 32000, date: isoDaysAgo(2), description: 'Uber al trabajo', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-transporte'] },
  { id: 'm4', type: MOVEMENT_TYPES.INCOME, amount: 400000, date: isoDaysAgo(3), description: 'Proyecto freelance', categoryIds: [DEFAULT_CATEGORY_IDS.INCOME, 'cat-freelance'] },
  { id: 'm5', type: MOVEMENT_TYPES.EXPENSE, amount: 120000, date: isoDaysAgo(4), description: 'Cena restaurante', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-comida', 'cat-entretenimiento'] },
  { id: 'm6', type: MOVEMENT_TYPES.EXPENSE, amount: 65000, date: isoDaysAgo(5), description: 'Internet y luz', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-servicios'] },
  { id: 'm7', type: MOVEMENT_TYPES.EXPENSE, amount: 45000, date: isoDaysAgo(7), description: 'Farmacia', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-salud'] },
  { id: 'm8', type: MOVEMENT_TYPES.EXPENSE, amount: 28000, date: isoDaysAgo(9), description: 'Cine con amigos', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-entretenimiento'] },
  { id: 'm9', type: MOVEMENT_TYPES.EXPENSE, amount: 90000, date: isoDaysAgo(12), description: 'Gasolina', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-transporte'] },
  { id: 'm10', type: MOVEMENT_TYPES.INCOME, amount: 150000, date: isoDaysAgo(15), description: 'Venta artículo usado', categoryIds: [DEFAULT_CATEGORY_IDS.INCOME] },
  { id: 'm11', type: MOVEMENT_TYPES.EXPENSE, amount: 210000, date: isoDaysAgo(20), description: 'Mercado del mes', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-comida'] },
  { id: 'm12', type: MOVEMENT_TYPES.EXPENSE, amount: 55000, date: isoDaysAgo(28), description: 'Plan celular', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-servicios'] },
  { id: 'm13', type: MOVEMENT_TYPES.INCOME, amount: 2500000, date: isoDaysAgo(31), description: 'Pago mensual', categoryIds: [DEFAULT_CATEGORY_IDS.INCOME, 'cat-salario'] },
  { id: 'm14', type: MOVEMENT_TYPES.EXPENSE, amount: 130000, date: isoDaysAgo(40), description: 'Consulta médica', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-salud'] },
  { id: 'm15', type: MOVEMENT_TYPES.EXPENSE, amount: 75000, date: isoDaysAgo(60), description: 'Reparación bicicleta', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-transporte'] },
  { id: 'm16', type: MOVEMENT_TYPES.INCOME, amount: 300000, date: isoDaysAgo(75), description: 'Freelance diseño', categoryIds: [DEFAULT_CATEGORY_IDS.INCOME, 'cat-freelance'] },
  { id: 'm17', type: MOVEMENT_TYPES.EXPENSE, amount: 95000, date: isoDaysAgo(200), description: 'Regalo cumpleaños', categoryIds: [DEFAULT_CATEGORY_IDS.EXPENSE, 'cat-entretenimiento'] },
]

vi.mock('../services/api/client', () => ({
  api: {
    getMovements: vi.fn(async () => mockMovements),
    getCategories: vi.fn(async () => mockCategories),
    createMovement: vi.fn(async (data) => ({ id: `m-${Date.now()}`, ...data })),
    updateMovement: vi.fn(async (id, data) => ({ id, ...data })),
    deleteMovement: vi.fn(async () => {}),
    createCategory: vi.fn(async (data) => ({ id: `cat-${Date.now()}`, ...data })),
    updateCategory: vi.fn(async (id, data) => ({ id, ...data })),
    deleteCategory: vi.fn(async () => {}),
  },
}))

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  globalThis.ResizeObserver = ResizeObserverMock
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function getEgresosText() {
  const section = screen.getByText('Ingresos vs Egresos').closest('section')
  const row = within(section).getByText('Egresos').closest('div')
  return within(row).getByText(/^\$[\d.,\s]+$/).textContent
}

function getIngresosText() {
  const section = screen.getByText('Ingresos vs Egresos').closest('section')
  const row = within(section).getByText('Ingresos').closest('div')
  return within(row).getByText(/^\$[\d.,\s]+$/).textContent
}

function parseMoney(text) {
  return Number(text.replace(/[^\d]/g, ''))
}

function renderApp() {
  return render(
    <ExpensesProvider>
      <HashRouter>
        <Layout>
          <Dashboard />
        </Layout>
      </HashRouter>
    </ExpensesProvider>,
  )
}

describe('Dashboard: agregar/eliminar actualiza las secciones', () => {
  it('el campo de monto muestra el formato de moneda al escribir', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    await user.click(screen.getByRole('button', { name: '+ Agregar' }))

    const montoInput = screen.getByPlaceholderText('$ 0')
    fireEvent.change(montoInput, { target: { value: '20000' } })

    expect(montoInput.value.replace(/\u00A0/g, ' ')).toBe('$ 20.000')
  })

  it('flujo exacto del usuario: agregar gasto de 20000 con etiqueta Gasto aumenta egresos', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    const egresosAntes = parseMoney(getEgresosText())
    expect(egresosAntes).toBe(675000)

    await user.click(screen.getByRole('button', { name: '+ Agregar' }))

    const typeButtons = screen.getAllByRole('button', { name: 'Gasto' })
    await user.click(typeButtons[0])

    const montoInput = screen.getByPlaceholderText('$ 0')
    fireEvent.change(montoInput, { target: { value: '20000' } })

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    const egresosDespues = parseMoney(getEgresosText())
    expect(egresosDespues).toBe(695000)
  })

  it('agregar un ingreso aumenta el total de ingresos', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    const ingresosAntes = parseMoney(getIngresosText())
    expect(ingresosAntes).toBe(3050000)

    await user.click(screen.getByRole('button', { name: '+ Agregar' }))
    const typeButtons = screen.getAllByRole('button', { name: 'Ingreso' })
    await user.click(typeButtons[0])

    const montoInput = screen.getByPlaceholderText('$ 0')
    fireEvent.change(montoInput, { target: { value: '100000' } })

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    const ingresosDespues = parseMoney(getIngresosText())
    expect(ingresosDespues).toBe(3150000)
  })

  it('eliminar un movimiento ajusta los totales', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const totalAntes = parseMoney(getIngresosText()) + parseMoney(getEgresosText())

    const primerItem = screen.getAllByRole('listitem')[0]
    const deleteBtn = within(primerItem).getByRole('button', { name: 'Eliminar' })
    await user.click(deleteBtn)

    const totalDespues = parseMoney(getIngresosText()) + parseMoney(getEgresosText())
    expect(totalDespues).toBeLessThan(totalAntes)
    confirmSpy.mockRestore()
  })

  it('navegar al mes anterior cambia el resumen del dashboard', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    const egresosMesActual = parseMoney(getEgresosText())

    await user.click(screen.getByRole('button', { name: 'Mes anterior' }))

    const egresosMesAnterior = parseMoney(getEgresosText())
    expect(egresosMesAnterior).not.toBe(egresosMesActual)
  })

  it('el panel de total por año se despliega y muestra el resumen del año', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    await user.click(screen.getByRole('button', { name: /Total por año/ }))

    expect(screen.getByText('Balance')).toBeTruthy()
    expect(screen.getByLabelText('Año')).toBeTruthy()
  })

  it('el panel de total por año muestra el desglose por categoría cuando esa sección está activa', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    // Cambiar a la sección "Por categoría"
    await user.click(screen.getByRole('button', { name: /Por categoría/ }))

    // Desplegar el panel de total por año
    await user.click(screen.getByRole('button', { name: /Total por año/ }))

    // Debe mostrar categorías del año (ej. Comida) en lugar de solo Balance
    expect(screen.getAllByText('Comida').length).toBeGreaterThanOrEqual(1)
  })

  it('crear una categoría nueva desde el modal y guardar el registro funciona', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    await user.click(screen.getByRole('button', { name: '+ Agregar' }))

    // Crear categoría nueva desde el modal
    await user.click(screen.getByRole('button', { name: '+ Crear nueva categoría' }))
    const nameInput = screen.getByPlaceholderText('Ej. Mascotas')
    await user.type(nameInput, 'Mascotas')
    await user.click(screen.getByRole('button', { name: 'Crear' }))

    // La categoría nueva queda seleccionada (chip activo)
    const chip = screen.getByRole('button', { name: 'Mascotas' })
    expect(chip).toBeTruthy()

    // Poner monto y guardar
    const montoInput = screen.getByPlaceholderText('$ 0')
    fireEvent.change(montoInput, { target: { value: '50000' } })
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    // El registro se guardó sin error y aparece en el listado
    expect(screen.getByText('Sin descripción')).toBeTruthy()
  })

  it('los filtros de periodo se activan/desactivan con toggle y sin ninguno usa el mes', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    // Abrir filtros
    await user.click(screen.getByRole('button', { name: /Filtros/ }))

    // Sin filtro de periodo activo → badge 0
    expect(screen.queryByText('0')).toBeNull()

    // Activar "Día"
    await user.click(screen.getByRole('button', { name: 'Día' }))
    expect(screen.getByText('1')).toBeTruthy()

    // Desactivar "Día" → vuelve a 0 (vista del mes general)
    await user.click(screen.getByRole('button', { name: 'Día' }))
    expect(screen.queryByText('1')).toBeNull()
  })

  it('el panel por categoría muestra Ingreso y Gasto en primera y segunda posición', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Ingresos vs Egresos')

    await user.click(screen.getByRole('button', { name: /Por categoría/ }))

    const heading = screen.getByRole('heading', { name: 'Por categoría' })
    const section = heading.closest('section')
    const names = within(section).getAllByText(
      /^(Ingreso|Gasto|Comida|Transporte|Servicios|Salario|Entretenimiento|Freelance|Salud)$/,
    )
    expect(names[0].textContent).toBe('Ingreso')
    expect(names[1].textContent).toBe('Gasto')
  })

  it('categoryBreakdown calcula montos por tipo para la barra segmentada', () => {
    const cats = [
      { id: 'cat-ingreso', name: 'Ingreso', color: '#22c55e' },
      { id: 'cat-gasto', name: 'Gasto', color: '#f87171' },
      { id: 'cat-cristales', name: 'Cristales', color: '#38bdf8' },
    ]
    const movs = [
      { id: 'a', type: 'ingreso', amount: 100, date: '2026-09-01', description: '', categoryIds: ['cat-ingreso', 'cat-cristales'] },
      { id: 'b', type: 'gasto', amount: 100, date: '2026-09-02', description: '', categoryIds: ['cat-gasto', 'cat-cristales'] },
    ]
    const bd = categoryBreakdown(movs, cats)
    const cristales = bd.find((c) => c.id === 'cat-cristales')
    expect(cristales.incomeAmount).toBe(100)
    expect(cristales.expenseAmount).toBe(100)
    expect(cristales.amount).toBe(200)
  })
})
