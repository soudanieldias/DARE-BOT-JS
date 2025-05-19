/* eslint-disable no-undef */
const { Guilds, Settings } = require('../database/models');
const LoggerModule = require('../utils/Logger');

class DatabaseModule {
  constructor(client) {
    this.client = client;
    this.logger = new LoggerModule();
  }

  async initialize() {
    try {
      await this.logger.info('Database', 'Inicializando...');
      await this.populateServers();
      await this.logger.info('Database', 'Inicializada com sucesso.');
    } catch (error) {
      await this.logger.error('Database', `Erro: ${error}`);
    }
  }

  async populateServers() {
    try {
      const servers = await this.client.guilds.cache.map(guild => ({
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

      await this.logger.info(
        'Database',
        'Guildas populadas no banco de dados com sucesso.'
      );
    } catch (error) {
      await this.logger.error('Database', `Erro: ${error}`);
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
      await this.logger.error('Database', `Erro: ${error}`);
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
      await this.logger.error('Database', `Erro no arquivo: ${error}`);
    }
  }

  async handleError(error) {
    await this.logger.error('Database', `Erro no arquivo: ${error}`);
  }
}

module.exports = DatabaseModule;
