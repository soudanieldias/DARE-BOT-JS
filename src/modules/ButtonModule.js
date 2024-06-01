const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

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
  };

  generateButtons = async (buttonsPath) => {
    const audioFiles = (await fs.readdir(`${buttonsPath}`)).filter(
      (file) => path.extname(file).toLowerCase() === '.mp3');

    const fileObjects = audioFiles.map((audio) =>
      new ButtonBuilder()
        .setCustomId(audio.slice(0, -4))
        .setLabel(audio.slice(0, -4))
        .setStyle(ButtonStyle.Primary)
    );
    return fileObjects;
  };
};
