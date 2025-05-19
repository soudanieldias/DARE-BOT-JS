/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').VoiceState} oldMember
 * @param {import('discord.js').VoiceState} newMember
 */
module.exports = async client => {
  client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (newMember.channelId === '000') {
      //'1178350850884776008') {
      // const memberData = await newMember.guild.members.fetch(`${newMember.id}`);
      // const textMessage = `Olá, ${memberData.user.username}. Bem-vindo ao canal de suporte da ${newMember.guild.name}`;
      // const ttsStream = discordTTS.getVoiceStream(`${textMessage}`, { lang: 'pt' });
      const ttsStream = './src/audios/atendimento/botchamada.mp3';
      const connectionParams = {
        channelId: newMember.channelId,
        guildId: newMember.guild.id,
        adapterCreator: newMember.guild.voiceAdapterCreator,
      };

      await client.soundModule.playSound(
        client,
        newMember,
        ttsStream,
        connectionParams
      );
    }
  });
};
