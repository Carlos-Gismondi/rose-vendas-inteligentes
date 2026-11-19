import { User, ShoppingBag, Package, Headset, FileChartLine } from 'lucide-react'
import type { ReactNode } from 'react'
import { useApp } from '../../context/AppContext'
import { nav } from '../../data/demo'
import type { Page } from '../../data/demo'
import './Sidebar.css'

const approvedIcons: Partial<Record<Page, ReactNode>> = {
  Clientes: <User size={20} strokeWidth={2} />,
  Pedidos: <ShoppingBag size={20} strokeWidth={2} />,
  Produtos: <Package size={20} strokeWidth={2} />,
  Contatos: <Headset size={20} strokeWidth={2} />,
  Relatórios: <FileChartLine size={20} strokeWidth={2} />,
}

export default function Sidebar() {
  const { collapsed, menuOpen, page, navigate, setMenuOpen } = useApp()
  return <>
    {menuOpen && <button className="backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand">
        <img className="brand-logo brand-logo-full" src="/logo-nature.png" alt="Naturé Vendas Inteligentes" />
        <img className="brand-logo brand-logo-icon" src="/logo-nature-icon.png" alt="Símbolo Naturé" />
      </div>
      <nav aria-label="Navegação principal">{nav.map(item => <button key={item.label} className={`nav-item ${page === item.label ? 'selected' : ''}`} onClick={() => navigate(item.label)} title={item.label}><span className="nav-icon">{approvedIcons[item.label] ?? item.icon}</span>{!collapsed && item.label}</button>)}</nav>
      
    </aside>
  </>
}
