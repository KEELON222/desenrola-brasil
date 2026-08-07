// Modal de Pagamento Pix
function createPixModal() {
  const html = `
    <div id="pixModal" style="
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <h2 style="margin: 0 0 20px 0; color: #333;">Escaneie o código QR</h2>

        <div id="pixQrCode" style="
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 250px;
        ">
          <div style="text-align: center; color: #999;">
            <p>Gerando QR Code...</p>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <p style="color: #666; margin-bottom: 10px;">Ou copie o código Pix abaixo:</p>
          <div style="
            display: flex;
            gap: 10px;
            align-items: center;
          ">
            <input
              id="pixCode"
              type="text"
              readonly
              value="Gerando..."
              style="
                flex: 1;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-family: monospace;
                font-size: 12px;
              "
            />
            <button
              onclick="copyPixCode()"
              style="
                padding: 12px 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
              "
              onmouseover="this.style.background='#45a049'"
              onmouseout="this.style.background='#4CAF50'"
            >
              Copiar
            </button>
          </div>
        </div>

        <button
          onclick="closePixModal()"
          style="
            width: 100%;
            padding: 12px;
            background: #f0f0f0;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            color: #333;
          "
        >
          Fechar
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function showPixModal(cpf, value = 100, nome = '') {
  const modal = document.getElementById('pixModal');
  modal.style.display = 'flex';

  // Gerar QR Code via API
  generatePixQrCode(cpf, value, nome);
}

function closePixModal() {
  const modal = document.getElementById('pixModal');
  modal.style.display = 'none';
}

function copyPixCode() {
  const pixCode = document.getElementById('pixCode');
  pixCode.select();
  document.execCommand('copy');

  // Feedback visual
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓ Copiado!';
  setTimeout(() => {
    button.textContent = originalText;
  }, 2000);
}

async function generatePixQrCode(cpf, value, nome) {
  try {
    const response = await fetch('/api/generate-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: cpf.replace(/\D/g, ''),
        nome: nome,
        value: value,
        description: 'Pagamento Desenrola Brasil'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || 'Erro ao gerar QR Code');
    }

    // Atualizar o código Pix
    const pixCodeInput = document.getElementById('pixCode');
    pixCodeInput.value = data.qrCode || data.pix || data.codigo || 'Código não disponível';

    // Atualizar QR Code (pode ser uma imagem ou string)
    const qrCodeDiv = document.getElementById('pixQrCode');
    if (data.qrCodeUrl) {
      qrCodeDiv.innerHTML = `<img src="${data.qrCodeUrl}" alt="QR Code" style="max-width: 100%; border-radius: 8px;">`;
    } else if (data.qrCode) {
      // Se for uma string, gera QR Code com biblioteca
      generateQRCodeImage(data.qrCode);
    }

  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('pixCode').value = 'Erro ao gerar QR Code';
    document.getElementById('pixQrCode').innerHTML = `
      <div style="color: red; text-align: center;">
        <p>⚠️ Erro ao gerar QR Code</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

function generateQRCodeImage(text) {
  // Usar biblioteca QRCode.js se disponível
  if (typeof QRCode !== 'undefined') {
    const qrCodeDiv = document.getElementById('pixQrCode');
    qrCodeDiv.innerHTML = '';
    new QRCode(qrCodeDiv, {
      text: text,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    // Fallback: usar API externa
    const qrCodeDiv = document.getElementById('pixQrCode');
    qrCodeDiv.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}"
           alt="QR Code"
           style="max-width: 100%; border-radius: 8px;">
    `;
  }
}

// Inicializar modal quando a página carrega
document.addEventListener('DOMContentLoaded', createPixModal);
