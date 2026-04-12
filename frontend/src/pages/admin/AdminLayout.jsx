import { useState } from 'react'
import { FiMenu, FiX, FiLogOut, FiClock, FiEye, FiEyeOff, FiLock, FiChevronsDown, FiCheck } from 'react-icons/fi'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildNav(role) {
  const base = [
    { id: 'overview',   label: 'Overview' },
    { id: 'orders',     label: 'Orders' },
    { id: 'customers',  label: 'Customers' },
  ]
  if (role === 'superadmin') {
    base.push({ id: 'restaurants', label: 'Restaurants' })
    base.push({ id: 'users',       label: 'Users' })
  }
  return base
}

// ── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ userId, api, onClose }) {
  const [newPass, setNewPass]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  async function handleSave() {
    if (newPass.length < 6) { setError('Password must be at least 6 characters'); return }
    setSaving(true)
    setError('')
    try {
      await api.patch(`/api/auth/admin/users/${userId}/password`, { password: newPass })
      setDone(true)
      setTimeout(onClose, 1000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
      <div className="bg-bg-card border border-border rounded-xl p-5 w-full max-w-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Change Password</h3>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg border border-border text-text-muted hover:text-text-secondary hover:border-border-light transition-colors shrink-0"><FiX size={15} /></button>
        </div>

        {done ? (
          <p className="text-xs text-green-400 text-center py-2">Password updated!</p>
        ) : (
          <>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="New password (min 6 chars)"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 pr-9 text-text-primary text-xs placeholder-text-muted focus:outline-none focus:border-gold"
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showPass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 text-xs border border-border text-text-muted py-2 rounded-lg hover:border-border-light transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 text-xs bg-gold text-bg-deep font-semibold py-2 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Availability helpers ──────────────────────────────────────────────────────

function availabilityLabel(avail) {
  if (!avail || avail.status === 'open') return null
  if (avail.status === 'paused' && !avail.pausedUntil) return 'Temporarily unavailable'
  if (avail.pausedUntil) {
    const t = new Date(avail.pausedUntil)
    return `Available again at ${t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  return 'Unavailable'
}

function isOpen(avail) {
  if (!avail) return true
  if (avail.status === 'open') return true
  // Check if scheduled time has passed
  if (avail.pausedUntil && new Date(avail.pausedUntil) <= new Date()) return true
  return false
}

// ── Pause Modal ───────────────────────────────────────────────────────────────

function defaultCustomDateTime() {
  const d = new Date(Date.now() + 60 * 60000)  // now + 1 hour
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().slice(0, 5)     // "HH:MM"
  return { date, time }
}

function PauseModal({ type, onConfirm, onCancel }) {
  const [option, setOption] = useState('temp')   // 'temp' | '30' | '60' | 'custom'
  const def = defaultCustomDateTime()
  const [customDate, setCustomDate] = useState(def.date)
  const [customTime, setCustomTime] = useState(def.time)

  const label = type === 'pickup' ? 'Pickup' : 'Delivery'

  function resolveUntil() {
    if (option === 'temp')   return null
    if (option === '30')     return new Date(Date.now() + 30 * 60000)
    if (option === '60')     return new Date(Date.now() + 60 * 60000)
    if (option === 'custom' && customDate && customTime) {
      return new Date(`${customDate}T${customTime}`)
    }
    return null
  }

  function customerMessage() {
    const until = resolveUntil()
    if (!until) return `${label} is temporarily unavailable`
    return `${label} available again at ${until.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${
      until.toDateString() !== new Date().toDateString()
        ? `, ${until.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}`
        : ''
    }`
  }

  function handleConfirm() {
    onConfirm(resolveUntil())
  }

  const canConfirm = true

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
      <div className="bg-bg-card border border-border rounded-xl p-5 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Pause {label}</h3>
          <button onClick={onCancel} className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg border border-border text-text-muted hover:text-text-secondary hover:border-border-light transition-colors shrink-0"><FiX size={15} /></button>
        </div>

        <div className="space-y-2">
          {[
            { id: 'temp',   label: 'Temporarily unavailable', sub: 'You re-enable manually' },
            { id: '30',     label: 'Next 30 minutes',          sub: `Back at ${new Date(Date.now()+30*60000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` },
            { id: '60',     label: 'Next hour',                sub: `Back at ${new Date(Date.now()+60*60000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` },
            { id: 'custom', label: 'Choose date & time',       sub: null },
          ].map(o => (
            <label key={o.id} className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
              option === o.id ? 'border-gold bg-bg' : 'border-border hover:border-border-light'
            }`}>
              <input type="radio" name="pauseOption" value={o.id}
                checked={option === o.id} onChange={() => setOption(o.id)}
                className="mt-0.5 accent-yellow-400" />
              <div>
                <p className="text-sm text-text-primary">{o.label}</p>
                {o.sub && <p className="text-xs text-text-muted">{o.sub}</p>}
              </div>
            </label>
          ))}
        </div>

        {option === 'custom' && (
          <div className="flex gap-2">
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex-1 bg-bg border border-border rounded-lg px-2 py-1.5 text-text-primary text-xs focus:outline-none focus:border-gold" />
            <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)}
              className="flex-1 bg-bg border border-border rounded-lg px-2 py-1.5 text-text-primary text-xs focus:outline-none focus:border-gold" />
          </div>
        )}

        {/* Customer preview */}
        <div className="bg-bg border border-border rounded-lg px-3 py-2">
          <p className="text-xs text-text-muted mb-0.5">Customers will see:</p>
          <p className="text-xs text-text-secondary italic">"{customerMessage()}"</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 text-xs border border-border text-text-muted py-2 rounded-lg hover:border-border-light transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={!canConfirm}
            className="flex-1 text-xs bg-gold text-bg-deep font-semibold py-2 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
            Pause {label}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Hours Modal ───────────────────────────────────────────────────────────────

function HoursModal({ restaurant, onSave, onCancel, saving }) {
  const defaultHours = day => ({ day, open: null, close: null })

  function getHours(type) {
    const src = restaurant[type] || []
    return DAYS.map((_, i) => src.find(h => h.day === i) || defaultHours(i))
  }

  const [pickup,   setPickup]   = useState(() => getHours('pickupHours'))
  const [delivery, setDelivery] = useState(() => getHours('deliveryHours'))

  // Remember last open times so toggling back restores them instead of defaults
  const [savedTimes, setSavedTimes] = useState({})  // key: `${type}-${day}`

  function updateDay(type, day, field, value) {
    const setter = type === 'pickup' ? setPickup : setDelivery
    setter(prev => prev.map(h => h.day === day ? { ...h, [field]: value || null } : h))
  }

  function toggleClosed(type, day, becomingClosed) {
    const list   = type === 'pickup' ? pickup : delivery
    const setter = type === 'pickup' ? setPickup : setDelivery
    const key    = `${type}-${day}`

    if (becomingClosed) {
      // Save current times before closing
      const cur = list.find(h => h.day === day)
      if (cur?.open || cur?.close) {
        setSavedTimes(prev => ({ ...prev, [key]: { open: cur.open, close: cur.close } }))
      }
      setter(prev => prev.map(h => h.day === day ? { ...h, open: null, close: null } : h))
    } else {
      // Restore previously saved times, fall back to default only if never set
      const saved = savedTimes[key]
      setter(prev => prev.map(h => h.day === day
        ? { ...h, open: saved?.open || '11:00', close: saved?.close || '21:00' }
        : h
      ))
    }
  }

  function handleSave() {
    onSave({ pickupHours: pickup, deliveryHours: delivery })
  }

  function copyToAll(type, sourceDay) {
    const list = type === 'pickup' ? pickup : delivery
    const src = list.find(h => h.day === sourceDay)
    if (!src) return
    const setter = type === 'pickup' ? setPickup : setDelivery
    setter(prev => prev.map(h => ({ ...h, open: src.open, close: src.close })))
  }

  function HoursRow({ type, hours }) {
    return (
      <div className="space-y-1.5">
        {hours.map(h => {
          const closed = !h.open && !h.close
          return (
            <div key={h.day} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleClosed(type, h.day, !closed)}
                title={closed ? 'Click to open' : 'Click to close'}
                className={`shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  closed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {closed
                  ? <FiX size={11} className="text-white" />
                  : <FiCheck size={11} className="text-white" />
                }
              </button>
              <span className={`text-xs w-7 shrink-0 ${closed ? 'text-text-muted' : 'text-text-primary'}`}>
                {DAYS[h.day]}
              </span>
              {closed && (
                <span className="text-xs text-text-muted italic">Closed</span>
              )}
              {!closed && (
                <>
                  <input type="time" value={h.open || ''} onChange={e => updateDay(type, h.day, 'open', e.target.value)}
                    className="flex-1 bg-bg border border-border rounded px-1.5 py-1 text-text-primary text-xs focus:outline-none focus:border-gold" />
                  <span className="text-xs text-text-muted">–</span>
                  <input type="time" value={h.close || ''} onChange={e => updateDay(type, h.day, 'close', e.target.value)}
                    className="flex-1 bg-bg border border-border rounded px-1.5 py-1 text-text-primary text-xs focus:outline-none focus:border-gold" />
                  <button
                    type="button"
                    title="Copy to all days"
                    onClick={() => copyToAll(type, h.day)}
                    className="shrink-0 text-text-muted hover:text-gold transition-colors"
                  >
                    <FiChevronsDown size={15} />
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex flex-col md:items-center md:justify-center">
      {/* Full-screen on mobile, centered card on desktop */}
      <div className="flex flex-col w-full h-full bg-bg-card
                      md:h-auto md:max-h-[88vh] md:max-w-sm md:rounded-xl md:border md:border-border md:my-4 md:overflow-hidden">

        {/* Scrollable content — scrollbar hidden on both platforms */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 [&::-webkit-scrollbar]:hidden"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Operating Hours</h3>
            <button onClick={onCancel} className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg border border-border text-text-muted hover:text-text-secondary hover:border-border-light transition-colors shrink-0"><FiX size={15} /></button>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary mb-2">Pickup</p>
            <HoursRow type="pickup" hours={pickup} />
          </div>

          {restaurant.offersDelivery && (
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Delivery</p>
              <HoursRow type="delivery" hours={delivery} />
            </div>
          )}
        </div>

        {/* Sticky action buttons */}
        <div className="flex gap-2 p-4 border-t border-border bg-bg-card">
          <button onClick={onCancel}
            className="flex-1 text-xs border border-border text-text-muted py-2.5 rounded-lg hover:border-border-light transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 text-xs bg-gold text-bg-deep font-semibold py-2.5 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Hours'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Availability toggle row ───────────────────────────────────────────────────

function AvailabilityRow({ label, avail, onPause, onResume }) {
  const open = isOpen(avail)
  const pauseMsg = availabilityLabel(avail)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        <button
          onClick={open ? onPause : onResume}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${open ? 'bg-gold' : 'bg-border'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${open ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>
      {pauseMsg && (
        <p className="text-xs text-yellow-400 leading-tight">{pauseMsg}</p>
      )}
    </div>
  )
}

// ── Sidebar content ───────────────────────────────────────────────────────────

function SidebarContent({ section, setSection, restaurants, selectedRestaurant, setSelectedRestaurant, onLogout, onClose, role, userName, userId, api, onRestaurantUpdate, placedCount = 0 }) {
  const nav = buildNav(role)
  const [pauseFor, setPauseFor]       = useState(null)   // 'pickup' | 'delivery'
  const [showHours, setShowHours]     = useState(false)
  const [savingHours, setSavingHours] = useState(false)
  const [toggling, setToggling]       = useState(null)
  const [showChangePass, setShowChangePass] = useState(false)

  const r = selectedRestaurant

  async function applyAvailability(type, status, pausedUntil) {
    if (!r) return
    setToggling(type)
    try {
      const field = type === 'pickup' ? 'pickupAvailability' : 'deliveryAvailability'
      const res = await api.put(`/api/db/restaurants/${r._id}`, {
        [field]: { status, pausedUntil: pausedUntil || null },
      })
      onRestaurantUpdate({ ...r, [field]: res.data?.[field] || { status, pausedUntil } })
    } catch (e) {
      alert(e.message)
    } finally {
      setToggling(null)
    }
  }

  async function saveHours(hours) {
    if (!r) return
    setSavingHours(true)
    try {
      await api.put(`/api/db/restaurants/${r._id}`, hours)
      onRestaurantUpdate({ ...r, ...hours })
      setShowHours(false)
    } catch (e) {
      alert(e.message)
    } finally {
      setSavingHours(false)
    }
  }

  function handlePauseConfirm(pausedUntil) {
    const status = pausedUntil ? 'scheduled' : 'paused'
    applyAvailability(pauseFor, status, pausedUntil)
    setPauseFor(null)
  }

  function navigate(id) {
    setSection(id)
    onClose?.()
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Masinfo</p>
        <p className="text-gold font-bold text-lg leading-tight">Admin</p>
        {userName && <p className="text-xs text-text-muted mt-1">{userName}</p>}
      </div>

      {/* Restaurant selector — superadmin only */}
      {role === 'superadmin' && restaurants.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text-muted mb-1">Restaurant</p>
          <select
            value={r?._id || ''}
            onChange={e => {
              setSelectedRestaurant(restaurants.find(x => x._id === e.target.value) || null)
              onClose?.()
            }}
            className="w-full bg-bg-card border border-border rounded-lg px-2 py-1.5 text-text-primary text-xs focus:outline-none focus:border-gold"
          >
            <option value="">All</option>
            {restaurants.map(x => <option key={x._id} value={x._id}>{x.name}</option>)}
          </select>
        </div>
      )}

      {/* Availability + hours — only when a restaurant is selected */}
      {r && (
        <div className="mb-5 bg-bg-card border border-border rounded-lg px-3 py-2.5 space-y-2.5">
          <p className="text-xs text-text-muted">Orders</p>

          <AvailabilityRow
            label="Pickup"
            avail={r.pickupAvailability}
            onPause={() => setPauseFor('pickup')}
            onResume={() => {
              if (window.confirm('Enable pickup orders? Customers will be able to place pickup orders.'))
                applyAvailability('pickup', 'open', null)
            }}
          />

          {r.offersDelivery && (
            <AvailabilityRow
              label="Delivery"
              avail={r.deliveryAvailability}
              onPause={() => setPauseFor('delivery')}
              onResume={() => {
                if (window.confirm('Enable delivery orders? Customers will be able to place delivery orders.'))
                  applyAvailability('delivery', 'open', null)
              }}
            />
          )}

          <button onClick={() => setShowHours(true)}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-border text-text-muted rounded-lg py-1.5 hover:border-gold hover:text-gold transition-colors">
            <FiClock size={12} /> Working Hours
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(n => (
          <button key={n.id} onClick={() => navigate(n.id)}
            className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
              section === n.id ? 'bg-gold text-bg-deep font-semibold' : 'text-text-secondary hover:bg-bg-card'
            }`}>
            <div className="flex items-center justify-between">
              <span>{n.label}</span>
              {n.id === 'orders' && placedCount > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center ${
                  section === 'orders' ? 'bg-bg-deep text-gold' : 'bg-gold text-bg-deep'
                }`}>
                  {placedCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <button onClick={() => setShowChangePass(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
          <FiLock size={13} /> Change Password
        </button>
        <button onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
          <FiLogOut size={13} /> Logout
        </button>
      </div>

      {/* Modals */}
      {showChangePass && userId && (
        <ChangePasswordModal userId={userId} api={api} onClose={() => setShowChangePass(false)} />
      )}
      {pauseFor && (
        <PauseModal
          type={pauseFor}
          onConfirm={handlePauseConfirm}
          onCancel={() => setPauseFor(null)}
        />
      )}
      {showHours && r && (
        <HoursModal
          restaurant={r}
          onSave={saveHours}
          onCancel={() => setShowHours(false)}
          saving={savingHours}
        />
      )}
    </>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AdminLayout({ section, setSection, restaurants, selectedRestaurant, setSelectedRestaurant, onLogout, role, userName, userId, api, onRestaurantUpdate, placedCount, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nav = buildNav(role)

  const sidebarProps = {
    section, setSection,
    restaurants, selectedRestaurant, setSelectedRestaurant,
    onLogout, role, userName, userId, api, onRestaurantUpdate, placedCount,
  }

  return (
    <div className="min-h-screen bg-bg-deep flex">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-bg border-r border-border flex-col py-6 px-4 h-screen sticky top-0 overflow-y-auto">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <aside className="relative z-50 w-64 bg-bg border-r border-border flex flex-col py-6 px-4 h-full overflow-y-auto">
            <button onClick={() => setDrawerOpen(false)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg border border-border text-text-secondary hover:border-border-light hover:text-text-primary transition-colors text-xs font-medium">
              <FiX size={13} /> Close
            </button>
            <SidebarContent {...sidebarProps} onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-bg border-b border-border">
          <button onClick={() => setDrawerOpen(true)} className="text-text-secondary">
            <FiMenu size={20} />
          </button>
          <p className="text-gold font-bold text-sm">Admin</p>
          <p className="text-xs text-text-muted">{nav.find(n => n.id === section)?.label}</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}