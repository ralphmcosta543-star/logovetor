import Head from 'next/head'

const NibIcon = () => (
  <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="22" y="3" width="56" height="18" rx="4" strokeWidth="5"/>
    <path d="M 28 21 C 22 28 4 48 3 64 C 2 75 12 86 22 96 C 28 103 33 113 33 121 C 33 127 39 133 46 133 C 49 133 50 127 49 119 C 48 109 48 102 48 96" strokeWidth="5"/>
    <path d="M 72 21 C 78 28 96 48 97 64 C 98 75 88 86 78 96 C 72 103 67 113 67 121 C 67 127 61 133 54 133 C 51 133 50 127 51 119 C 52 109 52 102 52 96" strokeWidth="5"/>
    <line x1="50" y1="21" x2="50" y2="74" strokeWidth="4"/>
    <circle cx="50" cy="82" r="8" strokeWidth="4"/>
  </svg>
)

const s = {
  h2: { fontSize: '1.15rem', fontWeight: 700, marginTop: '36px', marginBottom: '8px' },
  p:  { color: '#475569', lineHeight: 1.75, marginBottom: '12px' },
}

export async function getStaticProps() { return { props: {} } }

export default function Privacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | LogoVetor</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

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

      <section style={{background:'#F8FAFC', padding:'80px 0 48px', borderBottom:'1px solid #E2E8F0'}}>
        <div className="container" style={{maxWidth:'760px'}}>
          <div className="section-label">Legal</div>
          <h1 style={{fontSize:'2.25rem', fontWeight:800, letterSpacing:'-.02em', marginBottom:'8px'}}>Política de Privacidade</h1>
          <p style={{color:'#64748B'}}>Última atualização: 30 de junho de 2026</p>
        </div>
      </section>

      <section style={{padding:'64px 0 80px'}}>
        <div className="container" style={{maxWidth:'760px'}}>

          <p style={s.p}>A LogoVetor ("nós", "nosso") está comprometida em proteger a privacidade dos seus dados. Esta política descreve quais informações coletamos, como as usamos e quais são seus direitos.</p>

          <h2 style={s.h2}>1. Informações que coletamos</h2>
          <p style={s.p}>Coletamos as informações que você nos fornece diretamente ao utilizar nossos serviços:</p>
          <p style={s.p}><strong>Dados de cadastro e pagamento:</strong> nome e endereço de e-mail fornecidos no momento do pedido. O pagamento é processado integralmente pelo Mercado Pago — não armazenamos dados de cartão ou chaves bancárias.</p>
          <p style={s.p}><strong>Arquivos enviados:</strong> as imagens de logo enviadas para vetorização são usadas exclusivamente para a geração do arquivo vetorial e excluídas de nossos servidores assim que o processamento é concluído.</p>
          <p style={s.p}><strong>Dados de uso:</strong> podemos coletar informações técnicas como endereço IP, tipo de navegador e páginas acessadas, de forma anônima, para fins de análise e melhoria do serviço.</p>

          <h2 style={s.h2}>2. Como usamos suas informações</h2>
          <p style={s.p}>Utilizamos seus dados para: processar e entregar os arquivos vetorizados; confirmar e gerenciar pagamentos; responder a dúvidas e solicitações de suporte; melhorar a qualidade do serviço.</p>
          <p style={s.p}>Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>

          <h2 style={s.h2}>3. Compartilhamento de dados</h2>
          <p style={s.p}>Seus dados podem ser compartilhados apenas com:</p>
          <p style={s.p}><strong>Mercado Pago:</strong> para processamento seguro do pagamento via PIX.<br/><strong>Vectorizer.AI:</strong> a imagem enviada é transmitida à API de vetorização para processamento. Consulte a política de privacidade da Vectorizer.AI para mais detalhes.<br/><strong>Autoridades legais:</strong> quando exigido por lei ou ordem judicial.</p>

          <h2 style={s.h2}>4. Retenção de dados</h2>
          <p style={s.p}>Os arquivos de imagem enviados são excluídos automaticamente após a geração do vetor. Os dados de pedido (nome, e-mail, valor) são mantidos pelo período mínimo exigido pela legislação fiscal brasileira (5 anos).</p>

          <h2 style={s.h2}>5. Seus direitos (LGPD)</h2>
          <p style={s.p}>Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: acessar os dados que temos sobre você; solicitar a correção de dados incorretos; solicitar a exclusão dos seus dados, quando aplicável; revogar o consentimento a qualquer momento.</p>
          <p style={s.p}>Para exercer seus direitos, entre em contato pelo e-mail <a href="mailto:contato@logovetor.com.br" style={{color:'var(--blue)'}}>contato@logovetor.com.br</a>.</p>

          <h2 style={s.h2}>6. Cookies</h2>
          <p style={s.p}>Utilizamos cookies essenciais para o funcionamento do site. Não utilizamos cookies de rastreamento ou publicidade de terceiros.</p>

          <h2 style={s.h2}>7. Segurança</h2>
          <p style={s.p}>Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, perda ou alteração. A transmissão de dados é feita via HTTPS.</p>

          <h2 style={s.h2}>8. Alterações nesta política</h2>
          <p style={s.p}>Podemos atualizar esta política periodicamente. Publicaremos a nova versão nesta página com a data de atualização. O uso contínuo do serviço após as alterações implica a aceitação da política revisada.</p>

          <h2 style={s.h2}>9. Contato</h2>
          <p style={s.p}>Dúvidas sobre esta política? Fale conosco em <a href="mailto:contato@logovetor.com.br" style={{color:'var(--blue)'}}>contato@logovetor.com.br</a> ou acesse nossa <a href="/atendimento" style={{color:'var(--blue)'}}>página de contato</a>.</p>

          <div style={{marginTop:'48px', paddingTop:'32px', borderTop:'1px solid #E2E8F0', display:'flex', gap:'16px'}}>
            <a href="/" className="btn btn-outline">Voltar ao início</a>
            <a href="/termos" className="btn btn-outline">Termos de Uso</a>
          </div>

        </div>
      </section>

      <footer style={{background:'#0F172A', padding:'32px 0', textAlign:'center'}}>
        <p style={{color:'rgba(255,255,255,.35)', fontSize:'.85rem', margin:0}}>
          © {new Date().getFullYear()} LogoVetor. Todos os direitos reservados.
        </p>
      </footer>
    </>
  )
}
