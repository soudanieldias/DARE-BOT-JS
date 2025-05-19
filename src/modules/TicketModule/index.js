const TicketManager = require('./TicketManager');
const TicketConfig = require('./TicketConfig');
const Logger = require('../../utils/Logger');

class TicketModule {
  constructor() {
    this.ticketManager = null;
    this.ticketConfig = null;
    this.logger = new Logger();
  }

  initialize(dbModule) {
    this.ticketManager = new TicketManager(dbModule);
    this.ticketConfig = new TicketConfig(dbModule);
  }

  async ticketOpen(client, interaction) {
    return await this.ticketManager.openTicket(client, interaction);
  }

  async ticketClose(client, interaction) {
    return await this.ticketManager.closeTicket(client, interaction);
  }

  async ticketReopen(client, interaction) {
    return await this.ticketManager.reopenTicket(client, interaction);
  }

  async ticketConfig(client, interaction) {
    return await this.ticketConfig.config(client, interaction);
  }

  async ticketModal(client, interaction) {
    return await this.ticketConfig.ticketModal(client, interaction);
  }

  async addUser(client, interaction) {
    return await this.ticketManager.addUser(client, interaction);
  }

  async ticketMentionUser(client, interaction) {
    return await this.ticketManager.ticketMentionUser(client, interaction);
  }

  async checkTicketConfig(client, interaction) {
    await this.ticketConfig.checkTicketConfig(client, interaction);
  }

  async ticketCloseMessage(client, interaction) {
    return await this.ticketManager.ticketCloseMessage(client, interaction);
  }

  async ticketTranscript(client, interaction) {
    return await this.ticketManager.generateTranscript(client, interaction);
  }
}

module.exports = TicketModule;
