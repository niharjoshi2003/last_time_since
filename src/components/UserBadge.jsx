import React, { useState, useRef, useEffect } from 'react'
import { User, LogOut, Cloud, ChevronDown } from 'lucide-react'

const UserBadge = ({ user, onSignOut, onOpenAuth }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleSignOut = async () => {
    await onSignOut()
    setDropdownOpen(false)
  }

  if (user) {
    const userInitial = user.email?.[0]?.toUpperCase() || 'U'

    return (
      <div className="user-badge" ref={dropdownRef}>
        <button
          type="button"
          className="user-badge-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="user-avatar">{userInitial}</div>
          <span className="user-email">{user.email}</span>
          <ChevronDown size={16} className={`user-chevron ${dropdownOpen ? 'open' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="user-dropdown">
            <div className="user-dropdown-item">
              <User size={16} />
              <span>{user.email}</span>
            </div>
            <div className="user-dropdown-divider" />
            <button
              type="button"
              className="user-dropdown-item user-dropdown-action"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button type="button" className="guest-badge" onClick={onOpenAuth}>
      <Cloud size={16} />
      <span>Save to Cloud</span>
    </button>
  )
}

export default UserBadge
