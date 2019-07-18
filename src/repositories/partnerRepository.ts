import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Pagination from "../services/pagination";
import Role from "../models/role";

class PartnerRepository {
    
    static findPartnerById = async (id: number) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let partner: any = await sequelize.query('SELECT "partner"."id", "partner"."statusId", "partner"."nameEn", "partner"."nameRu", "partner"."tradeNameEn", "partner"."tradeNameRu", "partner"."license","partner"."ceoFirstNameEn", "partner"."ceoFirstNameRu", "partner"."ceoLastNameEn", "partner"."ceoLastNameRu", "partner"."establishmentYear", "partner"."employersCount", "partner"."tel", "partner"."website", "partner"."cityEn", "partner"."cityRu", "partner"."addressEn", "partner"."addressRu", "partner"."zip", "partner"."createdAt", "partner"."updatedAt", "country"."id" AS "country.id", "country"."title" AS "country.title", "areaOfWork"."id" AS "areaOfWork.id", "areaOfWork"."title' + lang + '" AS "areaOfWork.title", "ownership"."id" AS "ownership.id", "ownership"."title' + lang + '" AS "ownership.title", "partnerType"."id" AS "partnerType.id", "partnerType"."title' + lang + '" AS "partnerType.title", "csoType"."id" AS "csoType.id", "csoType"."title' + lang + '" AS "csoType.title", "authorised"."authorisedId" as "authorisedId","assist"."assistId" as "assistId" FROM "partners" AS "partner" LEFT OUTER JOIN "countries" AS "country" ON "partner"."countryId" = "country"."id" LEFT OUTER JOIN "areas_of_work" AS "areaOfWork" ON "partner"."areaOfWorkId" = "areaOfWork"."id" LEFT OUTER JOIN "companys_ownerships" AS "ownership" ON "partner"."ownershipId" = "ownership"."id" LEFT OUTER JOIN "partner_types" AS "partnerType" ON "partner"."partnerTypeId" = "partnerType"."id" LEFT OUTER JOIN "cso_types" AS "csoType" ON "partner"."csoTypeId" = "csoType"."id" LEFT outer JOIN (SELECT "us"."id" AS "authorisedId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' + Role.partnerAuthorisedId + '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "authorised" ON "authorised"."partnerId" = "partner"."id" LEFT outer JOIN (SELECT "us"."id" AS "assistId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' +Role.partnerAssistId+ '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "assist" ON "assist"."partnerId" = "partner"."id" WHERE "partner"."id" = ' + id + ' LIMIT 1', {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        
        return partner;
    }

    static getAdminList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ' AND (users."id" = ' + idSearch +' OR users."email" LIKE \'%'+ searchPhrase +'%\' OR upd."firstName' +lang+ '" LIKE \'%'+ searchPhrase +'%\' OR upd."lastName' +lang+ '" LIKE \'%'+ searchPhrase +'%\' OR p."name' +lang+ '" LIKE \'%'+ searchPhrase +'%\')';
        }

        const partnersQuery: Array<{userId: number}>|null = await sequelize.query('SELECT users_has_roles."userId" as "userId" FROM users_has_roles RIGHT JOIN users ON users_has_roles."userId" = users."id" RIGHT JOIN users_personal_data upd ON users."id" = upd."userId" LEFT JOIN partners p ON p."id" = users."partnerId" WHERE (users_has_roles."roleId" = \'' + Role.partnerAssistId + '\' OR users_has_roles."roleId" = \'' + Role.partnerAuthorisedId  + '\')' + searchInstanse + ' GROUP BY users_has_roles."userId"', {
            type: QueryTypes.SELECT
        });

        if (partnersQuery == null || partnersQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(partnersQuery.length);

        let usersIds = partnersQuery.map(a => a.userId);

        let query = 'SELECT users."email", users."id",CASE WHEN users."emailVerifiedAt" IS NULL THEN \'not active\' WHEN users."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "userStatus", TO_CHAR(users."createdAt", \'yyyy-mm-dd HH:ii:ss\') as "createdAt", upd."firstName' +lang+ '" as "firstName", upd."lastName' +lang+ '" as "lastName", r."title' +lang+ '" as "role", p."name' +lang+ '" as "company", p."statusId" as "companyStatus" FROM users LEFT JOIN users_personal_data AS upd ON users."id" = upd."userId" LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN roles r ON r."id" = uhr."roleId" LEFT JOIN partners p ON p."id" = users."partnerId" WHERE users."id" IN (' + usersIds.join(', ') + ') ORDER BY users."id" DESC';

        query = query + pagination.getLimitOffsetParam();

        const partners = await sequelize.query(query,{type: QueryTypes.SELECT});
        return partners;
    }

    static getList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ' WHERE p."id" = ' + idSearch +' OR p."name' +lang+ '" LIKE \'%'+ searchPhrase +'%\'';
        }

        const partnersQuery: Array<{id: number}>|null = await sequelize.query('SELECT p."id" as "id" FROM partners p ' + searchInstanse, {
            type: QueryTypes.SELECT
        });

        if (partnersQuery == null || partnersQuery.length < 1) {
            // partners count = 0
            pagination.setItemsCount(0);
            return [];
        }
        pagination.setItemsCount(partnersQuery.length);
        let partnersIds = partnersQuery.map(a => a.id);

        let query = 'SELECT p."id" as "id", p."name'+lang+'" as "name", TO_CHAR(p."createdAt", \'yyyy-mm-dd HH:ii:ss\') as "createdAt", \'n/a\' as "coordinator", \'n/a\' as "programCode", p."statusId" as "status", aow."title' +lang+ '" as "areaOfWork" FROM partners "p" LEFT JOIN areas_of_work AS aow ON p."areaOfWorkId" = aow."id" WHERE p."id" IN (' + partnersIds.join(', ') + ') ORDER BY p."id" DESC';

        query = query + pagination.getLimitOffsetParam();

        const partners = await sequelize.query(query,{type: QueryTypes.SELECT});
        return partners;
    }
}
export default PartnerRepository;