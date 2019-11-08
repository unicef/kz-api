import { Request, Response } from "express";
import Sequelize from "sequelize";
import i18n from "i18next";
import User from "../../models/user";
import UserHelper from "../../helpers/userHelper";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import Role from "../../models/role";
import UserPersonalData from "../../models/userPersonalData";
import PartnerHelper from "../../helpers/partnerHelper";
import Partner from "../../models/partner";
import ApiController from "../apiController";
import UserNotfind from "../../exceptions/userNotFind";
import PartnerNotFind from "../../exceptions/partner/partnerNotFind";
import DocumentHelper from "../../helpers/documentHelper";
import UserIsNotActivated from "../../exceptions/userIsNotActivated";
import Pagination from "../../services/pagination";
import PartnerRepository from "../../repositories/partnerRepository";
import exceptionHandler from "../../services/exceptionHandler";
import UserRepository from "../../repositories/userRepository";
import FaceRequestRepository from "../../repositories/faceRequestRepository";
import UserHasActiveRequest from "../../exceptions/user/userHasActiveRequest";
import sequelize from "../../services/sequelize";

class AdminPartnerController {
    static createPartner = async (req: Request, res: Response) => {
        try {
            // check user exists
            const userExists = await User.isUserExists(req.body.user.email);
            if (userExists) {
                throw new UserAlreadyExists();
            }

            // creating user
            const user = await User.generateUser(req.body.user.email);
            // add role to user
            const role = await Role.findByPk(req.body.user.role.id);
            user.addRole(role);

            // working with user data
            let userData: any = UserHelper.getUserDataFromRequest(req.body.user);
            userData['userId'] = user.id;
            const userPersonalData = await UserPersonalData.create(userData);

            let partner: any = null;
            if (req.body.user.role.id == 'ra') {
                let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req.body.company);
                // create new partner
                partner = await Partner.create(partnerData);
                user.partnerId = partner.id;
                user.save();
            } else {
                partner = await Partner.findOne({
                    where: {
                        id: req.body.user.company.id
                    }
                });
                if (partner) {
                    let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req.body.company);
                    partner.update(partnerData);
                }
                user.partnerId = partner.id;
                user.save();
            }
            // working with documents 
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    await DocumentHelper.transferDocumentFromTemp(element.id, element.title, partner);
                });
            }

            ApiController.success({
                message: i18n.t('successPartnerCreation'),
                userId: user.id,
                companyId: partner.id
            }, res);
            return ;
        } catch(error) {
            return exceptionHandler(error, res);
        }
    }

    static updatePartner = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.body.user.id);
            if (user == null) {
                throw new UserNotfind(400, 116, i18n.t('adminUserNotFind'), 'User with id:' + req.body.user.id + ' not find');
            }

            // get user request data
            let userData = UserHelper.getUserDataFromRequest(req.body.user);
            const userPersonalData = await UserPersonalData.findOne({
                where: {
                    userId: user.id
                }
            });
            if (userPersonalData == null) {
                throw new UserNotfind(400, 116, i18n.t('userPersonalDataNotFind'), 'User personal data not find');
            }
            await userPersonalData.update(userData);
            // get partner data from request
            let partnerData = PartnerHelper.getPartnerDataFromRequest(req.body.company);
            let partner: Partner|null = null;
            if (req.body.company.id) {
                partner = await Partner.findByPk(req.body.company.id);
                if (partner == null) {
                    throw new PartnerNotFind(400, 110, i18n.t('adminPartnerNotFind'), 'Partner with id:' + req.body.company.id + ' nod find');
                }    
                await partner.update(partnerData);
            } else {
                // create partner and set partner id into user partner id property
                partner = await Partner.create(partnerData);

                user.partnerId = partner.id;
                user.save();
            }
            // working with partner documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    DocumentHelper.transferDocumentFromTemp(element.id, element.title, partner);
                });
            }

            return ApiController.success({
                message: i18n.t('adminSuccessPartnerSaving')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getPartnersList = async (req: Request, res: Response) => {
        let pagination = new Pagination(req, 15);
        let searchInstanse = req.query.search?req.query.search:null;
        const partners = await PartnerRepository.getAdminList(searchInstanse, pagination);

        const responseData = {
            partners: partners,
            currentPage: pagination.getCurrentPage(),
            lastPage: pagination.getLastPage()
        }

        return ApiController.success(responseData, res);
    }

    static block = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try {
            let roleId = Role.partnerAuthorisedId;
            const user = await User.findOne({
                where: {
                    id: req.body.userId
                }, 
                include: [
                    User.associations.roles
                ]
            });
            
            if (user == null) {
                throw new UserNotfind();
            }
            if (user.emailVerifiedAt == null || user.isBlocked) {
                throw new UserIsNotActivated(412, 111, i18n.t('adminUserAccountNotActivated'), 'User (id: ' + user.id + ' ) isn\'t activated');
            }
            if (!user.hasRole(Role.partnerAssistId) && !user.hasRole(Role.partnerAuthorisedId)) {
                throw new UserNotfind();
            }
            if (roleId == Role.partnerAuthorisedId) {
                // check if is it opened face request
                const faceRequest = await FaceRequestRepository.getActiveByPartnerId(user.partnerId);

                if (faceRequest) {
                    throw new UserHasActiveRequest();
                }
            }
            
            const newUserEmail = req.body.email;
            const isUserExists = await User.isUserExists(newUserEmail);
            if (isUserExists) {
                throw new UserAlreadyExists();
            }
            // blocking partner process
            const newUser = await User.generateUser(newUserEmail, transaction);

            // add role to user
            if (user.hasRole(Role.partnerAssistId)) {
                roleId = Role.partnerAssistId;
            }
            await UserRepository.addRole(newUser.id, roleId, transaction);
            newUser.partnerId = user.partnerId;

            UserPersonalData.create({
                userId: newUser.id,
                firstNameEn: '',
                firstNameRu: '',
                lastNameEn: '',
                lastNameRu: '',
                occupationEn: '',
                occupationRu: '',
                tel: '',
                mobile: ''
            }, {transaction: transaction});
            await newUser.save({transaction:transaction});

            user.partnerId = null;
            user.isBlocked = true;
            await user.save({transaction: transaction});

            transaction.commit();
            const responseData = {
                message: i18n.t('partnerBlockedSuccess'),
                newUserId: newUser.id
            };

            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }
}

export default AdminPartnerController;