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

    static getUserDataFromRequest = (req: Request): {} => {
        let userData: any = {};
        UserHelper.userPersonalFields.forEach((field)=>{
            if (req.body.user[field] && req.body.user[field]!== null) {
                userData[field] = req.body.user[field];
            } else {
                userData[field] = '';
            }
        })

        return userData;
    }

    static getUserPartner = async (userId: number): Promise<number|null> => {
        const Op = Sequelize.Op;
        let partner: Partner|null = await Partner.findOne({
            where: {
                [Op.or]: [{assistId: userId}, {authorisedId: userId}]
            }
        });
        if (partner) {
            return partner.id;
        } else {
            return null;
        }
    }
}

export default UserHelper;