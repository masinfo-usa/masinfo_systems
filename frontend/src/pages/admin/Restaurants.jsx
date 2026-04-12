import { useState } from 'react'

function SectionHeader({ children }) {
  return (
    <p className="text-xs font-semibold text-gold uppercase tracking-widest pt-2">{children}</p>
  )
}

function Field({ label, name, form, setForm, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold"
      />
    </div>
  )
}

function SelectField({ label, name, form, setForm, options }) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{label}</label>
      <select
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function Toggle({ label, name, form, setForm }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => setForm(f => ({ ...f, [name]: !f[name] }))}
        className={`w-10 h-5 rounded-full transition-colors ${form[name] ? 'bg-gold' : 'bg-border'} relative`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[name] ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-text-secondary">{label}</span>
    </label>
  )
}

const emptyForm = {
  // Basic
  name: '', slug: '', phone: '', email: '', domain: '',
  // Address
  street: '', city: '', state: '', zip: '',
  // Config
  timezone: 'America/New_York', staffPin: '',
  // Email
  brevoSenderEmail: '', notificationEmail: '',
  // Toggles
  offersDelivery: false, isActive: true,
}

export default function Restaurants({ api, restaurants, onRefresh }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(emptyForm)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  function openNew() {
    setForm(emptyForm)
    setEditing('new')
    setError('')
  }

  function openEdit(r) {
    setForm({
      name: r.name || '', slug: r.slug || '', phone: r.phone || '',
      email: r.email || '', domain: r.domain || '',
      street: r.address?.street || '', city: r.address?.city || '',
      state: r.address?.state || '', zip: r.address?.zip || '',
      timezone: r.timezone || 'America/New_York',
      staffPin: r.staffPin || '',
      brevoSenderEmail: r.brevoSenderEmail || '',
      notificationEmail: r.notificationEmail || '',
      offersDelivery: r.offersDelivery ?? false,
      isActive: r.isActive ?? true,
    })
    setEditing(r)
    setError('')
  }

  async function save() {
    setSaving(true)
    setError('')
    const payload = {
      name: form.name, slug: form.slug, phone: form.phone,
      email: form.email, domain: form.domain,
      address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
      timezone: form.timezone,
      staffPin: form.staffPin,
      brevoSenderEmail: form.brevoSenderEmail,
      notificationEmail: form.notificationEmail,
      offersDelivery: form.offersDelivery,
      isActive: form.isActive,
    }
    try {
      if (editing === 'new') {
        await api.post('/api/db/restaurants', payload)
      } else {
        await api.put(`/api/db/restaurants/${editing._id}`, payload)
      }
      setEditing(null)
      onRefresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteRestaurant(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/db/restaurants/${id}`)
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  // ── Form view ─────────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="max-w-lg space-y-5">
        <h1 className="text-xl font-bold text-text-primary">
          {editing === 'new' ? 'New Restaurant' : `Edit — ${editing.name}`}
        </h1>

        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg px-4 py-3 text-yellow-300 text-xs">
          Fields marked with * are saved to DB but not yet wired to the backend — the server still reads from env vars until that migration is done.
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 space-y-4">

          <SectionHeader>Basic Info</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Name" name="name" form={form} setForm={setForm} /></div>
            <div className="col-span-2"><Field label="Slug (e.g. nyc-halal-bites)" name="slug" form={form} setForm={setForm} /></div>
            <div className="col-span-2"><Field label="Domain * (e.g. mezquite-valley.com)" name="domain" form={form} setForm={setForm} /></div>
            <div className="col-span-2"><Field label="Phone" name="phone" form={form} setForm={setForm} /></div>
            <div className="col-span-2"><Field label="Contact Email *" name="email" form={form} setForm={setForm} /></div>
          </div>

          <SectionHeader>Address</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Street" name="street" form={form} setForm={setForm} /></div>
            <Field label="City"  name="city"  form={form} setForm={setForm} />
            <Field label="State" name="state" form={form} setForm={setForm} />
            <Field label="ZIP"   name="zip"   form={form} setForm={setForm} />
          </div>

          <SectionHeader>Configuration</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <SelectField
                label="Timezone *" name="timezone" form={form} setForm={setForm}
                options={[
                  { value: 'America/New_York',    label: 'Eastern (ET)' },
                  { value: 'America/Chicago',     label: 'Central (CT)' },
                  { value: 'America/Denver',      label: 'Mountain (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
                  { value: 'America/Phoenix',     label: 'Arizona (no DST)' },
                  { value: 'America/Anchorage',   label: 'Alaska (AKT)' },
                  { value: 'Pacific/Honolulu',    label: 'Hawaii (HT)' },
                ]}
              />
            </div>
            <div className="col-span-2">
              <Field label="Staff PIN *" name="staffPin" type="password" placeholder="Leave blank to keep current" form={form} setForm={setForm} />
            </div>
          </div>

          <SectionHeader>Email Settings</SectionHeader>
          <div className="space-y-4">
            <Field label="Brevo Sender Email * (from address)" name="brevoSenderEmail" form={form} setForm={setForm} placeholder="updates@mezquite-valley.com" />
            <Field label="Notification Email * (new order alerts)" name="notificationEmail" form={form} setForm={setForm} placeholder="owner@restaurant.com" />
          </div>

          <SectionHeader>Settings</SectionHeader>
          <div className="space-y-3 pt-1">
            <Toggle label="Offers delivery" name="offersDelivery" form={form} setForm={setForm} />
            <Toggle label="Active"          name="isActive"       form={form} setForm={setForm} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={save} disabled={saving}
              className="flex-1 bg-gold text-bg-deep font-semibold py-2.5 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setError('') }}
              className="flex-1 border border-border text-text-secondary py-2.5 rounded-lg hover:border-border-light transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">Restaurants</h1>
        <button onClick={openNew}
          className="bg-gold text-bg-deep font-semibold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors text-sm">
          + New
        </button>
      </div>

      {restaurants.length === 0 && <p className="text-text-muted text-sm">No restaurants yet.</p>}

      <div className="space-y-3">
        {restaurants.map(r => (
          <div key={r._id} className="bg-bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">{r.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.isActive ? 'bg-green-900 text-green-300' : 'bg-border text-text-muted'}`}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-text-muted">slug: {r.slug}</p>
              {r.domain && <p className="text-xs text-text-muted">{r.domain}</p>}
              <p className="text-xs text-text-muted">{r.phone}{r.email ? ` · ${r.email}` : ''}</p>
              {r.address?.street && <p className="text-xs text-text-muted">{r.address.street}, {r.address.city}, {r.address.state} {r.address.zip}</p>}
              <div className="flex gap-3 pt-1">
                <span className="text-xs text-gold">✓ Pickup</span>
                <span className={`text-xs ${r.offersDelivery ? 'text-gold' : 'text-text-muted'}`}>{r.offersDelivery ? '✓' : '✗'} Delivery</span>
                {r.brevoSenderEmail && <span className="text-xs text-gold">✓ Email</span>}
                {r.staffPin && <span className="text-xs text-gold">✓ Staff PIN</span>}
              </div>
              <p className="text-xs text-text-muted font-mono">ID: {r._id}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(r)}
                className="text-xs border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:border-border-light transition-colors">
                Edit
              </button>
              <button onClick={() => deleteRestaurant(r._id, r.name)}
                className="text-xs border border-red-900 text-red-400 px-3 py-1.5 rounded-lg hover:border-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}