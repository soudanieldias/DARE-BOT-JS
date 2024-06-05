/* eslint-disable no-undef */
const TicketModule = require('./TicketModule');
const SoundpadModule = require('./SoundpadModule');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DatabaseModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */

module.exports = (client, slashCommands) => {
  // const { soundpadModule, ticketModule } = client;
  const soundpadModule = new SoundpadModule();
  const ticketModule = new TicketModule();

  client.on('interactionCreate', async (interaction) => {
    try {
      const { message, customId } = interaction;

      if (interaction.isStringSelectMenu()) {
        return await soundpadModule.listSoundpads(client, interaction);
      }

      if (interaction.isButton()) {
        if (message.content.includes('Lista de Áudios')) {
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
        if (interaction.customId == 'ticket-mention') {
          return await ticketModule.ticketMentionUser(client, interaction);
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
        switch (customId) {
          case 'ticketmodal':
            return await ticketModule.ticketModal(client, interaction);
          default:
            return await interaction.reply({
              content: 'Erro, Modal não identificado!',
              ephemeral: true,
            });
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(interaction.commandName);

        if (!command) {
          return interaction.reply(
            'Erro ao executar o comando: NÃO ENCONTRADO'
          );
        }

        switch (command) {
          default:
            return await command.execute(client, interaction, slashCommands);
        }
      }
    } catch (error) {
      console.error(`[${__filename}] Erro no arquivo: ${error}`);
    }
  });
};
