import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../services/authApi'


import type { AuthUser, LoginCredentials } from '../services/authApi'

interface AuthContextType {
  usuario: AuthUser | null
  accessToken: string | null
  autenticado: boolean
  carregando: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | null>(null)
const STORAGE_KEY = 'nature.mobile.session.v2'
const OLD_KEY = 'nature.mobile.session.v1'
type StoredSession = { refreshToken: string; user: AuthUser; loginAt: number }

function readStored(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const s = value as Partial<StoredSession>
    if (!s.loginAt || Date.now() - s.loginAt >= 86400000) return null
    if (typeof s.refreshToken !== 'string' || !s.refreshToken || !s.user ||
      typeof s.user.id !== 'number' || typeof s.user.email !== 'string') return null
    return { refreshToken: s.refreshToken, user: s.user, loginAt: s.loginAt }
  } catch { return null }
}
function saveStored(refreshToken: string, user: AuthUser) {
  const loginAt = readStored()?.loginAt ?? Date.now()
  // Salvar independentemente da largura: no celular o viewport pode mudar
  // e a instalacao anterior so salvava com max-width: 767px.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ refreshToken, user, loginAt }))
    localStorage.removeItem(OLD_KEY)
  } catch { /* armazenamento indisponivel: login sera necessario no proximo acesso */ }
}
function removeStored() {
  try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(OLD_KEY) } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const refreshRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationRef = useRef(0)
  const mountedRef = useRef(true)

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])
  const clear = useCallback(() => {
    generationRef.current++
    stopTimer()
    refreshRef.current = null
    setUsuario(null)
    setAccessToken(null)
    removeStored()
  }, [stopTimer])

  const installSession = useCallback((token: string, refresh: string, user: AuthUser, expires: number) => {
    stopTimer()
    refreshRef.current = refresh
    saveStored(refresh, user)
    setUsuario(user)
    setAccessToken(token)
    // Renova antes de expirar; usa sempre o refresh token mais recente.
    timerRef.current = setTimeout(async () => {
      const current = refreshRef.current
      if (!current || !mountedRef.current) return
      const generation = generationRef.current
      try {
        const next = await authApi.refresh(current, user)
        if (!mountedRef.current || generation !== generationRef.current || refreshRef.current !== current) return
        const verified = await authApi.me(next.accessToken)
        if (!mountedRef.current || generation !== generationRef.current || refreshRef.current !== current) return
        installSession(next.accessToken, next.refreshToken, verified, next.expiresIn)
      } catch {
        if (mountedRef.current && generation === generationRef.current && refreshRef.current === current) clear()
      }
    }, Math.max(5, expires - 60) * 1000)
  }, [clear, stopTimer])

  useEffect(() => {
    mountedRef.current = true
    let active = true
    const stored = readStored()
    if (!stored) {
      setCarregando(false)
      return () => { active = false; mountedRef.current = false }
    }
    const generation = generationRef.current
    void (async () => {
      try {
        const next = await authApi.refresh(stored.refreshToken, stored.user)
        if (!active || generation !== generationRef.current) return
        const verified = await authApi.me(next.accessToken)
        if (!active || generation !== generationRef.current) return
        installSession(next.accessToken, next.refreshToken, verified, next.expiresIn)
      } catch {
        if (active && generation === generationRef.current) clear()
      } finally {
        if (active) setCarregando(false)
      }
    })()
    return () => { active = false; mountedRef.current = false; stopTimer() }
  }, [clear, installSession, stopTimer])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setCarregando(true)
    generationRef.current++
    try {
      const result = await authApi.login(credentials)
      const verified = await authApi.me(result.accessToken)
      installSession(result.accessToken, result.refreshToken, verified, result.expiresIn)
      try { localStorage.setItem('nature.pattern.email',credentials.email.trim()) } catch {}
    } catch (error) { clear(); throw error }
    finally { setCarregando(false) }
  }, [clear, installSession])

  const logout = useCallback(async () => {
    const token = accessToken
    clear()
    if (token) {
      try { await authApi.logout(token) } catch { /* nao reativar sessao local */ }
    }
  }, [accessToken, clear])

  return <AuthContext.Provider value={{ usuario, accessToken,
    autenticado: Boolean(usuario && accessToken), carregando, login, logout }}>
    {children}
  </AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa de AuthProvider')
  return context
}
