const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./DatabaseModule').Interaction} dbModule
 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
 */

module.exports = class EmbedModule {
  constructor() {
    this.embed = new EmbedBuilder();
    this.embed.setTitle('Título do Embed');
    this.embed.setDescription('Descrição do Embed');
  }

  setTitle(title) {
    this.embed.setTitle(title);
  }

  setDescription(description) {
    this.embed.setDescription(description);
  }

  setColor(color) {
    this.embed.setColor(color);
  }

  setThumbnail(thumbnail) {
    this.embed.setThumbnail(thumbnail);
  }

  addField(name, value, inline = false) {
    this.embed.addField(name, value, inline);
  }

  async cancel(client, interaction) {
    return await interaction.message.delete();
  }

  async generate(client, interaction) {

    const newEmbed = new EmbedBuilder()
      .setTitle('Título do Embed')
      .setDescription('Descrição do Embed')
      .setColor('#00ff00')
      .setThumbnail('https://exemplo.com/miniatura.jpg');
      
    const send = new ButtonBuilder()
    .setCustomId('embed-send')
    .setStyle(ButtonStyle.Success)
    .setLabel('Enviar')
    .setEmoji('✅');
    
    const cancel = new ButtonBuilder()
    .setCustomId('embed-cancel')
    .setStyle(ButtonStyle.Danger)
    .setLabel('Cancelar')
    .setEmoji('❌');
      
    // Emojis | ❌🚫⛔✅

    const row = new ActionRowBuilder().addComponents([ send, cancel ]);

    this.embed = newEmbed;

    return await interaction.reply({ embeds: [ newEmbed ], components: [ row ], ephemeral: true });
  }

  async send(client, interaction) {
    // const { channel } = interaction;

    if (!interaction.channel) {
      throw new Error('Canal inválido');
    }

    if (!this.embed.title) {
      throw new Error('Título do embed não definido');
    }

    return await interaction.channel.send({ embeds: [this.embed] });
  }
};
