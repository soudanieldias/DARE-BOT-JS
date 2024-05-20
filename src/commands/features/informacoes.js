const { AudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const discordTTS = require('discord-tts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('informacoes')
    .setDescription('Reproduz as informações do servidor no canal de voz'),
	execute: async (_client, interaction) => {
    const hasAdminRole = interaction.memberPermissions?.has([PermissionFlagsBits.Administrator])
  
    if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');

    let player = new AudioPlayer();

    try {
      const member = interaction.guild?.members.cache.get(interaction.member.user.id);
      const channelId = member.voice.channelId;
      const guildId = interaction.guildId;

      if (!channelId) return interaction.reply('Conecte-se a um canal de voz para ouvir as informações.');

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      connection.subscribe(player);

      await player.play(createAudioResource('./src/audios/informacoes.mp3'));

      await interaction.reply('Saudação reproduzida no canal de voz');

      await interaction.deleteReply();

    } catch (error) {
      console.error('[SERVER INFO]', error);
    }
  }
};