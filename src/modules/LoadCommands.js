/* eslint-disable no-undef */
const { globSync } = require('glob');
const { REST, Routes } = require('discord.js');

module.exports = async (client, slashCommands) => {
  
  try {
    console.log('[Comandos] Carregando módulo de Comandos.');
    const commandFiles = globSync('./src/commands/**/*.js');
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    const restCommands = [];

    for (const file of commandFiles) {
      const command = require(`../../${file}`);
      const { name, description } = command.data;
      if (!name || !description) return;

      const cmd = client.application?.commands.cache.find((c) => (c.name === command.data.name));

      if (cmd) return console.error(`[Erro] Já existe um comando carregado com o mesmo nome, nome: ${name}`);

      delete require.cache[require.resolve(`../../${file}`)];

      slashCommands.set(command.data.name, command);
      restCommands.push(command.data);
    }

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: restCommands,
      }
    );

    console.log('[Comandos] Comandos carregados com Sucesso.');

  } catch (error) {
    console.error(`[Comandos] Ocorreu um erro ao carregar os comandos! \n${error}`);
  }
}
