const ButtonModule = require('./ButtonModule.js');
const AudioFileService = require('../services/AudioFileService');
const DiscordInteractionService = require('../services/DiscordInteractionService');
const Logger = require('../utils/Logger');
const {
  soundpadCategories,
  categoryOptions,
} = require('../config/soundpad.config');

class SoundpadModule {
  static categories = categoryOptions;

  constructor() {
    this.buttonModule = new ButtonModule();
    this.discordInteractionService = new DiscordInteractionService(
      this.buttonModule
    );
    this.audioFileService = new AudioFileService();
    this.logger = new Logger();
  }

  listSoundpads = async (_client, interaction) => {
    return this.discordInteractionService.handleSoundpadList(
      interaction,
      soundpadCategories
    );
  };

  start = async client => {
    try {
      await this.logger.info('SoundPad', 'Inicializando Soundpad.');
      await this.audioFileService.loadAudioFiles(client);
      await this.logger.info('SoundPad', 'Soundpad inicializado com sucesso.');
    } catch (error) {
      await this.logger.error('SoundPad', `Erro ao inicializar: ${error}`);
    }
  };
}

module.exports = SoundpadModule;
