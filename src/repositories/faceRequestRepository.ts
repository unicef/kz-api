import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import ProjectTranche from "../models/projectTranche";

class FaceRequestRepository {

    static findByTrancheId = async (trancheId: number) => {
        const query = `SELECT fr.* FROM face_requests AS fr WHERE fr."trancheId" = ${trancheId}`;

        const faceRequests = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceRequests;
    }

    static findById = async (requestId: number) => {
        const query = `SELECT fr."id" as "id", 
        TO_CHAR(fr."from", 'yyyy-mm') as "dateFrom", 
        TO_CHAR(fr."to", 'yyyy-mm') as "dateTo", 
        fr."typeId" as "type",
        fr."statusId" as "statusId", 
        fr."isCertify" as "isCertify",
        fr."isValid" as "isValid",
        fr."isAuthorised" as "isAuthorised",
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
    
}

export default FaceRequestRepository;