const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "AllyUsers",
    {
      user_owner: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      timestamps: false,
    }
  );
};
