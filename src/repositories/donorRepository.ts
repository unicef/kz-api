import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Pagination from "../services/pagination";
import Role from "../models/role";

class DonorRepository {

    static getAdminList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ' AND (users."id" = ' + idSearch +' OR users."email" ILIKE \'%'+ searchPhrase +'%\' OR upd."firstName' +lang+ '" ILIKE \'%'+ searchPhrase +'%\' OR upd."lastName' +lang+ '" ILIKE \'%'+ searchPhrase +'%\' OR dc."company' +lang+ '" ILIKE \'%'+ searchPhrase +'%\')';
        }

        const donorsQuery: Array<{userId: number}>|null = await sequelize.query('SELECT users_has_roles."userId" as "userId" FROM users_has_roles RIGHT JOIN users ON users_has_roles."userId" = users."id" RIGHT JOIN users_personal_data upd ON users."id" = upd."userId" LEFT JOIN donors_companies dc ON dc."userId" = users."id" WHERE users_has_roles."roleId" = \'' + Role.donorId + '\'' + searchInstanse + ' GROUP BY users_has_roles."userId"', {
            type: QueryTypes.SELECT
        });

        if (donorsQuery == null || donorsQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(donorsQuery.length);

        let usersIds = donorsQuery.map(a => a.userId);

        let query = 'SELECT users."email", users."id",CASE WHEN users."emailVerifiedAt" IS NULL THEN \'not active\' WHEN users."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "status", TO_CHAR(users."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", upd."firstName' +lang+ '" as "firstName", upd."lastName' +lang+ '" as "lastName", dc."company' +lang+ '" as "company" FROM users LEFT JOIN users_personal_data AS upd ON users."id" = upd."userId" LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN donors_companies dc ON dc."userId" = users."id" WHERE users."id" IN (' + usersIds.join(', ') + ') ORDER BY users."id" DESC';

        query = query + pagination.getLimitOffsetParam();

        const donors = await sequelize.query(query,{type: QueryTypes.SELECT});
        return donors;
    }

    static saveDonorCompany = async (userId: number, companyData: { companyEn: string; companyRu: string; }) => {
        // check if user has company row
        const userCompany = await sequelize.query('SELECT * FROM "donors_companies" WHERE "userId"=' + userId, {
            type: QueryTypes.SELECT,
            plain: true
        })

        if (userCompany) {
            const updateInfo = await sequelize.query('UPDATE "donors_companies" SET "companyEn"=\'' + companyData.companyEn + '\', "companyRu"=\'' + companyData.companyRu + '\' WHERE "userId"=' + userId, {
                type: QueryTypes.UPDATE
            });

            return updateInfo;
        } else {
            // create new row
            const creteCompany = await sequelize.query('INSERT INTO "donors_companies" ("userId", "companyEn", "companyRu") VALUES ('+userId+', \''+companyData.companyEn+'\', \''+companyData.companyRu+'\');', {
                type: QueryTypes.INSERT
            })
            return creteCompany;
        }
    }

    static getCompanyData = async (userId: number): Promise<{userId:number;companyEn:string;companyRu:string;}|null> => {
        const userCompany: any = await sequelize.query('SELECT * FROM "donors_companies" WHERE "userId"=' + userId, {
            type: QueryTypes.SELECT,
            plain: true
        });

        return userCompany;
    }
}
export default DonorRepository;