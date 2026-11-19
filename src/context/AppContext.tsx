import { createContext, useContext, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { initialClients } from '../data/demo'
import type { Client, Page } from '../data/demo'

function useAppState() {
  const [page, setPage] = useState<Page>('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [clientFilter, setClientFilter] = useState<'Todos' | 'Inadimplentes'>('Todos')
  const [clients, setClients] = useState(initialClients)
  const [completed, setCompleted] = useState<number[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [toast, setToast] = useState('')
  const [period, setPeriod] = useState('Novembro/2026')
  const notify = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 4000) }
  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); setSearch(''); setFilter('Todos'); setClientFilter('Todos'); setShowForm(false) }
  const navigateToDebtors = () => { navigate('Clientes'); setClientFilter('Inadimplentes') }
  const activeClients = clients.filter(c => !completed.includes(c.id))
  const urgent = activeClients.filter(c => c.status !== 'Próximo')
  const filteredClients = useMemo(() => clients.filter(c => (clientFilter !== 'Inadimplentes' || c.inadimplente === true) && `${c.name} ${c.phone} ${c.product}`.toLowerCase().includes(search.toLowerCase())), [clients, search, clientFilter])
  const filteredContacts = activeClients.filter(c => (filter === 'Todos' || (filter === 'Atrasados' && c.status === 'Atrasado') || (filter === 'Hoje' && c.status === 'Hoje') || (filter === 'Próximos' && c.status === 'Próximo')) && `${c.name} ${c.product}`.toLowerCase().includes(search.toLowerCase()))
  const whatsapp = (c: Client) => { const phone = c.phone.replace(/\D/g, ''); const message = `Olá, ${c.name.split(' ')[0]}! Tudo bem? 🌿 Passando para saber se você precisa repor seu ${c.product}. Posso te ajudar?`; window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer') }
  const finish = (id: number) => { setCompleted(v => [...v, id]); notify('Contato marcado como realizado (somente demonstração).') }
  const saveClient = (e: FormEvent) => { e.preventDefault(); if (!form.name.trim() || !form.phone.trim()) return; setClients(v => [...v, { id: Date.now(), name: form.name.trim(), phone: form.phone.trim(), product: 'Sem compras', last: '—', due: '—', status: 'Próximo' }]); setForm({ name: '', phone: '', email: '', notes: '' }); setShowForm(false); notify('Cliente incluído nesta sessão de demonstração.') }
  return { page, setPage, collapsed, setCollapsed, menuOpen, setMenuOpen, search, setSearch, filter, setFilter, clientFilter, setClientFilter, navigateToDebtors, clients, setClients, completed, setCompleted, showForm, setShowForm, form, setForm, toast, period, setPeriod, notify, navigate, activeClients, urgent, filteredClients, filteredContacts, whatsapp, finish, saveClient }
}
type AppState = ReturnType<typeof useAppState>
const AppContext = createContext<AppState | null>(null)
export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState()
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp precisa de AppProvider')
  return context
}
