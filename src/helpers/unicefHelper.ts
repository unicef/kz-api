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

        let role = null;
        userObj.roles.forEach(role => {
            switch (role.id) {
                case Role.unicefResponsibleId:
                    role = Role.unicefResponsibleId;
                    break;
                case Role.unicefBudgetId:
                    role = Role.unicefBudgetId;
                    break;
                case Role.unicefDeputyId:
                    role = Role.unicefDeputyId;
                    break;
                case Role.unicefOperationId:
                    role = Role.unicefOperationId;
                    break;
            }
        });

        return role;
    }

}

export default UnicefHelper;