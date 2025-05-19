const { globSync } = require('glob');
const path = require('path');
const LoggerModule = require('../utils/LoggerModule');

class ButtonLoaderModule {
  constructor() {
    this.logger = new LoggerModule();
  }

  async loadButtons(client) {
    try {
      await this.logger.info('Buttons', 'Carregando módulo de Botões.');
      const buttonFiles = globSync('./src/buttons/**/*.js');

      for (const file of buttonFiles) {
        const button = require(`../../${file}`);
        const { customId } = button.data;

        if (client.buttons.has(customId)) {
          await this.logger.error(
            'Buttons',
            `Já existe um botão carregado com o mesmo ID: ${customId}`
          );
          return;
        }

        client.buttons.set(customId, button);
      }

      await this.logger.info('Buttons', 'Botões carregados com Sucesso.');
    } catch (error) {
      await this.logger.error('Buttons', `Erro no arquivo: ${error}`);
    }
  }
}

module.exports = ButtonLoaderModule;
