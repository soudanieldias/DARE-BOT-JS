module.exports = (client, slashCommands) => {
client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) return;

      if (interaction.isModalSubmit()) return;

      // if (interaction.isChatInputCommand()) return;

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(interaction.commandName);

        if (!command) {
          return interaction.reply(
            `Ocorreu um erro ao executar o comando! Tente mais Tarde!`
          );
        }

        return command.execute(client, interaction);
      }

    } catch (err) {
      console.error(err);
    }
  });
};
