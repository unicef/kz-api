import { Request } from "express";

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
            }
        })

        return userData;
    }
}

export default UserHelper;