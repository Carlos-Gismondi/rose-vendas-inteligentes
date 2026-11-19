import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import Chart from '../components/ui/Chart'
import { money } from '../data/demo'

export default function RelatoriosPage() {
  return (
    <><div className="page-intro"><div><h2>Relatórios</h2><p>Acompanhe os resultados do seu negócio.</p></div></div><div className="report-stats"><div className="stat"><strong>{money(3980)}</strong><small>Vendas no mês</small></div><div className="stat"><strong>38</strong><small>Pedidos</small></div><div className="stat"><strong>{money(104.74)}</strong><small>Ticket médio</small></div></div><Panel title="Vendas por mês (dados ilustrativos)"><Chart bars /></Panel></>
  )
}
