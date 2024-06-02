const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 */

module.exports = class SoundModule {
  constructor() {
    this.players = new Map();
    this.connections = new Map();
    this.resources = new Map();
  }

  playSound = async (stream, connectionParams) => {
    const { guildId } = connectionParams;

    let player = this.players.get(guildId);

    if (!player) {
      player = createAudioPlayer();
      this.players.set(guildId, player);
    }

    let connection = this.connections.get(guildId);

    if (!connection) {
      connection = joinVoiceChannel(connectionParams);
      this.connections.set(guildId, connection);
    }

    const resource = createAudioResource(stream, { inlineVolume: true });
    this.resources.set(guildId, resource);

    await connection.subscribe(player);
    resource.volume?.setVolume(0.1);

    // player.on('stateChange', (oldState, newState) => {
      // if (newState.status === 'idle') {
        // connection.destroy();
        // this.connections.delete(guildId);
        // this.players.delete(guildId);
        // this.resources.delete(guildId);
      // }
    // });

    return await player.play(resource);
  };

  stopSound = async (guildId) => {
    const player = this.players.get(guildId);
    const connection = this.connections.get(guildId);

    if (player) player.stop();
    if (connection) connection.destroy();

    this.players.delete(guildId);
    this.connections.delete(guildId);
    this.resources.delete(guildId);
  }

  changeVolume = async (guildId, volume) => {
    const resource = this.resources.get(guildId);
    if (resource) resource.volume?.setVolume(volume);
  }
}
