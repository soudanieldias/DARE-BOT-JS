const { SlashCommandBuilder } = require('discord.js');
const { SoundModule } = require('../../modules/');
const soundModule = new SoundModule();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Sistema de Música DARE-Music')
    .addSubcommand((subCommand) =>
      subCommand
        .setName('play')
        .setDescription('Toca uma música')
        .addStringOption((option) =>
          option.setName('query').setDescription('Nome ou link do Stream')
        )
    )
    .addSubcommand((subCommand) =>
      subCommand.setName('stop').setDescription('Stop a music')
    )
    .addSubcommand((subCommand) =>
      subCommand.setName('next').setDescription('Pula para a próxima música')
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName('queue')
        .setDescription('Mostra a fila atual de músicas')
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName('volume')
        .setDescription('Altera o volume da música')
        .addIntegerOption((option) =>
          option
            .setName('volume')
            .setDescription('Altere o Volume entre 0 e 100')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName('playfile')
        .setDescription('Toda um áudio da internet (mp3, mp4, webm, ogg)')
        .addStringOption((option) =>
          option
            .setName('source')
            .setDescription('Link/Source do arquivo (mp3, mp4, webm, ogg)')
            .setRequired(true)
        )
    ),
  category: 'music',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (_client, interaction) => {
    try {
      const { member, options } = interaction;
      const channelId = member.voice.channel.id;
      const guildId = interaction.guildId;
      let source = '';

      if (!channelId)
        return interaction.reply(
          'Você precisa estar em um canal de voz para usar este comando.'
        );

      const connectionParams = {
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      };

      const subCommand = options.getSubcommand();

      switch (subCommand) {
        case 'play': {
          interaction.reply('Comando executado com sucesso', {
            ephemeral: true,
          });
          break;
        }
        case 'stop': {
          await soundModule.stopSound();
          await interaction.reply({
            content: 'Som parado com Sucesso',
            ephemeral: true,
          });
          break;
        }
        case 'next': {
          return interaction.reply({
            content: 'Comando desabilitado temporariamente',
            ephemeral: true,
          });
        }
        case 'volume':
          { const volume = options.getInteger('volume');
          soundModule.changeVolume(Number(volume));
          interaction.reply(`Volume alterado para ${volume}`, { ephemeral: true });
          // interaction.reply({ content: `Comando Desabilitado temporariamente`, ephemeral: true });
          break;
        }
        case 'playfile': {
          source = options.getString('source');
          soundModule.playSound(source, connectionParams);

          await interaction.reply({
            content: 'Comando executado com sucesso',
            ephemeral: true,
          });
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(`[Erro] Music.js: ${error}`);
    }
  },
};
