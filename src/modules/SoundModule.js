const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require('@discordjs/voice');

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

  playSound = async (client, interaction, stream, connectionParams) => {
    const { guildId } = connectionParams;
    const { member } = interaction;

    let player = this.players.get(guildId);

    if (!player) {
      player = createAudioPlayer();
      this.players.set(guildId, player);
    }

    let connection = this.connections.get(guildId);

    if (connection) {
      if (connection.joinConfig.channelId !== member.voice.channel.id) {
        return interaction.reply(
          'O bot já está conectado a outro canal de voz.'
        );
      }
    } else {
      connection = joinVoiceChannel(connectionParams);
      this.connections.set(guildId, connection);
      const playing = interaction.pad ? interaction.pad.name : stream;
      await interaction.reply({
        content: `Tocando som ${playing}`,
        ephemeral: true,
      });
    }

    const resource = createAudioResource(stream, { inlineVolume: true });
    this.resources.set(guildId, resource);

    await connection.subscribe(player);
    resource.volume?.setVolume(0.1);

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
  };

  changeVolume = async (guildId, volume) => {
    const resource = this.resources.get(guildId);
    if (resource) resource.volume?.setVolume(volume);
  };
};
