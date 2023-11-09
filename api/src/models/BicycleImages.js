const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "BicycleImages",
    {
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      default: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      timestamps: false,
    }
  );
};
