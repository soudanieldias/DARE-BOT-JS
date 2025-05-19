const colors = require('colors');
require('dotenv').config();

class Logger {
  constructor() {
    this.isDebug = process.env.DEBUG === 'true';
    this.devId = process.env.DEV_ID;
  }

  async info(module, msg) {
    if (this.isDebug) {
      console.log(colors.green(`[INFO/${module}]`), msg);
    }
  }

  async error(module, msg) {
    console.error(colors.red(`[ERROR/${module}]`), msg);
  }

  async warn(module, msg) {
    if (this.isDebug) {
      console.warn(colors.yellow(`[WARN/${module}]`), msg);
    }
  }

  async debug(module, msg) {
    if (this.isDebug) {
      console.log(colors.blue(`[DEBUG/${module}]`), msg);
    }
  }

  async debugToDev(client, module, msg) {
    if (!this.devId) {
      console.warn(
        colors.yellow('[WARN/Logger] DEV_ID não configurado no .env')
      );
      return;
    }

    try {
      const dev = await client.users.fetch(this.devId);
      if (!dev) {
        console.warn(
          colors.yellow('[WARN/Logger] Desenvolvedor não encontrado')
        );
        return;
      }

      const embed = {
        color: 0x0099ff,
        title: `Debug - ${module}`,
        description: msg,
        timestamp: new Date(),
        footer: {
          text: 'Debug Message',
        },
      };

      await dev.send({ embeds: [embed] });
    } catch (error) {
      console.error(
        colors.red('[ERROR/Logger] Erro ao enviar mensagem de debug:'),
        error
      );
    }
  }
}

module.exports = Logger;
