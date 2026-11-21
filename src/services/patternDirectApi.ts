const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const patternDirectApi = {
  async login(email: string, padrao: string) {
    const res = await fetch(`${BASE}/api/v1/auth/padrao/entrar-direto`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, padrao }), cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.erro || `HTTP ${res.status}`)
    return data as { access_token: string; refresh_token: string; expires_in: number }
  },
}
