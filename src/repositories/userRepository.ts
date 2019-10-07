import { QueryTypes, Transaction, QueryOptions } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Role from "../models/role";

class UserRepository {
    
    static findUserById = async (id: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        const query = `SELECT 
                "user"."id", 
                "user"."email", 
                CASE WHEN "user"."emailVerifiedAt" IS NULL THEN 'not active' WHEN "user"."isBlocked" THEN 'blocked' ELSE 'active' END AS  "status", 
                "user"."password", 
                "user"."passwordSalt", 
                "user"."isBlocked", 
                "user"."showSeed", 
                "user"."emailVerifiedAt", 
                "user"."lastLogin", 
                "user"."partnerId", 
                "user"."createdAt", 
                "user"."updatedAt", 
                "roles"."id" AS "roles.id", 
                "roles"."title${LANG}" AS "roles.title", 
                "personalData"."userId" AS "personalData.userId", 
                "personalData"."firstNameEn" AS "personalData.firstNameEn", 
                "personalData"."firstNameRu" AS "personalData.firstNameRu", 
                "personalData"."lastNameEn" AS "personalData.lastNameEn", 
                "personalData"."lastNameRu" AS "personalData.lastNameRu", 
                "personalData"."occupationEn" AS "personalData.occupationEn", 
                "personalData"."occupationRu" AS "personalData.occupationRu", 
                "personalData"."tel" AS "personalData.tel", 
                "personalData"."mobile" AS "personalData.mobile", 
                "personalData"."createdAt" AS "personalData.createdAt", 
                "personalData"."updatedAt" AS "personalData.updatedAt" 
            FROM "users" AS "user" 
            LEFT OUTER JOIN (
                "users_has_roles" AS "roles->users_has_roles" 
                INNER JOIN "roles" AS "roles" ON "roles"."id" = "roles->users_has_roles"."roleId") ON "user"."id" = "roles->users_has_roles"."userId" 
            LEFT OUTER JOIN "users_personal_data" AS "personalData" ON "user"."id" = "personalData"."userId" 
            WHERE "user"."id" = ${id} AND "roles"."id"!='a' 
            LIMIT 1`

        let user: any = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true,
            mapToModel: true
        });
        
        if (user) {
            // is admin flag
            let adminRole = await sequelize.query(`SELECT "roleId" FROM "users_has_roles" WHERE "userId" = ${id} AND "roleId"='a' LIMIT 1`, {
                type: QueryTypes.SELECT,
                nest: true,
                plain: true
            });
            user.isAdmin = adminRole? true : false;
            if (user.roles) {
                user.roles = [user.roles];
            }
        }
        
        return user;
    }

    static findByRole = async (roleId: string) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT 
                u."id", 
                upd."firstName${LANG}" || ' ' || upd."lastName${LANG}" as "name" 
            FROM users u 
            LEFT JOIN users_has_roles uhr ON u."id" = uhr."userId" 
            LEFT JOIN users_personal_data upd ON u.id = upd."userId" 
            WHERE uhr."roleId" = '${roleId}' AND u."isBlocked" = false AND u."emailVerifiedAt" IS NOT NULL 
            ORDER BY u."id" ASC`;
    
        const users = await sequelize.query(query,{type: QueryTypes.SELECT});
        return users;
    }

    static getNameById = async (userId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT 
                upd."firstName${LANG}" || ' ' || upd."lastName${LANG}" as "name" 
            FROM users_personal_data upd 
            WHERE upd."userId" = ${userId}`;
    
        const user = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true,
            mapToModel: true
        });
        return user;
    }

    static addRole = async (userId: number, roleId: string, transaction?: Transaction) => {
        const selectQuery = `SELECT uhr.* FROM users_has_roles uhr WHERE uhr."userId"= ${userId} AND uhr."roleId" = '${roleId}'`

        const roles = await sequelize.query(selectQuery,{type: QueryTypes.SELECT});
        if (roles.length > 0) {
            return true;
        }
        const insertQuery = `INSERT INTO users_has_roles ("userId", "roleId") VALUES (${userId}, '${roleId}');`;
        let options: QueryOptions = {
            type: QueryTypes.INSERT
        };
        if (transaction) {
            options.transaction = transaction
            console.log("ADD ROLE OPTIONS", options);
        }
        const insert = await sequelize.query(insertQuery, options);
        return insert;
    }

    static findWalletById = async (userId: number) => {
        const query = `SELECT * FROM users_wallets WHERE "userId" = ${userId}`;

        const wallet = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        
        return wallet;
    }

    /**
     * get users list fro choosing next user on approving face request/report process
     * 
     * var userId - except user from list
     */
    static getForFaceList = async (userId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT 
            u."id", 
            upd."firstName${LANG}" || ' ' || upd."lastName${LANG}" || ' - ' || r."title${LANG}" as "user" 
            FROM users u 
            LEFT JOIN users_has_roles uhr ON u."id" = uhr."userId" 
            LEFT JOIN roles r ON r."id" = uhr."roleId" 
            LEFT JOIN users_personal_data upd ON u.id = upd."userId" 
            WHERE uhr."roleId" IN ('${Role.unicefResponsibleId}', '${Role.unicefBudgetId}', '${Role.unicefDeputyId}', '${Role.unicefOperationId}') 
            AND u."isBlocked" = false 
            AND u."emailVerifiedAt" IS NOT NULL 
            AND u."id" != ${userId} 
            ORDER BY CASE
                WHEN uhr."roleId"='${Role.unicefResponsibleId}' THEN 1
                WHEN uhr."roleId"='${Role.unicefBudgetId}' THEN 2
                WHEN uhr."roleId"='${Role.unicefDeputyId}' THEN 3
                WHEN uhr."roleId"='${Role.unicefOperationId}' THEN 4
                ELSE 5
            END`;
    
        const users = await sequelize.query(query,{type: QueryTypes.SELECT});
        return users;
    }
}

export default UserRepository;