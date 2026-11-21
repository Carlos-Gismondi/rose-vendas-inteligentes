import { useEffect, useRef, useState } from 'react'
import './PatternLock.css'

type Props = { mode: 'create' | 'confirm' | 'unlock'; onPattern: (pattern: string) => void; onPassword: () => void; error?: string }
const DOTS = Array.from({ length: 9 }, (_, i) => i)
export default function PatternLock({ mode, onPattern, onPassword, error }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const selected = useRef<number[]>([])
  const dragging = useRef(false)
  const [path, setPath] = useState<number[]>([])
  const [cursor, setCursor] = useState<{x:number;y:number}|null>(null)
  const title = mode === 'create' ? 'Crie seu padrão' : mode === 'confirm' ? 'Confirme seu padrão' : 'Desenhe seu padrão'
  useEffect(() => { selected.current = []; setPath([]); setCursor(null) }, [mode])
  function point(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left, y = event.clientY - rect.top
    setCursor({x,y})
    const dots = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-dot]'))
    for (const dot of dots) {
      const r = dot.getBoundingClientRect()
      const dx = event.clientX - (r.left+r.width/2), dy = event.clientY - (r.top+r.height/2)
      if (Math.hypot(dx,dy) <= Math.max(r.width,r.height)*0.65) {
        const index = Number(dot.dataset.dot)
        if (!selected.current.includes(index)) {
          selected.current = [...selected.current, index]
          setPath([...selected.current])
        }
        break
      }
    }
  }
  function finish() {
    if (!dragging.current) return
    dragging.current = false
    const value = selected.current.join('-')
    selected.current = []
    setPath([])
    setCursor(null)
    if (value) onPattern(value)
  }
  function center(index: number) { return {x: (index%3+0.5)*100/3, y: (Math.floor(index/3)+0.5)*100/3} }
  return <div className="nature-pattern-page"><section className="nature-pattern-card">
    <img src="/logo-nature.png" alt="Naturé Vendas Inteligentes" className="nature-pattern-logo" />
    <h1>{title}</h1><p>{mode === 'create' ? 'Conecte pelo menos 4 pontos para cadastrar.' : mode === 'confirm' ? 'Repita o desenho para confirmar.' : 'Deslize o dedo para desbloquear esta sessão.'}</p>
    <div className="nature-pattern-grid" ref={ref} aria-label="Grade de desbloqueio com nove pontos"
      onPointerDown={e => { if (e.pointerType === 'mouse' && e.button !== 0) return; dragging.current = true; selected.current = []; setPath([]); e.currentTarget.setPointerCapture(e.pointerId); point(e) }}
      onPointerMove={e => { if (dragging.current) point(e) }}
      onPointerUp={finish} onPointerCancel={finish}>
      <svg className="nature-pattern-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {path.length > 0 && <polyline points={path.map(i => { const p=center(i); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="#168044" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {path.length > 0 && cursor && <line x1={center(path[path.length-1]).x} y1={center(path[path.length-1]).y} x2={cursor.x/(ref.current?.clientWidth||1)*100} y2={cursor.y/(ref.current?.clientHeight||1)*100} stroke="#168044" strokeOpacity=".5" strokeWidth="1.5" />}
      </svg>
      {DOTS.map(i => <button type="button" tabIndex={-1} key={i} data-dot={i} className={`nature-pattern-dot ${path.includes(i) ? 'selected' : ''}`} aria-label={`Ponto ${i+1}`}><span /></button>)}
    </div>
    {error && <p className="nature-pattern-error" role="alert">{error}</p>}
    <button className="nature-pattern-alternative" onClick={onPassword} type="button">Entrar com e-mail e senha</button>
    <small>Proteção local da sessão • O servidor continua exigindo autenticação.</small>
  </section></div>
}
