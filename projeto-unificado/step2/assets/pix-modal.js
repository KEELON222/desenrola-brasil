// Modal de Pagamento Pix
function createPixModal() {
  const html = `
    <div id="pixModal" style="
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.72);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: 'Rawline', 'Segoe UI', Arial, sans-serif;
    ">
      <div style="
        background: #ffffff;
        border-radius: 16px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        overflow: hidden;
        animation: pixModalIn .25s ease both;
      ">
        <!-- Cabeçalho institucional -->
        <div style="
          background: linear-gradient(135deg, #1451B4 0%, #1550b0 100%);
          padding: 22px 24px 18px;
        ">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 4px;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span style="color:#fff; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;">Pagamento Seguro</span>
          </div>
          <h2 style="margin: 6px 0 2px; color: #fff; font-size: 19px; font-weight: 700;">Serviço Contratado</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500;">Governo do Brasil</p>
        </div>

        <!-- Corpo -->
        <div style="padding: 24px;">
          <p style="margin: 0 0 16px; color: #444; font-size: 14px;">Escaneie o QR Code com o app do seu banco</p>

          <div id="pixQrCode" style="
            background: #f7f9fc;
            border: 1px solid #e5eaf2;
            padding: 16px;
            border-radius: 12px;
            margin: 0 auto 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 240px;
            max-width: 240px;
          ">
            <div style="text-align: center; color: #94a3b8;">
              <div style="
                width: 32px; height: 32px; margin: 0 auto 10px;
                border: 3px solid #cbd5e1; border-top-color: #1451B4;
                border-radius: 50%; animation: pixSpin .8s linear infinite;
              "></div>
              <p style="font-size: 13px; margin: 0;">Gerando QR Code...</p>
            </div>
          </div>

          <div style="
            display: flex; align-items: center; gap: 10px; margin: 4px 0 18px;
          ">
            <div style="flex:1; height:1px; background:#e5eaf2;"></div>
            <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em;">ou copie o código</span>
            <div style="flex:1; height:1px; background:#e5eaf2;"></div>
          </div>

          <div style="
            display: flex;
            border: 1.5px solid #e5eaf2;
            border-radius: 10px;
            overflow: hidden;
            background: #f7f9fc;
          ">
            <input
              id="pixCode"
              type="text"
              readonly
              value="Gerando..."
              style="
                flex: 1;
                min-width: 0;
                padding: 12px 14px;
                border: none;
                background: transparent;
                font-family: 'SFMono-Regular', Consolas, monospace;
                font-size: 12px;
                color: #333;
                outline: none;
              "
            />
            <button
              onclick="copyPixCode()"
              style="
                padding: 0 18px;
                background: #1451B4;
                color: white;
                border: none;
                cursor: pointer;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: .02em;
                transition: background 0.2s;
                white-space: nowrap;
              "
              onmouseover="this.style.background='#0f3d8c'"
              onmouseout="this.style.background='#1451B4'"
            >
              Copiar
            </button>
          </div>

          <div style="
            display:flex; align-items:center; gap:8px; margin-top: 18px;
            background: #f0f6ff; border-radius: 8px; padding: 10px 12px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1451B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4M12 8h.01"></path>
            </svg>
            <p style="margin:0; font-size:12px; color:#1451B4; text-align:left;">O pagamento é confirmado automaticamente após a compensação.</p>
          </div>

          <button
            onclick="closePixModal()"
            style="
              width: 100%;
              margin-top: 16px;
              padding: 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              font-weight: 600;
              font-size: 13px;
              color: #64748b;
            "
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes pixModalIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes pixSpin { to { transform: rotate(360deg); } }
    </style>
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
      <div style="color: #dc2626; text-align: center; padding: 8px;">
        <p style="margin:0 0 4px; font-weight:600; font-size:13px;">⚠️ Erro ao gerar QR Code</p>
        <p style="margin:0; font-size:12px;">${error.message}</p>
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
      width: 208,
      height: 208,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    // Fallback: usar API externa
    const qrCodeDiv = document.getElementById('pixQrCode');
    qrCodeDiv.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=208x208&data=${encodeURIComponent(text)}"
           alt="QR Code"
           style="max-width: 100%; border-radius: 8px;">
    `;
  }
}

// Inicializar modal quando a página carrega
document.addEventListener('DOMContentLoaded', createPixModal);
