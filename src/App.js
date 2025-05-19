/* eslint-disable no-undef */
const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const LoggerModule = require('./utils/LoggerModule');

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

/**
 * Classe principal da aplicação Discord
 * @class App
 */
class App {
  /**
   * @type {Client}
   */
  client = new Client({
    partials: [...partialsList],
    intents: [...intentsList],
  });

  /**
   * @type {string}
   */
  TOKEN = process.env.TOKEN;

  /**
   * @type {Collection}
   */
  slashCommands = new Collection();

  /**
   * @type {LoggerModule}
   */
  logger = new LoggerModule();

  /**
   * Inicializa uma nova instância da aplicação
   * @throws {Error} Se o TOKEN não estiver configurado
   */
  constructor() {
    if (!this.TOKEN) {
      throw new Error('TOKEN não configurado no arquivo .env');
    }
    this.client.commands = new Collection();
  }

  /**
   * Inicializa todos os módulos necessários
   * @private
   */
  initializeModules() {
    try {
      this.client.adminModule = new AdminModule();
      this.client.database = new DatabaseModule(this.client);
      this.client.pads = new Collection();
      this.client.soundModule = new SoundModule();
      this.client.soundpadModule = new SoundpadModule();
      this.client.ticketModule = new TicketModule();
      this.client.embedModule = new EmbedModule();
      this.client.memeLoaderModule = new MemeLoaderModule();
    } catch (error) {
      this.logger.error('App', `Erro ao inicializar módulos: ${error}`);
      throw error;
    }
  }

  /**
   * Inicia a aplicação e carrega todos os módulos necessários
   * @throws {Error} Se houver erro durante a inicialização
   */
  async start() {
    try {
      this.initializeModules();
      ActivityModule.default(this.client);
      InteractionModule(this.client, this.slashCommands);
      OnReadyModule(this.client, this.TOKEN);
      OnVoiceModule(this.client);
      new CommandLoaderModule().loadCommands(this.client);
      new ButtonLoaderModule(this.client);
      this.client.soundpadModule.start(this.client);
    } catch (error) {
      await this.logger.error('App', `Erro ao iniciar a aplicação: ${error}`);
      throw error;
    }
  }
}

module.exports = { App };
