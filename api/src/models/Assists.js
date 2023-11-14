const { DataTypes } = require("sequelize");
//Users
module.exports = (sequelize) => {
  sequelize.define(
    "Assists",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      open_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      attention_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      close_time: {
        type: DataTypes.DATE,
        allowNull: true,
      }
      ,
      total: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      }
      ,
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: false,
    }
  );
};
