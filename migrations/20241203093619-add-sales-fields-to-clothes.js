/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
// Modify 'size' column
    await queryInterface.changeColumn('clothes', 'size', {
      type: Sequelize.DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'FREE'),
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'is_sale', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('clothes', 'price', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'post_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'sale_type', {
      type: Sequelize.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sale_type');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('sale_type', JSON.stringify(value));
      },
    });
    await queryInterface.sequelize.query(`
      UPDATE clothes
      SET size = CASE
        WHEN size = '90' THEN 'S'
        WHEN size = '95' THEN 'M'
        WHEN size = '100' THEN 'L'
        WHEN size = '105' THEN 'XL'
        WHEN size = '110' THEN 'XXL'
        ELSE 'FREE'
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
// Restore 'size' column to previous state (change to original value)
    await queryInterface.changeColumn('clothes', 'size', {
      type: Sequelize.DataTypes.ENUM('90', '95', '100', '105', '110', 'Other'),
      allowNull: true,
    });
    await queryInterface.removeColumn('clothes', 'is_sale');
    await queryInterface.removeColumn('clothes', 'price');
    await queryInterface.removeColumn('clothes', 'post_name');
    await queryInterface.removeColumn('clothes', 'sale_type');
  },
};