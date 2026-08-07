# Desenrola Brasil - Projeto Unificado

Este é o projeto consolidado que une as 3 páginas originais em um único funil de conversão.

## Estrutura do Projeto

```
projeto-unificado/
├── index.html          # Homepage (Inicio)
├── funnel.js           # Sistema de navegação entre páginas
├── inicio/             # Conteúdo da página inicial
│   ├── css/
│   ├── js/
│   └── images/
├── step1/              # Formulário de CPF
│   ├── index.html
│   └── assets/         # CSS e imagens do step1
├── step2/              # Confirmação e resultado
│   ├── index.html
│   └── assets/         # CSS, imagens e áudio do step2
└── _external/          # Recursos externos (Google Tag Manager, etc)
```

## Fluxo de Navegação

1. **Homepage (index.html)** → Clique em "ACESSAR AGORA"
2. **Step 1 (step1/index.html)** → Informe CPF e clique em "Continuar"
3. **Step 2 (step2/index.html)** → Resultado e resumo

## Como Usar

### Localmente (em desenvolvimento)
```bash
# Opção 1: Usar live server (VS Code)
# Instale a extensão "Live Server" e clique com botão direito > "Open with Live Server"

# Opção 2: Python
python -m http.server 8000
# Acesse http://localhost:8000

# Opção 3: Node.js
npx http-server
# Acesse http://localhost:8080
```

### Em Produção
Fazer upload de toda a pasta `projeto-unificado` para seu servidor web.

## Recursos Importantes

- **funnel.js**: Gerencia a persistência de parâmetros UTM entre as páginas usando sessionStorage
- **Google Tag Manager**: Configurado com ID GTM-WZFPRXQC
- **Responsivo**: Otimizado para desktop e mobile

## Dados Persistidos

Os parâmetros da URL são persistidos automaticamente entre as páginas:
- Útil para rastrear origem de tráfego (utm_source, utm_medium, etc)
- Dados salvos em sessionStorage

## Contato
INARA SUED NASCIMENTO COSTA
CNPJ: 05.475.756/0001-00
