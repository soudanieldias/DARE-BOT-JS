const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cargo")
    .setDescription("Atribui ou remove um cargo")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("atribuir")
        .setDescription("Atribui um cargo a um usuário")
        .addUserOption((option) =>
          option
            .setName("usuario")
            .setDescription("O usuário para quem atribuir o cargo")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("cargo")
            .setDescription("O cargo a ser atribuído")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remove um cargo de um usuário")
        .addUserOption((option) =>
          option
            .setName("usuario")
            .setDescription("O usuário de quem remover o cargo")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("cargo")
            .setDescription("O cargo a ser removido")
            .setRequired(true)
        )
    ),
  category: "staff",
  async execute(_client, interaction) {
    try {
      const hasAdminRole = interaction.memberPermissions?.has([
        PermissionFlagsBits.Administrator,
      ]);

      const { options } = interaction;
      const user = options.getUser("usuario");
      const role = options.getRole("cargo");

      if (!hasAdminRole)
        return interaction.reply("ERRO: Comando disponível apenas para Staff!");
      if (!user || !role)
        return interaction.reply("Usuário ou cargo não encontrados.");
      const member = await interaction.guild.members.fetch(user);

      switch (options.getSubcommand()) {
        case "atribuir":
          await member.roles.add(role);
          await interaction.reply({
            content: `O cargo ${role.name} foi atribuído a ${user.username}`,
            ephemeral: true,
          });
          break;
        case "remover":
          await member.roles.remove(role);
          await interaction.reply({
            content: `O cargo ${role.name} foi removido de ${user.username}`,
            ephemeral: true,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
