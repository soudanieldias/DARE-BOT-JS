const { partialsList, intentsList } = require('./clientConfig.js');
const ButtonModule = require('./ButtonModule.js');
const LoadCommands = require('./LoadCommands.js');
const OnReady = require('./OnReady.js');
const OnInteraction = require('./OnInteraction.js');
const SetActivity = require('./SetActivity.js');
const SoundModule = require('./SoundModule.js');

module.exports = {
  ButtonModule,
  intentsList,
  LoadCommands,
  OnReady,
  OnInteraction,
  partialsList,
  SetActivity,
  SoundModule,
};
