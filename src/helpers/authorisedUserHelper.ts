import i18n from "i18next";
import Partner from "../models/partner";
import UserHelper from "./userHelper";
import User from "../models/user";
import Role from "../models/role";
import UserPersonalData from "../models/userPersonalData";
import PartnerHelper from "./partnerHelper";
import PartnerAlreadyHasAuthorised from "../exceptions/partner/partnerAlreadyHasAuthorised";
import { Transaction, CreateOptions, SaveOptions } from "sequelize/types";
import UserRepository from "../repositories/userRepository";

class AuthorisedUserHelper {
    static createAuthorisedPerson = async (authorisedInputData: any, partner: Partner, transaction?: Transaction): Promise<User> => {
        // check if partner allready has authorised person
        if (await PartnerHelper.isPartnerHasAuthorised(partner.id)) {
            throw new PartnerAlreadyHasAuthorised(400, 211, i18n.t('partnerAlreadyHasAuthorised'), 'Partner (id:' + partner.id + ') already has authorised person');
        }

        let authorisedData: any = UserHelper.getUserDataFromRequest(authorisedInputData);

        // create authorised person remotely
        let authorisedPerson = await User.generateUser(authorisedInputData.email, transaction);
        // add role to user
        const role = await Role.findByPk();
        await UserRepository.addRole(authorisedPerson.id, Role.partnerAuthorisedId, transaction);

        // working with user data
        authorisedData['userId'] = authorisedPerson.id;
        let options: CreateOptions|SaveOptions = {};
        if (transaction) {
            options.transaction = transaction;
        }
        const userPersonalData = await UserPersonalData.create(authorisedData, options);

        authorisedPerson.partnerId = partner.id;
        await authorisedPerson.save(options);

        return authorisedPerson;
    }
}

export default AuthorisedUserHelper;