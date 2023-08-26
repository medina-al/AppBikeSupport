const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define("Users", {
    userName: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balanceLiquid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    balanceFrozen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isEventOrganizer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isRetailer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },{
    timestamps: false, // Deshabilitar los campos de fecha
  });
};
