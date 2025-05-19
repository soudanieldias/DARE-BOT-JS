const Logger = require('./Logger');

class Permission {
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Verifica se um membro tem a role de admin
   * @param {GuildMember} member - O membro a ser verificado
   * @returns {boolean} - true se tiver permissão, false caso contrário
   */
  static hasAdminRole(member) {
    try {
      if (!member) return false;

      // Verifica se é o dono do servidor
      if (member.id === member.guild.ownerId) return true;

      // Verifica se tem a role de admin
      const adminRole = member.guild.roles.cache.find(
        role =>
          role.name.toLowerCase() === 'admin' ||
          role.name.toLowerCase() === 'administrador'
      );

      return member.roles.cache.has(adminRole?.id);
    } catch (error) {
      const logger = new Logger();
      logger.error(
        'PermissionUtils',
        `Erro ao verificar permissão de admin: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Verifica se um membro tem permissão para gerenciar tickets
   * @param {GuildMember} member - O membro a ser verificado
   * @returns {boolean} - true se tiver permissão, false caso contrário
   */
  static hasTicketPermission(member) {
    try {
      if (!member) return false;

      // Verifica se é admin
      if (this.hasAdminRole(member)) return true;

      // Verifica se tem a role de staff
      const staffRole = member.guild.roles.cache.find(
        role =>
          role.name.toLowerCase() === 'staff' ||
          role.name.toLowerCase() === 'moderador'
      );

      return member.roles.cache.has(staffRole?.id);
    } catch (error) {
      const logger = new Logger();
      logger.error(
        'PermissionUtils',
        `Erro ao verificar permissão de ticket: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Verifica se um membro tem permissão para usar comandos de moderação
   * @param {GuildMember} member - O membro a ser verificado
   * @returns {boolean} - true se tiver permissão, false caso contrário
   */
  static hasModPermission(member) {
    try {
      if (!member) return false;

      // Verifica se é admin
      if (this.hasAdminRole(member)) return true;

      // Verifica se tem a role de mod
      const modRole = member.guild.roles.cache.find(
        role =>
          role.name.toLowerCase() === 'mod' ||
          role.name.toLowerCase() === 'moderador'
      );

      return member.roles.cache.has(modRole?.id);
    } catch (error) {
      const logger = new Logger();
      logger.error(
        'PermissionUtils',
        `Erro ao verificar permissão de moderação: ${error.message}`
      );
      return false;
    }
  }
}

module.exports = Permission;
