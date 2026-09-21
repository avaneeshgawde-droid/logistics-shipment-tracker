import React from 'react'

export default function Sidebar({ role, activeTab, setActiveTab, onOpenCreate, isMobileOpen, onCloseMobile }) {
  const isAdmin = role === 'ADMIN'

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-section">
          <p className="sidebar-title">NAVIGATION</p>
          <button
            className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); onCloseMobile && onCloseMobile(); }}
          >
            📊 Overview
          </button>
          <button
            className={`sidebar-item ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('shipments'); onCloseMobile && onCloseMobile(); }}
          >
            📦 {isAdmin ? 'All Shipments' : 'My Shipments'}
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-title">ACTIONS</p>
          <button
            className="sidebar-item btn-action-item"
            onClick={() => { onOpenCreate(); onCloseMobile && onCloseMobile(); }}
          >
            ➕ {isAdmin ? 'Create Shipment' : 'Book Shipment'}
          </button>
        </div>

        <div className="sidebar-info-box">
          <span className="info-title">System Health</span>
          <div className="status-indicator">
            <span className="dot online" /> Spring Boot API
          </div>
          <small>Version 0.0.1-SNAPSHOT</small>
        </div>
      </aside>
    </>
  )
}
