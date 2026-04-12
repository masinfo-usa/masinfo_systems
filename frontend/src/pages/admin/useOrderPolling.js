import { useState, useEffect, useRef } from 'react'

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    function tone(freq, start, dur) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.22, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
      osc.start(start)
      osc.stop(start + dur)
    }

    tone(880,  now,        0.4)
    tone(1100, now + 0.2,  0.45)
  } catch {
    // AudioContext unavailable or blocked before user gesture
  }
}

// Polls /api/db/orders?status=placed every 30 seconds.
// Plays a two-tone chime when a new placed order is detected.
// Returns { placedCount, lastNewAt } — placedCount for the nav badge,
// lastNewAt (timestamp) to trigger a refresh banner in the Orders view.
export function useOrderPolling(api, selectedRestaurant) {
  const [placedCount, setPlacedCount] = useState(0)
  const [lastNewAt,   setLastNewAt]   = useState(null)

  const knownIdsRef    = useRef(null)   // null = first poll, Set after
  const apiRef         = useRef(api)
  const restaurantRef  = useRef(selectedRestaurant)

  useEffect(() => { apiRef.current = api },               [api])
  useEffect(() => { restaurantRef.current = selectedRestaurant }, [selectedRestaurant])

  useEffect(() => {
    knownIdsRef.current = null  // reset on restaurant change

    async function poll() {
      const _api = apiRef.current
      const _r   = restaurantRef.current
      if (!_api) return

      try {
        const p = new URLSearchParams({ status: 'placed' })
        if (_r) p.set('restaurantId', _r._id)

        const data   = await _api.get(`/api/db/orders?${p}`)
        const orders = Array.isArray(data) ? data : (data.data || [])
        const ids    = new Set(orders.map(o => o._id))

        setPlacedCount(orders.length)

        if (knownIdsRef.current === null) {
          // First poll — baseline, no chime
          knownIdsRef.current = ids
          return
        }

        const hasNew = orders.some(o => !knownIdsRef.current.has(o._id))
        if (hasNew) {
          playChime()
          setLastNewAt(Date.now())
        }
        knownIdsRef.current = ids
      } catch {
        // Network hiccup — stay silent, try again next tick
      }
    }

    poll()
    const id = setInterval(poll, 30_000)
    return () => clearInterval(id)
  }, [selectedRestaurant?._id]) // re-run (and reset) when restaurant changes

  return { placedCount, lastNewAt }
}
