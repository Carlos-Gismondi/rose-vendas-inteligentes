const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
async function call<T>(path: string, token: string, body?: Record<string, string>): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1/auth/padrao/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store', credentials: 'omit',
    })
  } catch { throw new Error('Não foi possível conectar à API.') }
  const data = await response.json().catch(() => ({})) as { erro?: string }
  if (!response.ok) throw new Error(data.erro || `Erro HTTP ${response.status}`)
  return data as T
}
export const patternApi = {
  status: (token: string) => call<{ cadastrado: boolean }>('status', token),
  create: (token: string, padrao: string, confirmacao: string) => call<{ cadastrado: boolean }>('cadastrar', token, { padrao, confirmacao }),
  verify: (token: string, padrao: string) => call<{ valido: boolean }>('verificar', token, { padrao }),
  reset: (token: string, senha: string, padrao: string, confirmacao: string) => call<{ cadastrado: boolean }>('redefinir', token, { senha, padrao, confirmacao }),
}
