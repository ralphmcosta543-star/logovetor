const prices = { basico: 19, intermediario: 49, profissional: 99 }
const labels = { basico: 'Básico', intermediario: 'Pequeno Negócio', profissional: 'Profissional / Gráfica' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const { nome, email, plano } = req.body

  if (!nome || !email || !plano)
    return res.status(400).json({ error: 'Nome, e-mail e plano são obrigatórios.' })

  const amount = prices[plano]
  if (!amount) return res.status(400).json({ error: 'Plano inválido.' })

  const token = process.env.MP_ACCESS_TOKEN
  if (!token) return res.status(500).json({ error: 'Credenciais do Mercado Pago não configuradas.' })

  try {
    const idempotencyKey = `logovetor-${plano}-${Date.now()}-${email.replace(/\W/g, '')}`

    const response = await fetch('https://api.mercadopago.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        type: 'online',
        processing_mode: 'automatic',
        description: `LogoVetor - Plano ${labels[plano]}`,
        external_reference: `logovetor-${plano}-${Date.now()}`,
        payer: { email },
        transactions: {
          payments: [{
            amount: amount.toFixed(2),
            payment_method: { id: 'pix', type: 'bank_transfer' },
          }],
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('MP error:', data)
      return res.status(response.status).json({ error: data.message || 'Erro ao criar cobrança no Mercado Pago.' })
    }

    const payment = data.transactions?.payments?.[0]
    const pixData = payment?.payment_method

    return res.status(200).json({
      orderId:      data.id,
      status:       data.status,
      amount,
      plano:        labels[plano],
      qrCode:       pixData?.qr_code        || null,
      qrCodeBase64: pixData?.qr_code_base64 || null,
      ticketUrl:    payment?.ticket_url      || null,
    })
  } catch (err) {
    console.error('Criar cobrança error:', err)
    return res.status(500).json({ error: 'Falha ao conectar com o Mercado Pago.' })
  }
}
