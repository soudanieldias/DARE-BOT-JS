const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises;

module.exports = class ButtonModule {
  
  sliceButtonArray = async (originalItensArray, maxItensPerRow) => {
    const allRows = [];

    const slicedResult = originalItensArray.reduce((acc, item, index) => {
      const group = Math.floor(index / maxItensPerRow);
      acc[group] = [...(acc[group] || []), item];
      return acc;
    }, []);

    await slicedResult.forEach((subArray) => {
      const actionRowBuilder = new ActionRowBuilder().addComponents(subArray);
      allRows.push(actionRowBuilder);
    });
    return allRows;
  }

  generateButtons = async () => {
    const audioFiles = await fs.readdir('./src/audios/soundpad/');
    const fileObjects = audioFiles
      .map((audio) => ( new ButtonBuilder().setCustomId(audio.slice(0, -4)).setLabel(audio.slice(0, -4)).setStyle(ButtonStyle.Primary)));
    return fileObjects;
  }
}
