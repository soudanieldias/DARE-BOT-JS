const { partialsList, intentsList } = require('./clientConfig.js');
const ButtonModule = require('./ButtonModule.js');
const DBModule = require('./DBModule.js');
const LoadButtons = require('./LoadButtons.js');
const LoadCommands = require('./LoadCommands.js');
const Logger = require('./Logger.js');
const OnReady = require('./OnReady.js');
const OnInteraction = require('./OnInteraction.js');
const SetActivity = require('./SetActivity.js');
const SoundModule = require('./SoundModule.js');
const TicketModule = require('./TicketModule.js');

module.exports = {
  ButtonModule,
  DBModule,
  intentsList,
  LoadButtons,
  LoadCommands,
  Logger,
  OnReady,
  OnInteraction,
  partialsList,
  SetActivity,
  SoundModule,
  TicketModule,
};
