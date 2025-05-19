const { globSync } = require('glob');
const LoggerModule = require('../utils/LoggerModule');

class AudioFileService {
  constructor() {
    this.logger = new LoggerModule();
  }

  async loadAudioFiles(client) {
    try {
      await this.logger.info(
        'AudioFileService',
        'Carregando arquivos de áudio...'
      );
      const audioFiles = globSync('./src/audios/**/*.mp3');

      audioFiles.forEach(file => {
        const fileName = file.split('/').pop().replace('.mp3', '');

        if (!client.pads.has(fileName)) {
          client.pads.set(fileName, {
            name: fileName,
            path: file,
          });
        } else {
          this.logger.warn(
            'AudioFileService',
            `Arquivo de nome: "${fileName}" já existe na lista de áudios.\nIgnorando-o!\nPath: "${file}"`
          );
        }
      });

      await this.logger.info(
        'AudioFileService',
        `${client.pads.size} arquivos de áudio carregados.`
      );
    } catch (error) {
      await this.logger.error(
        'AudioFileService',
        `Erro ao carregar arquivos: ${error}`
      );
      throw error;
    }
  }
}

module.exports = AudioFileService;
