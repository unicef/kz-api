import { Request } from "express";
import sequelize from "../services/sequelize";
import Sequelize from "sequelize";
import Partner from "../models/partner";
import Role from "../models/role";
import PartnerWithoutAssistant from "../exceptions/partner/partnerWithoutAssistant";
import PartnerHasManyAssists from "../exceptions/partner/partnerHasManyAssists";
import User from "../models/user";
import UserNotfind from "../exceptions/userNotFind";
import PartnerWithoutAuthorised from "../exceptions/partner/partnerWithoutAuthorised";

class PartnerHelper {
    static partnerFields = [
        "nameEn",
        "nameRu",
        "tradeNameEn",
        "tradeNameRu",
        "license",
        "countryId",
        "ceoFirstNameEn",
        "ceoFirstNameRu",
        "ceoLastNameEn",
        "ceoLastNameRu",
        "establishmentYear",
        "employersCount",
        "areaOfWorkId",
        "ownershipId",
        "partnerTypeId",
        "csoTypeId",
        "tel",
        "website",
        "cityEn",
        "cityRu",
        "addressEn",
        "addressRu",
        "zip"
    ];

    static partnerSelectFields = [
        "country",
        "areaOfWork",
        "ownership",
        "partnerType",
        "csoType"
    ];

    static getPartnerDataFromRequest = (companyData: any): {} => {
        let partnerData: any = {};
        PartnerHelper.partnerFields.forEach((field)=>{
            if ((companyData[field] && companyData[field]!== null) || companyData[field] == '') {
                partnerData[field] = companyData[field];
            }
        })

        PartnerHelper.partnerSelectFields.forEach((field)=>{
            if (companyData[field] && companyData[field]!== null) {
                partnerData[field+"Id"] = companyData[field]["id"];
            }
        })

        return partnerData;
    }

    /**
     * Get responsible assistant user from partner object
     */
    static getPartnerAssistant = async (partner: Partner): Promise<User> => {
        // get assistant user ids
        const assistantIds: Array<{id: number}>|null = await sequelize.query('SELECT users."id" FROM users LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN partners p ON p.id = users."partnerId" WHERE uhr."roleId" = \'' + Role.partnerAssistId + '\' AND users."partnerId" = ' + partner.id, 
        {type: Sequelize.QueryTypes.SELECT});

        if (assistantIds.length < 1) {
            throw new PartnerWithoutAssistant();
        }
        if (assistantIds.length > 1) {
            throw new PartnerHasManyAssists();
        }
        // get assistant
        let assistantId = assistantIds.map(a => a.id);
        const assistant: User|null = await User.findOne({
            where: {
                id: assistantId
            },
            include: [User.associations.personalData]
        });
        
        if (assistant == null) {
            throw new UserNotfind();
        }

        return assistant;
    }

    /**
     * Get autorised person user from partner object
     */
    static getPartnerAuthorised = async (partner: Partner): Promise<User|null> => {
        // get authorised user ids
        const authorisedIds: Array<{id: number}>|null = await sequelize.query('SELECT users."id" FROM users LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN partners p ON p.id = users."partnerId" WHERE uhr."roleId" = \'' + Role.partnerAuthorisedId + '\' AND users."partnerId" = ' + partner.id, 
        {type: Sequelize.QueryTypes.SELECT});

        if (authorisedIds.length < 1) {
            return null;
        }
        if (authorisedIds.length > 1) {
            throw new PartnerHasManyAssists();
        }
        // get authorised person
        let authorisedId = authorisedIds.map(a => a.id);
        const authorised: User|null = await User.findOne({
            where: {
                id: authorisedId
            },
            include: [User.associations.personalData]
        });
        
        if (authorised == null) {
            throw new UserNotfind();
        }

        return authorised;
    }
    
    static isPartnerHasAuthorised = async (partnerId: number): Promise<boolean> => {
        const authorisedIds: Array<{id: number}>|null = await sequelize.query('SELECT users."id" FROM users LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN partners p ON p.id = users."partnerId" WHERE uhr."roleId" = \'' + Role.partnerAuthorisedId + '\' AND users."partnerId" = ' + partnerId, 
        {type: Sequelize.QueryTypes.SELECT});

        if (authorisedIds.length < 1) {
            return false;
        }
        return true;
    }
}

export default PartnerHelper;