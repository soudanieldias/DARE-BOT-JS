const { TextInputBuilder, ActionRowBuilder } = require('discord.js');
const BaseModal = require('./BaseModal');

class TicketModal extends BaseModal {
  constructor() {
    super();
    this.buildModal();
  }

  buildModal() {
    const openTitle = new TextInputBuilder()
      .setCustomId('opentitle')
      .setLabel('Titulo (Para abrir ticket)')
      .setStyle(1)
      .setPlaceholder('Digite o titulo (Primeira Linha)')
      .setRequired(true);

    const openDescription = new TextInputBuilder()
      .setCustomId('opendescription')
      .setLabel('Descrição (Para abrir ticket)')
      .setStyle(2)
      .setPlaceholder('Digite a Descrição.')
      .setRequired(true);

    const ticketTitle = new TextInputBuilder()
      .setCustomId('tickettitle')
      .setLabel('Titulo (Dentro do ticket)')
      .setStyle(1)
      .setPlaceholder('Digite o titulo (Primeira Linha)')
      .setRequired(true);

    const ticketDescription = new TextInputBuilder()
      .setCustomId('ticketdescription')
      .setLabel('Descrição da mensagem (Dentro do ticket)')
      .setStyle(2)
      .setPlaceholder('Digite a Descrição.')
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(openTitle);
    const row2 = new ActionRowBuilder().addComponents(openDescription);
    const row3 = new ActionRowBuilder().addComponents(ticketTitle);
    const row4 = new ActionRowBuilder().addComponents(ticketDescription);

    this.setCustomId('ticketmodal')
      .setTitle('Mensagem Ticket')
      .addComponents(row1, row2, row3, row4);
  }
}

module.exports = new TicketModal().build();
