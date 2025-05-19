const { partialsList, intentsList } = require('./ClientConfigModule.js');
const ActivityModule = require('./ActivityModule.js');
const AdminModule = require('./AdminModule.js');
const ButtonLoaderModule = require('./ButtonLoaderModule.js');
const ButtonModule = require('./ButtonModule.js');
const CommandLoaderModule = require('./CommandLoaderModule.js');
const DatabaseModule = require('./DatabaseModule.js');
const EmbedModule = require('./EmbedModule.js');
const InteractionModule = require('./InteractionModule.js');
const LoggerModule = require('./LoggerModule.js');
const MemeLoaderModule = require('./MemeLoaderModule.js');
const OnReadyModule = require('./OnReadyModule.js');
const OnVoiceModule = require('./OnVoiceModule.js');
const SoundModule = require('./SoundModule.js');
const SoundpadModule = require('./SoundpadModule.js');
const TicketModule = require('./TicketModule/index.js');

module.exports = {
  ActivityModule,
  AdminModule,
  ButtonLoaderModule,
  ButtonModule,
  CommandLoaderModule,
  DatabaseModule,
  EmbedModule,
  intentsList,
  InteractionModule,
  LoggerModule,
  MemeLoaderModule,
  OnReadyModule,
  OnVoiceModule,
  partialsList,
  SoundModule,
  SoundpadModule,
  TicketModule,
};
