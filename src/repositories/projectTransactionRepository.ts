import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class ProjectTransactionRepository {
    static writeData = async (projectId: number, trancheId: number, faceRequestId: number, transactionHash: string) => {
        const query = `INSERT INTO projects_transactions ("projectId", "trancheId", "requestId", "transactionHash") VALUES (${projectId}, ${trancheId}, ${faceRequestId}, '${transactionHash}')`;

        const insert = await sequelize.query(query, {
            type: QueryTypes.INSERT
        });

        return insert;
    }
}

export default ProjectTransactionRepository;