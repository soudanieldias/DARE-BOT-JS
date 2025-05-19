const { ModalBuilder } = require('discord.js');

class BaseModal {
  constructor() {
    this.modal = new ModalBuilder();
  }

  setCustomId(customId) {
    this.modal.setCustomId(customId);
    return this;
  }

  setTitle(title) {
    this.modal.setTitle(title);
    return this;
  }

  addComponents(...components) {
    this.modal.addComponents(...components);
    return this;
  }

  build() {
    return this.modal;
  }
}

module.exports = BaseModal;
