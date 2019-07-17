import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";
import Role from "../models/role";

class PartnerRepository {
    static findPartnerById = async (id: number) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        let partner: any = await sequelize.query('SELECT "partner"."id", "partner"."statusId", "partner"."nameEn", "partner"."nameRu", "partner"."tradeNameEn", "partner"."tradeNameRu", "partner"."license","partner"."ceoFirstNameEn", "partner"."ceoFirstNameRu", "partner"."ceoLastNameEn", "partner"."ceoLastNameRu", "partner"."establishmentYear", "partner"."employersCount", "partner"."tel", "partner"."website", "partner"."cityEn", "partner"."cityRu", "partner"."addressEn", "partner"."addressRu", "partner"."zip", "partner"."createdAt", "partner"."updatedAt", "country"."id" AS "country.id", "country"."title" AS "country.title", "areaOfWork"."id" AS "areaOfWork.id", "areaOfWork"."title' + lang + '" AS "areaOfWork.title", "ownership"."id" AS "ownership.id", "ownership"."title' + lang + '" AS "ownership.title", "partnerType"."id" AS "partnerType.id", "partnerType"."title' + lang + '" AS "partnerType.title", "csoType"."id" AS "csoType.id", "csoType"."title' + lang + '" AS "csoType.title", "authorised"."authorisedId" as "authorisedId","assist"."assistId" as "assistId" FROM "partners" AS "partner" LEFT OUTER JOIN "countries" AS "country" ON "partner"."countryId" = "country"."id" LEFT OUTER JOIN "areas_of_work" AS "areaOfWork" ON "partner"."areaOfWorkId" = "areaOfWork"."id" LEFT OUTER JOIN "companys_ownerships" AS "ownership" ON "partner"."ownershipId" = "ownership"."id" LEFT OUTER JOIN "partner_types" AS "partnerType" ON "partner"."partnerTypeId" = "partnerType"."id" LEFT OUTER JOIN "cso_types" AS "csoType" ON "partner"."csoTypeId" = "csoType"."id" LEFT outer JOIN (SELECT "us"."id" AS "authorisedId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' + Role.partnerAuthorisedId + '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "authorised" ON "authorised"."partnerId" = "partner"."id" LEFT outer JOIN (SELECT "us"."id" AS "assistId", "p"."id" AS "partnerId" FROM "users" as "us" LEFT JOIN "users_has_roles" as "uhr" ON "us"."id" = "uhr"."userId" LEFT JOIN "partners" as "p" ON "p"."id" = "us"."partnerId" WHERE "uhr"."roleId" = \'' +Role.partnerAssistId+ '\' AND "us"."partnerId" = ' +id+ ' LIMIT 1) as "assist" ON "assist"."partnerId" = "partner"."id" WHERE "partner"."id" = ' + id, {
            type: QueryTypes.SELECT,
            nest: true
        });

        return partner;
    }
}
export default PartnerRepository;