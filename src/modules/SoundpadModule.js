/* eslint-disable no-undef */
const { globSync } = require('glob');
const ButtonModule = require('./ButtonModule.js');
const path = require('path');

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

  start = async (client) => {
    try {
      console.log('[SoundPad] Inicializando Soundpad.');
      const audioFiles = globSync('./src/audios/**/*.mp3');

      audioFiles.map((file) => {
        const fileName = file.split('/').pop().replace('.mp3', '');

        if (!client.pads.has(fileName)) {
          client.pads.set(fileName, {
            name: fileName,
            path: file,
          });
        } else {
          console.log(
            `Arquivo de nome: "${fileName}" já existe na lista de áudios.\nIgnorando-o!\nPath: "${file}"`
          );
        }
      });
      console.log(
        `[SoundPad] Soundpad inicializado ${client.pads.size} pads carregados.`
      );
    } catch (error) {
      console.error(`[${path.basename(__filename)}] Erro no arquivo: ${error}`);
    }
  };
}

module.exports = SoundpadModule;
