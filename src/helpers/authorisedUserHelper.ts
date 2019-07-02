import i18n from "i18next";
import Partner from "../models/partner";
import UserHelper from "./userHelper";
import User from "../models/user";
import Role from "../models/role";
import UserPersonalData from "../models/userPersonalData";
import PartnerHelper from "./partnerHelper";
import PartnerAlreadyHasAuthorised from "../exceptions/partner/partnerAlreadyHasAuthorised";
import { Transaction } from "sequelize/types";

class AuthorisedUserHelper {
    static createAuthorisedPerson = async (authorisedInputData: any, partner: Partner): Promise<User> => {
        // check if partner allready has authorised person
        if (PartnerHelper.isPartnerHasAuthorised(partner.id)) {
            throw new PartnerAlreadyHasAuthorised(400, 211, i18n.t('partnerAlreadyHasAuthorised'), 'Partner (id:' + partner.id + ') already has authorised person');
        }

        let authorisedData: any = UserHelper.getUserDataFromRequest(authorisedInputData);

        // create authorised person remotely
        let authorisedPerson = await User.generateUser(authorisedInputData.email);
        // add role to user
        const role = await Role.findByPk(Role.partnerAuthorisedId);
        authorisedPerson.addRole(role);

        // working with user data
        authorisedData['userId'] = authorisedPerson.id;
        const userPersonalData = await UserPersonalData.create(authorisedData);

        authorisedPerson.partnerId = partner.id;
        authorisedPerson.save();

        return authorisedPerson;
    }
}

export default AuthorisedUserHelper;