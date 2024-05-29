const { SlashCommandBuilder} = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendmd')
    .setDescription('Envia uma mensagem direta para o usuário selecionado.')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('ID do usuário que irá receber a MD.')
      .setRequired(true)),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
	execute: async (client, interaction) => {
    try {
      const userId = interaction.options.getUser('user');
      const user = await interaction.guild.members.fetch(userId);

      if (!userId) return interaction.reply('Usuário não encontrado.');

      if (!interaction.user.id === config['owner-id']) return interaction.reply('NÃO AUTORIZADO!!!');

      await user.send('Olá, você está na comunidade DARE, ouça este recado que preparamos pra você! 😉');
      await user.send({ files: [ './src/audios/DARE.mp3' ] });

      await interaction.reply('Mensagem enviada com sucesso.');

    } catch (error) {
      console.error('[SendMD]', error);
    }
  }
};
