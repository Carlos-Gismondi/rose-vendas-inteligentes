import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import Tag from '../components/ui/Tag'

export default function ContatosPage() {
  const { filter, setFilter, search, setSearch, filteredContacts, whatsapp, finish, notify } = useApp()
  return (
    <><div className="page-intro"><div><h2>Contatos e recompra</h2><p>Veja quem precisa ser contatado e prepare sua mensagem.</p></div></div><Panel title="Lembretes de recompra"><div className="filters">{['Todos','Hoje','Atrasados','Próximos'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><input className="search" placeholder="Buscar contato..." value={search} onChange={e => setSearch(e.target.value)}/><div className="contact-list">{filteredContacts.map(c => <div className="contact-row" key={c.id}><div className="initial">{c.name[0]}</div><div className="contact-info"><strong>{c.name}</strong><small>{c.product} · Última compra: {c.last}</small></div><Tag status={c.status}/><button className="whatsapp" onClick={() => whatsapp(c)} aria-label={`WhatsApp de ${c.name}`}>◉</button><button className="check" onClick={() => finish(c.id)} aria-label={`Concluir contato de ${c.name}`}>✓</button></div>)}{!filteredContacts.length && <p className="empty">Nenhum contato nesta categoria.</p>}</div><div className="message-box"><strong>◉ Mensagem sugerida</strong><p>Olá, [nome]! Tudo bem? 💚 Seu produto está acabando? Posso separar para você?</p><button onClick={() => { navigator.clipboard?.writeText('Olá! Tudo bem? 💚 Seu produto está acabando? Posso separar para você?'); notify('Mensagem copiada, se permitido pelo navegador.') }}>Copiar</button></div></Panel></>
  )
}
