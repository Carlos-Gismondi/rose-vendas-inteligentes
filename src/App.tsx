import './mobile-18-40.css'
import './style.css'
import { AppProvider, useApp } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './components/auth/LoginPage'
import SetupPage from './components/auth/SetupPage'


import { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import MobileNav from './components/layout/MobileNav'
import ClientModal from './components/forms/ClientModal'
import Toast from './components/ui/Toast'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import ProdutosPage from './pages/ProdutosPage'
import PedidosPage from './pages/PedidosPage'
import ContatosPage from './pages/ContatosPage'
import RelatoriosPage from './pages/RelatoriosPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'
import UsuariosPage from './pages/UsuariosPage'

const pages = {
  Dashboard: DashboardPage, Clientes: ClientesPage, Produtos: ProdutosPage,
  Pedidos: PedidosPage, Contatos: ContatosPage,
  'Relatórios': RelatoriosPage, 'Configurações': ConfiguracoesPage, Usuários: UsuariosPage,
}
function AppLayout() {
  const { page, collapsed } = useApp()
  const { usuario } = useAuth()
  const safePage = page === 'Usuários' && usuario?.perfil !== 'ADMIN' ? 'Dashboard' : page
  const Page = pages[safePage]
  return <div className={`app ${collapsed ? 'collapsed' : ''}`}>
    <Sidebar />
    <div className="workspace"><Topbar /><main>{usuario?.perfil === 'REVENDA' && ['Clientes','Pedidos','Relatórios','Contatos','Dashboard'].includes(safePage) ? <section style={{padding:24}}><h2>Área da revenda</h2><p>Os dados individuais estarão disponíveis após a integração da API de clientes e vendas. Nenhum dado de outras contas será exibido.</p></section> : <Page />}</main></div>
    <MobileNav /><ClientModal /><Toast />
  </div>
}
function AuthGate() {
 const { autenticado, carregando } = useAuth()
 const [setup, setSetup] = useState(false)
 useEffect(() => { if (!autenticado) void fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/instalacao/status`).then(r => r.json()).then(d => setSetup(Boolean(d.instalacao_pendente))).catch(() => {}) }, [autenticado])
 if (carregando) return <div style={{padding:40}}>Restaurando sessão...</div>
 if (autenticado) return <AppProvider><AppLayout /></AppProvider>
 return setup ? <SetupPage onDone={() => setSetup(false)} /> : <LoginPage />
}
export default function App() { return <AuthProvider><AuthGate /></AuthProvider> }
