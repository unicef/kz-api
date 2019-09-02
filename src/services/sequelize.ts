import { Sequelize } from "sequelize";
import Config from "./config";

/**
 * Connect to PostgreSQL database
 */
const dbHost = Config.get("DB_HOST", 'localhost');
const dbUser = Config.get("DB_USER", 'user');
const dbPassword = Config.get("DB_PASSWORD", 'user');
const dbName = Config.get("DB_DATABASE", 'database');
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {dialect: 'postgres', host: dbHost});

sequelize.authenticate();


export default sequelize;