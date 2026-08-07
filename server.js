const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'projeto-unificado');

// Sunize API Credentials
const SUNIZE_API_KEY = process.env.SUNIZE_API_KEY || 'ck_2fbf68de5b8678bf9ea2ec9163e029a5';
const SUNIZE_API_SECRET = process.env.SUNIZE_API_SECRET || 'cs_1e1fe23cac86f89e7887320f34c0f4e5';
const SUNIZE_API_BASE = 'https://api.sunize.com.br/v1';

app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(staticDir));

// Endpoint para criar transação Pix
app.post('/api/generate-pix', async (req, res) => {
  try {
    const { cpf, nome, value, description } = req.body;
    const cleanCpf = String(cpf || '').replace(/\D/g, '');

    if (!cleanCpf || !value) {
      return res.status(400).json({ error: 'CPF e valor são obrigatórios' });
    }

    const response = await axios.post(`${SUNIZE_API_BASE}/transactions`, {
      external_id: crypto.randomUUID(),
      total_amount: Number(value),
      payment_method: 'PIX',
      items: [
        {
          id: 'acordo-desenrola',
          title: 'Pagamento',
          description: description || 'Pagamento Desenrola Brasil',
          price: Number(value),
          quantity: 1,
          is_physical: false,
        },
      ],
      ip: req.ip,
      customer: {
        name: nome || 'Cliente Desenrola Brasil',
        email: `cliente${cleanCpf}@mail.com`,
        phone: '+5511999999999',
        document_type: 'CPF',
        document: cleanCpf,
      },
    }, {
      headers: {
        'x-api-key': SUNIZE_API_KEY,
        'x-api-secret': SUNIZE_API_SECRET,
      },
      timeout: 10000,
    });

    const data = response.data;

    res.json({
      id: data.id,
      status: data.status,
      qrCode: data.pix && data.pix.payload,
    });
  } catch (error) {
    console.error('Erro ao gerar Pix:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao gerar QR Code',
      details: error.response?.data?.error || error.message
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
