/* eslint-disable no-unused-vars */
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { Settings } = require('../database/models');
const DBModule = require('./DBModule');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DBModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */
module.exports = (client, slashCommands) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      const { message } = interaction;

      if (interaction.isButton()) {
        if (message.content.includes('Lista de Áudios: ')) {
          const soundpad = slashCommands.get('soundpad');
          if (!soundpad)
            return interaction.reply('ERRO: Ocorreu um erro com o SoundPad!');
          return await soundpad.execute(client, interaction);
        } else {
          return;
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId == 'ticketmodal') {
          const openTitle = interaction.fields.getTextInputValue('opentitle');
          const openDescription =
            interaction.fields.getTextInputValue('opendescription');
          const ticketTitle =
            interaction.fields.getTextInputValue('tickettitle');
          const ticketDescription =
            interaction.fields.getTextInputValue('ticketdescription');
          console.log(
            openTitle,
            openDescription,
            ticketTitle,
            ticketDescription
          );

          const [settings, created] = await Settings.findOrCreate({
            where: { id: interaction.guild.id },
            defaults: {
              id: interaction.guild.id,
              ticket_title: ticketTitle,
              ticket_description: ticketDescription,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          if (!created) {
            await settings.update({
              ticket_title: ticketTitle,
              ticket_description: ticketDescription,
              updatedAt: new Date(),
            });
          }

          const embedTicket = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({
              name: `${openTitle}`,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setDescription(openDescription)
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            });

          const dbModule = new DBModule();
          const { ticket_button_name, ticket_channel_id } =
            await dbModule.getTicketChannelData(interaction.guildId);

          const botaoTicket = new ButtonBuilder()
            .setCustomId('abrirticket')
            .setLabel(ticket_button_name || 'Abrir Ticket')
            .setStyle(2)
            .setEmoji('🎯');

          const botoesTicket = new ActionRowBuilder().setComponents(
            botaoTicket
          );

          const channel =
            interaction.guild.channels.cache.get(ticket_channel_id);

          channel.send({ embeds: [embedTicket], components: [botoesTicket] });

          await interaction.reply({
            content: 'Configurações de ticket criadas com sucesso!',
            ephemeral: true,
          });
        } else {
          return;
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
