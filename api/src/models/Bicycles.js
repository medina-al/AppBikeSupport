const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "Bicycles",
    {
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      line: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wheel_size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wheels: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      front_groupser: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      back_groupset: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brakes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: false,
    }
  );
};
