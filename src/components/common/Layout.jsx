import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExpenses } from '../../context/ExpensesContext'
import { Header } from './Header'
import { SideMenu } from './SideMenu'

const SECTION_ROUTES = {
  inicio: '/',
  movimientos: '/movimientos',
  categorias: '/categorias',
}

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { viewDate, navigateMonth, goToToday } = useExpenses()

  function handleNavigate(sectionId) {
    setMenuOpen(false)
    const route = SECTION_ROUTES[sectionId]
    if (route) navigate(route)
  }

  return (
    <div style={styles.wrapper}>
      <Header
        onMenuClick={() => setMenuOpen(true)}
        viewDate={viewDate}
        onNavigate={navigateMonth}
        onToday={goToToday}
      />
      <main style={styles.main}>{children}</main>
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100svh',
  },
  main: {
    flex: 1,
    padding: '0 16px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
}
