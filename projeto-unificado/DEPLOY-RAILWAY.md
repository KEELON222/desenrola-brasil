# Deploy na Railway 🚀

## Pré-requisitos

1. Conta na [Railway.app](https://railway.app)
2. Git instalado
3. Projeto versionado com Git

## Passo 1: Inicializar Git (se ainda não fez)

```bash
cd projeto-unificado
git init
git add .
git commit -m "Initial commit - Desenrola Brasil"
```

## Passo 2: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Crie um novo repositório (ex: `desenrola-brasil`)
3. **NÃO** marque "Initialize this repository"
4. Copie a URL do repositório

## Passo 3: Fazer Push para GitHub

```bash
git remote add origin https://github.com/seu-usuario/desenrola-brasil.git
git branch -M main
git push -u origin main
```

## Passo 4: Fazer Deploy na Railway

### Opção A: Via Railway Dashboard (Mais Fácil)

1. Acesse [railway.app/dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub"**
4. Conecte sua conta GitHub
5. Selecione o repositório `desenrola-brasil`
6. Railway detectará automaticamente que é Node.js
7. Clique em **"Deploy"**

### Opção B: Via Railway CLI

```bash
# Instale Railway CLI
npm install -g @railway/cli

# Faça login
railway login

# Deploy
railway up
```

## Passo 5: Configurar Domínio (Opcional)

1. No Dashboard da Railway, vá para seu projeto
2. Clique na aba **"Settings"**
3. Em **"Domains"**, clique **"+ Add Domain"**
4. Digite seu domínio (ex: `desenrola.seu-dominio.com`)
5. Configure os DNS do seu domínio apontando para Railway

## URL de Acesso

Após o deploy, Railway gerará uma URL como:
```
https://desenrola-brasil-production.up.railway.app
```

## Monitorar Deployment

1. Acesse o Dashboard
2. Clique no seu projeto
3. Vá para a aba **"Deployments"** para ver status

## Variáveis de Ambiente (se precisar)

1. Vá para a aba **"Variables"** no projeto
2. Adicione variáveis conforme necessário:
   ```
   NODE_ENV=production
   ```

## Reiniciar Aplicação

Após qualquer mudança no código:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

Railway fará deploy automaticamente!

## Troubleshooting

### Erro: "Port não foi definida"
✅ Ja está resolvido! Usamos `process.env.PORT`

### Erro: "npm install failed"
- Verifique se `package.json` está no root
- Verifique dependências em `package.json`

### Site está branco
- Verifique os logs: Dashboard → Logs
- Certifique-se que todos os assets estão sendo servidos

## Pronto! 🎉

Seu site Desenrola Brasil está no ar!

---

**Precisa de ajuda?**
- Railway Docs: https://docs.railway.app
- Discord Railway: https://discord.gg/railway
