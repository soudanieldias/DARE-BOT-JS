# DARE BOT

Bot do Discord para o servidor DARE.

## 🚀 Funcionalidades

- **Comandos de Música**
  - `/music play` - Toca uma música do YouTube
  - `/music stop` - Para a música atual
  - `/music next` - Pula para a próxima música
  - `/music queue` - Mostra a fila de músicas
  - `/music volume` - Ajusta o volume
  - `/music playfile` - Toca um arquivo de áudio (mp3, mp4, webm, ogg)

- **Comandos de Voz**
  - `/tts` - Converte texto em voz no canal de voz
  - `/join` - Faz o bot entrar no canal de voz
  - `/leave` - Faz o bot sair do canal de voz

- **Comandos de Utilidade**
  - `/ping` - Mostra a latência do bot
  - `/help` - Mostra a lista de comandos
  - `/pergunta` - Faz uma pergunta para o ChatGPT
    - Opção `ask`: Sua pergunta para o ChatGPT
    - Responde com um embed bonito contendo a pergunta e a resposta
    - Suporta respostas longas, dividindo em múltiplos embeds quando necessário

## 🛠️ Tecnologias

- Node.js
- Discord.js
- @discordjs/voice
- discord-tts
- axios

## 📋 Pré-requisitos

- Node.js 16.x ou superior
- NPM ou Yarn
- Token do Discord Bot
- Credenciais do YouTube Data API (para comandos de música)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dare-bot.git
cd dare-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais.

4. Inicie o bot:
```bash
npm start
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
TOKEN=seu_token_do_discord
CLIENT_ID=seu_client_id
GUILD_ID=seu_guild_id
YOUTUBE_API_KEY=sua_chave_api_youtube
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 