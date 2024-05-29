/* eslint-disable no-undef */

// const { sequelize } = require('../database/index.js');
const { Guilds } = require('../database/models');

class DBModule {
  async databaseHandler(client) {
    try {
      console.log('[DataBase] Inicializando...');
      await this.populateServers(client);
      console.log('[DataBase] Inicializada com sucesso.');
    } catch (error) {
      console.error(`Erro ${__filename}: ${error}`);
    }
  }

  async populateServers(client) {
    try {
      const servers = await client.guilds.cache.map(guild => ({
        id: guild.id,
        name: guild.name,
        iconURL: guild.icon,
      }));

      for (const server of servers) {
        await Guilds.findOrCreate({
          where: { id: server.id },
          defaults: server,
        });
      }

      console.log('Guildas populadas no banco de dados com sucesso.');
    } catch (error) {
      console.error(`Erro ${__filename}: ${error}`);
    }
  }
}

module.exports = DBModule;
