/* eslint-disable no-undef */
const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');

const {
  DBModule,
  partialsList,
  intentsList,
  OnReady,
  LoadButtons,
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
  buttons = new Collection();

  constructor() {
    SetActivity.default(this.client);
    OnInteraction(this.client, this.slashCommands);
    this.client.database = new DBModule(this.client);
  }
  
  start() {
    OnReady(this.client, this.TOKEN);
    LoadCommands(this.client, this.slashCommands);
    LoadButtons(this.client, this.buttons);
  }
}

module.exports = { App };
