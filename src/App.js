/* eslint-disable no-undef */
const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');

const {
  ActivityModule,
  ButtonLoaderModule,
  CommandLoaderModule,
  DatabaseModule,
  InteractionModule,
  intentsList,
  OnReadyModule,
  partialsList,
  SoundpadModule,
  SoundModule,
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
    ActivityModule.default(this.client);
    InteractionModule(this.client, this.slashCommands);
    this.client.database = new DatabaseModule(this.client);
    this.client.soundpadModule = new SoundpadModule();
    this.client.pads = new Collection();
    this.client.soundModule = new SoundModule();
  }
  
  start() {
    OnReadyModule(this.client, this.TOKEN);
    CommandLoaderModule(this.client, this.slashCommands);
    ButtonLoaderModule(this.client);
    this.client.soundpadModule.start(this.client);
  }
}

module.exports = { App };
