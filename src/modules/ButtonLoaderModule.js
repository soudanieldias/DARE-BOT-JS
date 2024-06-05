/* eslint-disable no-undef */
const { globSync } = require('glob');

module.exports = async (client) => {
  try {
    console.log('[Botões] Carregando módulo de Botões.');
    const buttonFiles = globSync('./src/buttons/**/*.js');
    
    for (const file of buttonFiles) {
      const button = require(`../../${file}`);
      const { data } = button;
      if (!data.customId) return;

      const btn = client.buttons?.get(data.customId);
      if (btn) {
        console.error(`[Erro] Já existe um botão carregado com o mesmo ID: ${data.customId}`);
        continue;
      }

      delete require.cache[require.resolve(`../../${file}`)];

      client.buttons.set(data.customId, button);
    }

    console.log('[Botões] Botões carregados com Sucesso.');
  } catch (error) {
    console.error(`[${__filename}] Erro no arquivo: ${error}`);
  }
}
