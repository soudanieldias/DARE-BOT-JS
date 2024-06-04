/* eslint-disable no-undef */
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimage')
    .setDescription('Mude avatar do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option
        .setName('avatar')
        .setDescription('O avatar')
        .setRequired(true)
    ),
    category: 'dev',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
  execute: async (client, interaction) => {
    const isDeveloper = interaction.member.id === process.env.DEV_ID;
    
    if (!isDeveloper) return interaction.reply('Erro: Não Autorizado!!!');

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
