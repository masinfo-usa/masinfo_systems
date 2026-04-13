import { useState, useEffect } from 'react'

const SORT_OPTIONS = [
  { label: 'Last order',    fn: (a, b) => new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0) },
  { label: 'Name A–Z',      fn: (a, b) => a.name.localeCompare(b.name) },
  { label: 'Newest member', fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
]

const DATE_PRESETS = [
  { label: 'Today',      from: () => { const d = new Date(); d.setHours(0,0,0,0); return d } },
  { label: 'This month', from: () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) } },
  { label: 'This year',  from: () => new Date(new Date().getFullYear(), 0, 1) },
  { label: 'All time',   from: () => null },
]

export default function Customers({ api, selectedRestaurant }) {
  const [customers, setCustomers]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [search, setSearch]               = useState('')
  const [sortLabel, setSortLabel]         = useState('Last order')
  const [preset, setPreset]               = useState('All time')
  const [detail, setDetail]               = useState(null)
  const [detailOrders, setDetailOrders]   = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      setDetail(null)
      setDetailOrders([])
      try {
        const params = selectedRestaurant ? `?restaurantId=${selectedRestaurant._id}` : ''
        const c = await api.get(`/api/db/customers${params}`)
        setCustomers(Array.isArray(c) ? c : c.data || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedRestaurant])

  async function openDetail(customer) {
    setDetail(customer)
    setDetailOrders([])
    setOrdersLoading(true)
    try {
      const p = new URLSearchParams()
      p.set('customerId', customer._id)
      if (selectedRestaurant) p.set('restaurantId', selectedRestaurant._id)
      const data = await api.get(`/api/db/orders?${p}`)
      const list = Array.isArray(data) ? data : data.data || []
      setDetailOrders(list.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)))
    } catch (e) {
      console.error(e)
    } finally {
      setOrdersLoading(false)
    }
  }

  const sortFn   = SORT_OPTIONS.find(s => s.label === sortLabel)?.fn || SORT_OPTIONS[0].fn
  const presetFrom = DATE_PRESETS.find(p => p.label === preset)?.from() ?? null

  const filtered = customers
    .filter(c => {
      if (presetFrom && (!c.lastOrderAt || new Date(c.lastOrderAt) < presetFrom)) return false
      const q = search.toLowerCase()
      if (!q) return true
      return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q)
    })
    .sort(sortFn)

  async function deleteCustomer(id, name) {
    if (!window.confirm(`Delete customer "${name}"?`)) return
    try {
      await api.delete(`/api/db/customers/${id}`)
      setCustomers(cs => cs.filter(c => c._id !== id))
      if (detail?._id === id) { setDetail(null); setDetailOrders([]) }
    } catch (e) {
      alert(e.message)
    }
  }

  const detailRealOrders  = detailOrders.filter(o => o.isRealOrder)
  const detailTotalSpent  = detailRealOrders.reduce((s, o) => s + (o.pricing?.total || 0), 0)

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-text-primary">
        Customers {selectedRestaurant ? `— ${selectedRestaurant.name}` : '(All Restaurants)'}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold w-64 placeholder-text-muted"
        />

        {/* Date preset */}
        <div className="flex gap-1">
          {DATE_PRESETS.map(p => (
            <button key={p.label} onClick={() => setPreset(p.label)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                preset === p.label
                  ? 'border-gold text-gold'
                  : 'border-border text-text-muted hover:border-border-light'
              }`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1">
          {SORT_OPTIONS.map(s => (
            <button key={s.label} onClick={() => setSortLabel(s.label)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                sortLabel === s.label
                  ? 'border-gold text-gold'
                  : 'border-border text-text-muted hover:border-border-light'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-text-muted ml-auto">{filtered.length} customers</span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 space-y-2 min-w-0">
          {filtered.map(c => (
            <div key={c._id} onClick={() => openDetail(c)}
              className={`bg-bg-card border rounded-lg px-4 py-3 cursor-pointer transition-colors ${detail?._id === c._id ? 'border-gold' : 'border-border hover:border-border-light'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary font-medium text-sm truncate">{c.name}</p>
                  <p className="text-text-muted text-xs truncate">{c.email}</p>
                </div>
                <p className="text-xs text-text-muted shrink-0">
                  {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{c.phone}</p>
            </div>
          ))}
          {!loading && filtered.length === 0 && <p className="text-text-muted text-sm">No customers found.</p>}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-card p-5 space-y-4 md:relative md:inset-auto md:z-auto md:overflow-visible md:border md:border-border md:rounded-xl md:w-80 md:shrink-0 md:self-start md:sticky md:top-0">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-text-primary">{detail.name}</h2>
            </div>

            <div className="space-y-1 text-xs text-text-secondary">
              <p><span className="text-text-muted">Email:</span> {detail.email || '—'}</p>
              <p><span className="text-text-muted">Phone:</span> {detail.phone}</p>
              <p><span className="text-text-muted">Member since:</span> {new Date(detail.createdAt).toLocaleDateString()}</p>
              <p><span className="text-text-muted">Last order:</span> {detail.lastOrderAt ? new Date(detail.lastOrderAt).toLocaleDateString() : '—'}</p>
            </div>

            {detail.addresses?.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-text-muted mb-2">Saved addresses</p>
                <div className="space-y-2">
                  {detail.addresses.map((a, i) => (
                    <div key={i} className="text-xs text-text-secondary bg-bg border border-border rounded-lg px-3 py-2">
                      <p>{a.full}</p>
                      {a.unit && <p className="text-text-muted">Unit: {a.unit}</p>}
                      <p className="text-text-muted mt-0.5">Last used: {new Date(a.lastUsedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ordersLoading ? (
              <p className="text-text-muted text-xs">Loading orders…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-bg border border-border rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-text-primary">{detailOrders.length}</p>
                    <p className="text-xs text-text-muted">Orders</p>
                  </div>
                  <div className="bg-bg border border-border rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-gold">${detailTotalSpent.toFixed(2)}</p>
                    <p className="text-xs text-text-muted">Spent</p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-text-muted mb-2">Order history</p>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {detailOrders.length === 0 && <p className="text-xs text-text-muted">No orders.</p>}
                    {detailOrders.map(o => (
                      <div key={o._id} className="flex justify-between text-xs text-text-secondary">
                        <span>{new Date(o.orderedAt).toLocaleDateString()} · {o.orderType}</span>
                        <span className="text-gold">${o.pricing?.total?.toFixed(2) || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button onClick={() => deleteCustomer(detail._id, detail.name)}
              className="w-full text-xs border border-red-900 text-red-400 py-2 rounded-lg hover:border-red-700 transition-colors">
              Delete Customer
            </button>
            <button onClick={() => { setDetail(null); setDetailOrders([]) }}
              className="w-full text-xs border border-border text-text-muted py-2 rounded-lg hover:border-border-light transition-colors">
              ✕ Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}