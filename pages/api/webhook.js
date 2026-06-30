export default async function handler(req, res) {
  res.status(200).end()

  if (req.method !== 'POST') return

  const { type, data } = req.body || {}

  try {
    if (type === 'order' && data?.id) {
      const token = process.env.MP_ACCESS_TOKEN
      const response = await fetch(`https://api.mercadopago.com/v1/orders/${data.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const order = await response.json()

      if (order.status === 'processed') {
        console.log(`✅ Pagamento confirmado — Order: ${order.id} | Ref: ${order.external_reference}`)
      }
    }
  } catch (err) {
    console.error('Webhook error:', err)
  }
}
