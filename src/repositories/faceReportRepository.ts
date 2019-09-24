import { QueryTypes } from "sequelize";
import sequelize from "../services/sequelize";

class FaceReportRepository {

    static findByTrancheId = async (trancheId: number) => {
        const query = `SELECT fr."id", TO_CHAR(fr."from", 'yyyy-mm-dd') as "dateFrom", TO_CHAR(fr."to", 'yyyy-mm-dd') as "dateTo", fr."typeId" as "type",
        fr."statusId" as "statusId" FROM face_reports AS fr WHERE fr."trancheId" = ${trancheId}`;

        const faceReports = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceReports;
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
        TO_CHAR(fr."approvedAt", 'yyyy-mm-dd') as "approvedAt",
        TO_CHAR(fr."successedAt", 'yyyy-mm-dd') as "successedAt",
        TO_CHAR(fr."createdAt", 'yyyy-mm-dd') as "createdAt",
        fr."analyticalDocId" as "analyticalDocId",
        fr."financialDocId" as "financialDocId",
        fr."justificationDocId" as "justificationDocId",
        p."partnerId" as "partnerId",
        pt."num" as "num" 
        FROM face_reports fr 
        LEFT JOIN project_tranches pt ON pt."id" = fr."trancheId" 
        LEFT JOIN projects p ON pt."projectId" = p."id"
        WHERE fr."id" = ${requestId}`;

        const faceReport = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return faceReport;
    }
    
}

export default FaceReportRepository;