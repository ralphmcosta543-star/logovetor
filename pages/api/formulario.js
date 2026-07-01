export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const { nome, email, assunto, mensagem } = req.body

  if (!nome || !email || !assunto || !mensagem)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })

  // Log no servidor (substitua por envio de e-mail real quando tiver SMTP configurado)
  console.log('📬 Novo contato recebido:')
  console.log(`  Nome: ${nome}`)
  console.log(`  E-mail: ${email}`)
  console.log(`  Assunto: ${assunto}`)
  console.log(`  Mensagem: ${mensagem}`)

  // TODO: integrar com Resend, SendGrid ou Nodemailer para envio real de e-mail

  return res.status(200).json({ ok: true })
}
