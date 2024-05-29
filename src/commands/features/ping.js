const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com Pong!'),
		category: 'features',
		/**
		 *
		 * @param {import('discord.js').Client} client
		 * @param {import('discord.js').ChatInputCommandInteraction} interaction
		 */
	async execute(client, interaction) {
    if(interaction.isRepliable()) {
			return interaction.reply({ content: `Pong!\n${client.ws.ping}ms!` });
		}
	},
};
