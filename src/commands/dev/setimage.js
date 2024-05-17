const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimage')
    .setDescription('Mude avatar do bot')
    .addAttachmentOption((option) =>
      option
        .setName('avatar')
        .setDescription('O avatar')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    const hasAdminRole = interaction.memberPermissions?.has([PermissionFlagsBits.Administrator])
    
    if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');

    const avatar = interaction.options.getAttachment('avatar');

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(message);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (avatar.contentType !== 'image/gif')
      return await sendMessage('Use um gif para emojis animados');

    var error;

    await client.user.setAvatar(avatar.url).catch(async (err) => {
      error = true;
      console.log(err);
      return await sendMessage(`Erro: '${err.toString()}'`);
    });

    if (error) return;
    await sendMessage('Enviado');
  },
};
