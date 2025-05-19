const { EmbedBuilder } = require('discord.js');

class BaseEmbed {
  constructor() {
    this.embed = new EmbedBuilder();
  }

  setTitle(title) {
    this.embed.setTitle(title);
    return this;
  }

  setDescription(description) {
    this.embed.setDescription(description);
    return this;
  }

  setColor(color) {
    this.embed.setColor(color);
    return this;
  }

  setAuthor(options) {
    this.embed.setAuthor(options);
    return this;
  }

  setFooter(options) {
    this.embed.setFooter(options);
    return this;
  }

  setThumbnail(url) {
    this.embed.setThumbnail(url);
    return this;
  }

  addFields(...fields) {
    this.embed.addFields(...fields);
    return this;
  }

  build() {
    return this.embed;
  }
}

module.exports = BaseEmbed;
