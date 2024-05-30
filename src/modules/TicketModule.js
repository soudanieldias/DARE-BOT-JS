const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  ButtonStyle,
} = require('discord.js');
const { Settings } = require('../database/models');
const ticketModal = require('../modules/modals/ticketmodal.js');
const DBModule = require('./DBModule.js');

module.exports = class TicketModule {
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('./DBModule.js')} dbModule
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  dbModule = new DBModule();

  async config(_client, interaction) {
    try {
      const canal = interaction.options.getChannel('canal');
      const canalLogs = interaction.options.getChannel('logs');
      const categoria = interaction.options.getChannel('categoria');
      const botaoTicket = interaction.options.getString('botao');
      const cargo = interaction.options.getRole('cargo');

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
        updatedAt: new Date(),
      });

      return await interaction.showModal(ticketModal);
    } catch (error) {
      console.error(error);
    }
  }

  async addUser(client, interaction) {
    this.checkTicketConfig(client, interaction);
  }

  async removeUser(client, interaction) {
    this.checkTicketConfig(client, interaction);
  }

  async checkTicketConfig(client, interaction) {
    const hasAdminRole = interaction.memberPermissions?.has([
      PermissionFlagsBits.Administrator,
    ]);
    if (!hasAdminRole) return interaction.reply('Erro: Não Autorizado!!!');
    return;
  }

  async ticketModal(client, interaction) {
    const openTitle = interaction.fields.getTextInputValue('opentitle');
    const openDescription =
      interaction.fields.getTextInputValue('opendescription');
    const ticketTitle = interaction.fields.getTextInputValue('tickettitle');
    const ticketDescription =
      interaction.fields.getTextInputValue('ticketdescription');

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

    const { ticket_button_name, ticket_channel_id } =
      await this.dbModule.getGuildData(interaction.guildId);

    const botaoTicket = new ButtonBuilder()
      .setCustomId('ticket-open')
      .setLabel(ticket_button_name || 'Abrir Ticket')
      .setStyle(2)
      .setEmoji('🎯');

    const botoesTicket = new ActionRowBuilder().setComponents(botaoTicket);

    const channel = interaction.guild.channels.cache.get(ticket_channel_id);

    channel.send({ embeds: [embedTicket], components: [botoesTicket] });

    await interaction.reply({
      content: 'Configuração do sistema de ticket realizada com sucesso!',
      ephemeral: true,
    });
  }

  async ticketOpen(client, interaction) {
    if (
      interaction.guild.channels.cache.find(
        (c) => c.topic === interaction.user.id
      )
    ) {
      return interaction.reply({
        content: `**Já existe um ticket aberto para a sua conta -> ${interaction.guild.channels.cache.find(
          (c) => c.topic === interaction.user.id
        )}.**`,
        ephemeral: true,
      });
    }

    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    const { ticket_category_id, ticket_role_id } = guildData;

    const ticketChannel = await interaction.guild.channels.create({
      name: `🔖・ticket--${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: `${interaction.user.id}`,
      parent: ticket_category_id,
      permissionOverwrites: [
        {
          id: ticket_role_id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AddReactions,
          ],
        },
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AddReactions,
          ],
        },
      ],
    });

    const { embedCreated, buttonRowCreated } = await this.embedCreation(
      client,
      interaction
    );

    await interaction.reply({
      embeds: [embedCreated],
      components: [buttonRowCreated],
      ephemeral: true,
    });

    await this.embedTicket(client, interaction, guildData, ticketChannel);
  }

  async embedCreation(_client, interaction) {
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
      .setURL(interaction.channel.url)
      .setStyle(ButtonStyle.Link);

    const buttonRowCreated = new ActionRowBuilder().addComponents(button);

    return { embedCreated, buttonRowCreated };
  }

  async embedTicket(client, interaction, guildData, ticketChannel) {
    const ticketChannelEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setAuthor({
        name: guildData.ticket_title,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(guildData.ticket_description)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const closeButton = new ButtonBuilder()
      .setCustomId('ticket-close')
      .setStyle(ButtonStyle.Danger)
      .setLabel('Fechar ticket');

    const closeButtonRow = new ActionRowBuilder().addComponents(closeButton);

    ticketChannel.send({ embeds: [ticketChannelEmbed], components: [closeButtonRow] }).then((m) => {
      m.pin();
    });
  }
};
