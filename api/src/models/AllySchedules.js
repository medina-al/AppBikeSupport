const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "AllySchedules",
    {
      openTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closeTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
