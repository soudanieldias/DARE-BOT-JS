/* eslint-disable no-undef */
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const path = require('path');
const { categories } = require('../../modules/SoundpadModule');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('soundpad')
    .setDescription('Comandos de SoundPad')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addSubcommand(subCommand =>
      subCommand
        .setName('list')
        .setDescription('Lista todos os áudios disponíveis no SoundPad')
    )
    .addSubcommand(subCommand =>
      subCommand
        .setName('play')
        .setDescription('Toca o áudio selecionado')
        .addStringOption(option =>
          option
            .setName('filepath')
            .setDescription('Nome do arquivo de áudio')
            .setRequired(true)
        )
    ),
  category: 'music',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const { member, guild, options, customId } = interaction;
      const channelId = member?.voice.channel?.id;
      if (!channelId) {
        await interaction.reply(
          `Erro: <@!${member.id}> Entre em um canal de voz.`
        );
        return interaction.deleteReply();
      }

      const guildId = guild.id;
      const soundModule = client.soundModule;
      const connectionParams = {
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      };
      const subCommand = interaction.isButton()
        ? 'interaction'
        : options.getSubcommand();

      switch (subCommand) {
        case 'play': {
          const fileName = options.getString('filepath');
          const pad = client.pads.get(fileName);
          interaction.pad = pad;
          if (!pad)
            return interaction.reply({
              content: 'Pad não encontrado!',
              ephemeral: true,
            });
          await interaction.reply({
            content: `Tocando som ${pad.name}`,
            ephemeral: true,
          });
          return await soundModule.playSound(
            client,
            interaction,
            pad.path,
            connectionParams
          );
        }

        case 'list': {
          const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select_category')
              .setPlaceholder('Escolha uma categoria...')
              .addOptions(categories)
          );

          return await interaction.reply({
            content: 'Selecione uma Categoria:',
            embeds: [],
            components: [row],
            ephemeral: true,
          });
        }

        case 'interaction': {
          const pad = client.pads.get(customId);
          if (!pad)
            return interaction.reply({
              content: 'Pad não encontrado!',
              ephemeral: true,
            });
          interaction.pad = pad;
          await soundModule.playSound(
            client,
            interaction,
            pad.path,
            connectionParams
          );

          await interaction.reply({
            content: `Tocando som ${pad.name}`,
            ephemeral: true,
          });

          return await interaction.deleteReply();
        }

        default: {
          break;
        }
      }
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  },
};
