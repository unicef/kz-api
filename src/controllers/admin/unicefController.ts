import { Request, Response, NextFunction } from "express";
import Sequelize from "sequelize";
import i18n from "i18next";
import Role from "../../models/role";
import ApiController from "../apiController";
import User from "../../models/user";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import UnicefHelper from "../../helpers/unicefHelper";
import UserPersonalData from "../../models/userPersonalData";
import UserNotfind from "../../exceptions/userNotFind";
import UserIsNotActivated from "../../exceptions/userIsNotActivated";
import BadRole from "../../exceptions/user/badRole";
import sequelize from "../../services/sequelize";
import BadValidationException from "../../exceptions/badValidationException";
import Project from "../../models/project";
import { PatchUnicefMakeAdmin } from "../../requests/unicef/patchUnicefMakeAdmin";
import exceptionHandler from "../../services/exceptionHandler";
import UserRepository from "../../repositories/userRepository";
import { PatchUnicefUnmakeAdmin } from "../../requests/unicef/patchUnicefUnmakeAdmin";
import FaceRequestRepository from "../../repositories/faceRequestRepository";
import UserHasActiveRequest from "../../exceptions/user/userHasActiveRequest";
import FaceReportRepository from "../../repositories/faceReportRepository";

class AdminUnicefController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let roles = await sequelize.query('select "id", "title' + lang + '" as "title" FROM roles WHERE "id"=\'' +Role.unicefResponsibleId+ '\' OR "id"=\'' +Role.unicefBudgetId+ '\' OR "id"=\'' +Role.unicefDeputyId+ '\' OR "id"=\'' +Role.unicefOperationId+ '\'',
        {type: Sequelize.QueryTypes.SELECT});
        const responseData = {
            roles: roles
        }

        return ApiController.success(responseData, res);
    }

    static create = async (req: Request, res: Response, next: NextFunction) => {
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
            let userData: any = UnicefHelper.getUnicefDataFromRequest(req.body.user);
            userData['userId'] = user.id;
            const userPersonalData = await UserPersonalData.create(userData);

            return ApiController.success({
                message: i18n.t('successUnicefCreation'),
                userId: user.id
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findByPk(req.body.user.id);
            if (user == null) {
                throw new UserNotfind(400, 116, i18n.t('adminUserNotFind'), 'User with id:' + req.body.user.id + ' not find');
            }

            // get user request data
            let userData = UnicefHelper.getUnicefDataFromRequest(req.body.user);
            const userPersonalData = await UserPersonalData.findOne({
                where: {
                    userId: user.id
                }
            });
            if (userPersonalData == null) {
                throw new UserNotfind(400, 116, i18n.t('userPersonalDataNotFind'), 'User personal data not find');
            }
            await userPersonalData.update(userData);

            return ApiController.success({
                message: i18n.t('adminSuccessUnicefUpdate')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getUnicefList = async (req: Request, res: Response, next: NextFunction) => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let page = 1;
        const pageCount = 15;
        let responseData = {};
        if (req.query.page !== undefined && req.query.page!=='') {
            page = parseInt(req.query.page);
        }
        let searchInstanse = '';
        if (req.query.search) {
            const idSearch = +req.query.search ? +req.query.search : 0;
            searchInstanse = ' AND (users."id" = ' + idSearch +' OR users."email" ILIKE \'%'+ req.query.search +'%\' OR upd."firstName' +lang+ '" ILIKE \'%'+ req.query.search +'%\' OR upd."lastName' +lang+ '" ILIKE \'%'+ req.query.search +'%\')';
        }

        // get unicef ids
        const unicefQuery: Array<{userId: number}>|null = await sequelize.query('SELECT users_has_roles."userId" as "userId" FROM users_has_roles RIGHT JOIN users ON users_has_roles."userId" = users."id" RIGHT JOIN users_personal_data upd ON users."id" = upd."userId" WHERE (users_has_roles."roleId" = \'' + Role.unicefResponsibleId + '\' OR users_has_roles."roleId" = \'' + Role.unicefBudgetId  + '\' OR users_has_roles."roleId" = \'' + Role.unicefDeputyId  + '\' OR users_has_roles."roleId" = \'' + Role.unicefOperationId  + '\')' + searchInstanse + ' GROUP BY users_has_roles."userId"', {
            type: Sequelize.QueryTypes.SELECT
        });
        
        if (unicefQuery == null || unicefQuery.length < 1) {
            // unicef count = 0
            responseData = {unicefUsers: []};

            return ApiController.success(responseData, res);
        }

        const lastPage = Math.ceil(unicefQuery.length / pageCount);
        if (page>lastPage) {
            page = lastPage;
        }

        let usersIds = unicefQuery.map(a => a.userId);

        let query = 'SELECT users."email", users."id",CASE WHEN users."emailVerifiedAt" IS NULL THEN \'not active\' WHEN users."isBlocked" THEN \'blocked\' ELSE \'active\' END AS  "userStatus", TO_CHAR(users."createdAt", \'yyyy-mm-dd HH:MI\') as "createdAt", upd."firstName'+lang+'" as "firstName", upd."lastName'+lang+'" as "lastName", r."title'+lang+'" as "role" FROM users LEFT JOIN users_personal_data AS upd ON users."id" = upd."userId" LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN roles r ON r."id" = uhr."roleId" WHERE users."id" IN (' + usersIds.join(', ') + ') AND ("roleId" = \'' + Role.unicefResponsibleId + '\' OR "roleId" = \'' + Role.unicefBudgetId  + '\' OR "roleId" = \'' + Role.unicefDeputyId  + '\' OR "roleId" = \'' + Role.unicefOperationId  + '\')' + searchInstanse + ' ORDER BY users."id" DESC';
        const offset = pageCount * (page-1);

        query = query + ' LIMIT ' + pageCount + ' OFFSET ' + offset;

        const unicefList = await sequelize.query(query,{type: Sequelize.QueryTypes.SELECT});

        responseData = {
            users: unicefList,
            currentPage: page,
            lastPage: lastPage
        }

        return ApiController.success(responseData, res);
    }

    static block = async (req: Request, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const newUserEmail = req.body.email;
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
            if (user.email == newUserEmail) {
                throw new BadValidationException(400, 121, i18n.t('blockUserErrorSameUser'), "Bad new user email. Same email with blocking user");
            }
            if (user.emailVerifiedAt == null || user.isBlocked) {
                throw new UserIsNotActivated(412, 111, i18n.t('adminUserAccountNotActivated'), 'User (id: ' + user.id + ' ) isn\'t activated');
            }
            const isUnicef = await user.isUnicefUser();
            if (!isUnicef) {
                throw new UserNotfind(403, 332, i18n.t('userNotUnicef'), 'User ( id : ' + user.id + ') is not unicef');
            }
    
            const userUnicefRole = await UnicefHelper.getUnicefUserRole(user);
            // if user has active face request/report - can't block user
            const activeRequestChain = await FaceRequestRepository.getActiveChainByUserId(user.id);
            const activeReportChain = await FaceReportRepository.getActiveChainByUserId(user.id);
            if (activeRequestChain || activeReportChain) {
                throw new UserHasActiveRequest();
            }
            const isUserExists = await User.isUserExists(newUserEmail);
            let newUser: User|null = null;
            if (isUserExists) {
                newUser = await User.findOne({
                    where: {
                        email: newUserEmail
                    },
                    include:[
                        User.associations.roles
                    ]
                });
                
                if (newUser) {
                    const newUserRole = await UnicefHelper.getUnicefUserRole(newUser);
                    // check is this user unicef
                    if (userUnicefRole != newUserRole) {
                        throw new BadRole(400, 234, i18n.t('userBadRole'), 'User has wrong role');
                    }
                }
    
            } else {
                // blocking partner process
                newUser = await User.generateUser(newUserEmail, transaction);
                // add role to user
                await UserRepository.addRole(newUser.id, userUnicefRole, transaction);
                
                await UserPersonalData.create({
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
                await newUser.save({transaction: transaction});
            }
            

            if (userUnicefRole === Role.unicefResponsibleId) {
                // set all in progress projects to new user
                const update = await Project.update({officerId: newUser.id}, {
                    where: {
                        officerId: user.id,
                        statusId: Project.IN_PROGRESS_STATUS_ID
                    },
                    transaction: transaction
                });
            }
    
            user.isBlocked = true;
            await user.save({transaction: transaction});
    
            transaction.commit();
            const responseData = {
                message: i18n.t('unicefBlockedSuccess'),
                newUserId: newUser.id
            };
    
            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }

    // add admin role to UNICEF USER
    static makeAdmin = async (req: PatchUnicefMakeAdmin, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const unicefUser = req.unicefUser;

            await UserRepository.addRole(unicefUser.id, Role.adminRoleId, transaction);
            transaction.commit();

            const responseData = {
                message: i18n.t('successMakeAdmin')
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }

    static unmakeAdmin = async (req: PatchUnicefUnmakeAdmin, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const adminUser = req.adminUser;

            await UserRepository.removeRole(adminUser.id, Role.adminRoleId, transaction);
            transaction.commit();

            const responseData = {
                message: i18n.t('successUnmakeAdmin')
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }
}

export default AdminUnicefController;