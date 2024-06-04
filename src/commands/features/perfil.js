const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Mostra o perfil do usuário')
    .setDefaultMemberPermissions(true)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('O usuário cujo perfil você quer ver')
        .setRequired(false)),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').User} user
   */
  async execute(client, interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Perfil de ${user.username}`)
      // .setImage(avatarUrl)
      .setThumbnail(avatarUrl)
      .addFields(
        { name: 'Nome do Usuário: ', value: `${user.username}` },
        { name: 'Menção do usuário: ', value: `<@!${user.tag}>` },
        { name: 'Location: ', value: `${interaction.guild?.preferredLocale}`, inline: true },
        { name: 'Created', value: `${interaction.guild.createdAt.toLocaleString()}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.avatarURL()}`
      });

    // await interaction.reply({ embeds: [embed] });
    console.log(embed.data);
    await interaction.reply({ content: `${JSON.stringify(user)}`, ephemeral: true });
  },
};
