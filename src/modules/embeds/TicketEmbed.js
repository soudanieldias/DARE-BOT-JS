const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const BaseEmbed = require('./BaseEmbed');

class TicketEmbed extends BaseEmbed {
  constructor() {
    super();
  }

  buildOpenedTicketEmbed(interaction, guildData) {
    return this.setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(guildData.ticketDescription)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .build();
  }

  buildReopenedTicketEmbed(interaction, guildData) {
    return this.setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `Olá, <@!${interaction.channel.topic}>, o seu ticket foi reaberto pelo <@!${interaction.user.id}>`
      )
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .build();
  }

  buildClosedTicketEmbed(interaction, guildData) {
    return this.setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription('Ticket fechado, escolha uma ação abaixo.')
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .build();
  }

  buildTicketButtons(type) {
    switch (type) {
      case 'opened':
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-close')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Fechar ticket'),
          new ButtonBuilder()
            .setCustomId('ticket-mention')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Mencionar Usuário')
        );

      case 'reopened':
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-closemessage')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Apagar Mensagem')
        );

      case 'closed':
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-reopen')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Reabrir Ticket'),
          new ButtonBuilder()
            .setCustomId('ticket-transcript')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Transcrever Ticket')
        );

      default:
        return null;
    }
  }
}

module.exports = new TicketEmbed();
