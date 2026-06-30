import Head from 'next/head'
import { useState, useRef, useEffect, useCallback } from 'react'

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

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const UploadIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const DownloadIcon = ({ size = 18 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
  </svg>
)

export default function Home() {
  // ── Hero drop zone ──
  const [heroFile, setHeroFile]         = useState(null)
  const [heroPreviewUrl, setHeroPreviewUrl] = useState(null)
  const [dragOver, setDragOver]         = useState(false)
  const heroInputRef = useRef(null)

  // ── Upload form ──
  const PLAN_CREDITS = { basico: 1, intermediario: 4, profissional: 10 }
  const [formView, setFormView]           = useState('form')
  const [formPlan, setFormPlan]           = useState('')
  const [uploadFiles, setUploadFiles]     = useState([])
  const [orderId, setOrderId]             = useState(null)
  const [qrData, setQrData]               = useState(null)
  const [downloadItems, setDownloadItems] = useState([]) // [{url, name, blob}]
  const [vecProgress, setVecProgress]     = useState({ current: 0, total: 0 })
  const [error, setError]                 = useState('')
  const [pixCopied, setPixCopied]         = useState(false)
  const [faqOpen, setFaqOpen]             = useState(null)
  const fileInputRef      = useRef(null)
  const multiFileInputRef = useRef(null)
  const portfolioRef      = useRef(null)
  const [showMore, setShowMore] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const ids = ['como-funciona', 'portfolio', 'precos']
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  function scrollPortfolio(dir) {
    portfolioRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  const maxFiles = PLAN_CREDITS[formPlan] || 1

  // ── Hero file handler ──
  const handleHeroFile = useCallback((file) => {
    setHeroFile(file)
    if (file.type.startsWith('image/')) {
      setHeroPreviewUrl(URL.createObjectURL(file))
    } else {
      setHeroPreviewUrl(null)
    }
    setUploadFiles([file])
  }, [])

  function heroReset(e) {
    e.preventDefault()
    e.stopPropagation()
    setHeroFile(null)
    setHeroPreviewUrl(null)
  }

  // ── Upload form handlers ──
  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) setUploadFiles([file])
  }

  function handleMultiFileChange(e) {
    const newFiles = Array.from(e.target.files)
    setUploadFiles(prev => {
      const combined = [...prev, ...newFiles]
      return combined.slice(0, maxFiles)
    })
    e.target.value = ''
  }

  function removeFile(idx) {
    setUploadFiles(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (uploadFiles.length === 0) { alert('Por favor, selecione ao menos um arquivo.'); return }
    setError('')
    setFormView('loading')

    try {
      const res = await fetch('/api/criar-cobranca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:  e.target.nome.value,
          email: e.target.email.value,
          plano: e.target.plano.value,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao gerar cobrança.'); setFormView('form'); return }
      setOrderId(data.orderId)
      setQrData(data)
      setFormView('qr')
    } catch {
      setError('Falha na conexão. Tente novamente.')
      setFormView('form')
    }
  }

  async function handleVerificarPagamento() {
    if (!orderId) return
    setFormView('loadingVector')
    try {
      const res  = await fetch(`/api/verificar-pagamento?orderId=${orderId}`)
      const data = await res.json()

      if (!data.paid) {
        setFormView('qr')
        setError('Pagamento ainda não confirmado. Aguarde alguns segundos e tente novamente.')
        return
      }

      const items = []
      for (let i = 0; i < uploadFiles.length; i++) {
        setVecProgress({ current: i + 1, total: uploadFiles.length })
        const formData = new FormData()
        formData.append('image', uploadFiles[i])
        const vecRes = await fetch('/api/vectorize', { method: 'POST', body: formData })

        if (!vecRes.ok) {
          const err = await vecRes.json().catch(() => ({}))
          setError(`Erro ao vetorizar arquivo ${i + 1}: ${err.error || 'Erro desconhecido.'}`)
          setFormView('qr')
          return
        }

        const blob = await vecRes.blob()
        const name = uploadFiles[i].name.replace(/\.[^.]+$/, '')
        items.push({ blob, url: URL.createObjectURL(blob), name: `${name}-vetor.svg` })
      }

      setDownloadItems(items)
      setFormView('success')
    } catch {
      setError('Falha na conexão. Tente novamente.')
      setFormView('qr')
    }
  }

  async function handleDownloadZip() {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const item of downloadItems) {
      const buf = await item.blob.arrayBuffer()
      zip.file(item.name, buf)
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logos-vetorizados.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopiarPix() {
    if (qrData?.qrCode) {
      navigator.clipboard.writeText(qrData.qrCode).catch(() => {})
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    }
  }

  function resetForm() {
    setFormView('form')
    setOrderId(null)
    setQrData(null)
    setDownloadItems([])
    setVecProgress({ current: 0, total: 0 })
    setError('')
    setUploadFiles([])
    setFormPlan('')
  }

  return (
    <>
      <Head>
        <title>LogoVetor | Vetorização Profissional de Logos</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <link rel="shortcut icon" href="/favicon.svg"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-inner">
          <a href="/" className="logo" style={{textDecoration:'none'}}>
            <NibIcon/>
            Logo<span>Vetor</span>
          </a>
          <div className="nav-links">
            <a href="#como-funciona" className={activeSection === 'como-funciona' ? 'nav-active' : ''}>Como funciona</a>
            <a href="#portfolio" className={activeSection === 'portfolio' ? 'nav-active' : ''}>Portfólio</a>
            <a href="#precos" className={activeSection === 'precos' ? 'nav-active' : ''}>Preços</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="container">
          <div className="hero-center">
            <h1>Transforme seu logo em <em>vetor perfeito</em></h1>
            <p className="hero-sub">Envie qualquer imagem pixelada e receba um arquivo vetorial profissional em minutos.</p>

            {/* Drop zone */}
            <div
              className={`hero-drop${dragOver ? ' drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault(); setDragOver(false)
                const file = e.dataTransfer.files[0]
                if (file) handleHeroFile(file)
              }}
            >
              <input
                ref={heroInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.webp"
                onChange={e => { if (e.target.files[0]) handleHeroFile(e.target.files[0]) }}
              />

              {!heroFile ? (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'18px'}}>
                  <div className="hero-drop-icon"><UploadIcon/></div>
                  <div>
                    <strong style={{fontSize:'1.1rem',color:'var(--text)'}}>Arraste seu logo aqui ou clique para selecionar, qualquer formato</strong>
                  </div>
                  <div className="hero-drop-formats">
                    {['PNG','JPG','GIF','WebP'].map(f => <span key={f}>{f}</span>)}
                  </div>
                  <p className="drop-maxsize">Tamanho máximo: 20 MB</p>
                </div>
              ) : (
                <div className="drop-preview-wrap">
                  {heroPreviewUrl && (
                    <img src={heroPreviewUrl} alt="Preview do logo" className="drop-preview-img"/>
                  )}
                  <p className="drop-fname">{heroFile.name}</p>
                  <a href="#precos" className="btn btn-primary">
                    Vetorizar agora <ChevronIcon/>
                  </a>
                  <button className="drop-reset" onClick={heroReset}>Trocar arquivo</button>
                </div>
              )}
            </div>

            {/* Trust bar */}
            <div className="hero-trust">
              {[1,2,3,4,5].map(i => <StarIcon key={i}/>)}
              &nbsp;+200 logos vetorizados com 5 estrelas
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona">
        <div className="container">
          <div className="section-label">Processo</div>
          <h2 className="section-title">Como funciona</h2>
          <p className="section-sub">Simples e rápido. Em poucos minutos seu logo está vetorizado e pronto para baixar.</p>
          <div className="steps">
            {[
              {
                num:'01', title:'Envie o logo', desc:'Faça o upload do arquivo: PNG, JPG, GIF ou WebP. Qualquer imagem é aceita.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              },
              {
                num:'02', title:'Veja o preview', desc:'Nossa tecnologia gera instantaneamente uma prévia do seu logo vetorizado.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              },
              {
                num:'03', title:'Efetue o pagamento', desc:'Pague via PIX de forma rápida e segura. Confirmação em segundos.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>
              },
              {
                num:'04', title:'Faça o download', desc:'Baixe os arquivos SVG, PDF, EPS e DXF prontos para uso em qualquer escala ou mídia.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              },
            ].map(s => (
              <div className="step" key={s.num}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={lightbox.src} alt={lightbox.label} className="lightbox-img" onClick={e => e.stopPropagation()}/>
          <p className="lightbox-label">{lightbox.label}</p>
        </div>
      )}
      <section id="portfolio">
        <div className="container">
          <div className="section-label">Portfólio</div>
          <h2 className="section-title">Exemplos de vetorização</h2>
          <p className="section-sub">Resultados reais de imagens vetorizadas. Clique para ampliar.</p>
          <div className="port-gallery">
              {[
                { src:'/portfolio/casa.png',      label:'Ilustração arquitetônica' },
                { src:'/portfolio/cachorro.png',  label:'Mascote skate' },
                { src:'/portfolio/montanha.png',  label:'Paisagem flat design' },
                { src:'/portfolio/mulher.png',    label:'Retrato low-poly' },
                { src:'/portfolio/homem.png',     label:'Ilustração poster' },
              ].map(img => (
                <div
                  key={img.src}
                  className="port-gallery-item"
                  onClick={() => setLightbox(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setLightbox(img)}
                >
                  <img src={img.src} alt={img.label} loading="lazy"/>
                  <div className="port-gallery-zoom">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                  <p className="port-gallery-label">{img.label}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="precos">
        <div className="container">
          <div className="section-label">Planos</div>
          <h2 className="section-title">Preços transparentes</h2>
          <p className="section-sub">Pague por crédito. Cada crédito = 1 vetorização profissional.</p>
          <div className="pricing-grid">

            {/* Básico */}
            <div className="plan">
              <div className="plan-header">
                <div className="plan-top">
                  <div className="plan-name">Básico</div>
                </div>
                <div className="plan-price"><strong>R$19,00</strong><span>/ crédito</span></div>
                <div style={{marginTop:'8px'}}>
                  <span className="plan-credit-tag">1 crédito = 1 vetorização</span>
                </div>
              </div>
              <p className="plan-desc">Ideal para quem precisa de uma vetorização pontual e rápida.</p>
              <ul className="plan-features">
                {['Cores ilimitadas','Entrega imediata','SVG + PDF + EPS + DXF'].map(f => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <a href="#enviar" className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Começar</a>
            </div>

            {/* Intermediário */}
            <div className="plan">
              <div className="plan-header">
                <div className="plan-top">
                  <div className="plan-badge-discount">Economia de 35%</div>
                  <div className="plan-name">Pequeno Negócio</div>
                </div>
                <div className="plan-price"><strong>R$49,00</strong><span>/ pacote</span></div>
                <div style={{marginTop:'8px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <span className="plan-credit-tag">4 créditos</span>
                  <span className="plan-per-tag">R$12,25 / vetorização</span>
                </div>
              </div>
              <p className="plan-desc">Para microempreendedores criando variações do logo ou identidade visual completa.</p>
              <ul className="plan-features">
                {['Cores ilimitadas','Entrega imediata','SVG + PDF + EPS + DXF','4 vetorizações no pacote'].map(f => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <a href="#enviar" className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Escolher Pacote</a>
            </div>

            {/* Profissional */}
            <div className="plan featured">
              <div className="plan-badge">Melhor custo-benefício</div>
              <div className="plan-header">
                <div className="plan-top">
                  <div className="plan-badge-discount">Economia de 48%</div>
                  <div className="plan-name">Profissional / Gráfica</div>
                </div>
                <div className="plan-price"><strong>R$99,00</strong><span>/ pacote</span></div>
                <div style={{marginTop:'8px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <span className="plan-credit-tag">10 créditos</span>
                  <span className="plan-per-tag">R$9,90 / vetorização</span>
                </div>
              </div>
              <p className="plan-desc">Para designers freelancers, agências locais, criadores de conteúdo e pequenas gráficas.</p>
              <ul className="plan-features">
                {['Cores ilimitadas','Entrega imediata','SVG + PDF + EPS + DXF','10 vetorizações no pacote','Maior economia por crédito'].map(f => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <a href="#enviar" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Escolher Profissional</a>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq">
        <div className="container">
          <div className="section-label">Dúvidas</div>
          <h2 className="section-title">Perguntas frequentes</h2>
          <p className="section-sub">Tudo que você precisa saber antes de vetorizar seu logo.</p>
          <div className="faq-list">
            {[
              { q:'Quais formatos de arquivo posso enviar?', a:'Aceitamos PNG, JPG, GIF e WebP, qualquer imagem de até 20 MB. Quanto melhor a qualidade do original, mais fiel será o resultado vetorial.' },
              { q:'Quanto tempo leva a vetorização?', a:'O processo é instantâneo. Após a confirmação do pagamento via PIX, o arquivo vetorizado é gerado e liberado para download em segundos.' },
              { q:'Qual formato vou receber?', a:'Você recebe os arquivos vetoriais em SVG, PDF, EPS e DXF, compatíveis com Illustrator, CorelDRAW, Inkscape e qualquer software de design.' },
              { q:'Posso editar o arquivo depois?', a:'Sim. O SVG é 100% editável em qualquer software vetorial. Você pode alterar cores, tamanhos, texto e formas sem perda de qualidade.' },
              { q:'Como funciona o sistema de créditos?', a:'1 crédito = 1 vetorização. Os planos com pacote oferecem créditos com desconto progressivo. No plano Profissional, por exemplo, cada vetorização sai a R$9,90 (contra R$19,00 avulso).' },
              { q:'O pagamento é seguro?', a:'Sim. Utilizamos PIX via Mercado Pago, uma das plataformas de pagamento mais seguras do Brasil. Nenhum dado do seu cartão é armazenado.' },
              { q:'E se eu não ficar satisfeito com o resultado?', a:'Você pode refazer a vetorização gratuitamente uma vez. Se ainda assim não estiver satisfeito, devolvemos o crédito integral.' },
            ].map((item, i) => (
              <div key={i} className={`faq-item${faqOpen === i ? ' faq-open' : ''}`}>
                <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{item.q}</span>
                  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {faqOpen === i && <p className="faq-answer">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="enviar" style={{background:'var(--blue)',padding:'80px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{color:'white',fontSize:'2rem',marginBottom:'12px'}}>Pronto para vetorizar?</h2>
          <p style={{color:'#BFDBFE',marginBottom:'36px',fontSize:'1.1rem'}}>Escolha seu plano e comece agora. Resultado em segundos.</p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="#precos" className="btn" style={{background:'white',color:'var(--blue)',padding:'16px 40px',fontSize:'1rem',fontWeight:700}}>Ver planos</a>
            <a href="mailto:contato@logovetor.com.br" className="btn btn-outline" style={{color:'white',borderColor:'rgba(255,255,255,0.4)',padding:'16px 40px',fontSize:'1rem'}}>Falar pelo e-mail</a>
          </div>
        </div>
      </section>

      {/* (form state kept for future modal) */}
      <div style={{display:'none'}}>
        <div className="upload-wrap">
          <div className="upload-wrap">

            {/* Form */}
            {formView === 'form' && (
              <form onSubmit={handleSubmit}>

                {/* 1. Plano */}
                <div className="form-group">
                  <label htmlFor="plano">Plano desejado</label>
                  <select id="plano" name="plano" required value={formPlan}
                    onChange={e => { setFormPlan(e.target.value); setUploadFiles([]) }}>
                    <option value="" disabled>Selecione um plano</option>
                    <option value="basico">Básico: R$19,00 (1 vetorização)</option>
                    <option value="intermediario">Pequeno Negócio: R$49,00 (4 vetorizações)</option>
                    <option value="profissional">Profissional / Gráfica: R$99,00 (10 vetorizações)</option>
                  </select>
                </div>

                {/* 2. Upload zone — adapta ao plano */}
                {formPlan === 'basico' && (
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <div className="upload-icon">📁</div>
                    <strong>{uploadFiles[0] ? '📎 ' + uploadFiles[0].name : 'Clique para selecionar o arquivo'}</strong>
                    <p>PNG, JPG, GIF, WebP até 20 MB</p>
                    <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp"
                      style={{display:'none'}} onChange={handleFileChange}/>
                  </div>
                )}

                {(formPlan === 'intermediario' || formPlan === 'profissional') && (
                  <div className="multi-upload-wrap">
                    <div className="multi-upload-drop" onClick={() => multiFileInputRef.current?.click()}>
                      <UploadIcon size={28}/>
                      <p style={{margin:'8px 0 4px',fontWeight:600}}>Clique ou arraste os logos aqui</p>
                      <p style={{fontSize:'.8rem',color:'var(--muted)',margin:0}}>
                        Até {maxFiles} arquivos • PNG, JPG, GIF, WebP • 20 MB cada
                      </p>
                      <input ref={multiFileInputRef} type="file" multiple
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        style={{display:'none'}} onChange={handleMultiFileChange}/>
                    </div>

                    {uploadFiles.length > 0 && (
                      <ul className="file-list">
                        {uploadFiles.map((f, i) => (
                          <li key={i} className="file-item">
                            <span className="file-item-num">{i + 1}</span>
                            <span className="file-item-name">📎 {f.name}</span>
                            <button type="button" className="file-item-remove" onClick={() => removeFile(i)}>×</button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p style={{fontSize:'.8rem',color:'var(--muted)',marginTop:'8px'}}>
                      {uploadFiles.length}/{maxFiles} arquivo(s) selecionado(s)
                      {uploadFiles.length < maxFiles && (
                        <button type="button" onClick={() => multiFileInputRef.current?.click()}
                          style={{marginLeft:'12px',background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontWeight:600,fontSize:'.8rem'}}>
                          + Adicionar mais
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* 3. Dados pessoais */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome">Nome completo</label>
                    <input type="text" id="nome" name="nome" placeholder="João Silva" required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="joao@empresa.com" required/>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="obs">Observações (opcional)</label>
                  <textarea id="obs" name="obs" placeholder="Ex: manter as cores originais, preciso para bordado…"/>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  <SendIcon/> Enviar pedido
                </button>
                {error && (
                  <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'10px',padding:'20px 24px',marginTop:'16px'}}>
                    <strong style={{color:'#B91C1C'}}>Erro ao processar</strong>
                    <p style={{color:'#991B1B',marginTop:'4px',fontSize:'.9rem'}}>{error}</p>
                    <button onClick={() => setError('')} style={{marginTop:'12px',background:'none',border:'none',color:'#B91C1C',cursor:'pointer',fontSize:'.875rem',fontWeight:'600'}}>Fechar ×</button>
                  </div>
                )}
              </form>
            )}

            {/* Loading cobrança */}
            {formView === 'loading' && (
              <div style={{textAlign:'center',padding:'48px 0'}}>
                <div className="spinner"/>
                <h3 style={{margin:'20px 0 8px'}}>Gerando cobrança PIX…</h3>
                <p>Aguarde um instante.</p>
              </div>
            )}

            {/* QR Code */}
            {formView === 'qr' && (
              <div style={{textAlign:'center',padding:'8px 0'}}>
                <div style={{fontSize:'1.5rem',marginBottom:'8px'}}>📲</div>
                <h3 style={{marginBottom:'4px'}}>Pague com PIX</h3>
                <p style={{marginBottom:'24px',fontSize:'.9rem'}}>
                  Plano {qrData?.plano} · R$ {qrData?.amount},00
                </p>
                {qrData?.qrCodeBase64 && (
                  <img src={`data:image/png;base64,${qrData.qrCodeBase64}`} alt="QR Code PIX"
                    style={{width:'200px',height:'200px',margin:'0 auto 20px',border:'1px solid var(--border)',borderRadius:'12px',padding:'8px'}}/>
                )}
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontSize:'.8125rem',fontWeight:'600',color:'var(--muted)',display:'block',marginBottom:'6px'}}>PIX Copia e Cola</label>
                  <div style={{display:'flex',gap:'8px'}}>
                    <input type="text" readOnly value={qrData?.qrCode || ''}
                      style={{fontSize:'.75rem',background:'#F8FAFC',color:'var(--muted)',cursor:'default'}}/>
                    <button onClick={handleCopiarPix} className="btn btn-outline"
                      style={{whiteSpace:'nowrap',padding:'10px 16px',fontSize:'.875rem'}}>
                      {pixCopied ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
                <div style={{background:'var(--blue-light)',border:'1px solid var(--blue-mid)',borderRadius:'10px',padding:'16px',marginBottom:'24px',textAlign:'left'}}>
                  <p style={{fontSize:'.875rem',color:'var(--text)'}}>
                    ⏱ Após o pagamento, clique em <strong>Já paguei</strong> para receber seu SVG.
                  </p>
                </div>
                <button onClick={handleVerificarPagamento} className="btn btn-primary"
                  style={{width:'100%',justifyContent:'center',marginBottom:'12px'}}>
                  ✅ Já paguei, gerar meu SVG
                </button>
                <button onClick={resetForm}
                  style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'.875rem'}}>
                  ← Voltar
                </button>
                {error && (
                  <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'10px',padding:'16px',marginTop:'16px'}}>
                    <p style={{color:'#991B1B',fontSize:'.875rem'}}>{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Loading vetorização */}
            {formView === 'loadingVector' && (
              <div style={{textAlign:'center',padding:'48px 0'}}>
                <div className="spinner"/>
                {vecProgress.total > 1
                  ? <h3 style={{margin:'20px 0 8px'}}>Vetorizando {vecProgress.current} de {vecProgress.total}…</h3>
                  : <h3 style={{margin:'20px 0 8px'}}>Verificando pagamento e vetorizando…</h3>
                }
                <p>Isso pode levar alguns segundos.</p>
              </div>
            )}

            {/* Success + Preview */}
            {formView === 'success' && (
              <div style={{textAlign:'center',padding:'32px 0'}}>
                <div style={{fontSize:'2rem',marginBottom:'8px'}}>✅</div>
                <h3 style={{marginBottom:'4px'}}>
                  {downloadItems.length > 1
                    ? `${downloadItems.length} logos vetorizados com sucesso!`
                    : 'Logo vetorizado com sucesso!'}
                </h3>
                <p style={{marginBottom:'24px',fontSize:'.9rem'}}>Confira as pré-visualizações abaixo antes de baixar.</p>

                {/* Preview grid */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns: downloadItems.length === 1 ? '1fr' : 'repeat(auto-fill,minmax(200px,1fr))',
                  gap:'16px',
                  marginBottom:'24px',
                }}>
                  {downloadItems.map((item, i) => (
                    <div key={i} style={{
                      background:'#F8FAFC',
                      border:'1px solid var(--border)',
                      borderRadius:'14px',
                      padding:'20px 16px 14px',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
                    }}>
                      <div style={{
                        background:'white', borderRadius:'10px', border:'1px solid var(--border)',
                        padding:'16px', width:'100%', display:'flex', alignItems:'center',
                        justifyContent:'center', minHeight:'130px',
                      }}>
                        <img src={item.url} alt={item.name}
                          style={{maxWidth:'100%',maxHeight:'160px',objectFit:'contain'}}/>
                      </div>
                      <p style={{fontSize:'.75rem',color:'var(--muted)',margin:0,wordBreak:'break-all'}}>{item.name}</p>
                      <a href={item.url} download={item.name}
                        style={{fontSize:'.8rem',color:'var(--blue)',fontWeight:600,textDecoration:'none'}}>
                        ↓ Baixar SVG
                      </a>
                    </div>
                  ))}
                </div>

                <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
                  {downloadItems.length > 1 && (
                    <button onClick={handleDownloadZip} className="btn btn-primary" style={{padding:'14px 32px',fontSize:'1rem'}}>
                      <DownloadIcon/> Baixar tudo (.zip)
                    </button>
                  )}
                  {downloadItems.length === 1 && (
                    <a href={downloadItems[0].url} download={downloadItems[0].name}
                      className="btn btn-primary" style={{padding:'14px 32px',fontSize:'1rem'}}>
                      <DownloadIcon/> Baixar SVG
                    </a>
                  )}
                </div>

                <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center',marginTop:'20px'}}>
                  <span style={{fontSize:'.75rem',background:'#DCFCE7',color:'#166534',padding:'3px 10px',borderRadius:'99px',fontWeight:'600'}}>✓ Escala infinita</span>
                  <span style={{fontSize:'.75rem',background:'#DCFCE7',color:'#166534',padding:'3px 10px',borderRadius:'99px',fontWeight:'600'}}>✓ Formato SVG</span>
                  <span style={{fontSize:'.75rem',background:'#DCFCE7',color:'#166534',padding:'3px 10px',borderRadius:'99px',fontWeight:'600'}}>✓ Editável</span>
                </div>

                <button onClick={resetForm}
                  style={{display:'block',margin:'20px auto 0',background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontSize:'.9rem',fontWeight:'600'}}>
                  ← Vetorizar mais logos
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer-full">
        <div className="container">
          <div className="footer-grid">

            {/* Marca */}
            <div className="footer-col footer-col-brand">
              <div className="footer-logo-wrap">
                <div style={{width:'32px',flexShrink:0}}><NibIcon stroke="white"/></div>
                <span className="footer-brand-name"><span style={{color:'var(--blue)'}}>Logo</span>Vetor</span>
              </div>
              <p className="footer-tagline">Transformamos logos antigos em vetores profissionais prontos para qualquer escala ou mídia.</p>
              <div className="footer-social">
                <a href="https://instagram.com/logovetor" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>

                <a href="mailto:contato@logovetor.com.br" aria-label="E-mail">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Navegação</h4>
              <ul className="footer-links">
                <li><a href="#como-funciona">Como funciona</a></li>
                <li><a href="#portfolio">Portfólio</a></li>
                <li><a href="#precos">Planos e preços</a></li>
                <li><a href="#faq">Perguntas frequentes</a></li>
              </ul>
            </div>

            {/* Contato */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contato</h4>
              <ul className="footer-links">
                <li><a href="mailto:contato@logovetor.com.br">contato@logovetor.com.br</a></li>
                <li><a href="/contato">Página de contato</a></li>
              </ul>
              <div className="footer-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Pagamento seguro via PIX
              </div>
              <div className="footer-badge" style={{marginTop:'8px'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Entrega imediata
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} LogoVetor. Todos os direitos reservados.</p>
            <div className="footer-bottom-links">
              <a href="/privacidade">Política de Privacidade</a>
              <a href="/termos">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
