import React, { useState } from 'react'
import { X, Mail, Lock,  Check } from 'lucide-react'

const AuthModal = ({ isOpen, onClose, onSignUp, onSignIn, onContinueAsGuest, migrating, migratedCount }) => {
  const [tab, setTab] = useState('signup') // 'signup' or 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (tab === 'signup') {
        const { error: signUpError } = await onSignUp(email, password)
        if (signUpError) {
          setError(signUpError)
        } else {
          setSuccess('Account created! Migrating your tasks...')
        }
      } else {
        const { error: signInError } = await onSignIn(email, password)
        if (signInError) {
          setError(signInError)
        } else {
          setSuccess('Signed in successfully!')
          setTimeout(() => {
            onClose()
          }, 1000)
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueAsGuest = () => {
    onContinueAsGuest()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {migrating ? 'Migrating to Cloud...' : tab === 'signup' ? 'Create Account' : 'Sign In'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {migrating ? (
          <div className="migration-progress">
            <div className="migration-spinner" />
            <p className="migration-text">
              Migrating {migratedCount > 0 ? `${migratedCount} ` : ''}tasks to cloud...
            </p>
            <p className="migration-subtext">This will only take a moment</p>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setTab('signup')
                  setError('')
                  setSuccess('')
                }}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => {
                  setTab('signin')
                  setError('')
                  setSuccess('')
                }}
              >
                Sign In
              </button>
            </div>

            {tab === 'signup' && (
              <div className="auth-benefits">
                <div className="auth-benefit">
                  <Check size={18} />
                  <span>Sync across devices</span>
                </div>
                <div className="auth-benefit">
                  <Check size={18} />
                  <span>Never lose your data</span>
                </div>
                <div className="auth-benefit">
                  <Check size={18} />
                  <span>Automatic backup</span>
                </div>
              </div>
            )}

            <form className="modal-form auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              <label className="form-label">
                <span>Email</span>
                <div className="form-input-wrapper">
                  <Mail size={18} className="form-input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </label>

              <label className="form-label">
                <span>Password</span>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleContinueAsGuest}
                >
                  Continue as Guest
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Please wait...' : tab === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthModal
