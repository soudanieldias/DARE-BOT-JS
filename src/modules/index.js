const { partialsList, intentsList } = require('./ClientConfigModule.js');
const ActivityModule = require('./ActivityModule.js');
const AdminModule = require('./AdminModule.js');
const ButtonLoaderModule = require('./ButtonLoaderModule.js');
const ButtonModule = require('./ButtonModule.js');
const CommandLoaderModule = require('./CommandLoaderModule.js');
const DatabaseModule = require('./DatabaseModule.js');
const InteractionModule = require('./InteractionModule.js');
const LoggerModule = require('./LoggerModule.js');
const OnReadyModule = require('./OnReadyModule.js');
const SoundModule = require('./SoundModule.js');
const SoundpadModule = require('./SoundpadModule.js');
const TicketModule = require('./TicketModule.js');

module.exports = {
  ActivityModule,
  AdminModule,
  ButtonLoaderModule,
  ButtonModule,
  CommandLoaderModule,
  DatabaseModule,
  intentsList,
  InteractionModule,
  LoggerModule,
  OnReadyModule,
  partialsList,
  SoundModule,
  SoundpadModule,
  TicketModule,
};
