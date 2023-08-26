const { DataTypes } = require("sequelize");
//List master
module.exports = (sequelize) => {
  sequelize.define(
    "ListsMaster",
    {
      global: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      firstValue: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      secondValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      thirdValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fourthValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      timestamps: false, // Deshabilitar los campos de fecha
    }
  );
};
