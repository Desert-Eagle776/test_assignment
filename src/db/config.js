import { Sequelize } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
  }
);

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (e) {
  console.error('Unable to connect to the database:', e);
};

export default sequelize;