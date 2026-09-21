import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

export default function AdminDashboard({
  onOpenCreate,
  onOpenUpdateStatus,
  onOpenDetails,
  refreshTrigger,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  showToast
}) {
  const { apiFetch } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

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

  async function handleDelete(trackingId) {
    const confirmMessage = `⚠️ PERMANENT DELETION CONFIRMATION:\n\nAre you sure you want to delete shipment "${trackingId}"? This operation cannot be reversed.`
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      await apiFetch(`/api/shipments/${trackingId}`, {
        method: 'DELETE'
      })
      setShipments(prev => prev.filter(s => s.trackingId !== trackingId))
      showToast && showToast(`Shipment ${trackingId} deleted successfully.`, 'info')
    } catch (err) {
      showToast && showToast(`Deletion failed: ${err.message}`, 'error')
    }
  }

  const totalCount = shipments.length
  const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length
  const inTransitCount = shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'AT_DISTRIBUTION_HUB').length
  const outForDeliveryCount = shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length

  const filteredShipments = shipments.filter(s => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !query ||
      s.trackingId.toLowerCase().includes(query) ||
      s.senderName.toLowerCase().includes(query) ||
      s.receiverName.toLowerCase().includes(query) ||
      s.origin.toLowerCase().includes(query) ||
      s.destination.toLowerCase().includes(query)

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="dashboard-layout">
      <Sidebar
        role="ADMIN"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreate={onOpenCreate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={onCloseMobileSidebar}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMINISTRATOR PORTAL</p>
            <h2>Logistics Control Center</h2>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchShipments}>
              🔄 Refresh
            </button>
            <button className="btn-primary" onClick={onOpenCreate}>
              ➕ Create Shipment
            </button>
          </div>
        </div>

        {error && <div className="notice notice-error">{error}</div>}

        {/* Live Metric Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Shipments</span>
            <strong className="stat-value">{totalCount}</strong>
            <span className="stat-sub">Live records in system</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">In Transit</span>
            <strong className="stat-value text-indigo">{inTransitCount}</strong>
            <span className="stat-sub">Active in transit network</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Out for Delivery</span>
            <strong className="stat-value text-teal">{outForDeliveryCount}</strong>
            <span className="stat-sub">Courier final delivery</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Delivered Shipments</span>
            <strong className="stat-value text-emerald">{deliveredCount}</strong>
            <span className="stat-sub">Completed orders</span>
          </div>
        </section>

        {/* Table & Filtering */}
        <section className="table-section">
          <div className="table-controls">
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tracking ID, sender, receiver, route..."
              />
            </div>

            <div className="filter-pills">
              <button
                className={`pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All ({totalCount})
              </button>
              <button
                className={`pill ${statusFilter === 'ORDER_PLACED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ORDER_PLACED')}
              >
                Order Placed
              </button>
              <button
                className={`pill ${statusFilter === 'IN_TRANSIT' ? 'active' : ''}`}
                onClick={() => setStatusFilter('IN_TRANSIT')}
              >
                In Transit
              </button>
              <button
                className={`pill ${statusFilter === 'AT_DISTRIBUTION_HUB' ? 'active' : ''}`}
                onClick={() => setStatusFilter('AT_DISTRIBUTION_HUB')}
              >
                At Hub
              </button>
              <button
                className={`pill ${statusFilter === 'OUT_FOR_DELIVERY' ? 'active' : ''}`}
                onClick={() => setStatusFilter('OUT_FOR_DELIVERY')}
              >
                Out for Delivery
              </button>
              <button
                className={`pill ${statusFilter === 'DELIVERED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('DELIVERED')}
              >
                Delivered
              </button>
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
                <p>No shipments match your criteria.</p>
                <button className="btn-secondary btn-small" onClick={onOpenCreate}>
                  Create a new shipment
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
                    <th>Actions</th>
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
                      <td className="actions-cell">
                        <button
                          className="btn-icon"
                          title="View Shipment Details & History"
                          onClick={() => onOpenDetails(s)}
                        >
                          👁️
                        </button>
                        <button
                          className="btn-icon"
                          title="Update Status & Location"
                          onClick={() => onOpenUpdateStatus(s)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          title="Delete Shipment"
                          onClick={() => handleDelete(s.trackingId)}
                        >
                          🗑️
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
