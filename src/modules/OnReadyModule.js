/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, token) => {
  client.on('ready', async () => {
    const discriminator = client.user.discriminator;
    console.log(`
      ------------------------------
      |  Online como: ${discriminator ?  `${client.user.username}#${discriminator}` : `${client.user.username}` };
      |  Operando em: ${client.guilds.cache.size} servidores.
      |  Online para: ${client.users.cache.size} Usuários.
      ------------------------------
      |  SERVIDORES ONDE EU ESTOU:
      |  ${client.guilds.cache.map((guild) => guild.name).join('\n      |  ')}
      ------------------------------
    `);
    await client.database.databaseHandler(client);
  });

  await client.login(token);
}
