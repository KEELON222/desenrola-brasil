const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'projeto-unificado');

// Servir arquivos estáticos da pasta projeto-unificado
app.use(express.static(staticDir));

// Redirecionar para index.html se não encontrar arquivo
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
