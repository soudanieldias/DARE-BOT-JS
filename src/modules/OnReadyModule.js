const Logger = require('../utils/Logger');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {string} token
 */
module.exports = async (client, token) => {
  const logger = new Logger();

  try {
    const discriminator = client.user.discriminator;
    const message = `
╔════════════════════════════════════════════════════════════╗
║                     🤖 BOT INICIADO                        ║
╠════════════════════════════════════════════════════════════╣
║ 📝 Informações do Bot:                                     ║
║    • Nome: ${discriminator ? `${client.user.username}#${discriminator}` : `${client.user.username}`}
║    • ID: ${client.user.id}
║    • Servidores: ${client.guilds.cache.size}
║    • Usuários: ${client.users.cache.size}
╠════════════════════════════════════════════════════════════╣
║ 🏢 Servidores Conectados:                                  ║
║    ${client.guilds.cache.map(guild => `• ${guild.name} (${guild.memberCount} membros)`).join('\n    ')}
╚════════════════════════════════════════════════════════════╝
    `;

    await logger.info('OnReady', message);

    await client.database.initialize(client);
  } catch (error) {
    console.error('Erro no OnReady:', error);
    await logger.error('OnReady', `Erro ao inicializar: ${error.message}`);
  }
};
