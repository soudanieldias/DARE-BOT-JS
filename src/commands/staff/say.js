const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Transmite uma mensagem para o canal informado')
    // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(channel => (
      channel.setName('channel')
      .setDescription('Canal onde deseja enviar a Mensagem')
      .setRequired(true)
    ))
    .addStringOption(message => (
      message.setName('message')
      .setDescription('Mensagem que será enviada no canal Selecionado')
      .setRequired(true)
    )),
  category: 'staff',
  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
	async execute (_client, interaction) {
    try {
      const hasAdminRole = interaction.memberPermissions?.has([PermissionFlagsBits.Administrator]);
      if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');

      const CHANNEL_ID = interaction.options.get('channel')?.value;
      const MESSAGE_CONTENT = interaction.options.get('message')?.value;

      const channel = await interaction.guild?.channels.fetch(`${CHANNEL_ID}`);

      await channel.send(`${MESSAGE_CONTENT}`);
      
      return interaction.reply({ content: 'Mensagem enviada com Sucesso!', ephemeral: true });

    } catch (error) {
      console.error('[SAY] Error: ', error);
    }
  }
};