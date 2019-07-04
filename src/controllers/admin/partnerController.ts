import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import fs from "fs";
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
import HttpException from "../../exceptions/httpException";
import TmpFile from "../../models/tmpFile";
import PartnerDocument from "../../models/partnerDocument";
import UserNotfind from "../../exceptions/userNotFind";
import PartnerNotFind from "../../exceptions/partner/partnerNotFind";
import DocumentHelper from "../../helpers/documentHelper";
import sequelize from "../../services/sequelize";
import { throws } from "assert";
import PartnerAlreadyBlocked from "../../exceptions/partner/partnerAlreadyBlocked";
import UserIsNotActivated from "../../exceptions/userIsNotActivated";

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
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static updatePartner = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.body.user.id);
            if (user == null) {
                throw new UserNotfind(400, 116, i18n.t('adminUserNotFind'), 'User with id:' + req.body.user.id + ' not find');
            }

            const partner = await Partner.findByPk(req.body.company.id);
            if (partner == null) {
                throw new PartnerNotFind(400, 110, i18n.t('adminPartnerNotFind'), 'Partner with id:' + req.body.company.id + ' nod find');
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
            await partner.update(partnerData);
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
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getPartnersList = async (req: Request, res: Response) => {
        let page = 1;
        const pageCount = 25;
        let responseData = {};
        if (req.query.page !== undefined) {
            page = parseInt(req.query.page);
        }
        let searchInstanse = '';

        // get partners ids
        const partnersQuery: Array<{userId: number}>|null = await sequelize.query('SELECT "userId" FROM users_has_roles WHERE "roleId" = \'' + Role.partnerAssistId + '\' OR "roleId" = \'' + Role.partnerAuthorisedId  + '\' GROUP BY "userId"', {
            type: Sequelize.QueryTypes.SELECT
        });
        
        if (partnersQuery == null || partnersQuery.length < 1) {
            // partners count = 0
            responseData = {partners: []};

            return ApiController.success(responseData, res);
        }

        const lastPage = Math.ceil(partnersQuery.length / pageCount);
        if (page>lastPage) {
            page = lastPage;
        }

        let usersIds = partnersQuery.map(a => a.userId);
        if (req.query.search) {
            const idSearch = +req.query.search ? +req.query.search : 0;
            searchInstanse = ' AND (users."id" = ' + idSearch +' OR users."email" LIKE \'%'+ req.query.search +'%\' OR upd."firstNameEn" LIKE \'%'+ req.query.search +'%\' OR upd."lastNameEn" LIKE \'%'+ req.query.search +'%\' OR p."nameEn" LIKE \'%'+ req.query.search +'%\')';
        }

        let query = 'SELECT users."email", users."id",CASE WHEN users."emailVerifiedAt" IS NULL THEN \'not active\' WHEN users."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "userStatus", TO_CHAR(users."createdAt", \'yyyy-mm-dd HH:ii:ss\') as "createdAt", upd."firstNameEn" as "firstName", upd."lastNameEn" as "lastName", r."title" as "role", p."nameEn" as "company", p."statusId" as "companyStatus" FROM users LEFT JOIN users_personal_data AS upd ON users."id" = upd."userId" LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN roles r ON r."id" = uhr."roleId" LEFT JOIN partners p ON p."id" = users."partnerId" WHERE users."id" IN (' + usersIds.join(', ') + ')' + searchInstanse + ' ORDER BY users."id" ASC';
        const offset = pageCount * (page-1);

        query = query + ' LIMIT ' + pageCount + ' OFFSET ' + offset;

        const partners = await sequelize.query(query,{type: Sequelize.QueryTypes.SELECT});

        responseData = {
            partners: partners,
            currentPage: page,
            lastPage: lastPage
        }

        return ApiController.success(responseData, res);
    }

    static block = async (req: Request, res: Response) => {
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
            if (user.emailVerifiedAt == null) {
                throw new UserIsNotActivated(412, 111, i18n.t('adminUserAccountNotActivated'), 'User (id: ' + user.id + ' ) isn\'t activated');
            }
            if (user.isBlocked) {
                throw new PartnerAlreadyBlocked();
            }
            if (!user.hasRole(Role.partnerAssistId) && !user.hasRole(Role.partnerAuthorisedId)) {
                throw new UserNotfind();
            }
            
            const newUserEmail = req.body.email;
            const isUserExists = await User.isUserExists(newUserEmail);
            if (isUserExists) {
                throw new UserAlreadyExists();
            }
            // blocking partner process
            const newUser = await User.generateUser(newUserEmail);

            // add role to user
            if (user.hasRole(Role.partnerAssistId)) {
                roleId = Role.partnerAssistId;
            }
            const role = await Role.findByPk(roleId);
            newUser.addRole(role);
            newUser.partnerId = user.partnerId;
            newUser.save();

            user.partnerId = null;
            user.isBlocked = true;
            user.save();

            const responseData = {
                message: i18n.t('partnerBlockedSuccess'),
                newUserId: newUser.id
            };

            return ApiController.success(responseData, res);
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

export default AdminPartnerController;