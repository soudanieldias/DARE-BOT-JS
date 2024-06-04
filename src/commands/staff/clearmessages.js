const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearmessages')
    .setDescription('Limpa o Chat')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(quantity => (
      quantity.setName('quantidade')
      .setDescription('Quantas mensagens deseja deletar? (1-100)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
    )),
  category: 'staff',
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
	async execute (client, interaction) {
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
