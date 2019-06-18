import { Request } from "express";
import Partner from "../models/partner";
import Sequelize from "sequelize";

class UserHelper {
    static userPersonalFields = [
        "firstNameEn",
        "firstNameRu",
        "lastNameEn",
        "lastNameRu",
        "occupationEn",
        "occupationRu",
        "tel",
        "mobile"
    ]

    static getUserDataFromRequest = (userInputData: any): {} => {
        let userData: any = {};
        UserHelper.userPersonalFields.forEach((field)=>{
            if (userInputData[field] && userInputData[field]!== null) {
                userData[field] = userInputData[field];
            } else {
                userData[field] = '';
            }
        })

        return userData;
    }

    static getUserPartner = async (userId: number): Promise<Partner|null> => {
        const Op = Sequelize.Op;
        let partner: Partner|null = await Partner.findOne({
            where: {
                [Op.or]: [{assistId: userId}, {authorisedId: userId}]
            }
        });
        if (partner) {
            return partner;
        } else {
            return null;
        }
    }
}

export default UserHelper;