const { Settings } = require('../database/models');
const ticketModal = require('../modules/modals/ticketmodal.js');

module.exports = class TicketModule {
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('./DBModule.js')} client.database
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */

  async config (client, interaction) {
    try {
      const canal = interaction.options.getChannel('canal');
      const canalLogs = interaction.options.getChannel('logs');
      const categoria = interaction.options.getChannel('categoria');
      const botaoTicket = interaction.options.getString('botao');
      const cargo = interaction.options.getRole('cargo');

      console.log(canal, canalLogs, categoria, botaoTicket, cargo);

      await Settings.upsert({
        id: interaction.guild.id,
        owner_id: interaction.guild.ownerId,
        ticket_channel_id: canal.id,
        ticket_button_name: botaoTicket,
        announces_channel_id: canalLogs.id,
        mod_role_id: cargo.id,
        ticket_category_id: categoria.id,
        ticket_logs_channel_id: canalLogs.id,
        ticket_role_id: cargo.id,
        ticket_title: botaoTicket,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await interaction.showModal(ticketModal);

    return;
    } catch (error) {
      console.error(error);
    }
  }

  
  async addUser(client, interaction) {
    this.checkTicketConfig(client, interaction);
  }
  
  async removeUser(client, interaction) {
    console.log(client, interaction);    
  }
  
  async checkTicketConfig(client, interaction) {
    return interaction.reply({ });

    // if (
    //   !guildSettings ||
    //   !guildSettings.ticket_category_id ||
    //   !guildSettings.ticket_role_id
    // ) {
    //   return interaction.reply({
    //     content: '❌ **O sistema de tickets não foi configurado!**',
    //     ephemeral: true,
    //   });
    // }

  }
}
