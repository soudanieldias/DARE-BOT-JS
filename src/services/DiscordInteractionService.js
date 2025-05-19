const LoggerModule = require('../utils/Logger');

class DiscordInteractionService {
  constructor(buttonModule) {
    this.buttonModule = buttonModule;
    this.logger = new LoggerModule();
  }

  async handleSoundpadList(interaction, soundpadCategories) {
    try {
      const { values } = interaction;
      const buttonsPath = soundpadCategories[values[0]];

      const generatedButtons = await this.buttonModule.generateButtons(
        buttonsPath.path
      );
      const slicedButtons = await this.buttonModule.sliceButtonArray(
        generatedButtons,
        5
      );

      await interaction.reply({
        content: `Enviando lista de áudios.\nCategoria ${buttonsPath.category}`,
        ephemeral: true,
      });

      await this.logger.info(
        'DiscordInteraction',
        `Enviando lista de áudios da categoria: ${buttonsPath.category}`
      );

      return slicedButtons.map(async (rowData, index) => {
        await interaction.channel.send({
          content: `Lista de Áudios (${buttonsPath.category}): ${index + 1}`,
          components: [rowData],
        });
      });
    } catch (error) {
      await this.logger.error(
        'DiscordInteraction',
        `Erro ao listar áudios: ${error}`
      );
      throw error;
    }
  }
}

module.exports = DiscordInteractionService;
