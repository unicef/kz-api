import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import ProjectTranche from "../models/projectTranche";

class FaceRequestContractRepository {
    static getNotContractRequests = async () => {
        const query = `SELECT "requestId", "contractHash" FROM request_contracts WHERE "contractAddress" IS NULL`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return faceRequests;
    }

    static setRequestContract = async (requestId: number, contractHash: string) => {
        // isset request row
        const query = `SELECT "requestId", "contractHash" FROM request_contracts WHERE "requestId"=${requestId}`;

        const faceContracts = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        if (faceContracts) {
            // update contract address
            const updateQuery = `UPDATE request_contracts SET "contractHash" = '${contractHash}' WHERE  "requestId" = ${requestId}`;
            const faceContracts = await sequelize.query(updateQuery, {
                type: QueryTypes.UPDATE
            });
        } else {
            const insertQuery = `INSERT INTO request_contracts ("requestId", "contractHash")
            VALUES (${requestId}, '${contractHash}')`;
            const faceContracts = await sequelize.query(insertQuery, {
                type: QueryTypes.INSERT
            });
        }

        return true;
    }

    static setContractProperty = async (requestId: number, column: string, value: string) => {
        const updateQuery = `UPDATE request_contracts SET "${column}" = '${value}' WHERE  "requestId" = ${requestId}`;
        const faceContracts = await sequelize.query(updateQuery, {
            type: QueryTypes.UPDATE
        });
        return faceContracts;
    }
}

export default FaceRequestContractRepository;