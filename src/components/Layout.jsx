import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <div>
      <div className="mobile-topbar">
        <strong>Сухова А. В.</strong>
        <button
          className="btn-primary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Открыть меню"
        >
          {menuOpen ? 'Закрыть' : 'Меню'}
        </button>
      </div>

      <div className="app-shell">
        <Sidebar open={menuOpen} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
