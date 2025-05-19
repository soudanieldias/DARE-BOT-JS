const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const { Settings } = require('../../database/models');
const { TicketModal } = require('../modals');

class TicketConfig {
  constructor(dbModule) {
    this.dbModule = dbModule;
  }

  async config(_client, interaction) {
    try {
      const canal = interaction.options.getChannel('canal');
      const canalLogs = interaction.options.getChannel('logs');
      const categoria = interaction.options.getChannel('categoria');
      const botaoTicket = interaction.options.getString('botao');
      const cargo = interaction.options.getRole('cargo');

      await Settings.upsert({
        id: interaction.guild.id,
        owner: interaction.guild.ownerId,
        ticketChannelId: canal.id,
        ticketButtonName: botaoTicket,
        announcesChannelId: canalLogs.id,
        modRoleId: cargo.id,
        ticketCategoryId: categoria.id,
        ticketLogsChannelId: canalLogs.id,
        ticketRoleId: cargo.id,
        ticketTitle: botaoTicket,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await interaction.showModal(TicketModal);
    } catch (error) {
      console.error(error);
    }
  }

  async addUser(client, interaction) {
    await this.checkTicketConfig(client, interaction);
  }

  async removeUser(client, interaction) {
    this.checkTicketConfig(client, interaction);
  }

  async checkTicketConfig(client, interaction) {
    const hasAdminRole = interaction.memberPermissions?.has([
      PermissionFlagsBits.Administrator,
    ]);
    if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');
    return;
  }

  async ticketModal(client, interaction) {
    const openTitle = interaction.fields.getTextInputValue('opentitle');
    const openDescription =
      interaction.fields.getTextInputValue('opendescription');
    const ticketTitle = interaction.fields.getTextInputValue('tickettitle');
    const ticketDescription =
      interaction.fields.getTextInputValue('ticketdescription');

    const [settings, created] = await Settings.findOrCreate({
      where: { id: interaction.guild.id },
      defaults: {
        id: interaction.guild.id,
        ticketTitle: ticketTitle,
        ticketDescription: ticketDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!created) {
      await settings.update({
        ticketTitle: ticketTitle,
        ticketDescription: ticketDescription,
        updatedAt: new Date(),
      });
    }

    const embedTicket = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: `${openTitle}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(openDescription)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const { ticketButtonName, ticketChannelId } =
      await this.dbModule.getGuildData(interaction.guildId);

    const botaoTicket = new ButtonBuilder()
      .setCustomId('ticket-open')
      .setLabel(ticketButtonName || 'Abrir Ticket')
      .setStyle(2)
      .setEmoji('🎯');

    const botoesTicket = new ActionRowBuilder().setComponents(botaoTicket);

    const channel = interaction.guild.channels.cache.get(ticketChannelId);

    channel.send({ embeds: [embedTicket], components: [botoesTicket] });

    await interaction.reply({
      content: 'Configuração do sistema de ticket realizada com sucesso!',
      ephemeral: true,
    });
  }
}

module.exports = TicketConfig;
