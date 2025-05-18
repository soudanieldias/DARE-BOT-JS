# 🤖 DARE BOT

Um bot Discord avançado para gerenciamento de comunidade, desenvolvido especialmente para a Comunidade DARE.

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Comandos](#-comandos)
- [Módulos](#-módulos)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

## 🎯 Sobre

O DARE BOT é um ecossistema completo de gerenciamento de comunidade no Discord, desenvolvido por DanielDias (@SouDanielDias). O bot oferece uma ampla gama de funcionalidades para administração, entretenimento e suporte, tornando a gestão da comunidade mais eficiente e interativa.

## ✨ Funcionalidades

### 🎵 Sistema de Áudio
- Reprodução de músicas do YouTube
- Sistema de fila avançado
- Controle de volume
- Efeitos sonoros personalizados
- Soundpad com categorias

### 🎫 Sistema de Tickets
- Criação de tickets de suporte
- Categorização de tickets
- Sistema de menções
- Transcrição de conversas
- Reabertura de tickets

### 👥 Gerenciamento de Comunidade
- Sistema de cargos automáticos
- Reações para cargos
- Moderação automática
- Logs detalhados
- Sistema multi-servidor

### 🛠️ Ferramentas Administrativas
- Comandos de moderação
- Sistema de embeds
- Gerenciamento de mensagens
- Configurações personalizáveis
- Painel de controle

## 📋 Requisitos

- Node.js v16.9.0 ou superior
- NPM v7.0.0 ou superior
- Discord.js v14.0.0 ou superior
- FFmpeg instalado no sistema
- Token do Bot Discord
- Permissões adequadas no servidor

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/DARE-BOT-JS.git
cd DARE-BOT-JS
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o bot:
```bash
npm start
```

## ⚙️ Configuração

O bot utiliza um arquivo `config.json` para configurações personalizáveis:

```json
{
  "bot": {
    "presence": {
      "message": "AVE DARE!",
      "type": "PLAYING"
    },
    "debug": false
  },
  "roles": {
    "reaction": [],
    "staff": [],
    "owner": "ID_DO_DONO"
  },
  "channels": {
    "reactions": "ID_DO_CANAL",
    "main": "ID_DO_CANAL"
  }
}
```

## 📁 Estrutura do Projeto

```
DARE-BOT-JS/
├── src/
│   ├── commands/        # Comandos do bot
│   ├── modules/         # Módulos principais
│   ├── buttons/         # Botões interativos
│   ├── database/        # Configurações do banco
│   ├── audios/          # Arquivos de áudio
│   └── memes/           # Arquivos de mídia
├── config.json          # Configurações do bot
└── .env                 # Variáveis de ambiente
```

## 🎮 Comandos

### 🎵 Comandos de Música
- `/play` - Reproduz uma música
- `/skip` - Pula para próxima música
- `/queue` - Mostra a fila de músicas
- `/volume` - Ajusta o volume

### 🎫 Comandos de Ticket
- `/ticket` - Abre um novo ticket
- `/close` - Fecha um ticket
- `/transcript` - Gera transcrição

### 👥 Comandos de Moderação
- `/ban` - Bane um usuário
- `/kick` - Expulsa um usuário
- `/mute` - Silencia um usuário
- `/clear` - Limpa mensagens

## 🔧 Módulos

### SoundModule
- Gerenciamento de áudio
- Sistema de fila
- Controle de volume
- Efeitos sonoros

### TicketModule
- Sistema de tickets
- Categorização
- Transcrição
- Menções

### InteractionModule
- Gerenciamento de interações
- Botões
- Menus
- Modais

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

DanielDias - [@SouDanielDias](https://twitter.com/SouDanielDias)

Link do Projeto: [https://github.com/seu-usuario/DARE-BOT-JS](https://github.com/seu-usuario/DARE-BOT-JS)