const { ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = class SetActivity {
  static default(client) {
    client.once('ready', () => {
      client.user.setActivity(
        `${config['presence-message']}`,
        {
          type: ActivityType.Playing
        }
      );
    });
  }
}
