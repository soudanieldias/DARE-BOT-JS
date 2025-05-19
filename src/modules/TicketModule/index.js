const DatabaseModule = require('../DatabaseModule');
const TicketConfig = require('./TicketConfig');
const TicketEmbed = require('./TicketEmbed');
const TicketManager = require('./TicketManager');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

class TicketModule {
  constructor() {
    this.dbModule = new DatabaseModule();
    this.ticketEmbed = new TicketEmbed();
    this.ticketConfig = new TicketConfig(this.dbModule);
    this.ticketManager = new TicketManager(this.dbModule, this.ticketEmbed);
  }

  async config(client, interaction) {
    return await this.ticketConfig.config(client, interaction);
  }

  async addUser(client, interaction) {
    await this.ticketConfig.checkTicketConfig(client, interaction);
  }

  async removeUser(client, interaction) {
    await this.ticketConfig.checkTicketConfig(client, interaction);
  }

  async ticketModal(client, interaction) {
    await this.ticketConfig.ticketModal(client, interaction);
  }

  async ticketOpen(client, interaction) {
    await this.ticketManager.openTicket(client, interaction);
  }

  async ticketClose(client, interaction) {
    await this.ticketManager.closeTicket(client, interaction);
  }

  async ticketCloseMessage(client, interaction) {
    return await this.ticketManager.ticketCloseMessage(client, interaction);
  }

  async ticketReopen(client, interaction) {
    await this.ticketManager.reopenTicket(client, interaction);
  }

  async ticketTranscript(client, interaction) {
    await this.ticketManager.generateTranscript(client, interaction);
  }

  async ticketMentionUser(client, interaction) {
    const {
      channel: { topic, url },
      guild,
    } = interaction;
    const validUser = await guild.members.fetch(topic);
    try {
      if (!topic || !validUser) {
        return interaction.reply({
          content:
            'Este canal não é um ticket, ou o usuário não se encontra mais no servidor.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ticket Aberto')
        .setDescription(
          `Olá ${validUser.user.tag}, você possui um ticket em aberto no servidor ${interaction.guild.name}, no qual foi mencionado.`
        )
        .addFields([
          { name: 'Canal do ticket:', value: `<#${interaction.channel.id}>` },
        ])
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Ir para o ticket')
          .setURL(url)
          .setStyle(ButtonStyle.Link)
      );

      await validUser.send({
        content: `Olá ${validUser.user}, você possui um ticket em aberto no qual foi mencionado:`,
        embeds: [embed],
        components: [row],
      });

      return interaction.reply({
        content: 'O usuário foi mencionado',
        ephemeral: true,
      });
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
      return interaction.reply({
        content: `Não foi possível mencionar o usuário ${validUser.user}.`,
        ephemeral: true,
      });
    }
  }
}

module.exports = TicketModule;
