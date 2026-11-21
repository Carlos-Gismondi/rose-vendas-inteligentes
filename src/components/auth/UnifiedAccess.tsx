import { useEffect, useRef, useState } from 'react'
import type { FormEvent, PointerEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import './UnifiedAccess.css'

type Mode = 'loading' | 'create' | 'confirm' | 'unlock' | 'no-session'
type Props = {
  mode: Mode; passwordMode: boolean; onPasswordMode: () => void; onPatternMode: () => void
  onLoginStart: () => void; onPasswordSuccess: () => void; onCancelPassword: () => void
  onSignOut: () => void; onPattern: (value: string) => void; error: string
}
export default function UnifiedAccess(props: Props) {
  const { login, autenticado } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loginError, setLoginError] = useState('')
  const [sending, setSending] = useState(false)
  const [path, setPath] = useState<number[]>([])
  const [readyPattern, setReadyPattern] = useState('')
  const [accountEmail, setAccountEmail] = useState(() => { try { return localStorage.getItem('nature.pattern.email') || '' } catch { return '' } })
  const [cursor, setCursor] = useState<{x:number;y:number}|null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const selected = useRef<number[]>([])
  const dragging = useRef(false)
  useEffect(() => { selected.current=[]; setPath([]);setCursor(null);setReadyPattern('') }, [props.mode, props.passwordMode])
  function point(event: PointerEvent<HTMLDivElement>) {
    const el=grid.current; if(!el)return
    const rect=el.getBoundingClientRect()
    setCursor({x:event.clientX-rect.left,y:event.clientY-rect.top})
    for(const dot of el.querySelectorAll<HTMLButtonElement>('[data-dot]')){
      const r=dot.getBoundingClientRect()
      if(Math.hypot(event.clientX-r.left-r.width/2,event.clientY-r.top-r.height/2)<=Math.max(r.width,r.height)*0.65){
        const i=Number(dot.dataset.dot)
        if(!selected.current.includes(i)){selected.current=[...selected.current,i];setPath([...selected.current])}
        break
      }
    }
  }
  function finish(){
    if(!dragging.current)return
    dragging.current=false
    const value=selected.current.join('-')
    selected.current=[];setPath([]);setCursor(null)
    if(value) { setReadyPattern(value); if(props.mode==='create'||props.mode==='confirm'||props.mode==='unlock') props.onPattern(value) }
  }
  function center(i:number){return {x:(i%3+.5)*100/3,y:(Math.floor(i/3)+.5)*100/3}}
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSending(true);setLoginError('');props.onLoginStart()
    try{await login({email:email.trim(),senha});setSenha('');props.onPasswordSuccess()}
    catch(e){props.onCancelPassword();setLoginError(e instanceof Error?e.message:'Falha no login.')}
    finally{setSending(false)}
  }
  const title=props.mode==='create'?'Crie seu padrão':props.mode==='confirm'?'Confirme seu padrão':'Desenhe seu padrão de acesso'
  return <div className="nature-access-page"><section className="nature-access-card">
    <img src="/logo-nature.png" alt="Naturé Vendas Inteligentes" className="nature-access-logo" />
    <h1>Bem-vindo(a)</h1><p className="nature-access-subtitle">Acesse o sistema utilizando o método de sua preferência.</p>
    <div className="nature-access-tabs" role="tablist" aria-label="Método de acesso">
      <button type="button" role="tab" aria-selected={!props.passwordMode} className={!props.passwordMode?'active':''} onClick={props.onPatternMode}>▦ &nbsp; Padrão</button>
      <button type="button" role="tab" aria-selected={props.passwordMode} className={props.passwordMode?'active':''} onClick={props.onPasswordMode}>♟ &nbsp; Login e senha</button>
    </div>
    {props.passwordMode ? <form onSubmit={submit} className="nature-access-form">
      <label htmlFor="nature-email">E-mail</label><input id="nature-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required />
      <label htmlFor="nature-pass">Senha</label><input id="nature-pass" type="password" autoComplete="current-password" value={senha} onChange={e=>setSenha(e.target.value)} required />
      {loginError&&<p role="alert" className="nature-access-error">{loginError}</p>}
      <button className="nature-access-submit" disabled={sending} type="submit">{sending?'Entrando...':'ACESSAR'}</button>
      {autenticado&&<p className="nature-access-help">Você já tem uma sessão válida. Para acessar por senha novamente, encerre a sessão atual primeiro. <button type="button" onClick={props.onSignOut}>Encerrar sessão</button></p>}
    </form> : <div className="nature-access-pattern">
      <h2>{title}</h2>
      {props.mode==='no-session' && <label className="nature-account-label">Conta <input type="email" autoComplete="username" placeholder="E-mail da conta (sem senha)" value={accountEmail} onChange={e=>setAccountEmail(e.target.value)} onBlur={()=>{try{localStorage.setItem('nature.pattern.email',accountEmail.trim())}catch{}}} /></label>}
      {props.mode==='loading' ? <p className="nature-access-help">Consultando padrão cadastrado...</p> :
       <>
        <p className="nature-access-hint">{props.mode==='create'?'Conecte pelo menos 4 pontos.':props.mode==='confirm'?'Repita o mesmo desenho.':'Deslize o dedo ou mouse sobre os pontos.'}</p>
        <div ref={grid} className="nature-access-grid" aria-label="Padrão de nove pontos"
          onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging.current=true;selected.current=[];setPath([]);e.currentTarget.setPointerCapture(e.pointerId);point(e)}}
          onPointerMove={e=>{if(dragging.current)point(e)}} onPointerUp={finish} onPointerCancel={finish}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="nature-access-lines">
            {path.length>0&&<polyline points={path.map(i=>{const p=center(i);return `${p.x},${p.y}`}).join(' ')} fill="none" stroke="#168044" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
            {path.length>0&&cursor&&<line x1={center(path[path.length-1]).x} y1={center(path[path.length-1]).y} x2={cursor.x/(grid.current?.clientWidth||1)*100} y2={cursor.y/(grid.current?.clientHeight||1)*100} stroke="#168044" strokeOpacity=".5" strokeWidth="1.5"/>}
          </svg>
          {Array.from({length:9},(_,i)=><button key={i} data-dot={i} tabIndex={-1} type="button" aria-label={`Ponto ${i+1}`} className={path.includes(i)?'selected':''}><span/></button>)}
        </div>
       </>}
      {loginError&&!props.passwordMode&&<p role="alert" className="nature-access-error">{loginError}</p>}
      {props.error&&<p role="alert" className="nature-access-error">{props.error}</p>}
      <button type="button" className="nature-access-clear" onClick={()=>{selected.current=[];setPath([]);setCursor(null);setReadyPattern('')}}>Limpar</button>
      <button type="button" className="nature-access-submit" disabled={props.mode==='loading'||readyPattern.split('-').length<4} onClick={()=>{if(props.mode==='no-session'){try{localStorage.setItem('nature.pattern.email',accountEmail.trim())}catch{}; if(!accountEmail.trim()){setLoginError('Informe o e-mail da conta.');return}} props.onPattern(readyPattern);setReadyPattern('')}} title="Desenhe o padrão nos nove pontos para acessar">ACESSAR</button>
    </div>}
    <footer>© 2026 Naturé Vendas Inteligentes</footer>
  </section></div>
}
