import { useState, useEffect } from 'react'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  )
}

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

function getTopItems(orders, key = 'qty') {
  const map = {}
  for (const order of orders) {
    for (const item of order.items || []) {
      if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 }
      map[item.name].qty     += item.quantity
      map[item.name].revenue += (item.price / 100) * item.quantity
    }
  }
  return Object.values(map).sort((a, b) => b[key] - a[key]).slice(0, 10)
}

export default function Overview({ api, selectedRestaurant }) {
  const [todayOrders, setTodayOrders]   = useState([])
  const [allOrders, setAllOrders]       = useState(null)   // null = not loaded yet
  const [customers, setCustomers]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [allTimeLoading, setAllTimeLoading] = useState(false)
  const [itemSort, setItemSort]         = useState('qty')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setAllOrders(null)
      try {
        const params = selectedRestaurant ? `?restaurantId=${selectedRestaurant._id}&` : '?'
        const [o, c] = await Promise.all([
          api.get(`/api/db/orders${params}today=true`),
          api.get(`/api/db/customers${selectedRestaurant ? `?restaurantId=${selectedRestaurant._id}` : ''}`),
        ])
        const raw = Array.isArray(o) ? o : o.data || []
        setTodayOrders(raw.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)))
        setCustomers(Array.isArray(c) ? c : c.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedRestaurant])

  async function loadAllTime() {
    setAllTimeLoading(true)
    try {
      const params = selectedRestaurant ? `?restaurantId=${selectedRestaurant._id}` : ''
      const o = await api.get(`/api/db/orders${params}`)
      const raw = Array.isArray(o) ? o : o.data || []
      setAllOrders(raw)
    } catch (e) {
      console.error(e)
    } finally {
      setAllTimeLoading(false)
    }
  }

  const todayRevenue   = todayOrders.filter(o => o.isRealOrder).reduce((s, o) => s + (o.pricing?.total || 0), 0)
  const todayPlaced    = todayOrders.filter(o => o.status === 'placed').length

  const srcOrders      = allOrders ?? []
  const realOrders     = srcOrders.filter(o => o.isRealOrder)
  const totalRevenue   = realOrders.reduce((s, o) => s + (o.pricing?.total || 0), 0)
  const statusCounts   = srcOrders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
  const topItems       = getTopItems(realOrders, itemSort)
  const maxVal         = topItems[0]?.[itemSort] || 1

  if (loading) return <p className="text-text-muted text-sm">Loading…</p>

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-text-primary">
        Overview {selectedRestaurant ? `— ${selectedRestaurant.name}` : '(All Restaurants)'}
      </h1>

      {/* Today stats */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Today</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Orders Today"     value={todayOrders.length} />
          <StatCard label="Revenue Today"    value={`$${todayRevenue.toFixed(2)}`} />
          <StatCard label="Customers"        value={customers.length} />
          <StatCard label="Placed Now"       value={todayPlaced} />
        </div>
      </div>

      {/* Recent today orders */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-3">Today's Orders</h2>
        <div className="space-y-2">
          {todayOrders.length === 0 && <p className="text-xs text-text-muted">No orders today.</p>}
          {todayOrders.slice(0, 8).map(o => (
            <div key={o._id} className="bg-bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between text-sm">
              <div>
                <span className="text-text-primary font-medium">{o.customerId?.name || '—'}</span>
                <span className="text-text-muted ml-3 text-xs">{o.orderType} · {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xs">{new Date(o.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-gold font-semibold text-xs">${o.pricing?.total?.toFixed(2) || '—'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(o.status)}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All-time stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider">All Time</p>
          {allOrders === null && (
            <button onClick={loadAllTime} disabled={allTimeLoading}
              className="text-xs px-3 py-1.5 border border-border rounded-lg text-text-muted hover:border-border-light transition-colors disabled:opacity-50">
              {allTimeLoading ? 'Loading…' : 'Load all-time stats'}
            </button>
          )}
        </div>

        {allOrders === null ? (
          <p className="text-xs text-text-muted">Click "Load all-time stats" to see totals, top items, and status breakdown.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Orders"     value={realOrders.length} sub="real orders only" />
              <StatCard label="Total Revenue"    value={`$${totalRevenue.toFixed(2)}`} sub="real orders only" />
              <StatCard label="Out for Delivery" value={statusCounts['out_for_delivery'] || 0} />
              <StatCard label="Delivered"        value={statusCounts['delivered'] || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Items */}
              <div className="bg-bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-text-secondary">Top Items</h2>
                  <div className="flex gap-1">
                    {[['qty', 'By qty'], ['revenue', 'By revenue']].map(([val, lbl]) => (
                      <button key={val} onClick={() => setItemSort(val)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          itemSort === val ? 'border-gold text-gold' : 'border-border text-text-muted hover:border-border-light'
                        }`}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {topItems.length === 0 && <p className="text-xs text-text-muted">No data.</p>}
                  {topItems.map((item, i) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary truncate pr-2">
                          <span className="text-text-muted mr-1.5">#{i + 1}</span>{item.name}
                        </span>
                        <span className="text-text-muted shrink-0">
                          {itemSort === 'qty' ? `${item.qty} sold` : `$${item.revenue.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${(item[itemSort] / maxVal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status breakdown */}
              <div className="bg-bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-text-secondary mb-4">Status Breakdown</h2>
                <div className="space-y-2">
                  {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${statusColor(status)}`}>{status}</span>
                      <span className="text-text-muted">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}