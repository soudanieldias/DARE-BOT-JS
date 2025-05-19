const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { TicketModule } = require('../../modules');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sistema de Ticket.')
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('config')
        .setDescription('Configure a funcionalidade de tickets')
        .addChannelOption(option =>
          option
            .setName('canal')
            .setDescription(
              'Canal que a mensagem para criar ticket será enviada.'
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('logs')
            .setDescription('Canal que as logs será enviada.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('categoria')
            .addChannelTypes(ChannelType.GuildCategory)
            .setDescription(
              'Selecione uma categoria a qual os tickets serão criados.'
            )
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('botao')
            .setDescription('O nome do botão de abrir tickets.')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('cargo')
            .setDescription('Cargo que podera ver os tickets.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('adduser')
        .setDescription('Adicione um membro a um ticket.')
        .addUserOption(option =>
          option
            .setName('membro')
            .setDescription('Membro que será adicionado ao ticket.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removeuser')
        .setDescription('Remova um membro do ticket.')
        .addUserOption(option =>
          option
            .setName('membro')
            .setDescription('Membro que será removido do ticket.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('mencionar')
        .setDescription('Mencione o membro que abriu o ticket em seu privado.')
    ),
  category: 'staff',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    const ticketModule = new TicketModule();

    switch (interaction.options.getSubcommand()) {
      case 'config':
        ticketModule.config(client, interaction);
        break;
      case 'adduser':
        ticketModule.addUser(client, interaction);
        break;
      case 'removeuser':
        ticketModule.removeUser(client, interaction);
        break;
      case 'mencionar':
        ticketModule.ticketMentionUser(client, interaction);
    }
  },
};
