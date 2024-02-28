import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";
import PositionsModel from "./positions.model.js";

const UsersModel = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  registration_timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'users',
  timestamps: false
});

UsersModel.belongsTo(PositionsModel, { foreignKey: "position_id", as: "position" });

try {
  await UsersModel.sync({});
  console.log("The 'UsersModel' table has been successfully created.");
} catch (e) {
  console.log("An error occurred while creating the 'UsersModel' table.");
  console.error(e);
};

export default UsersModel;