import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import { products } from '../data/demo'

export default function ProdutosPage() {
  const { notify } = useApp()
  return (
    <><div className="page-intro"><div><h2>Produtos</h2><p>Catálogo e intervalo previsto de recompra.</p></div><button className="primary" onClick={() => notify('Cadastro de produtos será implementado na etapa funcional.')}>＋ Novo produto</button></div><Panel title="Catálogo de produtos"><div className="table-scroll"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Intervalo de recompra</th></tr></thead><tbody>{products.map(p => <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.category}</td><td>{p.days} dias</td></tr>)}</tbody></table></div></Panel></>
  )
}
