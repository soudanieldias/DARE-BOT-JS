const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  NoSubscriberBehavior,
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
    this.volumes = new Map();
  }

  playSound = async (client, interaction, stream, connectionParams) => {
    const { guildId } = connectionParams;
    const { member } = interaction;

    let player = this.players.get(guildId);

    if (!player) {
      player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });
      this.players.set(guildId, player);
    }

    let connection = this.connections.get(guildId);

    if (connection) {
      const currentChannel = connection.joinConfig.channelId;
      const botChannel = member.guild.channels.cache.get(currentChannel);
      if (
        connection.joinConfig.channelId !== member.voice.channel.id &&
        !botChannel.members.size === 1
      ) {
        return interaction.reply(
          'O bot já está conectado a outro canal de voz.'
        );
      }
    }

    connection = joinVoiceChannel(connectionParams);
    this.connections.set(guildId, connection);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        this._cleanupConnection(guildId);
      } catch (error) {
        console.error(error);
        this._cleanupConnection(guildId);
      }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      this._cleanupConnection(guildId);
    });

    const resource = createAudioResource(stream, {
      inlineVolume: true,
      inputType: 'file',
    });

    const savedVolume = this.volumes.get(guildId) || 0.1;
    resource.volume.setVolume(savedVolume);
    this.resources.set(guildId, resource);

    player.on(AudioPlayerStatus.Idle, () => {
      this._cleanupConnection(guildId);
    });

    player.on('error', error => {
      console.error('Erro no player:', error);
      this._cleanupConnection(guildId);
    });

    await connection.subscribe(player);
    return await player.play(resource);
  };

  stopSound = async guildId => {
    this._cleanupConnection(guildId);
  };

  changeVolume = async (guildId, volume) => {
    const resource = this.resources.get(guildId);
    if (resource) {
      resource.volume?.setVolume(volume);
      this.volumes.set(guildId, volume);
    }
  };

  _cleanupConnection = guildId => {
    const player = this.players.get(guildId);

    if (player) {
      player.stop();
    }

    this.players.delete(guildId);
    this.connections.delete(guildId);
    this.resources.delete(guildId);
  };

  monitorConnections = client => {
    setInterval(() => {
      this.connections.forEach((connection, guildId) => {
        const guild = client.guilds.cache.get(guildId);
        const botMember = guild.members.cache.get(client.user.id);
        if (!botMember.voice.channel) {
          this._cleanupConnection(guildId);
        }
      });
    }, 30000);
  };
};
