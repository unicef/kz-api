import { Request, Response, NextFunction } from "express";
import cryptoRandomString from "crypto-random-string";
import dateformat from "dateformat";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import i18n from "i18next";
import fs from "fs";
import ApiController from "./apiController";
import config from "../config/config";
import { captureException } from "@sentry/node";
import userIsNotActivated from "../exceptions/userIsNotActivated";
import UserAlreadyExists from "../exceptions/userAlreadyExists";
import BadActivationLink from "../exceptions/badActivationLink";
import BadEmailException from "../exceptions/badEmailException";
import ActivationHash from "../models/activationHash";
import User from "../models/user";
import Role from "../models/role";
import event from "../services/event";
import UserLoggedIn from "../events/userLoggedIn";
import UserRegistered from "../events/userRegistered";
import UserPersonalData from "../models/userPersonalData";
import UserHelper from "../helpers/userHelper";
import SetPasswordHash from "../models/setPasswordHash";
import BadSetPasswordLink from "../exceptions/badSetPasswordLink";
import HttpException from "../exceptions/httpException";
import putUserStepInformation from "../requests/user/putUserStepInformation";
import putPartnerStepInformation from "../requests/partner/putPartnerStepInformation";
import PartnerHelper from "../helpers/partnerHelper";
import Partner from "../models/partner";
import UserRegisteredRemotely from "../events/userRegisteredRemotely";
import TmpFile from "../models/tmpFile";
import PartnerDocument from "../models/partnerDocument";
import UserNotfind from "../exceptions/userNotFind";
import mailer from "../services/mailer";
import ResetPasswordMail from "../mails/resetPasswordMail";
import ActivationLinkMail from "../mails/activationLinkMail";
import AuthorisedUserHelper from "../helpers/authorisedUserHelper";
import sequelize from "../services/sequelize";
import DocumentHelper from "../helpers/documentHelper";
import WrongOldPassword from "../exceptions/user/wrongOldPassword";
import BlockedUserException from "../exceptions/blockedUserException";

class UserController {
    // get users list
    static getUsersList = async (req: Request, res: Response) => {
        let response = i18n.t('testlong');

        ApiController.success(req.user, res);
    }

    // get user Data about auth user
    static getMe = async (req: Request, res: Response) => {
        const user = req.user;
        let responseData: any = {
            id: user.id,
            email: user.email,
            showSeed: user.showSeed,
            showForm: false,
            createdAt: dateformat(user.createdAt, 'yy-mm-dd HH:MM:ss')
        }
        // working with rolles
        let roles: string[] = [];
        user.roles.forEach((role: Role) => {
            const roleHash: string = CryptoJS.AES.encrypt(role.id, user.id + responseData.createdAt).toString();
            roles.push(roleHash);
        });
        responseData.roles = roles;

        // get user seed phrase
        const seedPhrase = 'plot tank rate alarm dysfunctional approve garrulous saw pinch unbecoming zippy direful';
        if (user.showSeed) {
            // generate txt file with seed
            fs.writeFile(__dirname + '/../../assets/users/files/' + user.passwordSalt + ".txt", seedPhrase, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
            });

            responseData.seed = {
                phrase: seedPhrase,
                link: 'http://' + config.APP_NAME + '/file?id=' + user.id
            }
        }
        // showForm flag
        if (!user.personalData.isFilledData()) {
            responseData.showForm = true;
        }
        if (user.hasRole('ra') || user.hasRole('ap')) {
            const partner = await UserHelper.getUserPartner(user);
            if (partner == null || partner.statusId == Partner.partnerStatusNew || partner.statusId == Partner.partnerStatusRejected) {
                responseData.showForm = true;
            }
        }

        ApiController.success(responseData, res);
        return ;
    }

    // create partner process
    static createPartner = async (req: Request, res: Response) => {
        try {
            // check exists user
            let user: any = await User.findOne({
                where: {email: req.body.email},
            });
            if (user !== null) {
                throw new UserAlreadyExists();
            }

            // creating user
            const passwordSalt: string = cryptoRandomString(10);
            user = await User.create({
                email: req.body.email,
                password: User.generatePassword(passwordSalt, req.body.password),
                passwordSalt: passwordSalt
            })


            // add Responsible assistant role to user
            const role = await Role.findByPk('ra');
            user.addRole(role);

            event(new UserRegistered(user));
            
            const responseData = {
                userId: user.id,
                message: i18n.t('successCreatedPartner')
            };
            return ApiController.success(responseData, res);
        } catch(error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    // activation user process
    static activationProcess = async (req: Request, res: Response) => {
        const hash = req.body.hash;
        try {
            // get activation hash model
            const hashModel = await ActivationHash.findOne({
                where: {hash: hash}
            }) || false;
            // check expires
            let today: Date = new Date();
            if (!hashModel) {
                throw new BadActivationLink();
            }
            if (today > hashModel.expiredAt) {
                const secret: string = process.env.ACTIVATION_SECRET || '123fds';
                const hash: string = CryptoJS.AES.encrypt(user.email, secret).toString();
                return res.status(412).json({
                    success:false, 
                    error:{message:i18n.t('activationLinkExpired')}, 
                    data: {
                        repeatHash: hash
                    }
                });
            }
            // get activation user
            const user = await User.findByPk(hashModel.userId) || false;
            if (!user) {
                throw new BadActivationLink();
            }
            // activation process
            user.emailVerifiedAt = new Date();
            user.save();

            hashModel.destroy();

            const responseData = {
                message: i18n.t('successUserActivation')
            }

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

    static login = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            }) || false;
            if (!user) {
                throw new BadEmailException();
            }
            // check user password
            if (!user.checkPassword(req.body.password)) {
                throw new BadEmailException();
            }
    
            // check user activation 
            if (user.emailVerifiedAt == null) {
                // get activation user hash
                const secret: string = process.env.ACTIVATION_SECRET || '123fds';
                const hash: string = CryptoJS.AES.encrypt(user.email, secret).toString();
                return res.status(412).json({
                    success:false, 
                    error:{message:i18n.t('userIsNotActivated')}, 
                    data: {
                        repeatHash: hash
                    }
                });
            }
            if (user.isBlocked) {
                throw new BlockedUserException();
            }
    
            let token = jwt.sign({userEmail: user.email},
                config.jwt.secret,
                { expiresIn: '24h'});
            
            event(new UserLoggedIn(user));

            const responseData = {
                token: token,
                message: i18n.t('userSuccessfulAuth')
            };
            
            ApiController.success(responseData, res);
        } catch (error) {
            console.log(error);
            captureException(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
        
    }

    static changeShowSeedFlag = async (req: Request, res: Response) => {
        try {
            if (req.user.showSeed) {
                req.user.showSeed = false;
                req.user.save();
            }
    
            const responseData = {
                message: i18n.t('successChangeShowFeedFlag')
            }
    
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

    static setUserPersonalData = async (req: Request, res: Response) => {
        for (var key in req.user.personalData.dataValues) {
            if (req.body[key]) {
                req.user.personalData[key] = req.body[key];
            }
        }
        req.user.personalData.save();
        
        return ApiController.success({message: i18n.t('successUpdatingUserData')}, res);
    }

    static getUserById = async (req: Request, res: Response) => {
        const userId: number = req.query.id;

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: [
                User.associations.roles,
                User.associations.personalData
            ]
        });
        if (user && user.personalData) {
            // working with roles
            let roles: Role[] = [];
            let isAdmin = false;
            user.roles.forEach((role: Role, index: number) => {
                if (role.id == Role.adminRoleId) {
                    isAdmin = true;
                } else {
                    roles.push(role);
                }
            })
            const company = await UserHelper.getUserPartner(user);
            let responseData: any = {
                email: user.email,
                firstNameEn: user.personalData.firstNameEn,
                firstNameRu: user.personalData.firstNameRu,
                lastNameEn: user.personalData.lastNameEn,
                lastNameRu: user.personalData.lastNameRu,
                occupationEn: user.personalData.occupationEn,
                occupationRu: user.personalData.occupationRu,
                status: user.status,
                roles: roles,
                isAdmin: isAdmin,
                tel: user.personalData.tel,
                mobile: user.personalData.mobile,
                id: user.id,
                lastLogin: dateformat(user.lastLogin, 'yy-mm-dd HH:MM:ss'),
                createdAt: dateformat(user.createdAt, 'yy-mm-dd HH:MM:ss')
            }
            if (company) {
                responseData['company'] = company.id;
            } else {
                responseData['company'] = null;
            }

            ApiController.success(responseData, res);

            return ;
        } else {
            ApiController.failed(404, 'User not found', res);
            return ;
        }
    }

    static setUserPassword = async (req: Request, res: Response) => {
        const setPasswordHash: string = req.body.hash;
        const newUserPassword: string = req.body.password;
        try {
            const hashModel = await SetPasswordHash.findOne({
                where: {
                    hash: setPasswordHash
                }
            }) || false;
    
            // check expires
            if (!hashModel || hashModel.isHashExpired()) {
                throw new BadSetPasswordLink();
            }
            // get activation user
            const user = await User.findByPk(hashModel.userId) || false;
            if (!user) {
                throw new BadSetPasswordLink();
            }
            // activation process + set password
            user.setPassword(newUserPassword);
            user.emailVerifiedAt = new Date();
            user.save();
    
            hashModel.destroy();
    
            const responseData = {
                message: i18n.t('successUserActivation')
            }
    
            ApiController.success(responseData, res);
            return ;
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }  
    }

    static setNewPassword = async (req: Request, res: Response) => {
        try {
            // check old password
            const  user = req.user;
            const oldPassword = req.body.currentPassword;
            const newPassword = req.body.password;
            if (!user.checkPassword(oldPassword)) {
                throw new WrongOldPassword();
            }

            user.setPassword(newPassword);
            return ApiController.success({
                message: i18n.t('passwordSuccessfullyChanged')
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

    static saveUserStepForm = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        try {
            // work with user information
            putUserStepInformation(req, res, next);
            let userPersonalInformation = user.personalData;
            let reqUserData: any = UserHelper.getUserDataFromRequest(req.body.user);
            if (userPersonalInformation) {
                await userPersonalInformation.update(reqUserData);
            } else {
                // create user personal data
                reqUserData['userId'] = user.id;
                userPersonalInformation = await UserPersonalData.create(reqUserData);
            }

            // work with company details
            if (user.hasRole(Role.partnerAssistId) || user.hasRole(Role.partnerAuthorisedId)) {
                putPartnerStepInformation(req, res, next);

                let userCompany = await UserHelper.getUserPartner(user);
                let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req.body.company.company);

                if (user.hasRole(Role.partnerAssistId)) {
                    // assist doesn't have partner
                    if (userCompany == null) {
                        // create partner 
                        userCompany = await Partner.create(partnerData);
                        // working with authorised
                        let authoriserPerson: User = await AuthorisedUserHelper.createAuthorisedPerson(req.body.company.authorisedPerson, userCompany);
                        user.partnerId = userCompany.id;
                        await user.save();
                    } else {
                        // update user company information and update authorised data
                        await userCompany.update(partnerData);
                        let authorisedPerson = await PartnerHelper.getPartnerAuthorised(userCompany);
                        if (authorisedPerson) {
                            // update authorised person
                            let authorisedData: any = UserHelper.getUserDataFromRequest(req.body.company.authorisedPerson);
                            authorisedPerson.personalData.update(authorisedData);
                        } else {
                            let authoriserPerson: User = await AuthorisedUserHelper.createAuthorisedPerson(req.body.company.authorisedPerson, userCompany);
                        }
                    }
                } else {
                    // this is authorised
                    if (userCompany == null) {
                        throw new Error('Authorised person(id:'+user.id+') without company')
                    }
                    await userCompany.update(partnerData);
                }
                
                // working with company docs
                if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                    req.body.documents.forEach(async (element: any) => {
                        await DocumentHelper.transferDocumentFromTemp(element.id, element.title, userCompany);
                    });
                }

                userCompany.statusId = Partner.partnerStatusFilled;
                userCompany.save();
            }
            return ApiController.success({message: i18n.t('userDataSavedSuccessfully')}, res);
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

    static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const userEmail = req.body.email;
        try {
            let user = await User.findOne({
                where: {
                    email: userEmail
                }
            });
    
            if (user==null) {
                throw new UserNotfind();
            }

            let mail = new ResetPasswordMail(user);
            mail.send();

            return ApiController.success({
                message: i18n.t('userResetPasswordSuccess')
            }, res)

        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static repeatActivationLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const repeatHash = req.body.repeatHash;
            const secret: string = process.env.ACTIVATION_SECRET || '123fds';
            const userEmail = CryptoJS.AES.decrypt(repeatHash, secret).toString(CryptoJS.enc.Utf8);
    
            const user = await User.findOne({
                where: {
                    email: userEmail
                }
            })
    
            if (user == null) {
                throw new UserNotfind();
            }
    
            // sending activation mail again
            let mail = new ActivationLinkMail(user);
            mail.send();
    
            return ApiController.success({
                message: i18n.t('activationLinkSent')
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
export default UserController;