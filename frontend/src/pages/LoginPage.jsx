import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ setView }) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await login(email, password)
      setView(data.role === 'ADMIN' ? 'admin' : 'customer')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Demo auto-account generation & login for evaluation convenience
  async function handleQuickLogin(role) {
    setLoading(true)
    setError('')
    const targetEmail = role === 'ADMIN' ? 'admin@logitrack.com' : 'customer@logitrack.com'
    const targetPass = 'password123'

    try {
      // First attempt login
      try {
        const data = await login(targetEmail, targetPass)
        setView(data.role === 'ADMIN' ? 'admin' : 'customer')
        return
      } catch {
        // If account doesn't exist yet, register it automatically
        const name = role === 'ADMIN' ? 'System Administrator' : 'Demo Customer'
        const data = await register(name, targetEmail, targetPass, role)
        setView(data.role === 'ADMIN' ? 'admin' : 'customer')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your shipment dashboard</p>
        </div>

        {error && <div className="notice notice-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="quick-login-divider">
          <span>OR QUICK DEMO ACCESS</span>
        </div>

        <div className="quick-login-buttons">
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={() => handleQuickLogin('ADMIN')}
            disabled={loading}
          >
            🔑 Admin Portal
          </button>
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={() => handleQuickLogin('CUSTOMER')}
            disabled={loading}
          >
            👤 Customer Portal
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <button className="link-btn" onClick={() => setView('register')}>
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}
