const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com Pong!'),
  category: 'features',

	async execute(client, interaction) {
    if(interaction.isRepliable()) {
			return interaction.reply({ content: `Pong!\n${client.ws.ping}ms!` });
		}
	},
};
