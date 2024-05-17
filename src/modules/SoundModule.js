const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

module.exports = class SoundModule {
  player = createAudioPlayer();
  
  playSound = async (streamSource, connectionParams) => {
    

    const connection = joinVoiceChannel(connectionParams);

    const resource = createAudioResource(streamSource);

    connection.subscribe(this.player);

    resource.volume?.setVolume(100);

    return this.player.play(resource);
  };
}