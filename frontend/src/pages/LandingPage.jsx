import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import StatusTimeline from '../components/StatusTimeline'

export default function LandingPage() {
  const { apiFetch } = useAuth()
  const [trackingId, setTrackingId] = useState('')
  const [searchedShipment, setSearchedShipment] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    const query = trackingId.trim()
    if (!query) return

    setLoading(true)
    setError('')
    setSearchedShipment(null)
    setHistory([])

    try {
      const shipmentData = await apiFetch(`/api/shipments/${query}`)
      setSearchedShipment(shipmentData)

      try {
        const historyData = await apiFetch(`/api/shipments/${query}/history`)
        setHistory(historyData || [])
      } catch {
        // Fallback to embedded status history
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">INTELLIGENT LOGISTICS PLATFORM</span>
          <h1>Track your shipment<br />every step of the way.</h1>
          <p className="hero-subtitle">
            Real-time package updates, location history, and operational visibility powered by Java Spring Boot & React.
          </p>

          <form className="search-card" onSubmit={handleSearch}>
            <label htmlFor="trackingInput">Track your package</label>
            <div className="search-input-group">
              <input
                id="trackingInput"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. TRK-A8B9C0D1)"
              />
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? 'Searching...' : 'Track Package'}
              </button>
            </div>
          </form>

          {error && <div className="notice notice-error">{error}</div>}

          {searchedShipment && (
            <div className="search-result-card">
              <div className="result-header">
                <div>
                  <span className="result-tracking">{searchedShipment.trackingId}</span>
                  <p className="result-route">{searchedShipment.origin} ➔ {searchedShipment.destination}</p>
                </div>
                <StatusBadge status={searchedShipment.status} />
              </div>

              <div className="result-parties">
                <div><span>Sender:</span> {searchedShipment.senderName}</div>
                <div><span>Receiver:</span> {searchedShipment.receiverName}</div>
              </div>

              <StatusTimeline
                currentStatus={searchedShipment.status}
                history={history.length > 0 ? history : searchedShipment.statusHistory || []}
              />
            </div>
          )}
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-Time Tracking</h3>
          <p>Instant status updates and location progress for every package in transit.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure Authentication</h3>
          <p>Role-based security ensuring authorized access for customers and administrators.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📜</div>
          <h3>Complete Audit History</h3>
          <p>Detailed event logs capturing timestamped location changes and notes.</p>
        </div>
      </section>
    </div>
  )
}
