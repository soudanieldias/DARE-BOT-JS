const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Sistema de Música DARE-Music')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addSubcommand((subCommand) =>
      subCommand
        .setName('play')
        .setDescription('Toca uma música')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('Nome ou link do Stream')
            .setRequired(true)
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
        .setDescription('Toca um áudio da internet (mp3, mp4, webm, ogg)')
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
   * @param {import('../../modules/SoundModule')} soundModule
   */
  execute: async (client, interaction) => {
    try {
      const { member, options, guildId } = interaction;
      const channelId = member.voice.channel.id;
      const { soundModule } = client;
      const query = options.getString('query');

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
          await soundModule.playSound(
            client,
            interaction,
            query,
            connectionParams
          );
          interaction.reply('Comando executado com sucesso', {
            ephemeral: true,
          });
          break;
        }
        case 'stop': {
          await soundModule.stopSound(interaction.guildId);
          await interaction.reply({
            content: 'Parando música e limpando a fila...',
            ephemeral: true,
          });
          break;
        }
        case 'next': {
          soundModule.skip(interaction.guild.id);
          return interaction.reply({
            content: 'Pulando música na fila...',
            ephemeral: true,
          });
        }
        case 'volume': {
          const volume = options.getInteger('volume');
          soundModule.changeVolume(interaction.guildId, Number(volume / 100));
          return await interaction.reply({
            content: `Volume alterado para ${volume}%`,
            ephemeral: true,
          });
        }
        case 'playfile': {
          const source = options.getString('source');
          return await soundModule.playSound(
            client,
            interaction,
            source,
            connectionParams
          );
        }
        default:
          break;
      }
    } catch (error) {
      console.error(`[Erro] Music.js: ${error}`);
    }
  },
};
