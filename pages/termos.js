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

export default function Termos() {
  return (
    <>
      <Head>
        <title>Termos de Uso | LogoVetor</title>
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
          <h1 style={{fontSize:'2.25rem', fontWeight:800, letterSpacing:'-.02em', marginBottom:'8px'}}>Termos de Uso</h1>
          <p style={{color:'#64748B'}}>Última atualização: 30 de junho de 2026</p>
        </div>
      </section>

      <section style={{padding:'64px 0 80px'}}>
        <div className="container" style={{maxWidth:'760px'}}>

          <p style={s.p}>Ao utilizar os serviços da LogoVetor ("nós", "nosso", "serviço"), você ("usuário") concorda com os termos descritos abaixo. Leia com atenção antes de realizar qualquer pedido.</p>

          <h2 style={s.h2}>1. Descrição do serviço</h2>
          <p style={s.p}>A LogoVetor oferece um serviço de vetorização de imagens bitmap (PNG, JPG, GIF e WebP) para formatos vetoriais (SVG, PDF, EPS e DXF) mediante pagamento por crédito. O serviço é prestado de forma automatizada por meio de tecnologia de inteligência artificial.</p>

          <h2 style={s.h2}>2. Uso permitido</h2>
          <p style={s.p}>Ao enviar uma imagem, você declara que: é o titular dos direitos sobre a imagem ou possui autorização legal para utilizá-la; a imagem não viola direitos de terceiros, marcas registradas ou leis de propriedade intelectual; a imagem não contém conteúdo ilegal, ofensivo ou impróprio.</p>
          <p style={s.p}>A LogoVetor reserva-se o direito de recusar ou cancelar pedidos que violem estes termos.</p>

          <h2 style={s.h2}>3. Propriedade intelectual</h2>
          <p style={s.p}>Os arquivos vetoriais gerados a partir das suas imagens são de sua propriedade. A LogoVetor não reivindica nenhum direito sobre os arquivos produzidos para você.</p>
          <p style={s.p}>O código-fonte, identidade visual, nome e marca LogoVetor são propriedade exclusiva da empresa e não podem ser reproduzidos sem autorização.</p>

          <h2 style={s.h2}>4. Pagamentos e créditos</h2>
          <p style={s.p}>Os pagamentos são processados via PIX pelo Mercado Pago. Após a confirmação do pagamento, o crédito é utilizado imediatamente para a vetorização solicitada.</p>
          <p style={s.p}>Os créditos adquiridos não expiram e podem ser utilizados a qualquer momento. Não realizamos reembolsos de créditos já utilizados em vetorizações concluídas com sucesso.</p>

          <h2 style={s.h2}>5. Política de reembolso</h2>
          <p style={s.p}>Caso o resultado não corresponda ao esperado, o usuário pode solicitar uma nova vetorização gratuita do mesmo arquivo em até 7 dias corridos. Se após a segunda tentativa o resultado ainda não for satisfatório, devolveremos o crédito integral para uso em outro arquivo.</p>
          <p style={s.p}>Reembolsos em dinheiro estão sujeitos à análise individual. Para solicitações, entre em contato pelo e-mail <a href="mailto:contato@logovetor.com.br" style={{color:'var(--blue)'}}>contato@logovetor.com.br</a>.</p>

          <h2 style={s.h2}>6. Limitação de responsabilidade</h2>
          <p style={s.p}>O serviço é fornecido "como está". A LogoVetor não garante que o resultado atenderá a todos os casos de uso específicos, especialmente para imagens de baixa qualidade, resolução muito reduzida ou com muitos detalhes complexos.</p>
          <p style={s.p}>A LogoVetor não se responsabiliza por danos indiretos, perda de negócio ou uso indevido dos arquivos gerados.</p>

          <h2 style={s.h2}>7. Disponibilidade do serviço</h2>
          <p style={s.p}>Buscamos manter o serviço disponível 24 horas por dia, 7 dias por semana. Porém, não garantimos disponibilidade ininterrupta e nos reservamos o direito de realizar manutenções programadas ou emergenciais.</p>

          <h2 style={s.h2}>8. Alterações nos termos</h2>
          <p style={s.p}>Podemos revisar estes termos a qualquer momento. A versão vigente estará sempre disponível nesta página. O uso contínuo do serviço após alterações implica a aceitação dos novos termos.</p>

          <h2 style={s.h2}>9. Legislação aplicável</h2>
          <p style={s.p}>Estes termos são regidos pelas leis brasileiras. Eventuais disputas serão resolvidas no foro da comarca de São Paulo, SP.</p>

          <h2 style={s.h2}>10. Contato</h2>
          <p style={s.p}>Dúvidas sobre estes termos? Fale conosco em <a href="mailto:contato@logovetor.com.br" style={{color:'var(--blue)'}}>contato@logovetor.com.br</a> ou acesse nossa <a href="/contato" style={{color:'var(--blue)'}}>página de contato</a>.</p>

          <div style={{marginTop:'48px', paddingTop:'32px', borderTop:'1px solid #E2E8F0', display:'flex', gap:'16px'}}>
            <a href="/" className="btn btn-outline">Voltar ao início</a>
            <a href="/privacidade" className="btn btn-outline">Política de Privacidade</a>
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
