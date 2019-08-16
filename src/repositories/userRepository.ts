import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Role from "../models/role";

class UserRepository {
    
    static findUserById = async (id: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        //
        let user: any = await sequelize.query('SELECT "user"."id", "user"."email", CASE WHEN "user"."emailVerifiedAt" IS NULL THEN \'not active\' WHEN "user"."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "status", "user"."password", "user"."passwordSalt", "user"."isBlocked", "user"."showSeed", "user"."emailVerifiedAt", "user"."lastLogin", "user"."partnerId", "user"."createdAt", "user"."updatedAt", "roles"."id" AS "roles.id", "roles"."title' + LANG + '" AS "roles.title", "personalData"."userId" AS "personalData.userId", "personalData"."firstNameEn" AS "personalData.firstNameEn", "personalData"."firstNameRu" AS "personalData.firstNameRu", "personalData"."lastNameEn" AS "personalData.lastNameEn", "personalData"."lastNameRu" AS "personalData.lastNameRu", "personalData"."occupationEn" AS "personalData.occupationEn", "personalData"."occupationRu" AS "personalData.occupationRu", "personalData"."tel" AS "personalData.tel", "personalData"."mobile" AS "personalData.mobile", "personalData"."createdAt" AS "personalData.createdAt", "personalData"."updatedAt" AS "personalData.updatedAt" FROM "users" AS "user" LEFT OUTER JOIN ( "users_has_roles" AS "roles->users_has_roles" INNER JOIN "roles" AS "roles" ON "roles"."id" = "roles->users_has_roles"."roleId") ON "user"."id" = "roles->users_has_roles"."userId" LEFT OUTER JOIN "users_personal_data" AS "personalData" ON "user"."id" = "personalData"."userId" WHERE "user"."id" = ' + id + ' AND "roles"."id"!=\'a\' LIMIT 1', {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true,
            mapToModel: true
        });
        
        if (user) {
            // is admin flag
            let adminRole = await sequelize.query('SELECT "roleId" FROM "users_has_roles" WHERE "userId" = ' + id + ' AND "roleId"=\'a\' LIMIT 1', {
                type: QueryTypes.SELECT,
                nest: true,
                plain: true
            });
            if (adminRole) {
                user.isAdmin = true;
            } else {
                user.isAdmin = false;
            }
            if (user.roles) {
                user.roles = [user.roles];
            }
        }
        
    
        return user;
    }

    static findByRole = async (roleId: string) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT u."id", upd."firstName${LANG}" || ' ' || upd."lastName${LANG}" as "name" FROM users u ` +
                      `LEFT JOIN users_has_roles uhr ON u."id" = uhr."userId" `+
                      `LEFT JOIN users_personal_data upd ON u.id = upd."userId" ` + 
                      `WHERE uhr."roleId" = '${roleId}' AND u."isBlocked" = false AND u."emailVerifiedAt" IS NOT NULL ORDER BY u."id" ASC`;
    
        const users = await sequelize.query(query,{type: QueryTypes.SELECT});
        return users;
    }
}
export default UserRepository;