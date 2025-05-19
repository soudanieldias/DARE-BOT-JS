const colors = require('colors');

class LoggerModule {
  async info(module, msg) {
    console.log(colors.green(`[INFO/${module}]`), msg);
  }

  async error(module, msg) {
    console.error(colors.red(`[ERROR/${module}]`), msg);
  }

  async warn(module, msg) {
    console.warn(colors.yellow(`[WARN/${module}]`), msg);
  }
}

module.exports = LoggerModule;
