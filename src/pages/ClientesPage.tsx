import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import Tag from '../components/ui/Tag'

export default function ClientesPage() {
  const { clients, filteredClients, search, setSearch, setShowForm, clientFilter, setClientFilter } = useApp()
  return (
    <><div className="page-intro"><div><h2>Clientes</h2><p>Gerencie seus clientes e acompanhe suas compras.</p></div><button className="primary" onClick={() => setShowForm(true)}>＋ Novo cliente</button></div><Panel title={clientFilter === 'Inadimplentes' ? `Clientes inadimplentes (${filteredClients.length})` : `Clientes cadastrados (${clients.length})`}><div className="client-filter-bar"><button type="button" className={clientFilter === 'Todos' ? 'active' : ''} onClick={() => setClientFilter('Todos')}>Todos</button><button type="button" className={clientFilter === 'Inadimplentes' ? 'active' : ''} onClick={() => setClientFilter('Inadimplentes')}>Inadimplentes</button></div><input className="search" placeholder="Buscar por nome, telefone ou produto..." value={search} onChange={e => setSearch(e.target.value)}/><div className="table-scroll"><table><thead><tr><th>Nome</th><th>Telefone</th><th>Última compra</th><th>Próxima recompra</th><th>Situação</th></tr></thead><tbody>{filteredClients.map(c => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.phone}</td><td>{c.last}</td><td>{c.due}</td><td><Tag status={c.status}/></td></tr>)}</tbody></table>{!filteredClients.length && <p className="empty">{clientFilter === 'Inadimplentes' ? 'Nenhum cliente inadimplente cadastrado nos dados de demonstração.' : 'Nenhum cliente encontrado.'}</p>}</div></Panel></>
  )
}
