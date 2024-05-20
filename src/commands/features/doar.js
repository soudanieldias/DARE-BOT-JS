const { AudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const discordTTS = require('discord-tts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('doar')
    .setDescription('Doe para ajudar a DARE.'),
	execute: async (_client, interaction) => {
    try {
      const hasAdminRole = interaction.memberPermissions?.has([PermissionFlagsBits.Administrator])
    
      if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Doação PIX/PicPay')
      .setDescription('Faça as suas doações através do PIX/PicPay, basta escanear o QR Code.')
      .setImage('https://i.imgur.com/nr8sxiX.jpeg')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/cAPoJDf.jpeg' });
      await interaction.reply({ embeds: [] });

    } catch (error) {
      console.error('[SERVER INFO]', error);
    }
  }
};