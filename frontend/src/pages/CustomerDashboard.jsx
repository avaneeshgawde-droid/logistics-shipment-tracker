import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

export default function CustomerDashboard({
  onOpenCreate,
  onOpenDetails,
  refreshTrigger,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) {
  const { user, apiFetch } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchShipments() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/shipments')
      setShipments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [refreshTrigger])

  const filteredShipments = shipments.filter(s => {
    const query = searchQuery.toLowerCase().trim()
    return (
      !query ||
      s.trackingId.toLowerCase().includes(query) ||
      s.senderName.toLowerCase().includes(query) ||
      s.receiverName.toLowerCase().includes(query) ||
      s.origin.toLowerCase().includes(query) ||
      s.destination.toLowerCase().includes(query)
    )
  })

  const activeCount = shipments.filter(s => s.status !== 'DELIVERED').length
  const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length

  return (
    <div className="dashboard-layout">
      <Sidebar
        role="CUSTOMER"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreate={onOpenCreate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={onCloseMobileSidebar}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">CUSTOMER PORTAL</p>
            <h2>Hello, {user?.name || 'Valued Customer'}</h2>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchShipments}>
              🔄 Refresh
            </button>
            <button className="btn-primary" onClick={onOpenCreate}>
              📦 Book Shipment
            </button>
          </div>
        </div>

        {error && <div className="notice notice-error">{error}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">My Total Orders</span>
            <strong className="stat-value">{shipments.length}</strong>
            <span className="stat-sub">Registered shipments</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Orders</span>
            <strong className="stat-value text-indigo">{activeCount}</strong>
            <span className="stat-sub">In progress or transit</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Delivered Orders</span>
            <strong className="stat-value text-emerald">{deliveredCount}</strong>
            <span className="stat-sub">Completed deliveries</span>
          </div>
        </section>

        <section className="table-section">
          <div className="table-controls">
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tracking ID, recipient, or location..."
              />
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="skeleton-container">
                <div className="skeleton-row" />
                <div className="skeleton-row" />
                <div className="skeleton-row" />
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="empty-state">
                <p>No shipments found.</p>
                <button className="btn-primary btn-small" onClick={onOpenCreate}>
                  Book a new shipment
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map(s => (
                    <tr key={s.id}>
                      <td className="font-bold tracking-code">{s.trackingId}</td>
                      <td>{s.senderName}</td>
                      <td>{s.receiverName}</td>
                      <td>{s.origin} ➔ {s.destination}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <button
                          className="btn-secondary btn-small"
                          onClick={() => onOpenDetails(s)}
                        >
                          View Progress ➔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
