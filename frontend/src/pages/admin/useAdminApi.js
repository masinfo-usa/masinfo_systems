const BASE = import.meta.env.VITE_API_URL

export function makeApi(token) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  async function req(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : {}
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
    return data
  }

  return {
    get:    (path)        => req('GET',    path),
    post:   (path, body)  => req('POST',   path, body),
    put:    (path, body)  => req('PUT',    path, body),
    patch:  (path, body)  => req('PATCH',  path, body),
    delete: (path)        => req('DELETE', path),
  }
}