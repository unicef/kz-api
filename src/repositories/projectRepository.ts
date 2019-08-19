import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class ProjectRepository {

    static findById = async (projectId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT projects."id" as "id", projects."statusId" as "status", projects."titleEn" as "titleEn", `+
        `projects."titleRu" as "titleRu", projects."type" as "type", `+
        `projects."type" || '_KAZ_' || date_part('year', CURRENT_DATE) || '_' || projects."id" as "projectCode", `+
        `TO_CHAR(projects."deadline", \'yyyy-mm-dd\') as "deadline", projects."ice" as "ice", projects."usdRate" as "usdRate", `+
        `projects."descriptionEn" as "descriptionEn", projects."descriptionRu" as "descriptionRu", `+
        `TO_CHAR(projects."createdAt", \'yyyy-Mon-dd\') as "createdAt", programmes."id" as "programme.id", programmes."title${LANG}" as "programme.title", `+
        `programmes."code" as "programme.code", officer."userId" as "officer.id", officer."firstName${LANG}" || officer."lastName${LANG}" as "officer.name", `+
        `sections."id" as "section.id", sections."title${LANG}" as "section.title" `+
        `FROM projects `+
        `LEFT JOIN programmes ON programmes."id"=projects."programmeId" `+
        `LEFT JOIN users_personal_data as officer ON officer."userId"=projects."officerId" `+
        `LEFT JOIN sections ON sections."id"=projects."sectionId" `+
        `WHERE projects."id" = ${projectId}`;

        const project = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return project;
    }

    static isProjectExists = async (projectId: number) => {
        const query = `SELECT projects.id FROM projects WHERE projects."id"=${projectId}`;

        const project = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (project) {
            return true;
        } 
        return false;
    }
    
}

export default ProjectRepository;