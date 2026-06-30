export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' })

  const { orderId } = req.query
  if (!orderId) return res.status(400).json({ error: 'orderId obrigatório' })

  const token = process.env.MP_ACCESS_TOKEN

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const data = await response.json()

    if (!response.ok)
      return res.status(response.status).json({ error: 'Erro ao verificar pagamento.' })

    return res.status(200).json({
      orderId: data.id,
      status:  data.status,
      paid:    data.status === 'processed',
    })
  } catch (err) {
    console.error('Verificar pagamento error:', err)
    return res.status(500).json({ error: 'Falha ao verificar pagamento.' })
  }
}
