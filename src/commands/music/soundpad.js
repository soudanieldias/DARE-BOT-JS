const { SlashCommandBuilder } = require('@discordjs/builders');
const { SoundModule } = require('../../modules/');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

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
          option.setName('filepath')
          .setDescription('Nome do arquivo de áudio')
          .setRequired(true))
    ),
  category: 'music',
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const { member, guild, options, customId } = interaction;
      const channelId = member?.voice.channel?.id;

      if (!channelId) {
        await interaction.reply(`Erro: <@!${member.id}> Entre em um canal de voz.`);
        return interaction.deleteReply();
      }

      const guildId = guild.id;
      const soundModule = new SoundModule();
      const connectionParams = { channelId, guildId, adapterCreator: interaction.guild.voiceAdapterCreator };


      const subCommand = interaction.isButton() ? 'interaction': options.getSubcommand();

      switch (subCommand) {
        case 'play': {
          const fileName = options.getString('filepath');
          const pad = client.pads.get(fileName);
          if (!pad) return interaction.reply({ content: 'Pad não encontrado!', ephemeral: true});

          await soundModule.playSound(pad.path, connectionParams);
          await interaction.reply({ content: `Tocando som: ${pad.name}`, ephemeral: true });
          break;
        }

        case 'list': {
          const categories = [
            { label: 'audios', value: 'spad_audios' },
            { label: 'memes', value: 'spad_memes' },
            { label: 'musicas', value: 'spad_musicas' },
          ];

          const row = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select_category')
                .setPlaceholder('Escolha uma categoria...')
                .addOptions(categories)
            );

          return await interaction.reply({
            content: 'Selecione uma Categoria:',
            embeds: [],
            components : [row],
            ephemeral: true,
          });
        }

        case 'interaction': {
          const pad = client.pads.get(customId);
          await soundModule.playSound(pad.path, connectionParams)
          return await interaction.reply({ content: `Tocando som: ${pad.name}`, ephemeral: true });
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
