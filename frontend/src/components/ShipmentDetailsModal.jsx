import React from 'react'
import StatusBadge from './StatusBadge'
import StatusTimeline from './StatusTimeline'

export default function ShipmentDetailsModal({ isOpen, shipment, onClose, onOpenStatusUpdate }) {
  if (!isOpen || !shipment) return null

  function formatDate(isoString) {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">SHIPMENT DETAILS</span>
            <h3>{shipment.trackingId}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="details-grid">
          <div className="detail-card">
            <span className="detail-label">Status</span>
            <div className="detail-value"><StatusBadge status={shipment.status} /></div>
          </div>
          <div className="detail-card">
            <span className="detail-label">Sender</span>
            <div className="detail-value"><strong>{shipment.senderName}</strong></div>
          </div>
          <div className="detail-card">
            <span className="detail-label">Receiver</span>
            <div className="detail-value"><strong>{shipment.receiverName}</strong></div>
          </div>
          <div className="detail-card">
            <span className="detail-label">Route</span>
            <div className="detail-value">{shipment.origin} → {shipment.destination}</div>
          </div>
        </div>

        <div className="route-banner">
          <div className="route-point">
            <span>ORIGIN</span>
            <strong>{shipment.origin}</strong>
          </div>
          <div className="route-arrow">➔</div>
          <div className="route-point">
            <span>DESTINATION</span>
            <strong>{shipment.destination}</strong>
          </div>
        </div>

        <div className="details-section">
          <StatusTimeline currentStatus={shipment.status} history={shipment.statusHistory || []} />
        </div>

        <div className="meta-footer">
          <span>Created: {formatDate(shipment.createdAt)}</span>
          <span>Last Updated: {formatDate(shipment.updatedAt)}</span>
        </div>

        <div className="modal-actions">
          {onOpenStatusUpdate && (
            <button className="btn-primary" onClick={() => { onClose(); onOpenStatusUpdate(shipment); }}>
              Update Status
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
