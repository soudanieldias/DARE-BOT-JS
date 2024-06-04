const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar do usuário')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('O usuário cujo avatar você quer ver')
        .setRequired(false)
    ),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
   */
  async execute(_client, interaction) {
    try {
      const user = interaction.options.getUser('user') || interaction.user;

      const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarUrl);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
