import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/common/Layout'
import { ExpensesProvider } from './context/ExpensesContext'
import { Categories } from './pages/Categories'
import { Dashboard } from './pages/Dashboard'
import { Movements } from './pages/Movements'

function App() {
  return (
    <ExpensesProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movimientos" element={<Movements />} />
            <Route path="/categorias" element={<Categories />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ExpensesProvider>
  )
}

export default App
