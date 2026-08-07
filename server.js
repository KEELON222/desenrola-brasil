const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'projeto-unificado');

// Sunize API Credentials
const SUNIZE_CLIENT_KEY = process.env.SUNIZE_CLIENT_KEY || 'ck_2fbf68de5b8678bf9ea2ec9163e029a5';
const SUNIZE_CLIENT_SECRET = process.env.SUNIZE_CLIENT_SECRET || 'cs_1e1fe23cac86f89e7887320f34c0f4e5';
const SUNIZE_API_BASE = 'https://api.sunize.com.br/v1';

app.use(express.json());
app.use(express.static(staticDir));

// Endpoint para gerar QR Code Pix
app.post('/api/generate-pix', async (req, res) => {
  try {
    const { cpf, value, description } = req.body;

    if (!cpf || !value) {
      return res.status(400).json({ error: 'CPF e valor são obrigatórios' });
    }

    // Chamada à API Sunize para gerar Pix
    const response = await axios.post(`${SUNIZE_API_BASE}/pix/create`, {
      cpf,
      amount: value,
      description: description || 'Pagamento Desenrola Brasil',
    }, {
      auth: {
        username: SUNIZE_CLIENT_KEY,
        password: SUNIZE_CLIENT_SECRET,
      },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao gerar Pix:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar QR Code',
      details: error.message
    });
  }
});

// Redirecionar para index.html se não encontrar arquivo
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
