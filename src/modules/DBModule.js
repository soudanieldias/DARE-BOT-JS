/* eslint-disable no-undef */

// const { sequelize } = require('../database/index.js');
const { Guilds, Settings } = require('../database/models');

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
      console.error(`Erro ${__filename}: ${error}`);
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
      console.error(`Erro ${__filename}: ${error}`);
    }
  }

  async getTicketChannelData(guildId) {
    try {
      const ticketChannelData = await Settings.findOne({
        where: {
          id: guildId,
        },
        attributes: ['ticket_button_name', 'ticket_channel_id'],
      });

      return ticketChannelData;
    } catch (error) {
      console.error(error);
    }
  }
}


module.exports = DBModule;
