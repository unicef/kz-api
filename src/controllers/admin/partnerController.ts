import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import i18n from "i18next";
import User from "../../models/user";
import UserHelper from "../../helpers/userHelper";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import Role from "../../models/role";
import UserPersonalData from "../../models/userPersonalData";
import event from "../../services/event";
import UserRegisteredRemotely from "../../events/userRegisteredRemotely";
import PartnerHelper from "../../helpers/partnerHelper";
import Partner from "../../models/partner";
import ApiController from "../apiController";

class AdminPartnerController {
    static createPartner = async (req: Request, res: Response) => {
        // check user exists
        const userExists = await User.isUserExists(req.body.user.email);
        if (userExists) {
            throw new UserAlreadyExists(400, i18n.t('userExistsError'), i18n.t('userExistsError'));
        }

        // creating user
        const passwordSalt: string = cryptoRandomString(10);
        const password: string = cryptoRandomString(12);

        const user = await User.create({
            email: req.body.user.email,
            password: User.generatePassword(passwordSalt, password),
            passwordSalt: passwordSalt
        });
        // add role to user
        const role = await Role.findByPk(req.body.user.roleId);
        user.addRole(role);

        // working with user data
        let userData: any = UserHelper.getUserDataFromRequest(req);
        userData['userId'] = user.id;
        UserPersonalData.create(userData);

        event(new UserRegisteredRemotely(user));
        if (req.body.user.roleId == 'ra') {
            let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req);
            // create new partner
            partnerData["nameEn"] = req.body.company.nameEn;
            partnerData["nameRu"] = req.body.company.nameRu;
            partnerData["assistId"] = user.id;

            const partner = await Partner.create(partnerData);
        } else {
            const partner = await Partner.findOne({
                where: {
                    id: req.body.user.companyId
                }
            });
            if (partner) {
                partner.authorisedId = user.id;
                partner.save();
            }
        }
        // working with documents TODO!!!

        ApiController.success({
            message: i18n.t('successPartnerCreation'),
            userId: user.id,
            companyId: partner.id
        }, res);
    }
}

export default AdminPartnerController;