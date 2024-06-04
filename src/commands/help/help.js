const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lista os comandos disponíveis no BOT')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	category: 'help',
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 * @param {Array<{ data: SlashCommandBuilder, execute: Function }>} slashCommands
   */
	execute: async (client, interaction, slashCommands) => {
		if (!client.user) return;
		
		const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Comandos Disponíveis:');

		slashCommands.forEach((cmd) => {
			embed.addFields({
				name: `Name: **${cmd.data.name}**`,
				value: `Description: ***${cmd.data.description}***\n`,
			});
		});

		return await interaction.reply({embeds: [embed]});
  }
};
