import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class ProjectRepository {

    static findById = async (projectId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT projects."id" as "id", projects."statusId" as "status", projects."titleEn" as "titleEn", `+
        `projects."titleRu" as "titleRu", projects."type" as "type", projects."partnerId" as "partnerId", `+
        `projects."type" || '_KAZ_' || date_part('year', CURRENT_DATE) || '_' || projects."id" as "projectCode", `+
        `TO_CHAR(projects."deadline", \'yyyy-mm-dd\') as "deadline", projects."ice" as "ice", projects."usdRate" as "usdRate", `+
        `projects."descriptionEn" as "descriptionEn", projects."descriptionRu" as "descriptionRu", `+
        `TO_CHAR(projects."createdAt", \'yyyy-Mon-dd\') as "createdAt", programmes."id" as "programme.id", programmes."title${LANG}" as "programme.title", `+
        `programmes."code" as "programme.code", officer."userId" as "officer.id", `+
        `officer."firstName${LANG}" || officer."lastName${LANG}" as "officer.name", `+
        `CASE WHEN projects."partnerId" IS NULL THEN \'\' ELSE partners."name${LANG}" END AS "partnerName", `+
        `sections."id" as "section.id", sections."title${LANG}" as "section.title" `+
        `FROM projects `+
        `LEFT JOIN programmes ON programmes."id"=projects."programmeId" `+
        `LEFT JOIN users_personal_data as officer ON officer."userId"=projects."officerId" `+
        `LEFT JOIN sections ON sections."id"=projects."sectionId" `+
        `LEFT JOIN partners ON partners."id"=projects."partnerId"`+
        `WHERE projects."id" = ${projectId}`;

        const project = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (project !== null) {
            if (project.partnerId !== null) {
                const assistQuery = `SELECT 
                "upd"."firstName${LANG}" || ' ' || "upd"."lastName${LANG}" as "name"
                FROM "users" as "us" 
                    LEFT JOIN "users_has_roles" as "uhr" 
                        ON "us"."id" = "uhr"."userId" 
                    LEFT JOIN "partners" as "p" 
                        ON "p"."id" = "us"."partnerId" 
                    LEFT OUTER JOIN "users_personal_data" as "upd" ON "us"."id"="upd"."userId"  
                WHERE "uhr"."roleId" = 'ra' AND "us"."partnerId" = ${project.partnerId} LIMIT 1`
                const assist = await sequelize.query(assistQuery, {
                    type: QueryTypes.SELECT,
                    nest: true,
                    plain: true
                });
                if (assist!==null) {
                    project.assistantName = assist.name;
                }
            } else {
                project.assistantName = "";
            }
        }

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

    static findByPartnerId = async (partnerId: number): Promise<Array<object>|[]> => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT projects."id", projects."title${LANG}", projects."type", projects."programmeId", projects."deadline", projects."ice", projects."usdRate", projects."officerId", projects."sectionId", projects."description${LANG}" 
        FROM projects
        WHERE projects."partnerId" = ${partnerId};`;

        const projects = await sequelize.query(query, {
            type: QueryTypes.SELECT
        })

        return projects;
    }
    
}

export default ProjectRepository;