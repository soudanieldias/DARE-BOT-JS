const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar do usuário')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('O usuário cujo avatar você quer ver')
        .setRequired(false)),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
   */
  async execute(_client, interaction) {
    // Pegue o usuário fornecido ou o próprio usuário se nenhum for fornecido
    const user = interaction.options.getUser('user') || interaction.user;

    // Obtenha o URL do avatar do usuário
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

    // Crie o Embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatarUrl)

    // Responda com o embed
    await interaction.reply({ embeds: [embed] });
  },
};
