const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const KEY = 'nature.pattern.device.v1'
export function deviceCredential(): string | null { try { const s=localStorage.getItem(KEY);return s && /^[a-f0-9]{64}$/.test(s)?s:null } catch {return null} }
export function createCredential(): string {const b=new Uint8Array(32);crypto.getRandomValues(b);return Array.from(b,v=>v.toString(16).padStart(2,'0')).join('')}
export function saveCredential(v:string){localStorage.setItem(KEY,v)}
export function forgetCredential(){localStorage.removeItem(KEY)}
async function post(path:string, body:Record<string,string>,token?:string){
 const res=await fetch(`${BASE}/api/v1/auth/padrao/dispositivo/${path}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...(token?{'Authorization':`Bearer ${token}`}:{})},body:JSON.stringify(body),cache:'no-store'})
 const json=await res.json().catch(()=>({}))
 if(!res.ok)throw new Error(json.erro||`HTTP ${res.status}`)
 return json
}
export const patternDeviceApi={
 link:(token:string,cred:string)=>post('vincular',{credencial:cred},token),
 login:(cred:string,pattern:string)=>post('entrar',{credencial:cred,padrao:pattern}),
 unlink:(token:string,cred:string)=>post('desvincular',{credencial:cred},token),
}
