import sequelize from "../services/sequelize";
import Sequelize from "sequelize";
import Role from "../models/role";
import PartnerWithoutAssistant from "../exceptions/partner/partnerWithoutAssistant";
import PartnerHasManyAssists from "../exceptions/partner/partnerHasManyAssists";
import User from "../models/user";
import UserNotfind from "../exceptions/userNotFind";
import { number } from "@hapi/joi";

class UnicefHelper {
    static unicefPersonalFields = [
        "firstNameEn",
        "firstNameRu",
        "lastNameEn",
        "lastNameRu",
        "occupationEn",
        "occupationRu",
        "tel",
        "mobile"
    ];

    static getUnicefDataFromRequest = (userInputData: any): {} => {
        let unicefData: any = {};
        UnicefHelper.unicefPersonalFields.forEach((field)=>{
            if (userInputData[field] && userInputData[field]!== null) {
                unicefData[field] = userInputData[field];
            } else {
                unicefData[field] = '';
            }
        })

        return unicefData;
    }

    static getUnicefUserRole = async (user: number|User): string|null => {
        let userObj: User|null = null;
        if (typeof user == number) {
            let userObj = await User.findOne({
                where: {
                    id: user
                },
                include: [
                    User.associations.roles
                ]
            });

            if (userObj == null) {
                return null;
            }
        } else {
            let userObj = user;
        }

        userObj.roles.forEach(role => {
            switch (role.id) {
                case Role.unicefResponsibleId:
                    return Role.unicefResponsibleId;
                case Role.unicefBudgetId:
                    return Role.unicefBudgetId;
                case Role.unicefDeputyId:
                    return Role.unicefDeputyId;
                case Role.unicefOperationId:
                    return Role.unicefOperationId;
            }
        });

        return null;
    }

}

export default UnicefHelper;