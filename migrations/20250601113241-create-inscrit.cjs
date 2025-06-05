'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Inscrits', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discordId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      inscriptionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Inscriptions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Inscrits');
  }
};
