import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Pagination from "../services/pagination";
import Role from "../models/role";

class ActivityRepository {
    static getByProjectId = async (projectId: number) => {
        const query = `SELECT pa."id" as "id", pa."title" as "title" FROM project_activities "pa" WHERE pa."projectId" = ${projectId}`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getByRequestId = async (requestId: number) => {
        const query = `SELECT pa."id" as "id", pa."title" as "title", ra."amountE" as "amountE", ra."amountF" as "amountF", ra."amountG" as "amountG" FROM project_activities "pa" LEFT JOIN request_activities "ra" ON pa."id" = ra."activityId" WHERE ra."requestId" = ${requestId}`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getTotalRequestAmounts = async (requestId: number) => {
        const query = `SELECT SUM(ra."amountE") as "totalE", SUM(ra."amountF") as "totalF", SUM(ra."amountG") as "totalG" FROM request_activities "ra" WHERE ra."requestId" = ${requestId}`;

        const total = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return total;
    }
}

export default ActivityRepository;