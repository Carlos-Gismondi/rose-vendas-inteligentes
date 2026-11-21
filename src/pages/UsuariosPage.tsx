import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Panel from '../components/ui/Panel'
import { apiUsuarios, type Usuario } from '../services/usuariosApi'
import './UsuariosPage.css'

const empty = { nome: '', email: '', perfil: 'OPERADOR', senha: '' }
type Filtro = 'Todos' | 'Ativos' | 'Inativos'
export default function UsuariosPage() {
  const { usuario, accessToken } = useAuth()
  const [rows, setRows] = useState<Usuario[]>([])
  const [form, setForm] = useState({ ...empty })
  const [edit, setEdit] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filtro>('Todos')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const token = accessToken || ''
  const load = async () => {
    try { setRows((await apiUsuarios('usuarios', token)).usuarios) }
    catch (e) { setError(e instanceof Error ? e.message : String(e)) }
  }
  useEffect(() => { if (token && usuario?.perfil === 'ADMIN') void load() }, [token, usuario?.perfil])
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true); setError(''); setInfo('')
    try { await action(); setInfo('Operação concluída.'); await load(); return true }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); return false }
    finally { setBusy(false) }
  }
  const close = () => { setShowForm(false); setEdit(null); setForm({ ...empty }) }
  const filtered = rows.filter(u => (filter === 'Todos' || u.status === (filter === 'Ativos' ? 'ATIVO' : 'INATIVO')) && `${u.nome} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
  if (usuario?.perfil !== 'ADMIN') return <p>Acesso restrito ao administrador.</p>
  return <>
    <div className="page-intro"><div><h2>Usuários</h2><p>Gerencie os usuários e seus acessos.</p></div><button className="primary" onClick={() => { setEdit(null); setForm({ ...empty }); setShowForm(true) }}>＋ Novo usuário</button></div>
    {error && <p role="alert" className="users-alert users-error">{error}</p>}
    {info && <p role="status" className="users-alert users-success">{info}</p>}
    <Panel title={`Usuários cadastrados (${rows.length})`}>
      <div className="client-filter-bar users-filter">
        {(['Todos', 'Ativos', 'Inativos'] as Filtro[]).map(f => <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <input className="search" aria-label="Pesquisar usuários" placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="table-scroll"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Situação</th><th>Ações</th></tr></thead><tbody>
        {filtered.map(u => <tr key={u.id}><td><strong>{u.nome}</strong></td><td>{u.email}</td><td>{u.perfil === 'ADMIN' ? 'Administrador' : u.perfil === 'OPERADOR' ? 'Operador' : 'Revenda'}</td><td><span className={`users-status ${u.status === 'ATIVO' ? 'is-active' : 'is-inactive'}`}>{u.status === 'ATIVO' ? 'Ativo' : 'Inativo'}</span></td><td><div className="users-actions"><button disabled={busy} onClick={() => { setEdit(u.id); setForm({ nome: u.nome, email: u.email, perfil: u.perfil, senha: '' }); setShowForm(true) }}>Editar</button><button disabled={busy} onClick={() => { const senha = window.prompt('Digite a nova senha (mínimo 12 caracteres, letras maiúsculas/minúsculas, número e símbolo)'); if (senha) void run(() => apiUsuarios(`usuarios/${u.id}/senha`, token, 'PUT', { senha })) }}>Senha</button><button disabled={busy || u.id === usuario.id} onClick={() => { if (window.confirm(`Deseja ${u.status === 'ATIVO' ? 'desativar' : 'ativar'} ${u.nome}?`)) void run(() => apiUsuarios(`usuarios/${u.id}/status`, token, 'PUT', { ativo: u.status !== 'ATIVO' })) }}>{u.status === 'ATIVO' ? 'Desativar' : 'Ativar'}</button></div></td></tr>)}
      </tbody></table>{!filtered.length && <p className="empty">Nenhum usuário encontrado.</p>}</div>
    </Panel>
    {showForm && <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget && !busy) close() }}><div className="modal users-modal" role="dialog" aria-modal="true" aria-label={edit ? 'Editar usuário' : 'Novo usuário'}><h2>{edit ? 'Editar usuário' : 'Novo usuário'}</h2><p>Preencha os dados de acesso.</p>
      <form onSubmit={e => { e.preventDefault(); void (async () => { const ok = await run(() => apiUsuarios('usuarios', token, 'POST', { ...form, ...(edit ? { id: edit } : {}) })); if (ok) close() })() }}>
        <label>Nome completo<input required minLength={3} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></label>
        <label>E-mail<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Perfil<select value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value })}><option value="ADMIN">Administrador</option><option value="OPERADOR">Operador</option><option value="REVENDA">Revenda</option></select></label>
        <label>Senha {edit ? '(opcional)' : ''}<input type="password" required={!edit} value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} /></label>
        <small>Senha: mínimo de 12 caracteres, com maiúscula, minúscula, número e símbolo.</small>
        <div className="modal-actions"><button type="button" disabled={busy} onClick={close}>Cancelar</button><button type="submit" disabled={busy} className="primary">{busy ? 'Salvando...' : edit ? 'Salvar alterações' : 'Cadastrar'}</button></div>
      </form>
    </div></div>}
  </>
}
