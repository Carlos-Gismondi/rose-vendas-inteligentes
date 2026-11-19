import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import { money } from '../data/demo'
import { orders } from '../data/demo'

export default function PedidosPage() {
  const { notify } = useApp()
  return (
    <><div className="page-intro"><div><h2>Pedidos</h2><p>Registre e acompanhe suas vendas.</p></div><button className="primary" onClick={() => notify('Cadastro de pedidos será implementado na etapa funcional.')}>＋ Novo pedido</button></div><Panel title="Pedidos recentes"><div className="table-scroll"><table><thead><tr><th>Nº</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td>#{o.id}</td><td><strong>{o.name}</strong></td><td>{o.date}</td><td>{money(o.value)}</td><td><span className="tag success">Concluído</span></td></tr>)}</tbody></table></div></Panel></>
  )
}
