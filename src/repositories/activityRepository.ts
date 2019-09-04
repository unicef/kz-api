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
}

export default ActivityRepository;