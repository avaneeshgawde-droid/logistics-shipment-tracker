import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ currentView, setView, onToggleMobileSidebar }) {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="left-brand-group">
        {user && (
          <button className="mobile-menu-btn" onClick={onToggleMobileSidebar} aria-label="Toggle Navigation">
            ☰
          </button>
        )}
        <div className="brand" onClick={() => setView('landing')}>
          <div className="brand-mark">LT</div>
          <div>
            <strong>LogiTrack</strong>
            <span>Logistics & Shipment Tracking</span>
          </div>
        </div>
      </div>

      <nav className="top-nav">
        <button
          className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
          onClick={() => setView('landing')}
        >
          Track Package
        </button>

        {user ? (
          <>
            <button
              className={`nav-link ${currentView.includes('dashboard') || currentView === 'admin' || currentView === 'customer' ? 'active' : ''}`}
              onClick={() => setView(user.role === 'ADMIN' ? 'admin' : 'customer')}
            >
              Dashboard
            </button>
            <div className="user-profile">
              <span className="user-name">{user.name}</span>
              <span className={`role-tag ${user.role.toLowerCase()}`}>{user.role}</span>
              <button className="btn-logout" onClick={() => { logout(); setView('landing'); }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="auth-btns">
            <button
              className={`btn-secondary ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => setView('login')}
            >
              Login
            </button>
            <button
              className={`btn-primary ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => setView('register')}
            >
              Register
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
