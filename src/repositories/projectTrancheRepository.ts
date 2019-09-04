import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import ProjectTranche from "../models/projectTranche";

class ProjectTrancheRepository {

    static findByProjectId = async (projectId: number) => {
        
        const query = `SELECT pt.* FROM project_tranches AS pt WHERE pt."projectId" = ${projectId}`;

        const tranches = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return tranches;
    }

    static findActiveByProjectId = async (projectId: number) => {
        const query = `SELECT pt.* FROM project_tranches AS pt WHERE pt."projectId" = ${projectId} AND pt."status"='${ProjectTranche.IN_PROGRESS_STATUS_KEY}' LIMIT 1`;

        const tranche = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (tranche) {
            return tranche;
        }

        return null;
    }
    
}

export default ProjectTrancheRepository;