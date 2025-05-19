const { TextInputBuilder, ActionRowBuilder } = require('discord.js');
const BaseModal = require('./BaseModal');

class ReportModal extends BaseModal {
  constructor() {
    super();
    this.buildModal();
  }

  buildModal() {
    const reportTitle = new TextInputBuilder()
      .setCustomId('reporttitle')
      .setLabel('Título do Report')
      .setStyle(1)
      .setPlaceholder('Digite o título do report')
      .setRequired(true);

    const reportDescription = new TextInputBuilder()
      .setCustomId('reportdescription')
      .setLabel('Descrição do Report')
      .setStyle(2)
      .setPlaceholder('Descreva detalhadamente o motivo do report')
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(reportTitle);
    const row2 = new ActionRowBuilder().addComponents(reportDescription);

    this.setCustomId('reportmodal')
      .setTitle('Report')
      .addComponents(row1, row2);
  }
}

module.exports = new ReportModal().build();
