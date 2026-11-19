import { useApp } from '../context/AppContext'
import Panel from '../components/ui/Panel'
import { logo } from '../data/demo'

export default function ConfiguracoesPage() {
  return (
    <><div className="page-intro"><div><h2>Configurações</h2><p>Preferências e informações do aplicativo.</p></div></div><Panel title="Sobre o Naturé"><div className="settings"><img src={logo} alt="Logotipo Nature"/><div><strong>Naturé Vendas Inteligentes</strong><p>Versão 0.3 — Protótipo visual responsivo.</p><p>Frontend: React + Vite + TypeScript.</p><p>Persistência, API, autenticação e PWA instalável serão implementados em etapas futuras.</p></div></div></Panel></>
  )
}
