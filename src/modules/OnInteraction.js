// /* eslint-disable no-unused-vars */
// const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
// const { Settings } = require('../database/models');
// const DBModule = require('./DBModule');
const TicketModule = require('./TicketModule');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DBModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */
module.exports = (client, slashCommands) => {
  const ticketModule = new TicketModule();

  client.on('interactionCreate', async (interaction) => {
    try {
      const { message } = interaction;

      if (interaction.isButton()) {
        if (message.content.includes('Lista de Áudios: ')) {
          const soundpad = slashCommands.get('soundpad');
          if (!soundpad)
            return interaction.reply('ERRO: Ocorreu um erro com o SoundPad!');
          return await soundpad.execute(client, interaction);
        }

        if (interaction.customId == 'ticket-open') {
          return await ticketModule.ticketOpen(client, interaction);
        }
        if (interaction.customId == 'ticket-close') {
          return await ticketModule.ticketClose(client, interaction);
        }
        if (interaction.customId == 'ticket-reopen') {
          return await ticketModule.ticketReopen(client, interaction);
        }
        if (interaction.customId == 'ticket-closemessage') {
          return await ticketModule.ticketCloseMessage(client, interaction);
        }
        if (interaction.customId == 'ticket-transcript') {
          return await ticketModule.ticketTranscript(client, interaction);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId == 'ticketmodal') {
          return await ticketModule.ticketModal(client, interaction);
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(interaction.commandName);

        if (!command) {
          return interaction.reply(
            `Ocorreu um erro ao executar o comando! Tente mais Tarde!`
          );
        }
        return command.execute(client, interaction, slashCommands);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
