const { AudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder} = require('discord.js');
const discordTTS = require('discord-tts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Envia uma mensagem de Texto para voz com o DARE BOT')
    .setDefaultMemberPermissions(true)
    .addStringOption(message => (
      message.setName('message')
      .setDescription('Mensagem que será falada no canal de Voz')
      .setRequired(true)
    )),
  category: 'features',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
	execute: async (_client, interaction) => {

    let player = new AudioPlayer();

    try {
      const member = interaction.guild?.members.cache.get(interaction.member.user.id);
      const textMessage = interaction.options.get('message')?.value;
      const channelId = member.voice.channelId;
      const guildId = interaction.guildId;

      if (!channelId) return interaction.reply('Não conectado a um canal de voz.');

      const ttsStream = discordTTS.getVoiceStream(`${textMessage}`, { lang: 'pt' });

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      connection.subscribe(player);
      await player.play(createAudioResource(ttsStream));
      return interaction.reply('Mensagem enviada para o canal de voz');

    } catch (error) {
      console.error('[SERVER INFO]', error);
    }
  }
};
