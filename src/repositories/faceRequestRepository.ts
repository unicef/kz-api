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

    
}

export default FaceRequestRepository;