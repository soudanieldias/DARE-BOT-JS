const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');

const {
  partialsList,
  intentsList,
  OnReady,
  LoadCommands,
  OnInteraction,
  SetActivity,
} = require('./modules/index.js');

dotenv.config();

class App {
  client = new Client({
    partials: [...partialsList],
    intents: [...intentsList],
  });

  TOKEN = process.env.TOKEN;

  slashCommands = new Collection();

  constructor() {
    OnInteraction(this.client, this.slashCommands);
    SetActivity.default(this.client);
  }
  
  start() {
    OnReady(this.client, this.TOKEN);
    LoadCommands(this.client, this.slashCommands);
  }
}

module.exports = { App };
