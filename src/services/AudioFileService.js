const { globSync } = require('glob');
const Logger = require('../utils/Logger');
const path = require('path');

class AudioFileService {
  constructor() {
    this.logger = new Logger();
  }

  async loadAudioFiles(client) {
    try {
      await this.logger.info(
        'AudioFileService',
        'Carregando arquivos de áudio...'
      );

      // Limpa a coleção atual de pads
      client.pads.clear();

      // Carrega os arquivos de todas as categorias
      const categories = [
        './src/audios/audios/**/*.mp3',
        './src/audios/frases/**/*.mp3',
        './src/audios/memes/**/*.mp3',
        './src/audios/musicas/**/*.mp3',
        './src/audios/times/**/*.mp3',
      ];

      for (const pattern of categories) {
        const audioFiles = globSync(pattern);
        await this.logger.info(
          'AudioFileService',
          `Procurando arquivos em: ${pattern}`
        );
        await this.logger.info(
          'AudioFileService',
          `Encontrados ${audioFiles.length} arquivos`
        );

        for (const file of audioFiles) {
          const fileName = path.basename(file, '.mp3');
          const category = path.basename(path.dirname(file));

          if (!client.pads.has(fileName)) {
            client.pads.set(fileName, {
              name: fileName,
              path: file,
              category: category,
            });
            await this.logger.info(
              'AudioFileService',
              `Arquivo carregado: ${fileName} (${category})`
            );
          } else {
            await this.logger.warn(
              'AudioFileService',
              `Arquivo de nome: "${fileName}" já existe na lista de áudios.\nIgnorando-o!\nPath: "${file}"`
            );
          }
        }
      }

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
