import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class ProjectTrancheRepository {

    static findByProjectId = async (projectId: number) => {
        
        const query = `SELECT pt.* FROM project_tranches AS pt WHERE pt."projectId" = ${projectId}`;

        const tranches = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return tranches;
    }
    
}

export default ProjectTrancheRepository;