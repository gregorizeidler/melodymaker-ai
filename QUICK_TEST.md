# 🚀 Guia Rápido de Teste - MelodyMakerAI

## ⚡ Começar em 3 Passos

### 1️⃣ Atualizar Banco de Dados
```bash
cd frontend
npx prisma generate
npx prisma db push
```

### 2️⃣ Iniciar Servidor
```bash
pnpm dev
```

### 3️⃣ Abrir no Navegador
```
http://localhost:3000
```

---

## 🎯 O Que Testar (Checklist)

### ✅ Navegação Básica
- [ ] Login/Cadastro funciona
- [ ] Sidebar tem 7 itens: Home, Create, Search, Playlists, Favorites, History, Analytics
- [ ] Toggle de tema Dark/Light/Auto funciona

### ✅ Criação de Música
- [ ] `/create` - Modo Simple funciona
- [ ] `/create` - Modo Custom funciona
- [ ] Tags de inspiração adicionam ao campo
- [ ] Botão "Create Song" enfileira 2 músicas (guidance 7.5 e 15)

### ✅ Dashboard de Analytics
- [ ] `/analytics` mostra estatísticas
- [ ] Cards de métricas exibem dados
- [ ] Breakdown de status aparece
- [ ] Taxa de sucesso calculada corretamente

### ✅ Histórico
- [ ] `/history` lista todas as gerações
- [ ] Status icons corretos (✓ processado, ⏰ queued, ✗ falhou)
- [ ] Badge "Remix" aparece em remixes
- [ ] Informações de plays/likes/comments visíveis

### ✅ Sistema de Remix
- [ ] Botão "..." nas músicas abre menu
- [ ] "Create Remix" gera 2 variações
- [ ] Remixes aparecem marcados no histórico

### ✅ Playlists
- [ ] `/playlists` mostra suas playlists
- [ ] Botão "Create Playlist" funciona
- [ ] Adicionar músicas à playlist funciona
- [ ] Remover músicas da playlist funciona

### ✅ Favoritos
- [ ] `/favorites` lista músicas favoritadas
- [ ] Botão estrela ⭐ adiciona/remove favorito
- [ ] Toast notification aparece

### ✅ Busca
- [ ] `/search` busca por texto funciona
- [ ] Resultados aparecem em grid
- [ ] "No results" aparece quando não encontra

### ✅ Ações de Música
- [ ] Botão ❤️ (Like) incrementa/decrementa contador
- [ ] Botão ⭐ (Favorite) muda cor quando ativo
- [ ] Botão "..." abre menu de ações
- [ ] "Share" copia link para clipboard
- [ ] "Download" funciona (apenas para suas músicas)

### ✅ Página de Upgrade
- [ ] `/upgrade` mostra 3 pacotes de créditos
- [ ] Badge "Most Popular" no Medium
- [ ] Cards mostram preço e features
- [ ] Botões de compra linkam para checkout

---

## 🐛 Se Algo Não Funcionar

### Erro de Prisma
```bash
npx prisma generate
npx prisma db push --force-reset  # ⚠️ Isso vai limpar o banco!
```

### Erro de TypeScript
```bash
npm run typecheck
```

### Erro de Build
```bash
rm -rf .next
pnpm dev
```

### Componentes não aparecem
- Verifique se todas as actions foram criadas
- Verifique se o schema do Prisma foi atualizado
- Rode `npx prisma generate` novamente

---

## 📊 Dados de Teste

### Criar Música de Teste (Simple Mode)
```
Descrição: "A dreamy lofi hip hop song, perfect for studying"
✓ Instrumental: OFF
```

### Criar Música de Teste (Custom Mode)
```
Styles: "electronic, 120bpm, synth-pop"
Lyrics Mode: Auto
Lyrics: "A song about coding at night"
✓ Instrumental: OFF
```

### Testar Remix
1. Crie uma música primeiro
2. Aguarde processamento
3. Clique nos "..." → "Create Remix"
4. Veja 2 novas gerações no histórico

---

## 🎨 Features Visuais para Verificar

### Cores e Temas
- **Dark Mode**: Fundo escuro, texto claro
- **Light Mode**: Fundo claro, texto escuro
- **Auto**: Segue preferência do sistema

### Status Badges
- 🟢 **Processed**: Verde
- 🔵 **Processing**: Azul com spinner
- 🟡 **Queued**: Amarelo
- 🔴 **Failed**: Vermelho
- 🟠 **No Credits**: Laranja

### Ícones
- ❤️ Like (rosa quando ativo)
- ⭐ Favorite (amarelo quando ativo)
- 💬 Comment
- 🔄 Remix
- ⬇️ Download
- 🔗 Share

---

## 🎯 Fluxo Completo de Teste

1. **Login** → Entre na conta
2. **Create** → Crie 3 músicas diferentes
3. **History** → Veja as gerações
4. **Analytics** → Veja estatísticas atualizadas
5. **Remix** → Faça remix de uma música
6. **Favorite** → Adicione aos favoritos
7. **Like** → Dê like em músicas
8. **Playlist** → Crie uma playlist e adicione músicas
9. **Search** → Busque por título
10. **Download** → Baixe suas músicas
11. **Theme** → Teste Dark/Light mode

---

## ✨ Pronto!

Se todos os itens acima funcionarem, o **MelodyMakerAI** está 100% operacional! 🎵

Enjoy creating music! 🚀
