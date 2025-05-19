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
const Logger = require('../../utils/Logger');

class TicketManager {
  constructor(dbModule) {
    this.dbModule = dbModule;
    this.logger = new Logger();
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
    try {
      const channel = interaction.channel;
      const userId = channel.topic;
      const guildData = await this.dbModule.getGuildData(interaction.guildId);

      if (!userId) {
        throw new Error('ID do usuário não encontrado no topic do canal');
      }

      // Atualiza as permissões do usuário
      await channel.permissionOverwrites.edit(userId, {
        ViewChannel: false,
      });

      // Atualiza as permissões do cargo de staff
      await channel.permissionOverwrites.edit(guildData.ticketRoleId, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
        AddReactions: true,
      });

      // Atualiza as permissões do @everyone
      await channel.permissionOverwrites.edit(interaction.guild.id, {
        ViewChannel: false,
      });

      // Cria o embed de ticket fechado
      const ticketClosedEmbed = new EmbedBuilder()
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

      // Cria os botões
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

      // Envia a mensagem com os botões
      await interaction.reply({
        embeds: [ticketClosedEmbed],
        components: [buttonsRow],
      });
    } catch (error) {
      this.logger.error(
        'TicketManager',
        `Erro ao fechar ticket: ${error.message}`
      );
      await interaction.reply({
        content: '❌ Erro ao fechar o ticket. Por favor, tente novamente.',
        ephemeral: true,
      });
    }
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
    try {
      const channel = interaction.channel;
      const userId = channel.topic;

      if (!userId) {
        throw new Error('ID do usuário não encontrado no topic do canal');
      }

      // Enviar mensagem de countdown
      const countdownMsg = await interaction.reply({
        content: '🔄 Gerando transcript e fechando ticket em 5 segundos...',
        ephemeral: true,
      });

      // Countdown de 5 segundos
      for (let i = 4; i > 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await countdownMsg.edit({
          content: `🔄 Gerando transcript e fechando ticket em ${i} segundos...`,
          ephemeral: true,
        });
      }

      // Gerar transcript
      const attachment = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        filename: `transcript-${channel.name}.html`,
        poweredBy: false,
        hydrate: true,
      });

      // Enviar mensagem final
      await countdownMsg.edit({
        content: '✅ Gerando transcript e fechando ticket agora...',
        ephemeral: true,
      });

      // Aguardar 1 segundo antes de fechar
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obter dados do servidor
      const guildData = await this.dbModule.getGuildData(interaction.guildId);
      const logsChannel = interaction.guild.channels.cache.get(
        guildData.ticketLogsChannelId
      );

      if (logsChannel) {
        // Criar embed para o canal de logs
        const embed = new EmbedBuilder()
          .setColor('#2f3136')
          .setTitle('Transcript de Ticket')
          .setDescription(
            `Ticket de <@${userId}> fechado por ${interaction.user.tag}`
          )
          .setTimestamp();

        // Enviar transcript para o canal de logs
        await logsChannel.send({
          embeds: [embed],
          files: [attachment],
        });
      } else {
        this.logger.error('TicketManager', 'Canal de logs não encontrado');
      }

      // Fechar o canal
      await channel.delete();
    } catch (error) {
      this.logger.error(
        'TicketManager',
        `Erro ao gerar transcript: ${error.message}`
      );
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Erro ao gerar transcript. Por favor, tente novamente.',
          ephemeral: true,
        });
      }
    }
  }

  async ticketMentionUser(client, interaction) {
    const {
      channel: { topic },
      guild,
    } = interaction;

    const user = await guild.members.fetch(topic);
    if (user) {
      await interaction.reply({
        content: `<@!${topic}>`,
        ephemeral: true,
      });
    }
  }
}

module.exports = TicketManager;
