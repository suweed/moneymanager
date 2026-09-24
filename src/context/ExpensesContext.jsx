import { createContext, useContext } from 'react'
import { useMockExpenses } from '../hooks/useMockExpenses'

const ExpensesContext = createContext(null)

// Provee los datos de gastos/ingresos a toda la app (Header, Layout y páginas).
export function ExpensesProvider({ children }) {
  const value = useMockExpenses()
  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useExpenses() {
  return useContext(ExpensesContext)
}
