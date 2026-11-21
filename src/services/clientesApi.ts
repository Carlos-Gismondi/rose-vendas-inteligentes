const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export type ClienteResumo = {id:number;codigo:string;nome:string;tipo_cliente:'revendedor'|'empresa';tipo_pessoa:'fisica'|'juridica';cpf_cnpj:string|null;situacao:'ativo'|'inativo';classificacao_id:number;classificacao:string;organizacao_id:number;organizacao_nome:string;telefone_principal:string|null;whatsapp:string|null}
export type Contato = {responsavel:string;telefone_principal:string;whatsapp:string;telefone_secundario:string;email:string}
export type Endereco = {cep:string;logradouro:string;numero:string;complemento:string;bairro:string;cidade:string;uf:string;referencia:string}
export type Preferencia = {categoria:string;descricao:string}
export type Interacao = {id:number;tipo:string;descricao:string;data_interacao:string;usuario_nome:string}
export type Cliente = ClienteResumo & {nome_fantasia:string;inscricao_estadual:string;data_nascimento:string;origem_cliente:string;observacoes:string;contato:Contato;endereco:Endereco;preferencias:Preferencia[];interacoes:Interacao[];criado_em:string;atualizado_em:string;arquivado_em:string|null}
export type ClienteForm = {id?:number;organizacao_id:number;tipo_cliente:'revendedor'|'empresa';tipo_pessoa:'fisica'|'juridica';nome:string;nome_fantasia:string;cpf_cnpj:string;inscricao_estadual:string;data_nascimento:string;classificacao_id:number;origem_cliente:string;observacoes:string;contato:Contato;endereco:Endereco;preferencias:Preferencia[]}
export type Opcoes = {organizacoes:{id:number;nome:string}[];classificacoes:{id:number;nome:string}[]}
export async function clientesApi<T>(path:string,token:string,method='GET',payload?:unknown):Promise<T> {
  const r=await fetch(`${base}/api/v1/${path}`,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',Accept:'application/json'},body:payload===undefined?undefined:JSON.stringify(payload)})
  const data=await r.json().catch(()=>({}))
  if(!r.ok)throw new Error(data.erro||`Falha na API (${r.status}).`)
  return data as T
}
export function clienteVazio(org=0):ClienteForm {return {organizacao_id:org,tipo_cliente:'revendedor',tipo_pessoa:'fisica',nome:'',nome_fantasia:'',cpf_cnpj:'',inscricao_estadual:'',data_nascimento:'',classificacao_id:1,origem_cliente:'',observacoes:'',contato:{responsavel:'',telefone_principal:'',whatsapp:'',telefone_secundario:'',email:''},endereco:{cep:'',logradouro:'',numero:'',complemento:'',bairro:'',cidade:'',uf:'',referencia:''},preferencias:[]}}
export const numero=(value:string)=>value.replace(/\D/g,'')
