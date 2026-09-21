import React from 'react'

export const statusConfig = {
  ORDER_PLACED: {
    label: 'Order Placed',
    className: 'badge-amber',
    icon: '📝'
  },
  PICKED_UP: {
    label: 'Picked Up',
    className: 'badge-blue',
    icon: '📦'
  },
  IN_TRANSIT: {
    label: 'In Transit',
    className: 'badge-indigo',
    icon: '🚚'
  },
  AT_DISTRIBUTION_HUB: {
    label: 'At Hub',
    className: 'badge-purple',
    icon: '🏢'
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    className: 'badge-teal',
    icon: '⚡'
  },
  DELIVERED: {
    label: 'Delivered',
    className: 'badge-emerald',
    icon: '✅'
  }
}

export default function StatusBadge({ status, showIcon = true }) {
  const config = statusConfig[status] || {
    label: status,
    className: 'badge-gray',
    icon: '📌'
  }

  return (
    <span className={`status-badge ${config.className}`}>
      {showIcon && <span className="badge-icon">{config.icon}</span>}
      <span className="badge-text">{config.label}</span>
    </span>
  )
}
