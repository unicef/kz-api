import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import ProjectTranche from "../models/projectTranche";
import FaceRequest from "../models/faceRequest";
import Project from "../models/project";

class FaceRequestRepository {

    static findByTrancheId = async (trancheId: number) => {
        const query = `SELECT 
            fr."id", 
            TO_CHAR(fr."from", 'yyyy-mm-dd') as "dateFrom", 
            TO_CHAR(fr."to", 'yyyy-mm-dd') as "dateTo", 
            fr."typeId" as "type",
            fr."statusId" as "statusId" 
            FROM face_requests AS fr 
            WHERE fr."trancheId" = ${trancheId}`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceRequests;
    }

    static findById = async (requestId: number) => {
        const query = `SELECT fr."id" as "id", 
        TO_CHAR(fr."from", 'yyyy-mm-dd') as "dateFrom", 
        TO_CHAR(fr."to", 'yyyy-mm-dd') as "dateTo", 
        fr."typeId" as "type",
        fr."statusId" as "statusId", 
        fr."isCertify" as "isCertify",
        fr."isValid" as "isValid",
        fr."isAuthorised" as "isAuthorised",
        fr."isFreeze" as "isFreeze",
        TO_CHAR(fr."approvedAt", 'yyyy-mm-dd') as "approvedAt",
        TO_CHAR(fr."successedAt", 'yyyy-mm-dd') as "successedAt",
        TO_CHAR(fr."createdAt", 'yyyy-mm-dd') as "createdAt",
        p."partnerId" as "partnerId",
        pt."num" as "num" 
        FROM face_requests fr 
        LEFT JOIN project_tranches pt ON pt."id" = fr."trancheId" 
        LEFT JOIN projects p ON pt."projectId" = p."id"
        WHERE fr."id" = ${requestId}`;

        const faceRequest = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceRequest;
    }

    static getSendedAmount = async (projectId: number) => {
        const query = `SELECT
        SUM(ra."amountF") as "sendedAmount"
        FROM request_activities ra
        LEFT JOIN face_requests fr ON fr."id"=ra."requestId"
        LEFT JOIN project_tranches pt ON pt."id"=fr."trancheId"
        WHERE pt."projectId"=${projectId} AND fr."statusId"='${FaceRequest.SUCCESS_STATUS_KEY}'`

        const sendedAmount = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (sendedAmount.sendedAmount === null) {
            return 0;
        }
        return parseInt(sendedAmount.sendedAmount);
    }

    static getTransactionAmountByReqId = async (requestId: number) => {
        const query = `SELECT
        SUM(ra."amountF") as "transactionAmount"
        FROM request_activities ra
        WHERE ra."requestId"='${requestId}'`

        const sendedAmount = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (sendedAmount.transactionAmount === null) {
            return 0;
        }
        return parseInt(sendedAmount.transactionAmount);
    }

    static getActiveByPartnerId = async (partnerId: number) => {
        const query = `SELECT fr.* 
            FROM face_requests fr
            LEFT JOIN project_tranches pt ON pt."id" = fr."trancheId"
            LEFT JOIN projects p ON p."id" = pt."projectId"
            WHERE p."statusId" = '${Project.IN_PROGRESS_STATUS_ID}'
            AND p."partnerId" = ${partnerId}
            AND pt."status" = '${ProjectTranche.IN_PROGRESS_STATUS_KEY}'
            AND (fr."statusId" != '${FaceRequest.SUCCESS_STATUS_KEY}' 
                OR fr."statusId" != '${FaceRequest.REJECT_STATUS_KEY}')`;
        
        const exec = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return  exec;
    }

    static getActiveChainByUserId = async (userId: number) => {
        const query = `SELECT reqcc.* 
            FROM request_confirm_chains reqcc
            LEFT JOIN face_requests fr ON fr."id"=reqcc."requestId"
            LEFT JOIN project_tranches pt ON pt."id"=fr."trancheId"
            WHERE pt."status" = '${ProjectTranche.IN_PROGRESS_STATUS_KEY}'
                AND fr.statusId!='${FaceRequest.SUCCESS_STATUS_KEY}'
                AND ((reqcc."confirmBy"=${userId} AND reqcc."confirmAt" IS NULL)
                    OR (reqcc."validateBy"=${userId} AND reqcc."validateAt" IS NULL)
                    OR (reqcc."certifyBy"=${userId} AND reqcc."certifyAt" IS NULL)
                    OR (reqcc."approveBy"=${userId} AND reqcc."approveAt" IS NULL)
                    OR (reqcc."verifyBy"=${userId} AND reqcc."verifyAt" IS NULL))`;

        const exec = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return exec;
    } 
}

export default FaceRequestRepository;