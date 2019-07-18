import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class DonorRepository {
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
}
export default DonorRepository;