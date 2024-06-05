/* eslint-disable no-undef */
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const path = require('path');
const Settings = require('../../database/models/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discordconfig')
    .setDescription('Configure o BOT em seu Discord')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((role) =>
      role
        .setName('modrole')
        .setDescription('Cargo administrativo do BOT no Discord')
        .setRequired(true)
    )
    .addChannelOption((channel) =>
      channel
        .setName('staffchannel')
        .setDescription(
          'Canal staff onde as mensagens de Alerta serão enviadas'
        )
    )
    .addChannelOption((channel) =>
      channel
        .setName('announcechannel')
        .setDescription(
          'Canal onde os anúncios programados do BOT serão enviados'
        )
    ),
  category: 'staff',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').SlashCommandBuilder} data
   */
  async execute(_client, interaction) {
    try {
      const hasAdminRole = interaction.memberPermissions?.has([
        PermissionFlagsBits.Administrator,
      ]);

      
      if (!hasAdminRole) {
        return interaction.reply({
          content: 'ERRO: Comando disponível apenas para Staff!',
          ephemeral: true,
        });
      }

      const modRole = interaction.options.getRole('modrole');
      const staffChannel = interaction.options.getChannel('staffchannel');
      const announcechannel = interaction.options.getChannel('announcechannel');

      const embed = new EmbedBuilder()
        .setTitle('Resumo das configurações')
        .setDescription(
          `Nome: **${interaction.guild.name}**
          \nCriado em: <t:${Math.round(interaction.guild.createdTimestamp / 1000)}>
          \nDono: <@${interaction.guild.ownerId}>
          \n### Informações salvas:
          \nCanal STAFF: ${staffChannel}
          \nCanal de Anúncios: ${announcechannel}
          \nCargo MOD: ${modRole}
          \n\n### Seu servidor configurado com sucesso!`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#ffffff');

        await Settings.findOrCreate({
          where: { id: interaction.guild.id },
          defaults: {
            owner: interaction.guild.ownerId,
            staffChannelId: staffChannel.id,
            announcesChannelId: announcechannel.id,
            modRoleId: modRole.id,
          },
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  },
};
