/* eslint-disable no-undef */
const path = require('path');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DatabaseModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */

module.exports = (client, slashCommands) => {
  const { soundpadModule, ticketModule, embedModule } = client;

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

        switch (interaction.customId) {
          case 'ticket-open':
            return await ticketModule.ticketOpen(client, interaction);

          case 'ticket-close':
            return await ticketModule.ticketClose(client, interaction);

          case 'ticket-mention':
            return await ticketModule.ticketMentionUser(client, interaction);

          case 'ticket-reopen':
            return await ticketModule.ticketReopen(client, interaction);

          case 'ticket-closemessage':
            return await ticketModule.ticketCloseMessage(client, interaction);

          case 'ticket-transcript':
            return await ticketModule.ticketTranscript(client, interaction);
          
          case 'embed-cancel':
            return await embedModule.cancel(client, interaction);

          case 'embed-send':
            return await embedModule.send(client, interaction);

          default:
            break;
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

        if (!command) return interaction.reply('Erro ao executar o comando: NÃO ENCONTRADO');

        switch (command) {
          default:
            return await command.execute(client, interaction, slashCommands);
        }
      }
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  });
};
