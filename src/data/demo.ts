export type Page = 'Dashboard' | 'Clientes' | 'Produtos' | 'Pedidos' | 'Contatos' | 'Relatórios' | 'Configurações' | 'Usuários'
export type Client = { id: number; name: string; phone: string; product: string; last: string; due: string; status: 'Atrasado' | 'Hoje' | 'Próximo'; inadimplente?: boolean }
export const initialClients: Client[] = [
  { id: 1, name: 'Maria Silva', phone: '(11) 99999-1234', product: 'Hidratante Corporal', last: '10/10/2026', due: '17/11/2026', status: 'Atrasado' },
  { id: 2, name: 'Ana Costa', phone: '(11) 98888-5678', product: 'Perfume Essencial', last: '15/10/2026', due: '18/11/2026', status: 'Hoje' },
  { id: 3, name: 'Juliana Mendes', phone: '(11) 97777-9012', product: 'Shampoo Lumina', last: '20/10/2026', due: '18/11/2026', status: 'Hoje' },
  { id: 4, name: 'Patrícia Lima', phone: '(11) 96666-3456', product: 'Desodorante Roll-on', last: '05/11/2026', due: '25/11/2026', status: 'Próximo' },
]
export const products = [
  { name: 'Hidratante Corporal', category: 'Corpo', days: 30 },
  { name: 'Shampoo Lumina', category: 'Cabelos', days: 45 },
  { name: 'Perfume Essencial', category: 'Perfumaria', days: 60 },
  { name: 'Desodorante Roll-on', category: 'Higiene', days: 30 },
]
export const orders = [
  { id: 1038, name: 'Maria Silva', date: '10/11/2026', value: 129.9 },
  { id: 1037, name: 'Ana Costa', date: '08/11/2026', value: 89.9 },
  { id: 1036, name: 'Juliana Mendes', date: '05/11/2026', value: 199.9 },
  { id: 1035, name: 'Patrícia Lima', date: '01/11/2026', value: 79.9 },
]
export const nav: { label: Page; icon: string }[] = [
  { label: 'Dashboard', icon: '▦' }, { label: 'Clientes', icon: '♙' }, { label: 'Pedidos', icon: '▤' },
  { label: 'Produtos', icon: '▣' }, { label: 'Contatos', icon: '☎' }, { label: 'Relatórios', icon: '▥' }, { label: 'Configurações', icon: '⚙' },
]
export const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const logo = '/logo-nature.png'

