/* eslint-disable no-undef */
const { Guilds, Settings } = require('../database/models');
const path = require('path');

class DatabaseModule {
  async databaseHandler(client) {
    try {
      console.log('[DataBase] Inicializando...');
      await this.populateServers(client);
      console.log('[DataBase] Inicializada com sucesso.');
    } catch (error) {
      console.error(`Erro ${path.basename(__filename)}: ${error}`);
    }
  }

  async populateServers(client) {
    try {
      const servers = await client.guilds.cache.map((guild) => ({
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

      console.log('[Database] Guildas populadas no banco de dados com sucesso.');
    } catch (error) {
      console.error(`Erro ${path.basename(__filename)}: ${error}`);
    }
  }

  async findGuildTicketConfig(guildId) {
    try {
      const ticketSettings = await Settings.findOne({
        where: {
          id: guildId,
        },
      });
      if (!ticketSettings) {
        return interaction.reply(
          'Erro: Configuração de Ticket não encontrada!'
        );
      } else {
        return ticketSettings;
      }
    } catch (error) {
      console.error(`Erro ${path.basename(__filename)}: ${error}`);
    }
  }

  async getGuildData(guildId) {
    try {
      const ticketChannelData = await Settings.findOne({
        where: {
          id: guildId,
        },
      });

      return ticketChannelData;
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  }
}


module.exports = DatabaseModule;
