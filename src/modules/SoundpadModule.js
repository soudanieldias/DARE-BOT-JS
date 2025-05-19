const { globSync } = require('glob');
const ButtonModule = require('./ButtonModule.js');
const Logger = require('../utils/Logger');

class SoundpadModule {
  static categories = [
    { label: 'audios', value: 'spad_audios' },
    { label: 'frases', value: 'spad_frases' },
    { label: 'memes', value: 'spad_memes' },
    { label: 'musicas', value: 'spad_musicas' },
    { label: 'times', value: 'spad_times' },
  ];

  soundpadCategories = {
    spad_audios: { path: './src/audios/audios', category: 'audios' },
    spad_frases: { path: './src/audios/frases', category: 'frases' },
    spad_memes: { path: './src/audios/memes', category: 'memes' },
    spad_musicas: { path: './src/audios/musicas', category: 'musicas' },
    spad_times: { path: './src/audios/times', category: 'times' },
  };

  constructor() {
    this.buttonModule = new ButtonModule();
    this.logger = new Logger();
  }

  listSoundpads = async (_client, interaction) => {
    const { values } = interaction;
    const buttonsPath = this.soundpadCategories[values[0]];

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
    return slicedButtons.map(async (rowData, index) => {
      await interaction.channel.send({
        content: `Lista de Áudios (${buttonsPath.category}): ${index + 1}`,
        components: [rowData],
      });
    });
  };

  start = async client => {
    try {
      await this.logger.info('SoundPad', 'Inicializando Soundpad.');
      const audioFiles = globSync('./src/audios/**/*.mp3');

      audioFiles.map(file => {
        const fileName = file.split('/').pop().replace('.mp3', '');

        if (!client.pads.has(fileName)) {
          client.pads.set(fileName, {
            name: fileName,
            path: file,
          });
        } else {
          this.logger.warn(
            'SoundPad',
            `Arquivo de nome: "${fileName}" já existe na lista de áudios.\nIgnorando-o!\nPath: "${file}"`
          );
        }
      });
      await this.logger.info(
        'SoundPad',
        `Soundpad inicializado ${client.pads.size} pads carregados.`
      );
    } catch (error) {
      await this.logger.error('SoundPad', `Erro no arquivo: ${error.message}`);
    }
  };
}

module.exports = SoundpadModule;
