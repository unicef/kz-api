import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import ProjectTranche from "../models/projectTranche";

class FaceRequestContractRepository {
    static findByRequestId = async (requestId: number) => {
        const query = `SELECT rc.* FROM request_contracts rc WHERE rc."requestId" = ${requestId} LIMIT 1`;

        const faceRequest = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceRequest;
    }

    static getNotContractRequests = async () => {
        const query = `SELECT "requestId", "contractHash" FROM request_contracts WHERE "contractAddress" IS NULL`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return faceRequests;
    }

    static getNotValidRequests = async () => {
        const query = `SELECT "requestId", "validateHash" FROM request_contracts WHERE "validateHash" IS NOT NULL AND "validateReceipt" IS NULL`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return faceRequests;
    }

    static getNotCertiriedRequests = async () => {
        const query = `SELECT "requestId", "certifyHash" FROM request_contracts WHERE "certifyHash" IS NOT NULL AND "certifyReceipt" IS NULL`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return faceRequests;
    }

    static getNotApprovedRequests = async () => {
        const query = `SELECT "requestId", "approveHash" FROM request_contracts WHERE "approveHash" IS NOT NULL AND "approveReceipt" IS NULL`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return faceRequests;
    }

    static getNotVerifiedRequests = async () => {
        const query = `SELECT "requestId", "verifyHash" FROM request_contracts WHERE "verifyHash" IS NOT NULL AND "verifyReceipt" IS NULL`;

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
            const updateQuery = `UPDATE request_contracts 
                SET "contractHash" = '${contractHash}', 
                "contractAddress" = null,
                "validateHash" = null,
                "validateReceipt" = null,
                "certifyHash" = null,
                "certifyReceipt" = null,
                "approveHash" = null,
                "approveReceipt" = null
                WHERE  "requestId" = ${requestId}`;
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