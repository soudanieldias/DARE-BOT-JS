const { AudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const discordTTS = require('discord-tts');
const { Readable } = require('stream');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Envia uma mensagem de Texto para voz com o DARE BOT')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
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

      if (!channelId) return interaction.reply('Você não está conectado a um canal de voz.');

      const ttsStream = discordTTS.getVoiceStream(`${textMessage}`, { lang: 'pt' });
      const audioStream = Readable.from(ttsStream);

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      await connection.subscribe(player);
      await player.play(createAudioResource(audioStream));

      return interaction.reply({ 
        content: 'Mensagem enviada para o canal de voz.', 
        ephemeral: true 
      });
    } catch (error) {
      console.error('[SERVER INFO]', error);
      return interaction.reply({
        content: 'Ocorreu um erro ao tentar enviar a mensagem.',
        ephemeral: true
      });
    }
  }
};
