const {
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const { TicketEmbed } = require('../embeds');
const LoggerModule = require('../LoggerModule');

class TicketManager {
  constructor(dbModule) {
    this.dbModule = dbModule;
    this.logger = new LoggerModule();
  }

  async openTicket(client, interaction) {
    if (
      interaction.guild.channels.cache.find(
        c => c.topic === interaction.user.id
      )
    ) {
      return interaction.reply({
        content: `**Já existe um ticket aberto para a sua conta -> ${interaction.guild.channels.cache.find(
          c => c.topic === interaction.user.id
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

    const embed = TicketEmbed.buildOpenedTicketEmbed(interaction, guildData);
    const buttons = TicketEmbed.buildTicketButtons('opened');

    // Envia a mensagem ephemeral com o link para o ticket
    const ticketLinkEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`Seu ticket foi criado em ${ticketChannel}`)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    const ticketLinkButton = new ButtonBuilder()
      .setLabel('Ir para o ticket')
      .setURL(ticketChannel.url)
      .setStyle(ButtonStyle.Link);

    const ticketLinkRow = new ActionRowBuilder().addComponents(
      ticketLinkButton
    );

    await interaction.reply({
      embeds: [ticketLinkEmbed],
      components: [ticketLinkRow],
      ephemeral: true,
    });

    // Envia a mensagem inicial no canal do ticket
    await ticketChannel
      .send({
        embeds: [embed],
        components: [buttons],
      })
      .then(m => m.pin());
  }

  async closeTicket(client, interaction) {
    const guildData = await this.dbModule.getGuildData(interaction.guildId);
    const embed = TicketEmbed.buildClosedTicketEmbed(interaction, guildData);
    const buttons = TicketEmbed.buildTicketButtons('closed');

    await interaction.reply({
      embeds: [embed],
      components: [buttons],
    });
  }

  async reopenTicket(client, interaction) {
    const ticketMember = interaction.channel.topic;
    const memberData = interaction.guild.members.cache.get(ticketMember);
    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    // Restaura as permissões do usuário
    if (memberData) {
      await interaction.channel.permissionOverwrites.edit(ticketMember, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
        AddReactions: true,
      });
    }

    // Restaura as permissões do cargo de staff
    await interaction.channel.permissionOverwrites.edit(
      guildData.ticketRoleId,
      {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
        AddReactions: true,
      }
    );

    // Remove a visibilidade do @everyone
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      ViewChannel: false,
    });

    const embed = TicketEmbed.buildReopenedTicketEmbed(interaction, guildData);
    const buttons = TicketEmbed.buildTicketButtons('reopened');

    // Apaga a mensagem de fechamento
    await interaction.message.delete();

    await interaction.reply({
      content: `<@!${interaction.channel.topic}>`,
      embeds: [embed],
      components: [buttons],
    });
  }

  async ticketCloseMessage(client, interaction) {
    try {
      await interaction.message.delete();
    } catch (error) {
      this.logger.error('Erro ao apagar mensagem:', error);
    }
  }

  async generateTranscript(client, interaction) {
    const { channel, user } = interaction;

    const attachment = await discordTranscripts.createTranscript(
      interaction.channel
    );

    interaction.channel.delete();

    const embed = new EmbedBuilder()
      .setDescription(
        `Ticket de <@${channel.topic}>\`(${channel.topic})\` \n Deletado por ${user}\`(${user.id})\``
      )
      .setColor('#2f3136')
      .setTimestamp();

    const guildData = await this.dbModule.getGuildData(interaction.guildId);
    const logsChannel = interaction.guild.channels.cache.get(
      guildData.ticketLogsChannelId
    );

    logsChannel.send({ embeds: [embed], files: [attachment] });
  }

  async ticketMentionUser(client, interaction) {
    const {
      channel: { topic, url },
      guild,
    } = interaction;

    try {
      const validUser = await guild.members.fetch(topic);

      if (!topic || !validUser) {
        return interaction.reply({
          content:
            'Este canal não é um ticket, ou o usuário não se encontra mais no servidor.',
          ephemeral: true,
        });
      }

      const mentionEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ticket Aberto')
        .setDescription(
          `Olá ${validUser.user.tag}, você possui um ticket em aberto no servidor ${interaction.guild.name}, no qual foi mencionado.`
        )
        .addFields([
          { name: 'Canal do ticket:', value: `<#${interaction.channel.id}>` },
        ])
        .setTimestamp();

      const mentionButton = new ButtonBuilder()
        .setLabel('Ir para o ticket')
        .setURL(url)
        .setStyle(ButtonStyle.Link);

      const mentionRow = new ActionRowBuilder().addComponents(mentionButton);

      await validUser.send({
        content: `Olá ${validUser.user}, você possui um ticket em aberto no qual foi mencionado:`,
        embeds: [mentionEmbed],
        components: [mentionRow],
      });

      return interaction.reply({
        content: 'O usuário foi mencionado',
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Erro ao mencionar usuário:', error);
      return interaction.reply({
        content: 'Não foi possível mencionar o usuário.',
        ephemeral: true,
      });
    }
  }
}

module.exports = TicketManager;
