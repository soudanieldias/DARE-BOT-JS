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
const discordTranscripts = require('discord-html-transcripts');
const DatabaseModule = require('./DatabaseModule.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('./DatabaseModule.js')} dbModule
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */

module.exports = class TicketModule {
  dbModule = new DatabaseModule();

  async config(_client, interaction) {
    try {
      const canal = interaction.options.getChannel('canal');
      const canalLogs = interaction.options.getChannel('logs');
      const categoria = interaction.options.getChannel('categoria');
      const botaoTicket = interaction.options.getString('botao');
      const cargo = interaction.options.getRole('cargo');

      await Settings.upsert({
        id: interaction.guild.id,
        owner: interaction.guild.ownerId,
        ticketChannelId: canal.id,
        ticketButtonName: botaoTicket,
        announcesChannelId: canalLogs.id,
        modRoleId: cargo.id,
        ticketCategoryId: categoria.id,
        ticketLogsChannelId: canalLogs.id,
        ticketRoleId: cargo.id,
        ticketTitle: botaoTicket,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await interaction.showModal(ticketModal);
    } catch (error) {
      console.error(error);
    }
  }

  async addUser(client, interaction) {
    await this.checkTicketConfig(client, interaction);
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
        ticketTitle: ticketTitle,
        ticketDescription: ticketDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!created) {
      await settings.update({
        ticketTitle: ticketTitle,
        ticketDescription: ticketDescription,
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

    const { ticketButtonName, ticketChannelId } =
      await this.dbModule.getGuildData(interaction.guildId);

    const botaoTicket = new ButtonBuilder()
      .setCustomId('ticket-open')
      .setLabel(ticketButtonName || 'Abrir Ticket')
      .setStyle(2)
      .setEmoji('🎯');

    const botoesTicket = new ActionRowBuilder().setComponents(botaoTicket);

    const channel = interaction.guild.channels.cache.get(ticketChannelId);

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

    const { ticketCategoryId, ticketRoleId } = guildData;

    const ticketChannel = await interaction.guild.channels.create({
      name: `🔖・ticket--${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: `${interaction.user.id}`,
      parent: ticketCategoryId,
      permissionOverwrites: [
        {
          id: ticketRoleId,
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
      interaction,
      ticketChannel,
    );

    await interaction.reply({
      embeds: [embedCreated],
      components: [buttonRowCreated],
      ephemeral: true,
    });

    await this.embedOpenedTicket(client, interaction, guildData, ticketChannel);
  }

  async ticketClose(client, interaction) {
    const ticketMember = interaction.channel.topic;
    const memberData = interaction.guild.members.cache.get(ticketMember);
    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    if (memberData) {
      interaction.channel.edit({ permissionOverwrites: [{ id: ticketMember, deny: [PermissionFlagsBits.ViewChannel] }] });
    }

    interaction.channel.edit({
      permissionOverwrites: [
        {
          id: guildData.ticketRoleId,
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
      ],
    });
    await this.embedClosedTicket(client, interaction, guildData)
  }

  async ticketCloseMessage(client, interaction) {
    return await interaction.message.delete();
  }

  async ticketReopen(client, interaction) {
    const ticketMember = interaction.channel.topic;
    const memberData = interaction.guild.members.cache.get(ticketMember);
    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    if (memberData) {
      interaction.channel.edit({ permissionOverwrites: [{ id: ticketMember, allow: [PermissionFlagsBits.ViewChannel] }] });
    }

    interaction.channel.edit({
      permissionOverwrites: [
        {
          id: guildData.ticketRoleId,
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
      ],
    });
    await interaction.message.delete();
    await this.embedReopenedTicket(client, interaction, guildData)
  }

  async ticketTranscript(client, interaction) {
    const { channel, user } = interaction;

        const attachment = await discordTranscripts.createTranscript(interaction.channel);

        interaction.channel.delete();

        const embed = new EmbedBuilder()
          .setDescription(
            `Ticket de <@${channel.topic}>\`(${channel.topic})\` \n Deletado por ${user}\`(${user.id})\``
          )
          .setColor('#2f3136')
          .setTimestamp();

        const guildData = await this.dbModule.getGuildData(interaction.guildId);
        const logsChannel = interaction.guild.channels.cache.get(guildData.ticketLogsChannelId);

        logsChannel.send({ embeds: [embed], files: [attachment] });
  }

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

    const closeButtonRow = new ActionRowBuilder().addComponents(closeButton);

    ticketChannel.send({ embeds: [ticketChannelEmbed], components: [closeButtonRow] }).then((m) => {
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
      .setDescription(`Olá, <@!${interaction.channel.topic}>, o seu ticket foi reaberto pelo <@!${interaction.user.id}>`)
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
      components: [closeButtonRow]
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

    const buttonsRow = new ActionRowBuilder().addComponents(reopenButton, transcriptButton);

    interaction.reply({ embeds: [ticketClosedChannelEmbed], components: [buttonsRow] });
  }
};
