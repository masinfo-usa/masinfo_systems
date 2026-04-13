import { useState, useEffect, useRef } from 'react'

const STATUSES = ['placed', 'ready', 'out_for_delivery', 'picked_up', 'delivered', 'cancelled']

function statusColor(status) {
  return {
    placed:           'bg-blue-900 text-blue-300',
    ready:            'bg-yellow-900 text-yellow-300',
    out_for_delivery: 'bg-purple-900 text-purple-300',
    picked_up:        'bg-green-900 text-green-300',
    delivered:        'bg-green-900 text-green-300',
    cancelled:        'bg-red-900 text-red-300',
  }[status] || 'bg-border text-text-muted'
}

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x }
function endOfDay(d)   { const x = new Date(d); x.setHours(23,59,59,999); return x }

const DATE_PRESETS = [
  { label: 'Today',        fn: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Yesterday',    fn: () => { const d = new Date(); d.setDate(d.getDate()-1); return { from: startOfDay(d), to: endOfDay(d) } } },
  { label: 'Last 7 days',  fn: () => { const d = new Date(); d.setDate(d.getDate()-6); return { from: startOfDay(d), to: endOfDay(new Date()) } } },
  { label: 'This month',   fn: () => { const d = new Date(); return { from: new Date(d.getFullYear(), d.getMonth(), 1), to: endOfDay(new Date()) } } },
  { label: 'Last month',   fn: () => { const d = new Date(); const f = new Date(d.getFullYear(), d.getMonth()-1, 1); const t = new Date(d.getFullYear(), d.getMonth(), 0); return { from: f, to: endOfDay(t) } } },
  { label: 'All time',     fn: () => ({ from: null, to: null }) },
]

export default function Orders({ api, selectedRestaurant, lastNewAt }) {
  const [allOrders, setAllOrders]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [detail, setDetail]             = useState(null)
  const [showRefreshBanner, setShowRefreshBanner] = useState(false)
  const mountedRef = useRef(false)

  // Filters
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType]     = useState('')
  const [sortDir, setSortDir]           = useState('desc')   // desc = newest first
  const [preset, setPreset]             = useState('Today')
  const [dateFrom, setDateFrom]         = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d })
  const [dateTo, setDateTo]             = useState(() => { const d = new Date(); d.setHours(23,59,59,999); return d })
  const [customFrom, setCustomFrom]     = useState('')
  const [customTo, setCustomTo]         = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const p = new URLSearchParams()
      if (selectedRestaurant) p.set('restaurantId', selectedRestaurant._id)
      if (filterStatus) p.set('status', filterStatus)
      if (filterType)   p.set('orderType', filterType)
      if (dateFrom)     p.set('from', dateFrom.toISOString())
      if (dateTo)       p.set('to', dateTo.toISOString())
      const data = await api.get(`/api/db/orders?${p}`)
      const raw = Array.isArray(data) ? data : data.data || []
      setAllOrders(raw)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [selectedRestaurant, filterStatus, filterType, dateFrom, dateTo])

  // Show refresh banner when polling detects a new order while we're already mounted
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    if (lastNewAt) setShowRefreshBanner(true)
  }, [lastNewAt])

  function applyPreset(label) {
    setPreset(label)
    setCustomFrom('')
    setCustomTo('')
    const p = DATE_PRESETS.find(d => d.label === label)
    if (p) { const { from, to } = p.fn(); setDateFrom(from); setDateTo(to) }
  }

  function applyCustomRange() {
    if (customFrom) setDateFrom(startOfDay(new Date(customFrom)))
    if (customTo)   setDateTo(endOfDay(new Date(customTo)))
    setPreset('')
  }

  // Sort client-side; date filtering is done server-side
  const orders = allOrders
    .sort((a, b) => sortDir === 'desc'
      ? new Date(b.orderedAt) - new Date(a.orderedAt)
      : new Date(a.orderedAt) - new Date(b.orderedAt)
    )

  async function updateStatus(id, status) {
    try {
      await api.put(`/api/db/orders/${id}/status`, { status })
      setAllOrders(os => os.map(o => o._id === id ? { ...o, status } : o))
      if (detail?._id === id) setDetail(d => ({ ...d, status }))
    } catch (e) { alert(e.message) }
  }

  async function deleteOrder(id) {
    if (!window.confirm('Delete this order?')) return
    try {
      await api.delete(`/api/db/orders/${id}`)
      setAllOrders(os => os.filter(o => o._id !== id))
      if (detail?._id === id) setDetail(null)
    } catch (e) { alert(e.message) }
  }

  const totalRevenue = orders.filter(o => o.isRealOrder).reduce((s, o) => s + (o.pricing?.total || 0), 0)

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-text-primary">
        Orders {selectedRestaurant ? `— ${selectedRestaurant.name}` : '(All Restaurants)'}
      </h1>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Status */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary text-xs focus:outline-none focus:border-gold">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Type */}
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary text-xs focus:outline-none focus:border-gold">
          <option value="">All types</option>
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
        </select>

        {/* Sort */}
        <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary text-xs hover:border-border-light transition-colors">
          {sortDir === 'desc' ? '↓ Newest first' : '↑ Oldest first'}
        </button>

        {/* Date presets */}
        <div className="flex flex-wrap gap-1">
          {DATE_PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p.label)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                preset === p.label
                  ? 'border-gold text-gold'
                  : 'border-border text-text-muted hover:border-border-light'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted shrink-0">Custom:</span>
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            className="flex-1 bg-bg-card border border-border rounded-lg px-2 py-1 text-text-secondary text-xs focus:outline-none focus:border-gold" />
          <span className="text-xs text-text-muted">→</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            className="flex-1 bg-bg-card border border-border rounded-lg px-2 py-1 text-text-secondary text-xs focus:outline-none focus:border-gold" />
        </div>
        <button onClick={applyCustomRange}
          className="w-full py-1.5 bg-gold text-bg-deep text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors">
          Apply Custom Range
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>{orders.length} orders</span>
        <span>Revenue: <span className="text-gold font-semibold">${totalRevenue.toFixed(2)}</span></span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading && <p className="text-text-muted text-sm">Loading…</p>}

      {/* New-order refresh banner */}
      {showRefreshBanner && (
        <button
          onClick={() => { setShowRefreshBanner(false); load() }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gold text-gold text-xs font-semibold hover:bg-gold/10 transition-colors"
        >
          ↑ New orders arrived — tap to refresh
        </button>
      )}

      {/* Order list */}
      <div className="space-y-2">
        {(() => {
          const newOrders   = orders.filter(o => o.status === 'placed')
          const otherOrders = orders.filter(o => o.status !== 'placed')

          function OrderRow({ o, pinned = false }) {
            return (
              <div onClick={() => setDetail(o)}
                className={`bg-bg-card border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  pinned
                    ? 'border-gold/30 hover:border-gold'
                    : 'border-border hover:border-border-light'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-text-primary font-medium text-sm">{o.customerId?.name || '—'}</span>
                    <span className="text-text-muted text-xs ml-2">{o.orderType}</span>
                    {!o.isRealOrder && <span className="text-xs text-yellow-500 ml-2">[test]</span>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gold text-sm font-semibold">${o.pricing?.total?.toFixed(2) || '—'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(o.status)}`}>{o.status}</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-1">{new Date(o.orderedAt).toLocaleString()}</p>
              </div>
            )
          }

          return (
            <>
              {newOrders.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider">
                    New Orders ({newOrders.length})
                  </p>
                  {newOrders.map(o => <OrderRow key={o._id} o={o} pinned />)}
                </div>
              )}

              {newOrders.length > 0 && otherOrders.length > 0 && (
                <div className="border-t border-border pt-2" />
              )}

              {otherOrders.map(o => <OrderRow key={o._id} o={o} />)}

              {!loading && orders.length === 0 && (
                <p className="text-text-muted text-sm">No orders found.</p>
              )}
            </>
          )
        })()}
      </div>

      {/* Order detail modal */}
      {detail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
          onClick={() => setDetail(null)}>
          <div className="bg-bg-card border border-border rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary">Order Detail</h2>
              <button onClick={() => setDetail(null)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg border border-border text-text-muted hover:text-text-secondary hover:border-border-light transition-colors">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs text-text-secondary">
              <p><span className="text-text-muted">Customer:</span> {detail.customerId?.name}</p>
              <p><span className="text-text-muted">Email:</span> {detail.customerId?.email}</p>
              <p><span className="text-text-muted">Phone:</span> {detail.customerId?.phone}</p>
              <p><span className="text-text-muted">Type:</span> {detail.orderType}</p>
              <p><span className="text-text-muted">Placed:</span> {new Date(detail.orderedAt).toLocaleString()}</p>
              {detail.orderType === 'delivery' && detail.deliveryInfo?.address?.full && (
                <p><span className="text-text-muted">Address:</span> {detail.deliveryInfo.address.full}</p>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-1">
              {detail.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-text-secondary">
                  <span>{item.quantity}× {item.name}</span>
                  <span>${((item.price / 100) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border mt-2 pt-2 space-y-0.5">
                <div className="flex justify-between text-xs text-text-muted"><span>Subtotal</span><span>${detail.pricing?.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between text-xs text-text-muted"><span>Tax</span><span>${detail.pricing?.tax?.toFixed(2)}</span></div>
                {detail.pricing?.deliveryFee > 0 && <div className="flex justify-between text-xs text-text-muted"><span>Delivery fee</span><span>${detail.pricing?.deliveryFee?.toFixed(2)}</span></div>}
                {detail.pricing?.tipAmount > 0 && <div className="flex justify-between text-xs text-text-muted"><span>Tip</span><span>${detail.pricing?.tipAmount?.toFixed(2)}</span></div>}
                <div className="flex justify-between text-xs font-bold text-text-primary pt-1"><span>Total</span><span>${detail.pricing?.total?.toFixed(2)}</span></div>
              </div>
            </div>

            {detail.payment?.card && (
              <p className="text-xs text-text-muted">{detail.payment.card.brand} ···· {detail.payment.card.last4}</p>
            )}

            <div className="border-t border-border pt-3">
              <p className="text-xs text-text-muted mb-2">Update status</p>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(detail._id, s)}
                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                      detail.status === s ? 'border-gold text-gold' : 'border-border text-text-muted hover:border-border-light'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => deleteOrder(detail._id)}
              className="w-full text-xs border border-red-900 text-red-400 py-2 rounded-lg hover:border-red-700 transition-colors">
              Delete Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}