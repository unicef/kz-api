import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Role from "../models/role";

class UserRepository {
    
    static findUserById = async (id: number) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        //
        let user: any = await sequelize.query('SELECT "user"."id", "user"."email", "user"."password", "user"."passwordSalt", "user"."isBlocked", "user"."showSeed", "user"."emailVerifiedAt", "user"."lastLogin", "user"."partnerId", "user"."createdAt", "user"."updatedAt", "roles"."id" AS "roles.id", "roles"."title' + lang + '" AS "roles.title", "personalData"."userId" AS "personalData.userId", "personalData"."firstNameEn" AS "personalData.firstNameEn", "personalData"."firstNameRu" AS "personalData.firstNameRu", "personalData"."lastNameEn" AS "personalData.lastNameEn", "personalData"."lastNameRu" AS "personalData.lastNameRu", "personalData"."occupationEn" AS "personalData.occupationEn", "personalData"."occupationRu" AS "personalData.occupationRu", "personalData"."tel" AS "personalData.tel", "personalData"."mobile" AS "personalData.mobile", "personalData"."createdAt" AS "personalData.createdAt", "personalData"."updatedAt" AS "personalData.updatedAt" FROM "users" AS "user" LEFT OUTER JOIN ( "users_has_roles" AS "roles->users_has_roles" INNER JOIN "roles" AS "roles" ON "roles"."id" = "roles->users_has_roles"."roleId") ON "user"."id" = "roles->users_has_roles"."userId" LEFT OUTER JOIN "users_personal_data" AS "personalData" ON "user"."id" = "personalData"."userId" WHERE "user"."id" = ' + id + ' AND "roles"."id"!=\'a\' LIMIT 1', {
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
}
export default UserRepository;