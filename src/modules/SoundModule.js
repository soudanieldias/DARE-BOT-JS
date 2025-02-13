const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
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
    this.queues = new Map();
  }

  playSound = async (client, interaction, stream, connectionParams) => {
    const { guildId } = connectionParams;
    const { member } = interaction;

    let player = this.players.get(guildId);

    if (!player) {
      player = createAudioPlayer();
      this.players.set(guildId, player);
      
      player.on(AudioPlayerStatus.Idle, () => {
        this._playNextInQueue(guildId);
      });
    }
    
    let connection = this.connections.get(guildId);
    
    if (connection) {
      const currentChannel = connection.joinConfig.channelId;
      const botChannel = member.guild.channels.cache.get(currentChannel);
      console.log(botChannel.members);
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

    this._enqueue(guildId, stream);

    if (player.state.status !== AudioPlayerStatus.Playing) {
      this._playNextInQueue(guildId);
    }
  };

  _enqueue = (guildId, stream) => {
    if (!this.queues.has(guildId)) {
      this.queues.set(guildId, []);
    }

    const queue = this.queues.get(guildId);
    queue.push(stream);
  };

  _playNextInQueue = (guildId) => {
    const queue = this.queues.get(guildId);
    if (!queue || queue.length === 0) {
      return;
    }

    const stream = queue.shift();

    const player = this.players.get(guildId);
    const connection = this.connections.get(guildId);
    if (!player || !connection) {
      return;
    }

    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(0.1);

    this.resources.set(guildId, resource);

    connection.subscribe(player);
    player.play(resource);
  };

  stopSound = async (guildId) => {
    this._cleanupConnection(guildId);
  };

  changeVolume = async (guildId, volume) => {
    const resource = this.resources.get(guildId);
    if (resource) resource.volume?.setVolume(volume);
  };

  _cleanupConnection = (guildId) => {
    const player = this.players.get(guildId);

    if (player) player.stop();

    this.players.delete(guildId);
    this.connections.delete(guildId);
    this.resources.delete(guildId);
    this.queues.delete(guildId);
  };

  skip = (guildId) => {
    const player = this.players.get(guildId);
    const queue = this.queues.get(guildId);
  
    if (!player || !queue || queue.length === 0) {
      return;
    }
  
    return this._playNextInQueue(guildId);
  };
  

  monitorConnections = (client) => {
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
