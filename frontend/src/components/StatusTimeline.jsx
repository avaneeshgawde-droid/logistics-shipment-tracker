import React from 'react'
import StatusBadge from './StatusBadge'

const STAGES = [
  { key: 'ORDER_PLACED', label: 'Order Placed' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'AT_DISTRIBUTION_HUB', label: 'Distribution Hub' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' }
]

export default function StatusTimeline({ currentStatus, history = [] }) {
  // Find current stage index in 6-stage timeline
  const currentStageIndex = STAGES.findIndex(s => s.key === currentStatus)

  function formatDate(isoString) {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="timeline-container">
      {/* 6-Stage Visual Stepper */}
      <div className="stepper">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentStageIndex && currentStageIndex !== -1
          const isCurrent = idx === currentStageIndex

          return (
            <div
              key={stage.key}
              className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="step-circle">
                {isCompleted ? (isCurrent ? '●' : '✓') : idx + 1}
              </div>
              <span className="step-label">{stage.label}</span>
              {idx < STAGES.length - 1 && (
                <div className={`step-line ${idx < currentStageIndex ? 'completed' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Historical Event Log */}
      <div className="history-log">
        <h4 className="log-title">Tracking History & Activity</h4>
        {history.length === 0 ? (
          <p className="no-history">No location updates logged yet.</p>
        ) : (
          <div className="log-list">
            {history.map((event, idx) => (
              <div key={event.id || idx} className="log-item">
                <div className="log-marker" />
                <div className="log-content">
                  <div className="log-header">
                    <StatusBadge status={event.status} />
                    <span className="log-time">{formatDate(event.timestamp)}</span>
                  </div>
                  {event.location && (
                    <div className="log-location">
                      📍 <strong>{event.location}</strong>
                    </div>
                  )}
                  {event.remarks && <p className="log-remarks">{event.remarks}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
