import { MongoClient } from "mongodb";
import Config from "../services/config";
import MongoDB from "../services/mongodb";

class HistoryRepository {
    
    static COLLECTION = 'projects';

    static create = async (data: HistoryData) => {
        const mongoDatabase: string = Config.get("MONGO_DATABASE", 'db');
        const mongoConnect: MongoClient = await MongoDB.getMongoConnection();

        const db = mongoConnect.db(mongoDatabase);

        const collection = db.collection(HistoryRepository.COLLECTION);

        const insert = await collection.insertOne(data);

        return insert;
    }

    static getList = async (projectId: number, limit: number) => {
        const mongoDatabase: string = Config.get("MONGO_DATABASE", 'db');
        const mongoConnect: MongoClient = await MongoDB.getMongoConnection();

        const db = mongoConnect.db(mongoDatabase);
        const collection = db.collection(HistoryRepository.COLLECTION);

        const history = collection.find({"projectId" : projectId});
        return history.toArray();
    }

    static deleteByProjectId = async (projectId: number) => {
        const mongoDatabase: string = Config.get("MONGO_DATABASE", 'db');
        const mongoConnect: MongoClient = await MongoDB.getMongoConnection();

        const db = mongoConnect.db(mongoDatabase);
        const collection = db.collection(HistoryRepository.COLLECTION);

        const delFlag = collection.deleteMany({ "projectId" : projectId });
        return delFlag;
    }
}

interface HistoryData {
    userId: number,
    projectId: number,
    event: object
}

export default HistoryRepository;