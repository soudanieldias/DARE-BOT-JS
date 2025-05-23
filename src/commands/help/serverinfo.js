const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Mostra um Embed com as informações sobre o Servidor/Guild')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  category: 'help',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const guildMembers = await interaction.guild?.members.fetch();
      const membersCount = guildMembers.filter(member => !member.user.bot).size;
      if (interaction.guild && client.user && interaction.isRepliable()) {
        const guildEmbed = new EmbedBuilder()
          .setColor('#ffffff')
          .setTitle('Informações do Servidor:')
          .addFields(
            { name: 'Nome do Servidor: ', value: `${interaction.guild.name}` },
            {
              name: 'Dono do Servidor: ',
              value: `<@!${interaction.guild.ownerId}>`,
            },
            { name: 'Membros no Servidor: ', value: `${membersCount}` },
            {
              name: 'Bots no Servidor: ',
              value: `${guildMembers.size - membersCount}`,
            },
            {
              name: 'Location: ',
              value: `${interaction.guild?.preferredLocale}`,
              inline: true,
            },
            {
              name: 'Created',
              value: `${interaction.guild.createdAt.toLocaleString()}`,
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter({
            text: `${client.user.username}`,
            iconURL: `${client.user.avatarURL()}`,
          });

        interaction.reply({ embeds: [guildEmbed] });
      }
    } catch (error) {
      console.error('[SERVER INFO]', error);
    }
  },
};
