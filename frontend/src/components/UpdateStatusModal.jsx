import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UpdateStatusModal({ isOpen, shipment, onClose, onUpdated }) {
  const { apiFetch } = useAuth()
  const [status, setStatus] = useState(shipment?.status || 'IN_TRANSIT')
  const [location, setLocation] = useState(shipment?.destination || '')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !shipment) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updated = await apiFetch(`/api/shipments/${shipment.trackingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          location: location || shipment.destination,
          remarks: remarks || `Status updated to ${status}`
        })
      })

      onUpdated(updated)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Shipment Status</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="shipment-summary-pill">
          <strong>{shipment.trackingId}</strong> • {shipment.senderName} → {shipment.receiverName}
        </div>

        {error && <div className="notice notice-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>New Status *</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            >
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="AT_DISTRIBUTION_HUB">At Distribution Hub</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder={`e.g. ${shipment.destination}`}
            />
          </div>

          <div className="form-group">
            <label>Status Update Note / Remarks</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Scanned at regional sorting facility."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
