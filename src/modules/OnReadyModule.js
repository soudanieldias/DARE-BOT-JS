const LoggerModule = require('../utils/Logger');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
class OnReadyModule {
  constructor() {
    this.logger = new LoggerModule();
  }

  async handleReady(client) {
    const discriminator = client.user.discriminator;
    await this.logger.info(
      'OnReady',
      `
      ------------------------------
      |  Online como: ${discriminator ? `${client.user.username}#${discriminator}` : `${client.user.username}`};
      |  Operando em: ${client.guilds.cache.size} servidores.
      |  Online para: ${client.users.cache.size} Usuários.
      ------------------------------
      |  SERVIDORES ONDE EU ESTOU:
      |  ${client.guilds.cache.map(guild => guild.name).join('\n      |  ')}
      ------------------------------
    `
    );
    await client.database.initialize(client);
  }
}

module.exports = async (client, token) => {
  const onReadyModule = new OnReadyModule();

  client.on('ready', async () => {
    await onReadyModule.handleReady(client);
  });

  await client.login(token);
};
