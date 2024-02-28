import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

const PositionsModel = sequelize.define('postitions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'positions',
  timestamps: false
});

try {
  await PositionsModel.sync({});
  console.log("The 'PositionsModel' table has been successfully created.");
} catch (e) {
  console.log("An error occurred while creating the 'PositionsModel' table.");
  console.error(e);
};

export default PositionsModel;