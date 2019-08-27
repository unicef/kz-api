import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Project from "../models/project";
import Pagination from "../services/pagination";

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

    static shortInfoById = async (projectId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT projects."id" as "id", projects."title${LANG}" as "title", projects."type" || '_KAZ_' || TO_CHAR(projects."createdAt", \'yyyy\') || '_' || projects."id" as "projectCode", TO_CHAR(projects."deadline", \'yyyy-mm-dd\') as "deadline", TO_CHAR(projects."createdAt", \'yyyy-Mon-dd\') as "createdAt", projects."ice" || ' KZT' as "ice", projects."description${LANG}" as "description", programmes."title${LANG}" as "programme.title", programmes."code" as "programme.code" `+
        `FROM projects `+
        `LEFT JOIN programmes ON programmes."id"=projects."programmeId" `+
        `WHERE projects."id" = ${projectId}`;

        const project = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return project;
    } 

    static getAllList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ` WHERE p."id" = ${idSearch} OR p."title${lang}" ILIKE '%${searchPhrase}%' OR o."firstName${lang}" ILIKE '%${searchPhrase}%' OR o."lastName${lang}" ILIKE '%${searchPhrase}%'`;
        }

        const projectsQuery: Array<{id: number}>|null = await sequelize.query(`SELECT p."id" as "id" FROM projects p JOIN users_personal_data o ON o."userId" = p."officerId"` + searchInstanse, {
            type: QueryTypes.SELECT
        });

        if (projectsQuery == null || projectsQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(projectsQuery.length);
        let projectsIds = projectsQuery.map(a => a.id);

        let query = `SELECT p."id" as "id", p."title${lang}" as "title", p."type" || '_KAZ_' || TO_CHAR(p."createdAt", \'yyyy\') || '_' || p."id" as "projectCode", TO_CHAR(p."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", TO_CHAR(p."deadline", \'yyyy-mm-dd HH:MI\') as "deadline", p."statusId" as "status", pr."code" as "programmeCode", pr."title${lang}" as "programmeTitle", pa."name${lang}" as "partnerName", o."firstName${lang}" || ' ' || o."lastName${lang}" AS "assistName" FROM projects "p" LEFT JOIN partners AS pa ON pa."id" = p."partnerId" LEFT JOIN programmes AS pr ON pr."id" = p."programmeId" LEFT JOIN  users_personal_data o ON o."userId" = p."officerId" WHERE p."id" IN (${projectsIds.join(', ')}) ORDER BY p."id" DESC`;

        query = query + pagination.getLimitOffsetParam();

        const projects = await sequelize.query(query,{type: QueryTypes.SELECT});
        return projects;
    }

    static getListForPartner = async (partnerId: number, searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ` AND (p."id" = ${idSearch} OR p."title${lang}" ILIKE '%${searchPhrase}%' OR o."firstName${lang}" ILIKE '%${searchPhrase}%' OR o."lastName${lang}" ILIKE '%${searchPhrase}%')`;
        }

        const projectsQuery: Array<{id: number}>|null = await sequelize.query(`SELECT p."id" as "id" FROM projects p JOIN users_personal_data o ON o."userId" = p."officerId" WHERE p."statusId" = '${Project.IN_PROGRESS_STATUS_ID}' AND p."partnerId"=${partnerId}` + searchInstanse, {
            type: QueryTypes.SELECT
        });

        if (projectsQuery == null || projectsQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(projectsQuery.length);
        let projectsIds = projectsQuery.map(a => a.id);

        let query = `SELECT p."id" as "id", p."title${lang}" as "title", TO_CHAR(p."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", TO_CHAR(p."deadline", \'yyyy-mm-dd HH:MI\') as "deadline", p."statusId" as "status", pr."code" as "programmeCode", pr."title${lang}" as "programmeTitle", pa."name${lang}" as "partnerName", o."firstName${lang}" || ' ' || o."lastName${lang}" AS "assistName" FROM projects "p" LEFT JOIN partners AS pa ON pa."id" = p."partnerId" LEFT JOIN programmes AS pr ON pr."id" = p."programmeId" LEFT JOIN  users_personal_data o ON o."userId" = p."officerId" WHERE p."id" IN (${projectsIds.join(', ')}) ORDER BY p."id" DESC`;

        query = query + pagination.getLimitOffsetParam();

        const projects = await sequelize.query(query,{type: QueryTypes.SELECT});
        return projects;
    }

    static getListForAssistant = async (assistantId: number, searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ` AND (p."id" = ${idSearch} OR p."title${lang}" ILIKE '%${searchPhrase}%' OR o."firstName${lang}" ILIKE '%${searchPhrase}%' OR o."lastName${lang}" ILIKE '%${searchPhrase}%' OR pa."name${lang}" ILIKE '%${searchPhrase}%')`;
        }

        const projectsQuery: Array<{id: number}>|null = await sequelize.query(`SELECT p."id" as "id" FROM projects p LEFT JOIN users_personal_data o ON o."userId" = p."officerId" LEFT JOIN partners pa ON pa."id" = p."partnerId" WHERE p."officerId"=${assistantId}` + searchInstanse, {
            type: QueryTypes.SELECT
        });

        if (projectsQuery == null || projectsQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(projectsQuery.length);
        let projectsIds = projectsQuery.map(a => a.id);

        let query = `SELECT p."id" as "id", p."title${lang}" as "title", TO_CHAR(p."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", TO_CHAR(p."deadline", \'yyyy-mm-dd HH:MI\') as "deadline", p."statusId" as "status", pr."code" as "programmeCode", pr."title${lang}" as "programmeTitle", pa."name${lang}" as "partnerName", o."firstName${lang}" || ' ' || o."lastName${lang}" AS "assistName" FROM projects "p" LEFT JOIN partners AS pa ON pa."id" = p."partnerId" LEFT JOIN programmes AS pr ON pr."id" = p."programmeId" LEFT JOIN  users_personal_data o ON o."userId" = p."officerId" WHERE p."id" IN (${projectsIds.join(', ')}) ORDER BY p."id" DESC`;

        query = query + pagination.getLimitOffsetParam();

        const projects = await sequelize.query(query,{type: QueryTypes.SELECT});
        return projects;
    }

    static getTranches = async (projectId: number) => {
        const tracnheString = i18n.t('tranche');
        let query = `SELECT '${tracnheString}' || ' ' || pt."num" as "num", TO_CHAR(pt."from", 'yyyy-mm') as "from", TO_CHAR(pt."to", 'yyyy-mm') as "to", pt."amount" as "amount" FROM project_tranches "pt" WHERE pt."projectId"=${projectId} ORDER BY pt."num" ASC`;

        const tranches = await sequelize.query(query,{type: QueryTypes.SELECT});
        return tranches;
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
        WHERE projects."partnerId" = ${partnerId} AND projects."statusId" = '${Project.IN_PROGRESS_STATUS_ID}'`;

        const projects = await sequelize.query(query, {
            type: QueryTypes.SELECT
        })

        return projects;
    }
    
}

export default ProjectRepository;