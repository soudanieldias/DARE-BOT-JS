const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require('discord.js');

class TicketEmbed {
  constructor() {}

  async embedCreation(_client, interaction, ticketChannel) {
    const embedCreated = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: `Suporte - ${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `Olá ${interaction.user}, Seu ticket foi criado com sucesso.`
      )
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const button = new ButtonBuilder()
      .setLabel('Atalho')
      .setURL(ticketChannel.url)
      .setStyle(ButtonStyle.Link);

    const buttonRowCreated = new ActionRowBuilder().addComponents(button);

    return { embedCreated, buttonRowCreated };
  }

  async embedOpenedTicket(client, interaction, guildData, ticketChannel) {
    const ticketChannelEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(guildData.ticketDescription)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const closeButton = new ButtonBuilder()
      .setCustomId('ticket-close')
      .setStyle(ButtonStyle.Danger)
      .setLabel('Fechar ticket');
    const mentionButton = new ButtonBuilder()
      .setCustomId('ticket-mention')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Mencionar Usuário');

    const closeButtonRow = new ActionRowBuilder().addComponents(
      closeButton,
      mentionButton
    );

    ticketChannel
      .send({ embeds: [ticketChannelEmbed], components: [closeButtonRow] })
      .then(m => {
        m.pin();
      });
  }

  async embedReopenedTicket(client, interaction, guildData) {
    const ticketChannelEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `Olá, <@!${interaction.channel.topic}>, o seu ticket foi reaberto pelo <@!${interaction.user.id}>`
      )
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const closeButton = new ButtonBuilder()
      .setCustomId('ticket-closemessage')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Apagar Mensagem');

    const closeButtonRow = new ActionRowBuilder().addComponents(closeButton);

    interaction.channel.send({
      content: `<@!${interaction.channel.topic}>`,
      embeds: [ticketChannelEmbed],
      components: [closeButtonRow],
    });
  }

  async embedClosedTicket(client, interaction, guildData) {
    const ticketClosedChannelEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription('Ticket fechado, escolha uma ação abaixo.')
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const reopenButton = new ButtonBuilder()
      .setCustomId('ticket-reopen')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Reabrir Ticket');

    const transcriptButton = new ButtonBuilder()
      .setCustomId('ticket-transcript')
      .setStyle(ButtonStyle.Danger)
      .setLabel('Transcrever Ticket');

    const buttonsRow = new ActionRowBuilder().addComponents(
      reopenButton,
      transcriptButton
    );

    interaction.reply({
      embeds: [ticketClosedChannelEmbed],
      components: [buttonsRow],
    });
  }
}

module.exports = TicketEmbed;
