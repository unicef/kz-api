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
import UserIsNotActivated from "../../exceptions/userIsNotActivated";
import Pagination from "../../services/pagination";
import exceptionHandler from "../../services/exceptionHandler";

class AdminDonorController {

    /**
     * Get donors list for admin panel
     */
    static list = async (req: Request, res: Response, next: NextFunction) => {
        let pagination = new Pagination(req, 15);
        let searchInstanse = req.query.search?req.query.search:null;
        const donors = await DonorRepository.getAdminList(searchInstanse, pagination);

        const responseData = {
            donors: donors,
            currentPage: pagination.getCurrentPage(),
            lastPage: pagination.getLastPage()
        }

        return ApiController.success(responseData, res);
    }

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
            return exceptionHandler(error, res);
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
                message: i18n.t('adminSuccessDonorUpdate')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static block = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findOne({
                where: {
                    id: req.body.userId
                },
                include:[
                    User.associations.roles
                ]
            });
            if (user == null) {
                throw new UserNotfind();
            }
            if (user.emailVerifiedAt == null || user.isBlocked) {
                throw new UserIsNotActivated(412, 111, i18n.t('adminUserAccountNotActivated'), 'User (id: ' + user.id + ' ) isn\'t activated');
            }
            const isDonor = await user.hasRole(Role.donorId);
            if (!isDonor) {
                throw new UserNotfind(403, 332, i18n.t('userNotDonor'), 'User ( id : ' + user.id + ') is not donor');
            }
    
            user.isBlocked = true;
            await user.save();
    
            const responseData = {
                message: i18n.t('donorBlockedSuccess')
            };
    
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default AdminDonorController;