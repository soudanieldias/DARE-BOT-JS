const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

module.exports = class SoundModule {
  player = createAudioPlayer();
  connection;
  resource;
  
  playSound = async (stream, connectionParams) => {
    this.connection = joinVoiceChannel(connectionParams);
    this.resource = createAudioResource(stream, { inlineVolume: true });
    await this.connection.subscribe(this.player);
    this.resource.volume?.setVolume(1);

    // this.player.on('stateChange', (oldState, newState) => {
    //   if (newState.status === 'idle') this.connection.destroy();
    // });

    return await this.player.play(this.resource);

  };

  stopSound = async () => {
    this.player.stop();
    this.connection.destroy();
  }

  changeVolume = async (volume) => {
    this.resource.volume?.setVolume(volume);
  }
}
