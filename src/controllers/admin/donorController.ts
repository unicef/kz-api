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
import UserNotfind from "../../exceptions/userNotFind";

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

    static update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findByPk(req.body.id);
            if (user == null) {
                throw new UserNotfind(400, 116, i18n.t('adminUserNotFind'), 'User with id:' + req.body.id + ' not find');
            }

            // get user request data
            let userData = DonorHelper.getPersonalData(req.body);
            const userPersonalData = await UserPersonalData.findOne({
                where: {
                    userId: user.id
                }
            });
            if (userPersonalData == null) {
                throw new UserNotfind(400, 116, i18n.t('userPersonalDataNotFind'), 'User personal data not find');
            }
            await userPersonalData.update(userData);

            // working with company
            let companyData: any = DonorHelper.getCompanyData(req.body);
            const donorCompany = await DonorRepository.saveDonorCompany(user.id, companyData);


            return ApiController.success({
                message: i18n.t('adminSuccessUnicefUpdate')
            }, res);
        } catch (error) {
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