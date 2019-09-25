import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Pagination from "../services/pagination";
import Role from "../models/role";

class ActivityRepository {
    static getByProjectId = async (projectId: number) => {
        const query = `SELECT 
            pa."id" as "id",
            pa."title" as "title", 
            0 as "amountE", 
            0 AS "amountF", 
            0 AS "amountG",
            false as "isRejected",
            '' AS "rejectReason"
            FROM project_activities "pa" 
            WHERE pa."projectId" = ${projectId}
            ORDER BY pa."id" ASC`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getReportActivitiesByRequestId = async (requestId: number) => {
        const query = `SELECT
        pa."id" as "id",
        pa."title" as "title",
        ra."amountG" as "amountA",
        '0' AS "amountB",
        '0' AS "amountC",
        '0' AS "amountD",
        false as "isRejected",
        '' AS "rejectReason"
        FROM request_activities "ra"
        LEFT JOIN project_activities "pa" ON pa."id" = ra."activityId"
        WHERE ra."requestId"=${requestId}
        ORDER BY pa."id" ASC`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getByRequestId = async (requestId: number) => {
        const query = `SELECT 
            ra."id" as "id", 
            pa."title" as "title", 
            ra."amountE" as "amountE", 
            CASE WHEN ra."amountF" IS NULL THEN 0 ELSE ra."amountF" END AS "amountF", 
            CASE WHEN ra."amountG" IS NULL THEN 0 ELSE ra."amountG" END AS "amountG",
            ra."isRejected" as "isRejected",
            CASE WHEN ra."rejectReason" IS NULL THEN \'\' ELSE ra."rejectReason" END AS "rejectReason" 
            FROM project_activities "pa" 
            LEFT JOIN request_activities "ra" ON pa."id" = ra."activityId" 
            WHERE ra."requestId" = ${requestId}
            ORDER BY ra."activityId" ASC`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getByReportId = async (reportId: number) => {
        const query = `SELECT 
            ra."id" as "id", 
            pa."title" as "title", 
            ra."amountA" as "amountA", 
            CASE WHEN ra."amountB" IS NULL THEN 0 ELSE ra."amountB" END AS "amountB", 
            CASE WHEN ra."amountC" IS NULL THEN 0 ELSE ra."amountC" END AS "amountC",
            CASE WHEN ra."amountD" IS NULL THEN 0 ELSE ra."amountD" END AS "amountD",
            ra."isRejected" as "isRejected",
            CASE WHEN ra."rejectReason" IS NULL THEN \'\' ELSE ra."rejectReason" END AS "rejectReason" 
            FROM project_activities "pa" 
            LEFT JOIN report_activities "ra" ON pa."id" = ra."activityId" 
            WHERE ra."reportId" = ${reportId}
            ORDER BY ra."activityId" ASC`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }

    static getTotalRequestAmounts = async (requestId: number) => {
        const query = `SELECT 
            CASE WHEN SUM(ra."amountE") IS NULL THEN 0 ELSE SUM(ra."amountE") END AS "totalE",
            CASE WHEN SUM(ra."amountF") IS NULL THEN 0 ELSE SUM(ra."amountF") END AS "totalF",
            CASE WHEN SUM(ra."amountG") IS NULL THEN 0 ELSE SUM(ra."amountG") END AS "totalG"
            FROM request_activities "ra" 
            WHERE ra."requestId" = ${requestId}`;

        const total = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return total;
    }

    static getTotalReportAmounts = async (reportId: number) => {
        const query = `SELECT 
            CASE WHEN SUM(ra."amountA") IS NULL THEN 0 ELSE SUM(ra."amountA") END AS "totalA",
            CASE WHEN SUM(ra."amountB") IS NULL THEN 0 ELSE SUM(ra."amountB") END AS "totalB",
            CASE WHEN SUM(ra."amountC") IS NULL THEN 0 ELSE SUM(ra."amountC") END AS "totalC",
            CASE WHEN SUM(ra."amountD") IS NULL THEN 0 ELSE SUM(ra."amountD") END AS "totalD"
            FROM report_activities "ra" 
            WHERE ra."reportId" = ${reportId}`;

        const total = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return total;
    }

    static findById = async (id: number) => {
        const query = `SELECT 
            ra."id" as "id", 
            ra."activityId" as "activityId", 
            pa."title" as "title", 
            ra."amountE" as "amountE", 
            CASE WHEN ra."amountF" IS NULL THEN 0 ELSE ra."amountF" END AS "amountF", 
            CASE WHEN ra."amountG" IS NULL THEN 0 ELSE ra."amountG" END AS "amountG",
            ra."isRejected" as "isRejected",
            CASE WHEN ra."rejectReason" IS NULL THEN \'\' ELSE ra."rejectReason" END AS "rejectReason" 
            FROM project_activities "pa" 
            LEFT JOIN request_activities "ra" ON pa."id" = ra."activityId" 
            WHERE ra."id" = ${id}`;

        const activity = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return activity;
    }

    static findReportActivityById = async (id: number) => {
        const query = `SELECT 
            ra."id" as "id", 
            ra."activityId" as "activityId", 
            pa."title" as "title", 
            ra."amountA" as "amountA", 
            ra."amountB" as "amountB", 
            CASE WHEN ra."amountC" IS NULL THEN 0 ELSE ra."amountC" END AS "amountC", 
            CASE WHEN ra."amountD" IS NULL THEN 0 ELSE ra."amountD" END AS "amountD",
            ra."isRejected" as "isRejected",
            CASE WHEN ra."rejectReason" IS NULL THEN \'\' ELSE ra."rejectReason" END AS "rejectReason" 
            FROM project_activities "pa" 
            LEFT JOIN report_activities "ra" ON pa."id" = ra."activityId" 
            WHERE ra."id" = ${id}`;

        const activity = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        return activity;
    }

    static getActivitiesAmountDFromReport = async (projectId: number, trancheNum: number) => {
        const query = `SELECT
            ra."activityId" AS "activityId",
            CASE WHEN ra."amountD" IS NULL THEN 0 ELSE ra."amountD" END
        FROM report_activities ra
        LEFT JOIN face_reports frep ON frep."id" = ra."reportId"
        LEFT JOIN project_tranches pt ON pt."id" = frep."trancheId"
        WHERE pt."projectId" = ${projectId} AND pt."num" = ${trancheNum}`;

        const activities = await sequelize.query(query,{type: QueryTypes.SELECT});

        return activities;
    }
}

export default ActivityRepository;