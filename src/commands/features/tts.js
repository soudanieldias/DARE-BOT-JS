const { AudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// const discordTTS = require('discord-tts');
const axios = require('axios');
const { Readable } = require('stream');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Envia uma mensagem de Texto para voz com o DARE BOT')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption(message => (
      message.setName('message')
      .setDescription('Mensagem que será falada no canal de Voz')
      .setRequired(true)
    )),
  category: 'features',
  /**
  *
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').ChatInputCommandInteraction} interaction
  */
  execute: async (_client, interaction) => {
    let player = new AudioPlayer();

    try {
      const member = interaction.guild?.members.cache.get(interaction.member.user.id);
      const textMessage = interaction.options.get('message')?.value;
      const channelId = member.voice.channelId;
      const guildId = interaction.guildId;

      if (!channelId) return interaction.reply('Você não está conectado a um canal de voz.');

      // const ttsStream = discordTTS.getVoiceStream(`${textMessage}`, { lang: 'pt' });
      const audioBuffer = await callTTSAPI(textMessage);

      if (!audioBuffer || audioBuffer.length === 0) {
        return interaction.reply('Erro ao gerar áudio.');
      }

      const audioStream = Readable.from(audioBuffer);

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      await connection.subscribe(player);
      await player.play(createAudioResource(audioStream));

      return interaction.reply({ content: 'Mensagem enviada para o canal de voz.', ephemeral: true });
    } catch (error) {
      console.error('[SERVER INFO]', error);
      return interaction.reply('Ocorreu um erro ao tentar enviar a mensagem.');
    }
  }
};

async function callTTSAPI(text) {
  const groupId = process.env.GROUP_ID;
  const apiKey = process.env.API_KEY;
  const url = `https://api.minimaxi.chat/v1/t2a_v2?GroupId=${groupId}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body = {
    model: 'speech-01-hd',
    text: text,
    stream: true,
    language_boost: 'Portuguese',
    voice_setting: {
      voice_id: 'moss_audio_80807393-e42b-11ef-8246-a2a69b77f2c2',
      speed: 1.0,
      vol: 1.0,
      pitch: 0
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: 'mp3',
      channel: 1
    }
  };

  try {
    const response = await axios.post(url, body, { headers, responseType: 'stream' });
    return await streamToBuffer(response.data);
  } catch (error) {
    console.error('Erro ao chamar a API TTS:', error);
    throw new Error('Erro ao gerar áudio.');
  }
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let lastAudioData = '';
    const chunks = [];

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => {
      try {
        const dataStr = Buffer.concat(chunks).toString('utf8');
        const jsonObjects = dataStr.split('\n').filter(line => line.startsWith('data: '));

        jsonObjects.forEach(jsonStr => {
          try {
            const jsonData = JSON.parse(jsonStr.replace('data: ', ''));
            if (jsonData.data && jsonData.data.audio) {
              lastAudioData = jsonData.data.audio;
            }
          } catch (parseErr) {
            console.warn('Erro ao analisar JSON:', parseErr);
          }
        });

        if (!lastAudioData) {
          console.warn('Dados de áudio estão vazios.');
          return reject(new Error('Dados de áudio vazios.'));
        }

        resolve(Buffer.from(lastAudioData, 'hex'));
      } catch (err) {
        reject(err);
      }
    });
  });
}
