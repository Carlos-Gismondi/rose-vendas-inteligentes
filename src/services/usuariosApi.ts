const base=(import.meta.env.VITE_API_URL || '').replace(/\/$/,'')
export type Usuario={id:number;nome:string;email:string;perfil:'ADMIN'|'OPERADOR'|'REVENDA';status:'ATIVO'|'INATIVO';organizacao_id:number}
export async function apiUsuarios(path:string,token:string,method='GET',data?:unknown):Promise<any>{
 const r=await fetch(`${base}/api/v1/${path}`,{method,headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)})
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.erro||`Erro HTTP ${r.status}`);return d
}
