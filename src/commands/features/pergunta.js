const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

/* global process */

function splitText(text, maxLength = 1024) {
  if (text.length <= maxLength) return [text];

  const parts = [];
  let currentPart = '';

  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (currentPart.length + paragraph.length + 1 <= maxLength) {
      currentPart += (currentPart ? '\n' : '') + paragraph;
    } else {
      if (currentPart) parts.push(currentPart);
      currentPart = paragraph;
    }
  }

  if (currentPart) parts.push(currentPart);

  return parts
    .map((part) => {
      if (part.length <= maxLength) return part;

      const words = part.split(' ');
      const result = [];
      let current = '';

      for (const word of words) {
        if (current.length + word.length + 1 <= maxLength) {
          current += (current ? ' ' : '') + word;
        } else {
          if (current) result.push(current);
          current = word;
        }
      }

      if (current) result.push(current);
      return result;
    })
    .flat();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pergunta')
    .setDescription('Faz uma pergunta para o ChatGPT')
    .addStringOption((option) =>
      option.setName('ask').setDescription('Sua pergunta').setRequired(true)
    ),
  category: 'features',
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const chatInput = interaction.options.getString('ask');
      const username = interaction.user.username;
      const userAvatar = interaction.user.displayAvatarURL();

      const perguntaEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🤖 ChatGPT')
        .setAuthor({
          name: username,
          iconURL: userAvatar,
        })
        .setTimestamp()
        .setFooter({
          text: `${client.user.username} - Sistema de IA`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields({
          name: '❓ Pergunta',
          value: chatInput,
        });

      await interaction.deferReply();

      if (!process.env.CHATGPT_URL) {
        throw new Error('URL da API não configurada');
      }

      const response = await axios.post(
        process.env.CHATGPT_URL,
        { chatInput },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Group-ID': process.env.GROUP_ID,
          },
        }
      );

      if (!response.data || !response.data.output) {
        throw new Error('Resposta inválida da API');
      }

      const respostaPartes = splitText(response.data.output);
      const embeds = [perguntaEmbed];

      respostaPartes.forEach((parte, index) => {
        const respostaEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle(
            index === 0 ? '✅ Resposta' : `✅ Resposta (Parte ${index + 1})`
          )
          .setAuthor({
            name: username,
            iconURL: userAvatar,
          })
          .setTimestamp()
          .setFooter({
            text: `${client.user.username} - Sistema de IA`,
            iconURL: client.user.displayAvatarURL(),
          })
          .addFields({
            name: '💭 Resposta',
            value: parte,
          });

        embeds.push(respostaEmbed);
      });

      await interaction.editReply({ embeds });
    } catch (error) {
      console.error('[SERVER INFO] Erro no comando pergunta:', error);
      return interaction.editReply({
        content:
          '❌ Ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        ephemeral: true,
      });
    }
  },
};
