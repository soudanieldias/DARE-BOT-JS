const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Sistema de Música DARE-Music")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("play")
        .setDescription("Toca uma música")
        .addStringOption((option) =>
          option.setName("query").setDescription("Nome ou link do Stream")
    ))
    .addSubcommand((subCommand) =>
      subCommand
        .setName("stop")
        .setDescription("Stop a music")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("next")
        .setDescription("Pula para a próxima música")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("queue")
        .setDescription("Mostra a fila atual de músicas")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("volume")
        .setDescription("Altera o volume da música")
        // .addIntegerOption((option) => {
        //   option
        //    .setName('value')
        //    .setRequired(true)
        //    .setDescription('Altere o Volume entre 0 e 100')
        // })
        
        // .addIntegerOption(option => {
        //   option
        //   .setName('value')
        //   .setRequired(true)
        //   .setDescription('Altere o Volume entre 0 e 100')
        // })

        // .addIntegerOption(option =>
        //   option
        //     .setName('volume')
        //     .setDescription('Digite um valor entre 0-100')
        //     .min_value(0)
        //     .max_value(100)
        //     .setRequired(true)
        //   )
    ),
  execute: async (client, interaction) => {
    try {
      const { member, guild, options } = interaction;
      const memberData = guild.members.cache.get(member.user.id);
      // console.log(memberData);

      const subCommand = options.getSubcommand();
      // console.log(subCommand);

      switch (subCommand) {
        case 'play':
          interaction.reply('Comando executado com sucesso', { ephemeral: true });
          break;

        case 'stop':
          interaction.reply('Comando executado com sucesso', { ephemeral: true });
          break;

        case 'next':
          interaction.reply('Comando executado com sucesso', { ephemeral: true });
          break;

        case 'volume':
          interaction.reply('Comando executado com sucesso', { ephemeral: true });
          break;
        
        default:
          break;
      }

    } catch (error) {
      console.error(error);
    }
  },
};
