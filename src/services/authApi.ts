export type UserRole = 'ADMIN' | 'OPERADOR' | 'REVENDA'
export interface AuthUser {
  id: number
  nome: string
  email: string
  perfil: UserRole
  organizacao_id: number
}
export interface LoginCredentials { email: string; senha: string }
export interface AuthSession {
  usuario: AuthUser
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Em desenvolvimento, o Vite encaminha /api para o Apache local.
// Em producao, configure um proxy HTTPS de mesma origem ou CORS no servidor.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

type JsonObject = Record<string, unknown>
function object(value: unknown): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Resposta inesperada da API.')
  }
  return value as JsonObject
}
function user(value: unknown): AuthUser {
  const d = object(value)
  if (typeof d.id !== 'number' || typeof d.nome !== 'string' ||
      typeof d.email !== 'string' ||
      !['ADMIN', 'OPERADOR', 'REVENDA'].includes(String(d.perfil)) ||
      typeof d.organizacao_id !== 'number') {
    throw new Error('Dados de usuario invalidos na resposta da API.')
  }
  return { id: d.id, nome: d.nome, email: d.email,
    perfil: d.perfil as UserRole, organizacao_id: d.organizacao_id }
}
function session(value: unknown, previousUser?: AuthUser): AuthSession {
  const d = object(value)
  if (typeof d.access_token !== 'string' || !d.access_token ||
      typeof d.refresh_token !== 'string' || !d.refresh_token ||
      typeof d.expires_in !== 'number' || d.expires_in <= 0) {
    throw new Error('Tokens ausentes na resposta da API.')
  }
  return { usuario: previousUser ?? user(d.usuario), accessToken: d.access_token,
    refreshToken: d.refresh_token, expiresIn: d.expires_in }
}
async function request(endpoint: string, init: RequestInit = {}, token?: string): Promise<unknown> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, { ...init, headers, credentials: 'omit', cache: 'no-store' })
  } catch {
    throw new Error('Nao foi possivel conectar a API Naturé.')
  }
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const d = data && typeof data === 'object' ? data as JsonObject : {}
    const message = typeof d.erro === 'string' ? d.erro :
      typeof d.message === 'string' ? d.message : `Erro HTTP ${response.status}`
    throw new Error(message)
  }
  return data
}
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return session(await request('/api/v1/auth/login', {
      method: 'POST', body: JSON.stringify(credentials),
    }))
  },
  async me(token: string): Promise<AuthUser> {
    const data = object(await request('/api/v1/auth/me', {}, token))
    return user(data.usuario)
  },
  async logout(token: string): Promise<void> {
    await request('/api/v1/auth/logout', { method: 'POST' }, token)
  },
  async refresh(refreshToken: string, currentUser: AuthUser): Promise<AuthSession> {
    return session(await request('/api/v1/auth/refresh', {
      method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }),
    }), currentUser)
  },
}
