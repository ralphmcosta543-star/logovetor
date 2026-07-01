const _ID = 'api-contato-handler'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const { nome, email, assunto, mensagem } = req.body

  if (!nome || !email || !assunto || !mensagem)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })

  console.log('📬 Novo contato:', { nome, email, assunto })

  return res.status(200).json({ ok: true })
}
