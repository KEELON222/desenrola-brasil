// Modal de Pagamento Pix
var currentTransactionId = null;
var currentPixCode = '';
var currentPixValue = 0;
var purchaseTracked = false;
var autoPollTimer = null;

function pixBodyTemplate() {
  return `
    <!-- QR Code -->
    <div style="position: relative; width: 220px; margin: 0 auto 30px;">
      <div style="
        border: 2px dashed #cbd5e1;
        border-radius: 16px;
        padding: 14px;
        background: #fff;
      ">
        <div id="pixQrCode" style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 190px;
        ">
          <div style="text-align: center; color: #94a3b8;">
            <div style="
              width: 30px; height: 30px; margin: 0 auto 10px;
              border: 3px solid #cbd5e1; border-top-color: #1456D8;
              border-radius: 50%; animation: pixSpin .8s linear infinite;
            "></div>
            <p style="font-size: 12px; margin: 0;">Gerando QR Code...</p>
          </div>
        </div>
      </div>
      <div id="pixAimPill" style="
        position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%);
        background: #fff; border: 1px solid #e5e7eb; border-radius: 999px;
        padding: 6px 14px; font-size: 12px; color: #475569; font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,.08); white-space: nowrap;
      ">
        📷 Aponte a câmera
      </div>
    </div>

    <!-- Selos de confiança -->
    <div style="display: flex; justify-content: space-between; gap: 6px; margin: 0 0 22px;">
      <div style="flex: 1; text-align: center;">
        <img src="assets/pix-logo.svg" alt="Pix" width="18" height="18" style="display: block; margin: 0 auto;">
        <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; line-height: 1.3;">Protegido<br>pelo Pix</p>
      </div>
      <div style="flex: 1; text-align: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#32BCAD" style="margin: 0 auto;">
          <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z"></path>
        </svg>
        <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; line-height: 1.3;">Liberação em<br>até 2 min.</p>
      </div>
      <div style="flex: 1; text-align: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1456D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto;">
          <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z"></path>
          <path d="M9 12 l2 2 4-4"></path>
        </svg>
        <p style="margin: 6px 0 0; font-size: 11px; color: #64748b; line-height: 1.3;">Ambiente<br>seguro</p>
      </div>
    </div>

    <!-- Botão copiar -->
    <button
      id="pixCopyBtn"
      onclick="copyPixCode()"
      style="
        width: 100%;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 15px;
        background: #1456D8;
        color: #fff;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(20,86,216,.35);
        margin-bottom: 10px;
        transition: background .2s;
      "
      onmouseover="this.style.background='#0f3fa8'"
      onmouseout="this.style.background='#1456D8'"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      Copiar código Pix
    </button>

    <!-- Botão já paguei -->
    <button
      id="pixCheckBtn"
      onclick="checkPaymentStatus()"
      style="
        width: 100%;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 14px;
        background: #e8f0fe;
        color: #1456D8;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 12px;
        transition: background .2s;
      "
      onmouseover="this.style.background='#d9e6fd'"
      onmouseout="this.style.background='#e8f0fe'"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
      Já fiz o pagamento
    </button>

    <div id="pixStatusMsg" style="min-height: 16px; margin-bottom: 4px;"></div>

    <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
      Confirmação automática. Se demorar, clique no botão acima.
    </p>
  `;
}

function pixConfirmedTemplate() {
  return `
    <div style="text-align: center; padding: 4px 0 2px;">
      <div style="
        width: 74px; height: 74px; margin: 4px auto 18px;
        background: #ecfdf5; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        animation: pixPop .4s cubic-bezier(.34,1.56,.64,1) both;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </div>

      <h3 style="margin: 0 0 6px; font-size: 19px; font-weight: 800; color: #0f172a;">Pagamento confirmado!</h3>
      <p style="margin: 0 0 22px; font-size: 13.5px; color: #64748b; line-height: 1.45; padding: 0 6px;">
        Seu acordo com o Desenrola Brasil foi processado com sucesso.
      </p>

      <div style="
        display: flex; align-items: center; gap: 12px; text-align: left;
        background: #f0f6ff; border: 1px solid #dbe7fb; border-radius: 12px;
        padding: 14px 16px; margin-bottom: 20px;
      ">
        <div style="
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          border: 3px solid #cbd8f5; border-top-color: #1456D8;
          animation: pixSpin .9s linear infinite;
        "></div>
        <div>
          <p style="margin: 0 0 2px; font-size: 13px; font-weight: 700; color: #1456D8;">Atualizando seu score...</p>
          <p style="margin: 0; font-size: 12px; color: #5b6b85; line-height: 1.4;">
            Seu nome será atualizado nos órgãos de proteção ao crédito em instantes.
          </p>
        </div>
      </div>

      <button
        onclick="closePixModal()"
        style="
          width: 100%;
          padding: 14px;
          background: #1456D8;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(20,86,216,.3);
        "
      >
        Entendi
      </button>
    </div>
  `;
}

function createPixModal() {
  var html = `
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
        border-radius: 18px;
        max-width: 380px;
        width: 100%;
        max-height: 92vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        animation: pixModalIn .25s ease both;
      ">
        <!-- Logo -->
        <div style="padding: 20px 22px 14px; text-align: center;">
          <img src="assets/govbr-logo.png" alt="gov.br" style="height: 26px;">
        </div>

        <!-- Valor / Produto -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0 22px 18px;
          border-bottom: 1px solid #eef2f7;
        ">
          <div style="text-align: left;">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 3px;">Valor a pagar</div>
            <div id="pixValue" style="font-size: 21px; font-weight: 800; color: #0f172a;">R$ 0,00</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 3px;">Produto</div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">Serviço Contratado</div>
          </div>
        </div>

        <div id="pixBody" style="padding: 22px;">
          ${pixBodyTemplate()}
        </div>

        <!-- Rodapé de confiança -->
        <div style="
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 22px; background: #f8fafc; border-top: 1px solid #eef2f7;
          border-radius: 0 0 18px 18px;
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1456D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
            <div style="text-align: left; line-height: 1.15;">
              <div style="font-size: 9.5px; color: #94a3b8;">Ambiente</div>
              <div style="font-size: 11px; font-weight: 700; color: #334155;">Seguro</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
            <div style="text-align: left; line-height: 1.15;">
              <div style="font-size: 9.5px; color: #94a3b8;">Dados 100%</div>
              <div style="font-size: 11px; font-weight: 700; color: #334155;">Protegidos</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/pix-logo.svg" alt="" width="14" height="14">
            <span style="font-size: 15px; font-weight: 800; color: #00BEAF; letter-spacing: -.02em;">pix</span>
          </div>
        </div>

        <button
          id="pixCloseBtn"
          onclick="closePixModal()"
          style="
            width: 100%;
            padding: 12px;
            background: transparent;
            border: none;
            border-top: 1px solid #eef2f7;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            color: #94a3b8;
          "
        >
          Fechar
        </button>
      </div>
    </div>
    <style>
      @keyframes pixModalIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes pixSpin { to { transform: rotate(360deg); } }
      @keyframes pixPop { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function formatCurrency(value) {
  return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showPixModal(cpf, value, nome) {
  value = value || 68.92;
  nome = nome || '';
  currentPixValue = value;
  purchaseTracked = false;

  var modal = document.getElementById('pixModal');
  modal.style.display = 'flex';
  document.getElementById('pixValue').textContent = formatCurrency(value);
  document.getElementById('pixBody').innerHTML = pixBodyTemplate();
  document.getElementById('pixCloseBtn').style.display = '';

  generatePixQrCode(cpf, value, nome);
}

function closePixModal() {
  var modal = document.getElementById('pixModal');
  modal.style.display = 'none';
}

async function copyPixCode() {
  if (!currentPixCode) return;

  try {
    await navigator.clipboard.writeText(currentPixCode);
  } catch (e) {
    var temp = document.createElement('textarea');
    temp.value = currentPixCode;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }

  var btn = document.getElementById('pixCopyBtn');
  var original = btn.innerHTML;
  btn.innerHTML = '✓ Código copiado!';
  setTimeout(function () { btn.innerHTML = original; }, 2000);
}

async function generatePixQrCode(cpf, value, nome) {
  currentTransactionId = null;
  currentPixCode = '';

  try {
    var response = await fetch('/api/generate-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: cpf.replace(/\D/g, ''),
        nome: nome,
        value: value,
        description: 'Pagamento Desenrola Brasil'
      })
    });

    var data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || 'Erro ao gerar QR Code');
    }

    currentTransactionId = data.id;
    currentPixCode = data.qrCode || '';

    generateQRCodeImage(currentPixCode);
    startAutoPolling();
  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('pixQrCode').innerHTML =
      '<div style="color: #dc2626; text-align: center; padding: 8px;">' +
      '<p style="margin:0 0 4px; font-weight:600; font-size:13px;">⚠️ Erro ao gerar QR Code</p>' +
      '<p style="margin:0; font-size:12px;">' + error.message + '</p>' +
      '</div>';
  }
}

function generateQRCodeImage(text) {
  var qrCodeDiv = document.getElementById('pixQrCode');
  if (typeof QRCode !== 'undefined') {
    qrCodeDiv.innerHTML = '';
    new QRCode(qrCodeDiv, {
      text: text,
      width: 190,
      height: 190,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrCodeDiv.innerHTML =
      '<img src="https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=' + encodeURIComponent(text) + '" ' +
      'alt="QR Code" style="max-width: 100%; display:block;">';
  }
}

// Verifica o status na Sunize automaticamente em segundo plano, sem
// depender do usuário clicar em "Já fiz o pagamento" — muita gente paga
// pelo app do banco e nunca volta pra clicar no botão manualmente.
// Continua rodando mesmo se o popup for fechado (só para quando a aba
// fecha), pra não perder a conversão. Some após ~20 min sem confirmação.
var AUTO_POLL_MAX_ATTEMPTS = 240;
var autoPollAttempts = 0;

function startAutoPolling() {
  stopAutoPolling();
  autoPollAttempts = 0;
  autoPollTimer = setInterval(silentCheckStatus, 5000);
}

function stopAutoPolling() {
  if (autoPollTimer) {
    clearInterval(autoPollTimer);
    autoPollTimer = null;
  }
}

async function silentCheckStatus() {
  if (!currentTransactionId || purchaseTracked) return;

  autoPollAttempts++;
  if (autoPollAttempts > AUTO_POLL_MAX_ATTEMPTS) {
    stopAutoPolling();
    return;
  }

  try {
    var response = await fetch('/api/check-pix/' + currentTransactionId);
    var data = await response.json();

    if (response.ok && data.status === 'AUTHORIZED') {
      showPaymentConfirmed();
    }
  } catch (error) {
    console.error('Erro na verificação automática:', error);
  }
}

async function checkPaymentStatus() {
  var statusMsg = document.getElementById('pixStatusMsg');
  var btn = document.getElementById('pixCheckBtn');

  if (!currentTransactionId) {
    statusMsg.innerHTML = '<p style="margin:0; font-size:12px; color:#dc2626;">Aguarde o QR Code ser gerado.</p>';
    return;
  }

  var originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Verificando...';
  statusMsg.innerHTML = '';

  try {
    var response = await fetch('/api/check-pix/' + currentTransactionId);
    var data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || 'Erro ao consultar status');
    }

    if (data.status === 'AUTHORIZED') {
      showPaymentConfirmed();
      return;
    }

    statusMsg.innerHTML = '<p style="margin:0; font-size:12px; color:#b45309;">Pagamento ainda não identificado. Aguarde alguns instantes.</p>';
  } catch (error) {
    statusMsg.innerHTML = '<p style="margin:0; font-size:12px; color:#dc2626;">' + error.message + '</p>';
  } finally {
    if (document.getElementById('pixCheckBtn')) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

function showPaymentConfirmed() {
  stopAutoPolling();
  document.getElementById('pixBody').innerHTML = pixConfirmedTemplate();
  document.getElementById('pixCloseBtn').style.display = 'none';
  trackPurchase();
}

function trackPurchase() {
  if (purchaseTracked) return;
  purchaseTracked = true;

  if (typeof gtag !== 'function') return;

  gtag('event', 'purchase', {
    transaction_id: currentTransactionId,
    value: currentPixValue,
    currency: 'BRL'
  });

  gtag('event', 'conversion', {
    'send_to': 'AW-17530341658/4dS_CK-Swt0cEJqSj6dB',
    'value': currentPixValue,
    'currency': 'BRL',
    'transaction_id': currentTransactionId
  });
}

document.addEventListener('DOMContentLoaded', createPixModal);
