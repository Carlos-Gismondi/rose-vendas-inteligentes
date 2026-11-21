import { User, UserRoundX, ShoppingBag, CircleDollarSign, Headset, CalendarDays } from 'lucide-react'
import './DashboardPage.css'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Panel from '../components/ui/Panel'
import Tag from '../components/ui/Tag'
import Chart from '../components/ui/Chart'
import { money } from '../data/demo'

export default function DashboardPage() {
  const { period, setPeriod, urgent, navigate, navigateToDebtors, clients, whatsapp, finish } = useApp()
  const { usuario } = useAuth()
  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] || 'Usuário'
  return (
    <><div className="page-intro"><div><h2>Olá, {primeiroNome}! 👋</h2><p>Veja o resumo das suas vendas e os contatos de hoje.</p></div><select value={period} onChange={e => setPeriod(e.target.value)} aria-label="Período"><option>Novembro/2026</option><option>Outubro/2026</option><option>Setembro/2026</option></select></div>
          <div className="stats nature-dashboard-stats">
            <div className="stat"><User size={24} strokeWidth={2}/><strong>70</strong><small>Clientes</small></div>
            <button type="button" className="stat alert stat-action" onClick={navigateToDebtors} aria-label="Ver clientes inadimplentes"><UserRoundX size={24} strokeWidth={2}/><strong>{clients.filter(c => c.inadimplente === true).length}</strong><small>Clientes inadimplentes</small></button>
            <div className="stat"><ShoppingBag size={24} strokeWidth={2}/><strong>38</strong><small>Pedidos</small></div>
            <div className="stat"><CircleDollarSign size={24} strokeWidth={2}/><strong>{money(3980)}</strong><small>Vendas no mês</small></div>
            <div className="stat alert"><Headset size={24} strokeWidth={2}/><strong>{urgent.length}</strong><small>Contatos prioritários</small></div>
            <div className="stat"><CalendarDays size={24} strokeWidth={2}/><strong>18</strong><small>Próximas recompras</small></div>
          </div><div className="dashboard-grid"><Panel title={`☎ Clientes para contatar (${urgent.length})`} action={<button className="text-link" onClick={() => navigate('Contatos')}>Ver todos →</button>}><div className="contact-list">{urgent.length ? urgent.map(c => <div className="contact-row" key={c.id}><div className="initial">{c.name.charAt(0)}</div><div className="contact-info"><strong>{c.name}</strong><small>{c.product}</small></div><Tag status={c.status}/><button className="whatsapp" onClick={() => whatsapp(c)} title="Abrir WhatsApp" aria-label={`WhatsApp de ${c.name}`}>◉</button><button className="check" onClick={() => finish(c.id)} title="Concluir contato" aria-label={`Concluir contato de ${c.name}`}>✓</button></div>) : <p className="empty">Todos os contatos prioritários foram concluídos.</p>}</div></Panel><Panel title="↗ Vendas do mês"><Chart /></Panel></div>
          <div className="info-note">ℹ️ Os números, clientes e gráficos exibidos nesta versão são demonstrativos. A integração com dados reais será realizada nas próximas etapas.</div></>
  )
}
