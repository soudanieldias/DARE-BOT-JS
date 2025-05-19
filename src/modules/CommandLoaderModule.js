/* eslint-disable no-undef */
const { globSync } = require('glob');
const { REST, Routes } = require('discord.js');
const path = require('path');
const config = require('../config.json');
const fs = require('fs');
const LoggerModule = require('../utils/LoggerModule');

class CommandLoaderModule {
  constructor() {
    this.logger = new LoggerModule();
  }

  async loadCommands(client) {
    try {
      await this.logger.info('Commands', 'Carregando módulo de Comandos.');
      const commandFiles = globSync('./src/commands/**/*.js');
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

      const restCommands = [];

      for (const file of commandFiles) {
        const command = require(`../../${file}`);
        const { name, description } = command.data;
        await this.logger.info(
          'Commands',
          `Comando ${name.toUpperCase()} sendo carregado...`
        );
        if (!name || !description) return;

        const cmd = client.application?.commands.cache.find(
          c => c.name === command.data.name
        );

        if (cmd) {
          await this.logger.error(
            'Commands',
            `Já existe um comando carregado com o mesmo nome, nome: ${name}`
          );
          return;
        }

        delete require.cache[require.resolve(`../../${file}`)];

        client.commands.set(name, command);
        await this.logger.info(
          'Commands',
          `Comando ${name.toUpperCase()} carregado corretamente.`
        );
        restCommands.push(command.data);
      }

      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: restCommands,
      });

      await this.logger.info('Commands', 'Comandos carregados com Sucesso.');
    } catch (error) {
      await this.logger.error('Commands', `Erro no arquivo: ${error}`);

      if (config['debug'] === true) {
        const guildData = await client.guilds.fetch(config['guild-id']);
        const devMember = await guildData.members.fetch(config['owner-id']);
        devMember.send(`\`\`\`${JSON.stringify(error)}\`\`\``);
      }
    }
  }
}

module.exports = CommandLoaderModule;
