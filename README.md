# 🤖 DARE BOT

Bot de gerenciamento de comunidade para o servidor DARE no Discord.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Desenvolvimento](#-desenvolvimento)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🚀 Funcionalidades

### 🎵 Comandos de Música

- `/music play` - Toca uma música do YouTube
- `/music stop` - Para a música atual
- `/music next` - Pula para a próxima música
- `/music queue` - Mostra a fila de músicas
- `/music volume` - Ajusta o volume
- `/music playfile` - Toca um arquivo de áudio (mp3, mp4, webm, ogg)

### 🗣️ Comandos de Voz

- `/tts` - Converte texto em voz no canal de voz
- `/join` - Faz o bot entrar no canal de voz
- `/leave` - Faz o bot sair do canal de voz

### 🛠️ Comandos de Utilidade

- `/ping` - Mostra a latência do bot
- `/help` - Mostra a lista de comandos
- `/pergunta` - Faz uma pergunta para o ChatGPT
  - Opção `ask`: Sua pergunta para o ChatGPT
  - Responde com um embed bonito contendo a pergunta e a resposta
  - Suporta respostas longas, dividindo em múltiplos embeds quando necessário

### 🎮 Comandos de Jogos

- `/dado` - Rola um dado com número de faces personalizado
- `/moeda` - Joga cara ou coroa
- `/rps` - Joga pedra, papel ou tesoura

### 👮 Comandos de Moderação

- `/ban` - Bane um usuário do servidor
- `/kick` - Expulsa um usuário do servidor
- `/mute` - Silencia um usuário
- `/unmute` - Remove o silenciamento de um usuário
- `/clear` - Limpa mensagens do canal

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/)
- [@discordjs/voice](https://discord.js.org/#/docs/voice)
- [discord-tts](https://www.npmjs.com/package/discord-tts)
- [discord-player](https://discord-player.js.org/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 📋 Pré-requisitos

- Node.js 16.x ou superior
- NPM ou Yarn
- MySQL 8.0 ou superior
- Token do Discord Bot
- Credenciais do YouTube Data API (para comandos de música)
- Conta no ChatGPT (para comandos de IA)

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

4. Edite o arquivo `.env` com suas credenciais

5. Inicie o bot:

```bash
npm run dev
```

## ⚙️ Configuração

O arquivo `.env` deve conter as seguintes variáveis:

```env
# Configurações do Bot
TOKEN=seu_token_do_discord
CLIENT_ID=seu_client_id
CLIENT_SECRET=seu_client_secret
GUILD_ID=seu_guild_id
DEV_ID=seu_dev_id
DEBUG=false
BOT_NAME=DARE
BOT_DESCRIPTION=descrição_do_bot
BOT_PREFIX=//

# Configurações do Banco de Dados
DB_ENV=production
NODE_ENV=production

# Configurações de APIs Externas
CHATGPT_URL=sua_url_do_webhook
API_KEY=sua_api_key
GROUP_ID=seu_group_id
```

## 💻 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia o bot em modo desenvolvimento
- `npm run nodemon` - Inicia o bot com hot-reload
- `npm run lint` - Verifica problemas de código
- `npm run lint:fix` - Corrige problemas de código automaticamente
- `npm run format` - Formata o código
- `npm run format:check` - Verifica a formatação do código
- `npm run db` - Reseta o banco de dados

### Padrões de Código

- ESLint para linting
- Prettier para formatação
- EditorConfig para configurações do editor
- Husky para git hooks
- lint-staged para verificações pré-commit

## 📁 Estrutura do Projeto

```
dare-bot/
├── src/
│   ├── commands/        # Comandos do bot
│   ├── events/         # Eventos do bot
│   ├── modules/        # Módulos reutilizáveis
│   ├── database/       # Configurações do banco de dados
│   ├── utils/          # Funções utilitárias
│   └── index.js        # Arquivo principal
├── .env                # Variáveis de ambiente
├── .env.example        # Exemplo de variáveis de ambiente
├── .eslintrc.js        # Configuração do ESLint
├── .prettierrc         # Configuração do Prettier
├── .editorconfig       # Configuração do EditorConfig
└── package.json        # Dependências e scripts
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Daniel Dias** - _Desenvolvimento_ - [GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Discord.js](https://discord.js.org/)
- [discord-player](https://discord-player.js.org/)
- [OpenAI](https://openai.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
