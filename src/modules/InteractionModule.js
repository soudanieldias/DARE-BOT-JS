const Logger = require('../utils/Logger');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DatabaseModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */

class InteractionModule {
  constructor() {
    this.logger = new Logger();
  }

  initialize(client, slashCommands) {
    const { soundpadModule, ticketModule, embedModule } = client;

    client.on('interactionCreate', async interaction => {
      try {
        // Log para debug
        await this.logger.info(
          'InteractionModule',
          `Tipo de interação: ${interaction.type}`
        );

        // Tratamento de Select Menu
        if (interaction.isStringSelectMenu()) {
          await this.logger.info(
            'InteractionModule',
            'Interação detectada: Select Menu'
          );
          return await soundpadModule.listSoundpads(client, interaction);
        }

        // Tratamento de Botões
        if (interaction.isButton()) {
          await this.logger.info(
            'InteractionModule',
            `Botão clicado: ${interaction.customId}`
          );

          // Verifica se é um botão do SoundPad
          if (interaction.message?.content?.includes('Lista de Áudios')) {
            const soundpad = slashCommands.get('soundpad');
            if (!soundpad) {
              await this.logger.error(
                'InteractionModule',
                'Comando soundpad não encontrado'
              );
              return interaction.reply({
                content: 'ERRO: Ocorreu um erro com o SoundPad!',
                ephemeral: true,
              });
            }
            return await soundpad.execute(client, interaction);
          }

          // Tratamento dos botões de Ticket
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
              await this.logger.warn(
                'InteractionModule',
                `Botão não identificado: ${interaction.customId}`
              );
              break;
          }
        }

        // Tratamento de Modal Submit
        if (interaction.isModalSubmit()) {
          await this.logger.info(
            'InteractionModule',
            `Modal submetido: ${interaction.customId}`
          );
          switch (interaction.customId) {
            case 'ticketmodal':
              return await ticketModule.ticketModal(client, interaction);
            default:
              return await interaction.reply({
                content: 'Erro, Modal não identificado!',
                ephemeral: true,
              });
          }
        }

        // Tratamento de Comandos Slash
        if (interaction.isChatInputCommand()) {
          await this.logger.info(
            'InteractionModule',
            `Comando executado: ${interaction.commandName}`
          );
          const command = slashCommands.get(interaction.commandName);

          if (!command) {
            await this.logger.error(
              'InteractionModule',
              `Comando ${interaction.commandName} não encontrado`
            );
            return interaction.reply({
              content: 'Erro ao executar o comando: NÃO ENCONTRADO',
              ephemeral: true,
            });
          }

          return await command.execute(client, interaction);
        }
      } catch (err) {
        await this.logger.error(
          'InteractionModule',
          `Erro no arquivo: ${err.message}\nStack: ${err.stack}`
        );
      }
    });
  }
}

module.exports = InteractionModule;
