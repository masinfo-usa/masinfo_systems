import { useState, useEffect } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Users({ api, restaurants, currentUser }) {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  // Create form
  const [newUsername, setNewUsername]   = useState('')
  const [newName, setNewName]           = useState('')
  const [newPassword, setNewPassword]   = useState('')
  const [newRestaurant, setNewRestaurant] = useState('')
  const [creating, setCreating]         = useState(false)
  const [createError, setCreateError]   = useState('')
  const [showNewPass, setShowNewPass]   = useState(false)

  // Change password
  const [changingId, setChangingId]     = useState(null)  // userId being edited
  const [changePass, setChangePass]     = useState('')
  const [showChangePass, setShowChangePass] = useState(false)
  const [changingLoading, setChangingLoading] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/auth/admin/users')
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createUser(e) {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      await api.post('/api/auth/admin/users', {
        username: newUsername,
        password: newPassword,
        name: newName,
        restaurantId: newRestaurant || null,
      })
      setNewUsername('')
      setNewName('')
      setNewPassword('')
      setNewRestaurant('')
      await load()
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  async function deleteUser(id, username) {
    if (!window.confirm(`Delete user "${username}"?`)) return
    try {
      await api.delete(`/api/auth/admin/users/${id}`)
      setUsers(us => us.filter(u => u._id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  async function savePassword(userId) {
    if (changePass.length < 6) { alert('Password must be at least 6 characters'); return }
    setChangingLoading(true)
    try {
      await api.patch(`/api/auth/admin/users/${userId}/password`, { password: changePass })
      setChangingId(null)
      setChangePass('')
    } catch (e) {
      alert(e.message)
    } finally {
      setChangingLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-xl font-bold text-text-primary">Admin Users</h1>

      {/* ── Create new user ─────────────────────────────────────────────── */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-secondary">Create Client Login</h2>
        <form onSubmit={createUser} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Username</label>
              <input
                type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)}
                required autoCapitalize="none" autoCorrect="off" placeholder="e.g. mezquite"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold placeholder-text-muted"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Display name</label>
              <input
                type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Mezquite Valley"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold placeholder-text-muted"
              />
            </div>
            <div className="relative">
              <label className="text-xs text-text-muted mb-1 block">Password</label>
              <input
                type={showNewPass ? 'text' : 'password'} value={newPassword}
                onChange={e => setNewPassword(e.target.value)} required placeholder="Min 6 characters"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 pr-9 text-text-primary text-sm focus:outline-none focus:border-gold placeholder-text-muted"
              />
              <button type="button" onClick={() => setShowNewPass(s => !s)}
                className="absolute right-2.5 bottom-2 text-text-muted hover:text-text-secondary">
                {showNewPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Restaurant</label>
              <select value={newRestaurant} onChange={e => setNewRestaurant(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold">
                <option value="">— Select restaurant —</option>
                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          {createError && <p className="text-red-400 text-xs">{createError}</p>}
          <button type="submit" disabled={creating}
            className="bg-gold text-bg-deep text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
            {creating ? 'Creating…' : 'Create User'}
          </button>
        </form>
      </div>

      {/* ── User list ───────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text-secondary">Existing Users</h2>
        {error   && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-text-muted text-sm">Loading…</p>}
        {!loading && users.map(u => (
          <div key={u._id} className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-text-primary font-medium text-sm">
                  {u.name || u.username}
                  {u.role === 'superadmin' && (
                    <span className="ml-2 text-xs text-gold border border-gold px-1.5 py-0.5 rounded">superadmin</span>
                  )}
                </p>
                <p className="text-text-muted text-xs mt-0.5">@{u.username}</p>
                <p className="text-text-muted text-xs">
                  {u.restaurantId ? `Restaurant: ${u.restaurantId.name}` : 'All restaurants'}
                </p>
              </div>
              {u.role !== 'superadmin' && (
                <button onClick={() => deleteUser(u._id, u.username)}
                  className="text-xs border border-red-900 text-red-400 px-2.5 py-1 rounded-lg hover:border-red-700 transition-colors shrink-0">
                  Delete
                </button>
              )}
            </div>

            {/* Change password (own account always, any client if superadmin) */}
            {(currentUser.id === u._id || currentUser.role === 'superadmin') && (
              changingId === u._id ? (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showChangePass ? 'text' : 'password'}
                      value={changePass}
                      onChange={e => setChangePass(e.target.value)}
                      placeholder="New password"
                      className="w-full bg-bg border border-border rounded-lg px-3 py-1.5 pr-8 text-text-primary text-xs focus:outline-none focus:border-gold placeholder-text-muted"
                    />
                    <button type="button" onClick={() => setShowChangePass(s => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                      {showChangePass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                  <button onClick={() => savePassword(u._id)} disabled={changingLoading}
                    className="text-xs bg-gold text-bg-deep px-3 py-1.5 rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-50">
                    {changingLoading ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => { setChangingId(null); setChangePass('') }}
                    className="text-xs border border-border text-text-muted px-3 py-1.5 rounded-lg hover:border-border-light transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => { setChangingId(u._id); setChangePass(''); setShowChangePass(false) }}
                  className="text-xs border border-border text-text-muted px-3 py-1.5 rounded-lg hover:border-border-light transition-colors">
                  Change password
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}