const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

module.exports = class SoundModule {
  player = createAudioPlayer();
  connection;
  
  playSound = async (stream, connectionParams) => {
    this.connection = joinVoiceChannel(connectionParams);
    this.resource = createAudioResource(stream, { inlineVolume: false });
    await this.connection.subscribe(this.player);
    // this.resource.volume?.setVolume(5);
    return this.player.play(this.resource);
  };

  stopSound = async () => {
    this.player.stop();
    this.connection.destroy();
  }

  changeVolume = async (volume) => {
    this.resource.volume?.setVolume(volume);
  }
}
