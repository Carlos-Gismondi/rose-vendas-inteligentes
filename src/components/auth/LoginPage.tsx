import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import './LoginPage.css'

export default function LoginPage() {
  const { login, carregando } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')

    try {
      await login({
        email: email.trim(),
        senha,
      })
    } catch {
      setErro(
        'Não foi possível entrar. Verifique suas credenciais e tente novamente.'
      )
    }
  }

  return (
    <div className="nature-login">
      <section className="nature-login-card">

        {/* LOGOTIPO OFICIAL NATURÉ */}
        <div className="nature-login-brand">
          <img
            src="/logo-nature.png"
            alt="Naturé Vendas Inteligentes"
            className="nature-login-logo"
          />
        </div>

        {/* BOAS-VINDAS */}
        <div className="nature-login-heading">
          <h2>Bem-vindo de volta!</h2>
          <p>Entre com suas credenciais para continuar.</p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit}>

          <label htmlFor="login-email">
            E-mail
          </label>

          <div className="nature-login-input">
            <Mail size={19} />

            <input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="login-password">
            Senha
          </label>

          <div className="nature-login-input">
            <LockKeyhole size={19} />

            <input
              id="login-password"
              type={mostrarSenha ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />

            <button
              type="button"
              className="nature-login-toggle"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={
                mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
              }
            >
              {mostrarSenha ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* MENSAGEM DE ERRO */}
          {erro && (
            <p className="nature-login-error" role="alert">
              {erro}
            </p>
          )}

          {/* BOTÃO ENTRAR */}
          <button
            className="nature-login-submit"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        {/* RODAPÉ */}
        <footer className="nature-login-footer">
          <p>© 2026 Naturé Vendas Inteligentes</p>
        </footer>

      </section>
    </div>
  )
}