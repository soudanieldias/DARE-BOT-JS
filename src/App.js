/* eslint-disable no-undef */
const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');

const {
  ActivityModule,
  AdminModule,
  ButtonLoaderModule,
  CommandLoaderModule,
  DatabaseModule,
  EmbedModule,
  InteractionModule,
  intentsList,
  OnReadyModule,
  partialsList,
  SoundpadModule,
  SoundModule,
  TicketModule,
  OnVoiceModule,
  MemeLoaderModule,
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
    this.client.adminModule = new AdminModule();
    this.client.database = new DatabaseModule(this.client);
    this.client.pads = new Collection();
    this.client.soundModule = new SoundModule();
    this.client.soundpadModule = new SoundpadModule();
    this.client.ticketModule = new TicketModule();
    this.client.embedModule = new EmbedModule();
    this.client.memeLoaderModule = new MemeLoaderModule();
  }
  
  start() {
    ActivityModule.default(this.client);
    InteractionModule(this.client, this.slashCommands);
    OnReadyModule(this.client, this.TOKEN);
    OnVoiceModule(this.client);
    CommandLoaderModule(this.client, this.slashCommands);
    ButtonLoaderModule(this.client);
    this.client.soundpadModule.start(this.client);
  }
}

module.exports = { App };
