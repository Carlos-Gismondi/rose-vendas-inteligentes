import { User, ShoppingBag, Package, Headset, FileChartLine, Users } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useApp } from '../../context/AppContext'
import { nav } from '../../data/demo'
import type { Page } from '../../data/demo'
import './Sidebar.css'
import { useAuth } from '../../context/AuthContext'

const approvedIcons: Partial<Record<Page, ReactNode>> = {
  Usuários: <Users size={20} />,
  Clientes: <User size={20} strokeWidth={2} />,
  Pedidos: <ShoppingBag size={20} strokeWidth={2} />,
  Produtos: <Package size={20} strokeWidth={2} />,
  Contatos: <Headset size={20} strokeWidth={2} />,
  Relatórios: <FileChartLine size={20} strokeWidth={2} />,
}

export default function Sidebar() {
  const { usuario } = useAuth()
  const { collapsed, menuOpen, page, navigate, setMenuOpen } = useApp()
  useEffect(() => {
    if (!menuOpen) return
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onEscape) }
  }, [menuOpen, setMenuOpen])
  return <>
    {menuOpen && <button className="backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
    <aside id="nature-mobile-sidebar" aria-label="Menu principal" className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand">
        <img className="brand-logo brand-logo-full" src="/logo-nature.png" alt="Naturé Vendas Inteligentes" />
        <img className="brand-logo brand-logo-icon" src="/logo-nature-icon.png" alt="Símbolo Naturé" />
      </div>
      <nav aria-label="Navegação principal">{[...nav, ...(usuario?.perfil === 'ADMIN' ? [{label: 'Usuários' as Page, icon: '👥'}] : [])].filter(item => usuario?.perfil === 'ADMIN' || !['Configurações','Usuários'].includes(item.label)).map(item => <button key={item.label} className={`nav-item ${page === item.label ? 'selected' : ''}`} onClick={() => navigate(item.label)} title={item.label}><span className="nav-icon">{approvedIcons[item.label] ?? item.icon}</span>{(!collapsed || menuOpen) && item.label}</button>)}</nav>
      
    </aside>
  </>
}
