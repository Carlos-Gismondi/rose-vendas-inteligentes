import { useApp } from '../../context/AppContext'
import { nav } from '../../data/demo'
import type { Page } from '../../data/demo'
export default function MobileNav() {
  const { page, navigate } = useApp()
  return <nav className="mobile-nav" aria-label="Navegação móvel">{(['Dashboard','Clientes','Pedidos','Contatos'] as Page[]).map(p => <button key={p} className={page === p ? 'active' : ''} onClick={() => navigate(p)}><span>{nav.find(n => n.label === p)?.icon}</span>{p === 'Dashboard' ? 'Início' : p}</button>)}</nav>
}
