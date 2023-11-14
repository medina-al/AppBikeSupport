const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define("Maps", {
    name: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    marker_icon: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'ACTIVO'
    },    
  },{
    timestamps: false,
  });
};
