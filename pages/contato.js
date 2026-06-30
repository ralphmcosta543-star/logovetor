import Head from 'next/head'
import { useState } from 'react'

const NibIcon = ({ stroke = 'currentColor' }) => (
  <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
    <rect x="22" y="3" width="56" height="18" rx="4" strokeWidth="5"/>
    <path d="M 28 21 C 22 28 4 48 3 64 C 2 75 12 86 22 96 C 28 103 33 113 33 121 C 33 127 39 133 46 133 C 49 133 50 127 49 119 C 48 109 48 102 48 96" strokeWidth="5"/>
    <path d="M 72 21 C 78 28 96 48 97 64 C 98 75 88 86 78 96 C 72 103 67 113 67 121 C 67 127 61 133 54 133 C 51 133 50 127 51 119 C 52 109 52 102 52 96" strokeWidth="5"/>
    <line x1="50" y1="21" x2="50" y2="74" strokeWidth="4"/>
    <circle cx="50" cy="82" r="8" strokeWidth="4"/>
  </svg>
)

export async function getServerSideProps() { return { props: {} } }

export default function Contato() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')

    const { nome, email, assunto, mensagem } = e.target

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.value,
          email: email.value,
          assunto: assunto.value,
          mensagem: mensagem.value,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao enviar mensagem.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError('Falha na conexão. Tente novamente.')
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Contato | LogoVetor</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="/" className="logo" style={{textDecoration:'none'}}>
            <NibIcon/>
            Logo<span>Vetor</span>
          </a>
          <div className="nav-links">
            <a href="/#como-funciona">Como funciona</a>
            <a href="/#portfolio">Portfólio</a>
            <a href="/#precos">Preços</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'#F8FAFC',padding:'80px 0 64px',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{maxWidth:'640px'}}>
          <div className="section-label">Fale conosco</div>
          <h1 style={{fontSize:'2.25rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:'12px'}}>Entre em contato</h1>
          <p style={{color:'var(--muted)',fontSize:'1.05rem'}}>Dúvidas, sugestões ou precisa de ajuda? Preencha o formulário e retornamos em até 24 horas.</p>
        </div>
      </section>

      {/* FORM */}
      <section style={{padding:'72px 0'}}>
        <div className="container" style={{maxWidth:'640px'}}>

          {status === 'success' ? (
            <div style={{textAlign:'center',padding:'48px 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'16px'}}>✅</div>
              <h2 style={{marginBottom:'8px'}}>Mensagem enviada!</h2>
              <p style={{color:'var(--muted)',marginBottom:'32px'}}>Recebemos seu contato e responderemos em breve no e-mail informado.</p>
              <a href="/" className="btn btn-outline">Voltar ao início</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'20px'}}>

              <div className="form-row">
                <div className="form-group" style={{margin:0}}>
                  <label htmlFor="nome">Nome completo</label>
                  <input type="text" id="nome" name="nome" placeholder="João Silva" required/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" name="email" placeholder="joao@email.com" required/>
                </div>
              </div>

              <div className="form-group" style={{margin:0}}>
                <label htmlFor="assunto">Assunto</label>
                <select id="assunto" name="assunto" required defaultValue="">
                  <option value="" disabled>Selecione um assunto</option>
                  <option value="duvida">Dúvida sobre o serviço</option>
                  <option value="pedido">Acompanhamento de pedido</option>
                  <option value="pagamento">Problema com pagamento</option>
                  <option value="resultado">Problema com resultado</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-group" style={{margin:0}}>
                <label htmlFor="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows={5}
                  placeholder="Descreva sua dúvida ou solicitação..." required
                  style={{minHeight:'140px'}}/>
              </div>

              {status === 'error' && (
                <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'10px',padding:'16px'}}>
                  <p style={{color:'#991B1B',fontSize:'.9rem',margin:0}}>{error}</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary"
                style={{padding:'16px',fontSize:'1rem',justifyContent:'center'}}
                disabled={status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
              </button>

            </form>
          )}

          {/* Info lateral */}
          <div style={{marginTop:'56px',paddingTop:'40px',borderTop:'1px solid var(--border)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
            <div>
              <p style={{fontSize:'.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:'6px'}}>E-mail</p>
              <a href="mailto:contato@logovetor.com.br" style={{color:'var(--blue)',fontWeight:600,fontSize:'.95rem',textDecoration:'none'}}>contato@logovetor.com.br</a>
            </div>

            <div>
              <p style={{fontSize:'.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:'6px'}}>Horário de atendimento</p>
              <p style={{fontSize:'.95rem',color:'var(--text)',margin:0}}>Seg a Sex, 9h às 18h</p>
            </div>
            <div>
              <p style={{fontSize:'.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:'6px'}}>Resposta em até</p>
              <p style={{fontSize:'.95rem',color:'var(--text)',margin:0}}>24 horas úteis</p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER simples */}
      <footer style={{background:'#0F172A',padding:'32px 0',textAlign:'center'}}>
        <p style={{color:'rgba(255,255,255,.35)',fontSize:'.85rem',margin:0}}>
          © {new Date().getFullYear()} LogoVetor. Todos os direitos reservados.
        </p>
      </footer>
    </>
  )
}
