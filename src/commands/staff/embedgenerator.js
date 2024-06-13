/* eslint-disable no-undef */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedModule = require('../../modules/EmbedModule');
const config = require('../../config.json');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embedgenerator')
    .setDescription('Gere um embed e o envie no canal de texto informado')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: 'staff',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const embedModule = new EmbedModule();

      if (!interaction.user.id === config['owner-id']) {
        return interaction.reply('NÃO AUTORIZADO!!!');
      }
      return await embedModule.generate(client, interaction);
    } catch (error) {
      interaction.reply('Ocorreu um erro ao enviar o Embed.');
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  },
};
