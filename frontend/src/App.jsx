import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ToastNotification from './components/ToastNotification'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import CreateShipmentModal from './components/CreateShipmentModal'
import UpdateStatusModal from './components/UpdateStatusModal'
import ShipmentDetailsModal from './components/ShipmentDetailsModal'

function MainContent() {
  const { user } = useAuth()
  const [currentView, setView] = useState('landing')

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Floating Toast Notification state
  const [toast, setToast] = useState(null)

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  function showToast(message, type = 'info') {
    setToast({ message, type })
  }

  function triggerRefresh() {
    setRefreshTrigger(Date.now())
  }

  // Enforce Role Access Control
  useEffect(() => {
    if (currentView === 'admin' && user?.role !== 'ADMIN') {
      setView(user ? 'customer' : 'login')
    }
  }, [currentView, user])

  function handleOpenDetails(shipment) {
    setSelectedShipment(shipment)
    setIsDetailsOpen(true)
  }

  function handleOpenUpdateStatus(shipment) {
    if (user?.role !== 'ADMIN') {
      showToast('Only Administrators can update shipment status.', 'error')
      return
    }
    setSelectedShipment(shipment)
    setIsUpdateStatusOpen(true)
  }

  function renderView() {
    switch (currentView) {
      case 'login':
        return <LoginPage setView={setView} />
      case 'register':
        return <RegisterPage setView={setView} />
      case 'admin':
        if (user?.role !== 'ADMIN') {
          return <LoginPage setView={setView} />
        }
        return (
          <AdminDashboard
            onOpenCreate={() => setIsCreateOpen(true)}
            onOpenUpdateStatus={handleOpenUpdateStatus}
            onOpenDetails={handleOpenDetails}
            refreshTrigger={refreshTrigger}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
            showToast={showToast}
          />
        )
      case 'customer':
        return (
          <CustomerDashboard
            onOpenCreate={() => setIsCreateOpen(true)}
            onOpenDetails={handleOpenDetails}
            refreshTrigger={refreshTrigger}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          />
        )
      case 'landing':
      default:
        return <LandingPage onSelectShipment={handleOpenDetails} />
    }
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setView={setView}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {renderView()}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Modals */}
      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newShipment) => {
          triggerRefresh()
          showToast(`Shipment ${newShipment.trackingId} created successfully!`, 'success')
        }}
      />

      <UpdateStatusModal
        isOpen={isUpdateStatusOpen}
        shipment={selectedShipment}
        onClose={() => { setIsUpdateStatusOpen(false); setSelectedShipment(null); }}
        onUpdated={(updated) => {
          triggerRefresh()
          showToast(`Shipment ${updated.trackingId} updated to ${updated.status}`, 'success')
        }}
      />

      <ShipmentDetailsModal
        isOpen={isDetailsOpen}
        shipment={selectedShipment}
        onClose={() => { setIsDetailsOpen(false); setSelectedShipment(null); }}
        onOpenStatusUpdate={user?.role === 'ADMIN' ? handleOpenUpdateStatus : null}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}
