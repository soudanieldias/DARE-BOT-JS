const SoundModule = require("./SoundModule");

module.exports = (client, slashCommands) => {
client.on('interactionCreate', async (interaction) => {
    try {
      const { message, commandName, user } = interaction;

      const soundModule = new SoundModule();

      if (interaction.isButton()) {
        if(message.content.includes('Lista de Áudios: ')) {
          const soundpad = slashCommands.get('soundpad');
          if(!soundpad) return interaction.reply('ERRO: Ocorreu um erro com o SoundPad!');
          await soundpad.execute(client, interaction);
        }
      }

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
