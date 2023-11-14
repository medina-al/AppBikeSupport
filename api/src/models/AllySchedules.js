const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "AllySchedules",
    {
      open_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      close_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
