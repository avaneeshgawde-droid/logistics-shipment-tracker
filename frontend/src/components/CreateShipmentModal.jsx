import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CreateShipmentModal({ isOpen, onClose, onCreated }) {
  const { apiFetch } = useAuth()
  const [senderName, setSenderName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [initialStatus, setInitialStatus] = useState('ORDER_PLACED')
  const [remarks, setRemarks] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!senderName || !receiverName || !origin || !destination) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const created = await apiFetch('/api/shipments', {
        method: 'POST',
        body: JSON.stringify({
          senderName,
          receiverName,
          origin,
          destination,
          initialStatus,
          remarks: remarks || 'Shipment order created.'
        })
      })

      onCreated(created)
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
          <h3>Create New Shipment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="notice notice-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Sender Name *</label>
              <input
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Receiver Name *</label>
              <input
                value={receiverName}
                onChange={e => setReceiverName(e.target.value)}
                placeholder="e.g. Jane Smith"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Origin Location *</label>
              <input
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="e.g. New York Hub"
                required
              />
            </div>
            <div className="form-group">
              <label>Destination Location *</label>
              <input
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Los Angeles Warehouse"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Initial Status</label>
            <select
              value={initialStatus}
              onChange={e => setInitialStatus(e.target.value)}
            >
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="AT_DISTRIBUTION_HUB">At Distribution Hub</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes / Remarks</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Fragile items included, handle with care."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
