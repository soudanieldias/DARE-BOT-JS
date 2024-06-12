const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memes')
    .setDescription('Receba um meme aleatório de nosa Base de Dados.')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
	execute: async (client, interaction) => {
    try {
      const memeFile = client.memeLoaderModule.getRandomMeme();
      return await interaction.reply({ files: [memeFile] });
    } catch (error) {
      console.error('[SERVER INFO]', error);
    }
  }
};
