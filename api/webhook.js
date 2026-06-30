// Webhook do Mercado Pago — notificações de pagamento
// Configure em: https://www.mercadopago.com.br/developers/panel/app
// URL: https://logovetor.vercel.app/api/webhook

module.exports = async function handler(req, res) {
  // Mercado Pago exige resposta 200 imediata
  res.status(200).end();

  if (req.method !== 'POST') return;

  const { type, data } = req.body || {};

  try {
    if (type === 'order' && data?.id) {
      const token = process.env.MP_ACCESS_TOKEN;

      // Buscar detalhes do pedido
      const response = await fetch(`https://api.mercadopago.com/v1/orders/${data.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const order = await response.json();

      if (order.status === 'processed') {
        console.log(`✅ Pagamento confirmado — Order: ${order.id} | Ref: ${order.external_reference}`);
        // Aqui você pode:
        // - Salvar em banco de dados
        // - Enviar e-mail de confirmação
        // - Chamar a Vectorizer.AI automaticamente
      }
    }
  } catch (err) {
    console.error('Webhook error:', err);
  }
};
