import { useState, useEffect } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { makeApi } from './admin/useAdminApi'
import { useOrderPolling } from './admin/useOrderPolling'
import AdminLayout from './admin/AdminLayout'
import Overview from './admin/Overview'
import Orders from './admin/Orders'
import Customers from './admin/Customers'
import Restaurants from './admin/Restaurants'
import Users from './admin/Users'

const BASE = import.meta.env.VITE_API_URL

function getSession() {
  try {
    const raw = sessionStorage.getItem('admin_session')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export default function AdminPage() {
  const [session, setSession]   = useState(getSession)   // { token, user }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginError, setLoginError]     = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [section, setSection]                       = useState('overview')
  const [restaurants, setRestaurants]               = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  const authed = !!session?.token
  const api    = session ? makeApi(session.token) : null
  const role   = session?.user?.role  // 'superadmin' | 'client'

  const { placedCount, lastNewAt } = useOrderPolling(authed ? api : null, selectedRestaurant)

  async function login() {
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch(`${BASE}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      const sess = { token: data.token, user: data.user }
      sessionStorage.setItem('admin_session', JSON.stringify(sess))
      setSession(sess)
    } catch (e) {
      setLoginError(e.message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function fetchRestaurants() {
    try {
      const data = await api.get('/api/db/restaurants')
      const list = data.data || data
      return Array.isArray(list) ? list : []
    } catch (e) {
      console.error('Failed to load restaurants', e)
      return []
    }
  }

  useEffect(() => {
    if (!authed) return
    fetchRestaurants().then(list => {
      setRestaurants(list)
      // Client users are auto-locked to their restaurant
      if (role === 'client' && session.user.restaurantId) {
        const r = list.find(r => r._id === session.user.restaurantId?.toString?.() || r._id === session.user.restaurantId)
        if (r) setSelectedRestaurant(r)
      }
    })
  }, [authed])

  function logout() {
    sessionStorage.removeItem('admin_session')
    setSession(null)
    setUsername('')
    setPassword('')
    setRestaurants([])
    setSelectedRestaurant(null)
    setSection('overview')
  }

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
        <div className="w-full max-w-sm bg-bg-card border border-border rounded-xl p-8 space-y-5">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Masinfo Systems</p>
            <h1 className="text-xl font-bold text-text-primary">Admin Access</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold text-sm"
          />
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 pr-10 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
          <button
            onClick={login}
            disabled={loginLoading || !username || !password}
            className="w-full bg-gold text-bg-deep font-semibold py-2.5 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <AdminLayout
      section={section}
      setSection={setSection}
      restaurants={restaurants}
      selectedRestaurant={selectedRestaurant}
      setSelectedRestaurant={setSelectedRestaurant}
      onLogout={logout}
      role={role}
      userName={session.user.name || session.user.username}
      userId={session.user.id}
      api={api}
      placedCount={placedCount}
      onRestaurantUpdate={updated => {
        setRestaurants(rs => rs.map(r => r._id === updated._id ? updated : r))
        setSelectedRestaurant(updated)
      }}
    >
      {section === 'overview'     && <Overview     api={api} selectedRestaurant={selectedRestaurant} />}
      {section === 'orders'       && <Orders       api={api} selectedRestaurant={selectedRestaurant} lastNewAt={lastNewAt} />}
      {section === 'customers'    && <Customers    api={api} selectedRestaurant={selectedRestaurant} />}
      {section === 'restaurants'  && <Restaurants  api={api} restaurants={restaurants} onRefresh={() => fetchRestaurants().then(setRestaurants)} />}
      {section === 'users'        && <Users        api={api} restaurants={restaurants} currentUser={session.user} />}
    </AdminLayout>
  )
}