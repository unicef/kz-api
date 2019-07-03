import sequelize from "../services/sequelize";
import Sequelize from "sequelize";
import Role from "../models/role";
import PartnerWithoutAssistant from "../exceptions/partner/partnerWithoutAssistant";
import PartnerHasManyAssists from "../exceptions/partner/partnerHasManyAssists";
import User from "../models/user";
import UserNotfind from "../exceptions/userNotFind";

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

}

export default UnicefHelper;