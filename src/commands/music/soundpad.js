const { SlashCommandBuilder } = require('@discordjs/builders');
const { SoundModule, ButtonModule } = require('../../modules/');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('soundpad')
    .setDescription('Comandos de SoundPad')
    .addSubcommand((subCommand) =>
      subCommand
        .setName("list")
        .setDescription("Lista todos os áudios disponíveis no SoundPad")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("play")
        .setDescription("Toda o áudio selecionado")
        .addStringOption(option => 
          option.setName('filename')
          .setDescription('Nome do arquivo de áudio')
          .setRequired(true))
    ),
  category: 'music',
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  execute: async (_client, interaction) => {
    try {
      const { member, guild, options, customId } = interaction;
      const channelId = member?.voice.channel?.id;

      if (!channelId) {
        await interaction.reply(`Erro: <@!${member.id}> Entre em um canal de voz.`);
        return interaction.deleteReply();
      }

      const guildId = guild.id;
      const soundModule = new SoundModule();
      let stream = '';
      const connectionParams = { channelId, guildId, adapterCreator: interaction.guild.voiceAdapterCreator };


      const subCommand = interaction.isButton() ? 'interaction': options.getSubcommand();

      switch (subCommand) {
        case 'play': {
          const filename = options.getString('filename');
          stream = `src/audios/soundpad/${filename}.mp3`;
          soundModule.playSound(stream, connectionParams);
          interaction.reply(`Tocando som: ${filename}`);
          break;
        }

        case 'list': {
          const buttonModule = new ButtonModule();
          const generatedButtons = await buttonModule.generateButtons();
          const slicedButtons = await buttonModule.sliceButtonArray(generatedButtons, 5);
          await interaction.reply('Enviando lista de áudios!');
          slicedButtons.map( async (rowData, index) => {
            await interaction.channel.send({ content: `Lista de Áudios: ${index + 1}`, components: [rowData]})
          }); 
          break;
        }

        case 'interaction': {
          stream = `src/audios/soundpad/${customId}.mp3`;
          soundModule.playSound(stream, connectionParams)
          await interaction.reply(`${customId}`);
          await interaction.deleteReply();
          break;
        }

        default: {
          break;
        }
      }
    } catch (error) {
      console.error(`[Erro]: ${error}`);
    }
  }
}
