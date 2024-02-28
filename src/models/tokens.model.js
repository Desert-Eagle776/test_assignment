import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

const TokensModel = sequelize.define('tokens', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isValid: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'tokens',
  timestamps: false
});

try {
  await TokensModel.sync({});
  console.log("The 'TokensModel' table has been successfully created.");
} catch (e) {
  console.log("An error occurred while creating the 'TokensModel' table.");
  console.error(e);
};

export default TokensModel;