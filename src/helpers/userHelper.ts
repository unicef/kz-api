import { Request } from "express";
import Partner from "../models/partner";
import Sequelize from "sequelize";
import User from "../models/user";

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

    static getUserPartner = async (user: User): Promise<Partner|null> => {
        if (user.partnerId == null) {
            return null;
        } 
        const partner = await Partner.findByPk(user.partnerId);
        if (partner == null) {
            return null;
        }

        return partner;
    }
}

export default UserHelper;