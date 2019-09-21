import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Pagination from "../services/pagination";
import Role from "../models/role";
import PartnerHelper from "../helpers/partnerHelper";
import Partner from "../models/partner";
import Project from "../models/project";

class PartnerRepository {
    
    static findById = async (id: number) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let partner: any = await sequelize.query('SELECT "partner"."id", "partner"."statusId", "partner"."nameEn", "partner"."nameRu", "partner"."tradeNameEn", "partner"."tradeNameRu", "partner"."license","partner"."ceoFirstNameEn", "partner"."ceoFirstNameRu", "partner"."ceoLastNameEn", "partner"."ceoLastNameRu", "partner"."establishmentYear", "partner"."employersCount", "partner"."tel", "partner"."website", "partner"."cityEn", "partner"."cityRu", "partner"."addressEn", "partner"."addressRu", "partner"."zip", "partner"."createdAt", "partner"."updatedAt", "country"."id" AS "country.id", "country"."title" AS "country.title", "areaOfWork"."id" AS "areaOfWork.id", "areaOfWork"."title' + lang + '" AS "areaOfWork.title", "ownership"."id" AS "ownership.id", "ownership"."title' + lang + '" AS "ownership.title", "partnerType"."id" AS "partnerType.id", "partnerType"."title' + lang + '" AS "partnerType.title", "csoType"."id" AS "csoType.id", "csoType"."title' + lang + '" AS "csoType.title", "authorised"."authorisedId" as "authorisedId","assist"."assistId" as "assistId" FROM "partners" AS "partner" LEFT OUTER JOIN "countries" AS "country" ON "partner"."countryId" = "country"."id" LEFT OUTER JOIN "areas_of_work" AS "areaOfWork" ON "partner"."areaOfWorkId" = "areaOfWork"."id" LEFT OUTER JOIN "companys_ownerships" AS "ownership" ON "partner"."ownershipId" = "ownership"."id" LEFT OUTER JOIN "partner_types" AS "partnerType" ON "partner"."partnerTypeId" = "partnerType"."id" LEFT OUTER JOIN "cso_types" AS "csoType" ON "partner"."csoTypeId" = "csoType"."id" LEFT outer JOIN (SELECT "us"."id" AS "authorisedId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' + Role.partnerAuthorisedId + '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "authorised" ON "authorised"."partnerId" = "partner"."id" LEFT outer JOIN (SELECT "us"."id" AS "assistId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' +Role.partnerAssistId+ '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "assist" ON "assist"."partnerId" = "partner"."id" WHERE "partner"."id" = ' + id + ' LIMIT 1', {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });

        if (partner!==null) {
            PartnerHelper.partnerSelectFields.forEach((key) => {
                partner[key] = partner[key]['id'] == null?null:partner[key];
            })
        }
        
        return partner;
    }

    static getAdminList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ' AND (users."id" = ' + idSearch +' OR users."email" ILIKE \'%'+ searchPhrase +'%\' OR upd."firstName' +lang+ '" ILIKE \'%'+ searchPhrase +'%\' OR upd."lastName' +lang+ '" ILIKE \'%'+ searchPhrase +'%\' OR p."name' +lang+ '" ILIKE \'%'+ searchPhrase +'%\')';
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

        let query = 'SELECT users."email", users."id",CASE WHEN users."emailVerifiedAt" IS NULL THEN \'not active\' WHEN users."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "userStatus", TO_CHAR(users."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", upd."firstName' +lang+ '" as "firstName", upd."lastName' +lang+ '" as "lastName", r."title' +lang+ '" as "role", p."name' +lang+ '" as "company", p."statusId" as "companyStatus" FROM users LEFT JOIN users_personal_data AS upd ON users."id" = upd."userId" LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN roles r ON r."id" = uhr."roleId" LEFT JOIN partners p ON p."id" = users."partnerId" WHERE users."id" IN (' + usersIds.join(', ') + ') ORDER BY users."id" DESC';

        query = query + pagination.getLimitOffsetParam();

        const partners = await sequelize.query(query,{type: QueryTypes.SELECT});
        return partners;
    }

    static getList = async (searchPhrase: string|null, pagination: Pagination) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let searchInstanse = '';
        if (searchPhrase) {
            const idSearch = +searchPhrase ? +searchPhrase : 0;
            searchInstanse = ' WHERE p."id" = ' + idSearch +' OR p."name' +lang+ '" ILIKE \'%'+ searchPhrase +'%\'';
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

        let query = 'SELECT p."id" as "id", p."name'+lang+'" as "name", TO_CHAR(p."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", \'n/a\' as "coordinator", \'n/a\' as "programCode", p."statusId" as "status", aow."title' +lang+ '" as "areaOfWork" FROM partners "p" LEFT JOIN areas_of_work AS aow ON p."areaOfWorkId" = aow."id" WHERE p."id" IN (' + partnersIds.join(', ') + ') ORDER BY p."id" DESC';

        query = query + pagination.getLimitOffsetParam();

        const partners = await sequelize.query(query,{type: QueryTypes.SELECT});
        return partners;
    }

    static getFullInformation = async (partnerId: number) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let partner: any = await sequelize.query('SELECT "partner"."id" as "id", "partner"."statusId" as "statusId", "partner"."name'+lang+'" as "name", "partner"."tradeName'+lang+'" as "tradeName", "partner"."license" as "license","partner"."ceoFirstName'+lang+'" as "ceoFirstName", "partner"."ceoLastName'+lang+'" as "ceoLastName", "partner"."establishmentYear" as "establishmentYear", "partner"."employersCount" as "employersCount", "partner"."tel" as "tel", "partner"."website" as "website", "partner"."city'+lang+'" as "city", "partner"."address'+lang+'" as "address", "partner"."zip" as "zip", TO_CHAR("partner"."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", "country"."title" AS "country", "areaOfWork"."title' + lang + '" AS "areaOfWork", "ownership"."title' + lang + '" AS "ownership", "partnerType"."title' + lang + '" AS "partnerType", "csoType"."title' + lang + '" AS "csoType", "assist"."assistId" as "assistant.id", "assist"."email" as "assistant.email", "assist"."firstName" as "assistant.firstName", "assist"."lastName" as "assistant.lastName", "assist"."occupation" as "assistant.occupation", "assist"."tel" as "assistant.tel", "assist"."mobile" as "assistant.mobile", "assist"."status" as "assistant.status", "assist"."createdAt" as "assistant.createdAt", "authorised"."authorisedId" as "authorised.id", "authorised"."email" as "authorised.email", "authorised"."firstName" as "authorised.firstName", "authorised"."lastName" as "authorised.lastName", "authorised"."occupation" as "authorised.occupation", "authorised"."tel" as "authorised.tel", "authorised"."mobile" as "authorised.mobile", "authorised"."status" as "authorised.status", "authorised"."createdAt" as "authorised.createdAt" FROM "partners" AS "partner" LEFT OUTER JOIN "countries" AS "country" ON "partner"."countryId" = "country"."id" LEFT OUTER JOIN "areas_of_work" AS "areaOfWork" ON "partner"."areaOfWorkId" = "areaOfWork"."id" LEFT OUTER JOIN "companys_ownerships" AS "ownership" ON "partner"."ownershipId" = "ownership"."id" LEFT OUTER JOIN "partner_types" AS "partnerType" ON "partner"."partnerTypeId" = "partnerType"."id" LEFT OUTER JOIN "cso_types" AS "csoType" ON "partner"."csoTypeId" = "csoType"."id" LEFT outer JOIN (SELECT "us"."id" AS "assistId", "us"."email" as "email", "upd"."firstName'+lang+'" as "firstName", "upd"."lastName'+lang+'" as "lastName", "upd"."occupation'+lang+'" as "occupation", "upd"."tel" as "tel", "upd"."mobile" as "mobile", CASE WHEN "us"."emailVerifiedAt" IS NULL THEN \'not active\' WHEN "us"."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "status", TO_CHAR("us"."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" LEFT OUTER JOIN "users_personal_data" as "upd" ON "us"."id"="upd"."userId"  WHERE "uhr"."roleId" = \'' +Role.partnerAssistId+ '\' AND "us"."partnerId" = ' +partnerId+ ' LIMIT 1) as "assist" ON "assist"."partnerId" = "partner"."id" LEFT outer JOIN (SELECT "us"."id" AS "authorisedId", "us"."email" as "email", "upd"."firstName'+lang+'" as "firstName", "upd"."lastName'+lang+'" as "lastName", "upd"."occupation'+lang+'" as "occupation", "upd"."tel" as "tel", "upd"."mobile" as "mobile", CASE WHEN "us"."emailVerifiedAt" IS NULL THEN \'not active\' WHEN "us"."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "status", TO_CHAR("us"."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" LEFT OUTER JOIN "users_personal_data" as "upd" ON "us"."id"="upd"."userId" WHERE "uhr"."roleId" = \'' + Role.partnerAuthorisedId + '\' AND "us"."partnerId" = ' +partnerId+ ' LIMIT 1) as "authorised" ON "authorised"."partnerId" = "partner"."id" WHERE "partner"."id" = ' +partnerId+ ' LIMIT 1', {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        
        return partner;
    }

    // get partners list for assigning into project
    static findAvailable = async () => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        const query = `SELECT partners."id", partners."name${LANG}" as "name"
        FROM partners
          LEFT JOIN (
              select p.* 
              from projects p 
              where p."statusId" = '${Project.IN_PROGRESS_STATUS_ID}'
          ) as projects ON projects."partnerId"=partners."id"
          WHERE partners."statusId" = '${Partner.partnerStatusApproved}'
         GROUP BY partners."id"
          HAVING COUNT(projects."id") < ${Partner.PROJECTS_LIMIT}`

        const partners = await sequelize.query(query, {
            type: QueryTypes.SELECT
        })

        return partners;
    }

    static getNameById = async (partnerId: number) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        const query = `SELECT p."name${LANG}" as "name" FROM partners p WHERE p."id" = ${partnerId}`;
    
        const partner = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true,
            mapToModel: true
        });
        return partner;
    }

    static getIdByRequestId = async (requestId: number) => {
        const query = `SELECT p."partnerId"
            FROM projects p
            LEFT JOIN project_tranches pt ON pt."projectId" = p."id"
            LEFT JOIN face_requests fr ON fr."trancheId" = pt."id"
            WHERE fr."id" = ${requestId}`;

        const partner = await sequelize.query(query,{
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        if (partner) {
            return partner.partnerId;
        }
        return null;
    }
}
export default PartnerRepository;