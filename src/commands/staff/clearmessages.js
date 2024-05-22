const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearmessages')
    .setDescription('Limpa o Chat')
    .addIntegerOption(quantity => (
      quantity.setName('quantidade')
      .setDescription('Quantas mensagens deseja deletar? (1-100)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
    )),
  category: 'staff',
	async execute (_client, interaction) {
    try {
      const { options } = interaction;

      const hasAdminRole = interaction.memberPermissions?.has([PermissionFlagsBits.Administrator]);
      const MESSAGES_TO_DELETE = options.getInteger('quantidade');

      if (!hasAdminRole) return interaction.reply('ERRO: Não Autorizado!!!');

      const messagesDeleted = await interaction.channel.bulkDelete(MESSAGES_TO_DELETE, true);

      return interaction.reply({ content: `${messagesDeleted.size} mensagens foram deletadas do canal`});

    } catch (error) {
      console.error('[ClearMessages] Error: ', error);
    }
  }
};
