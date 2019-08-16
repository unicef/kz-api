import { MongoClient } from "mongodb";
import Config from "./config";

class MongoDB {
    static connection: MongoClient|null = null;

    static getMongoConnection = async (): Promise<MongoClient> => {
        if (MongoDB.connection == null) {
            const mongoUser: string = Config.get("MONGO_USER", 'user');
            const mongoPassword: string = Config.get("MONGO_PASSWORD", 'password');
            const mongoHost: string = Config.get("MONGO_HOST", 'localhost');
            const mongoPort: string = Config.get("MONGO_PORT", 27017);
            const mongoUrl: string = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort;
            const mongoConnect = await MongoClient.connect(mongoUrl);

            MongoDB.connection = mongoConnect;
            return MongoDB.connection;
        } else {
            if (MongoDB.connection.isConnected()) {
                return MongoDB.connection;
            } else {
                MongoDB.connection = null;
                return await MongoDB.getMongoConnection();
            }
        }
    }
}

export default MongoDB;