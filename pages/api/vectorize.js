import formidable from 'formidable'
import fs from 'fs'
import FormData from 'form-data'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const apiId     = process.env.VECTORIZER_API_ID
  const apiSecret = process.env.VECTORIZER_API_SECRET

  if (!apiId || !apiSecret)
    return res.status(500).json({ error: 'Credenciais da API não configuradas.' })

  const form = formidable({ maxFileSize: 20 * 1024 * 1024, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Erro ao processar o arquivo enviado.' })

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
    if (!imageFile) return res.status(400).json({ error: 'Nenhuma imagem recebida.' })

    try {
      const formData = new FormData()
      formData.append('image', fs.createReadStream(imageFile.filepath), {
        filename: imageFile.originalFilename || 'logo.png',
        contentType: imageFile.mimetype || 'image/png',
      })

      const credentials = Buffer.from(`${apiId}:${apiSecret}`).toString('base64')

      const response = await fetch('https://vectorizer.ai/api/v1/vectorize', {
        method: 'POST',
        headers: { Authorization: `Basic ${credentials}`, ...formData.getHeaders() },
        body: formData,
      })

      fs.unlink(imageFile.filepath, () => {})

      if (!response.ok) {
        const errText = await response.text()
        console.error('Vectorizer.AI error:', response.status, errText)
        return res.status(response.status).json({ error: `Erro na API de vetorização (${response.status}).` })
      }

      const svgBuffer = Buffer.from(await response.arrayBuffer())
      const originalName = (imageFile.originalFilename || 'logo').replace(/\.[^.]+$/, '')

      res.setHeader('Content-Type', 'image/svg+xml')
      res.setHeader('Content-Disposition', `attachment; filename="${originalName}-vetor.svg"`)
      res.setHeader('Content-Length', svgBuffer.length)
      return res.status(200).send(svgBuffer)
    } catch (fetchErr) {
      console.error('Fetch error:', fetchErr)
      return res.status(500).json({ error: 'Falha ao conectar com o serviço de vetorização.' })
    }
  })
}
