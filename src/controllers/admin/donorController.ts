import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "../apiController";
import HttpException from "../../exceptions/httpException";
import User from "../../models/user";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import Role from "../../models/role";
import DonorHelper from "../../helpers/donorHelper";
import UserPersonalData from "../../models/userPersonalData";
import DonorRepository from "../../repositories/donorRepository";

class AdminDonorController {

    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // check user exists
            const userExists = await User.isUserExists(req.body.email);
            if (userExists) {
                throw new UserAlreadyExists();
            }

            // creating user
            const user = await User.generateUser(req.body.email);
            // add role to user
            const role = await Role.findByPk(Role.donorId);
            user.addRole(role);

            // working with user data
            let userData: any = DonorHelper.getPersonalData(req.body);
            userData['userId'] = user.id;
            const userPersonalData = await UserPersonalData.create(userData);

            // working with company
            let companyData: any = DonorHelper.getCompanyData(req.body);
            const donorCompany = await DonorRepository.saveDonorCompany(user.id, companyData);

            return ApiController.success({
                message: i18n.t('successDonorCreation'),
                userId: user.id
            }, res);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
        
    }
}

export default AdminDonorController;