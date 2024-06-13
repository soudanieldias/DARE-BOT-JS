
// const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const reportModal = require('./modals/reportmodal.js');

module.exports = class AdminModule {
    /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').Interaction} interaction
   */
  async openReportModal(client, interaction) {
    await fs.writeFileSync('./file.txt', `${interaction}`);
    return await interaction.showModal(reportModal);
  }
};
