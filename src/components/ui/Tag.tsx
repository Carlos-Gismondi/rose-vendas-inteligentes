import type { Client } from '../../data/demo'
export default function Tag({ status }: { status: Client['status'] }) {
  return <span className={`tag ${status.toLowerCase()}`}>{status === 'Atrasado' ? 'Atrasado há 3 dias' : status === 'Hoje' ? 'Vence hoje' : 'Em breve'}</span>
}
