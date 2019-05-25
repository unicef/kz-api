import { Sequelize } from "sequelize";
import config from "../config/config";

/**
 * Connect to PostgreSQL database
 */
const sequelize = new Sequelize(
    config.db.database, 
    config.db.user,
    config.db.password,
    {
        dialect: 'postgres',
        host: config.db.host
    }
    );

sequelize.authenticate();


export default sequelize;