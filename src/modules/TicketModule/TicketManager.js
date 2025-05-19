const {
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');

class TicketManager {
  constructor(dbModule, ticketEmbed) {
    this.dbModule = dbModule;
    this.ticketEmbed = ticketEmbed;
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

    const { embedCreated, buttonRowCreated } =
      await this.ticketEmbed.embedCreation(client, interaction, ticketChannel);

    await interaction.reply({
      embeds: [embedCreated],
      components: [buttonRowCreated],
      ephemeral: true,
    });

    await this.ticketEmbed.embedOpenedTicket(
      client,
      interaction,
      guildData,
      ticketChannel
    );
  }

  async closeTicket(client, interaction) {
    const ticketMember = interaction.channel.topic;
    const memberData = interaction.guild.members.cache.get(ticketMember);
    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    if (memberData) {
      interaction.channel.edit({
        permissionOverwrites: [
          { id: ticketMember, deny: [PermissionFlagsBits.ViewChannel] },
        ],
      });
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
    await this.ticketEmbed.embedClosedTicket(client, interaction, guildData);
  }

  async ticketCloseMessage(client, interaction) {
    return await interaction.message.delete();
  }

  async reopenTicket(client, interaction) {
    const ticketMember = interaction.channel.topic;
    const memberData = interaction.guild.members.cache.get(ticketMember);
    const guildData = await this.dbModule.getGuildData(interaction.guildId);

    if (memberData) {
      interaction.channel.edit({
        permissionOverwrites: [
          { id: ticketMember, allow: [PermissionFlagsBits.ViewChannel] },
        ],
      });
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
    await this.ticketEmbed.embedReopenedTicket(client, interaction, guildData);
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
}

module.exports = TicketManager;
