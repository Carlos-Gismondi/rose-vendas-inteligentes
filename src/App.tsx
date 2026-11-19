import './style.css'
import { AppProvider, useApp } from './context/AppContext'
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

const pages = {
  Dashboard: DashboardPage,
  Clientes: ClientesPage,
  Produtos: ProdutosPage,
  Pedidos: PedidosPage,
  Contatos: ContatosPage,
  'Relatórios': RelatoriosPage,
  'Configurações': ConfiguracoesPage,
}
function AppLayout() {
  const { page, collapsed } = useApp()
  const Page = pages[page]
  return <div className={`app ${collapsed ? 'collapsed' : ''}`}>
    <Sidebar />
    <div className="workspace"><Topbar /><main><Page /></main></div>
    <MobileNav />
    <ClientModal />
    <Toast />
  </div>
}
export default function App() {
  return <AppProvider><AppLayout /></AppProvider>
}
