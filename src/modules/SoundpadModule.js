const ButtonModule = require('./ButtonModule.js');
const AudioFileService = require('../services/AudioFileService');
const DiscordInteractionService = require('../services/DiscordInteractionService');
const LoggerModule = require('./LoggerModule');
const {
  soundpadCategories,
  categoryOptions,
} = require('../config/soundpadCategories');

class SoundpadModule {
  static categories = categoryOptions;

  constructor() {
    this.buttonModule = new ButtonModule();
    this.discordInteractionService = new DiscordInteractionService(
      this.buttonModule
    );
    this.audioFileService = new AudioFileService();
    this.logger = new LoggerModule();
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
    } catch (error) {
      await this.logger.error('SoundPad', `Erro ao inicializar: ${error}`);
    }
  };
}

module.exports = SoundpadModule;
