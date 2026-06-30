const formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');

// Desabilita o bodyParser padrão do Vercel para lidar com multipart/form-data
module.exports.config = {
  api: { bodyParser: false },
};

module.exports = async function handler(req, res) {
  // CORS para desenvolvimento local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verificar credenciais configuradas
  const apiId     = process.env.VECTORIZER_API_ID;
  const apiSecret = process.env.VECTORIZER_API_SECRET;

  if (!apiId || !apiSecret) {
    return res.status(500).json({
      error: 'Credenciais da API não configuradas. Adicione VECTORIZER_API_ID e VECTORIZER_API_SECRET nas variáveis de ambiente do Vercel.',
    });
  }

  // Parsear o upload
  const form = formidable({
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Erro ao processar o arquivo enviado.' });
    }

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({ error: 'Nenhuma imagem recebida.' });
    }

    try {
      // Montar requisição para Vectorizer.AI
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imageFile.filepath), {
        filename: imageFile.originalFilename || 'logo.png',
        contentType: imageFile.mimetype || 'image/png',
      });

      const credentials = Buffer.from(`${apiId}:${apiSecret}`).toString('base64');

      const response = await fetch('https://vectorizer.ai/api/v1/vectorize', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      // Limpar arquivo temporário
      fs.unlink(imageFile.filepath, () => {});

      if (!response.ok) {
        const errText = await response.text();
        console.error('Vectorizer.AI error:', response.status, errText);
        return res.status(response.status).json({
          error: `Erro na API de vetorização (${response.status}). Tente novamente.`,
        });
      }

      // Retornar o SVG direto para o cliente
      const svgBuffer = Buffer.from(await response.arrayBuffer());

      const originalName = (imageFile.originalFilename || 'logo').replace(/\.[^.]+$/, '');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${originalName}-vetor.svg"`);
      res.setHeader('Content-Length', svgBuffer.length);
      res.status(200).send(svgBuffer);

    } catch (fetchErr) {
      console.error('Fetch error:', fetchErr);
      res.status(500).json({ error: 'Falha ao conectar com o serviço de vetorização.' });
    }
  });
};
