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
  });

  client.login(token);
}
