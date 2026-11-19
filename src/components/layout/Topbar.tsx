import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound, Check, CheckCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './Topbar.css'

const subtitles: Record<string, string> = {
  Dashboard: 'Visão geral das suas vendas', Clientes: 'Gerencie seus clientes',
  Pedidos: 'Acompanhe os pedidos', Produtos: 'Catálogo de produtos',
  Contatos: 'Acompanhe os contatos e recompras', Relatórios: 'Indicadores de desempenho',
  Configurações: 'Preferências do aplicativo',
}

export default function Topbar() {
  const { page, setMenuOpen, setCollapsed, navigate, notify, urgent } = useApp()
  const [open, setOpen] = useState<'notifications' | 'user' | null>(null)
  const [read, setRead] = useState<string[]>([])
  const root = useRef<HTMLDivElement>(null)
  const notifications = useMemo(() => urgent.map(client => ({
    id: String(client.id), title: client.status === 'Atrasado' ? 'Recompra atrasada' : 'Contato previsto para hoje',
    description: `${client.name} • ${client.product}`,
  })), [urgent])
  const unread = notifications.filter(n => !read.includes(n.id)).length
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(null)
    }
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(null) }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onEscape)
    return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onEscape) }
  }, [])
  const go = (destination: Parameters<typeof navigate>[0]) => { navigate(destination); setOpen(null) }
  return <header className="topbar nature-topbar">
    <div className="top-left nature-top-left">
      <button type="button" className="icon-button menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={20}/></button>
      <button type="button" className="icon-button collapse-trigger" onClick={() => setCollapsed(v => !v)} aria-label="Recolher ou expandir menu"><Menu size={20}/></button>
      <div className="nature-page-heading"><h1>{page}</h1><span>{subtitles[page] || 'Naturé Vendas Inteligentes'}</span></div>
    </div>
    <div className="top-right nature-top-right" ref={root}>
      <div className="nature-popover-anchor">
        <button type="button" className="nature-top-action" aria-label={`Notificações: ${unread} não lidas`} aria-expanded={open === 'notifications'} aria-controls="nature-notifications" onClick={() => setOpen(v => v === 'notifications' ? null : 'notifications')}>
          <Bell size={20} strokeWidth={2}/>{unread > 0 && <span className="nature-bell-count">{unread > 99 ? '99+' : unread}</span>}
        </button>
        {open === 'notifications' && <div id="nature-notifications" className="nature-dropdown nature-notifications" role="region" aria-label="Painel de notificações">
          <div className="nature-dropdown-head"><strong>Notificações</strong><span>{unread} não lidas</span></div>
          {notifications.length ? <>
            <div className="nature-notification-list">{notifications.map(item => <div className={`nature-notification ${read.includes(item.id) ? 'is-read' : ''}`} key={item.id}>
              <div className="nature-notification-text"><strong>{item.title}</strong><span>{item.description}</span></div>
              {!read.includes(item.id) && <button type="button" title="Marcar como lida" aria-label={`Marcar notificação de ${item.description} como lida`} onClick={() => setRead(v => [...v, item.id])}><Check size={17}/></button>}
            </div>)}</div>
            <button type="button" className="nature-mark-all" disabled={!unread} onClick={() => setRead(notifications.map(n => n.id))}><CheckCheck size={16}/> Marcar todas como lidas</button>
          </> : <p className="nature-empty-notifications">Nenhuma notificação no momento.</p>}
        </div>}
      </div>
      <div className="nature-popover-anchor nature-user-anchor">
        <button type="button" className="nature-user-button" aria-label="Abrir menu do usuário" aria-expanded={open === 'user'} aria-controls="nature-user-menu" onClick={() => setOpen(v => v === 'user' ? null : 'user')}>
          <span className="nature-user-text"><strong>Rose</strong><small>Consultora</small></span><span className="avatar nature-user-avatar">R</span><ChevronDown className="nature-user-chevron" size={16}/>
        </button>
        {open === 'user' && <div id="nature-user-menu" className="nature-dropdown nature-user-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => { setOpen(null); notify('Meu perfil estará disponível quando o cadastro de usuários for implementado.') }}><UserRound size={18}/> Meu perfil</button>
          <button type="button" role="menuitem" onClick={() => go('Configurações')}><Settings size={18}/> Configurações</button>
          <button type="button" role="menuitem" className="nature-logout" onClick={() => { setOpen(null); notify('Sair estará disponível quando a autenticação for implementada.') }}><LogOut size={18}/> Sair</button>
        </div>}
      </div>
    </div>
  </header>
}
