const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define("Users", {
    username: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    names: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lastnames: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{
    timestamps: false,
  });
};
