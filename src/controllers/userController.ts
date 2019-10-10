import { Request, Response, NextFunction } from "express";
import cryptoRandomString from "crypto-random-string";
import dateformat from "dateformat";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import i18n from "i18next";
import fs from "fs";
import ApiController from "./apiController";
import Config from "../services/config";
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
import putUserStepInformation from "../requests/user/putUserStepInformation";
import putPartnerStepInformation from "../requests/partner/putPartnerStepInformation";
import PartnerHelper from "../helpers/partnerHelper";
import Partner from "../models/partner";
import UserNotfind from "../exceptions/userNotFind";
import ResetPasswordMail from "../mails/resetPasswordMail";
import ActivationLinkMail from "../mails/activationLinkMail";
import AuthorisedUserHelper from "../helpers/authorisedUserHelper";
import DocumentHelper from "../helpers/documentHelper";
import WrongOldPassword from "../exceptions/user/wrongOldPassword";
import BlockedUserException from "../exceptions/blockedUserException";
import UserRepository from "../repositories/userRepository";
import DonorRepository from "../repositories/donorRepository";
import BadValidationException from "../exceptions/badValidationException";
import SetPasswordHashRepository from "../repositories/setPasswordHashRepository";
import UserSetPassword from "../events/userSetPassword";
import sequelize from "../services/sequelize";
import exceptionHandler from "../services/exceptionHandler";

class UserController {
    // get user Data about auth user
    static getMe = async (req: Request, res: Response) => {
        const user = req.user;
        let responseData: any = {
            id: user.id,
            email: user.email,
            showSeed: user.showSeed,
            showForm: user.showForm,
            createdAt: dateformat(user.createdAt, 'yy-mm-dd HH:MM'),
            roles: []
        }
        // working with rolles
        user.roles.forEach((role: Role) => {
            const key: string = user.id + responseData.createdAt;
            const roleHash: string = role.getEncriptedRole(key);
            responseData.roles.push(roleHash);
        });

        if (user.showSeed) {
            // get user seed phrase
            const seedPhrase = await user.getWalletPhrase();
            // generate txt file with seed
            fs.writeFile(__dirname + '/../../assets/users/files/' + user.passwordSalt + ".txt", seedPhrase, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
            });

            responseData.seed = {
                phrase: seedPhrase,
                link: Config.get("APP_PROTOCOL", "http://") + Config.get('APP_NAME', 'api.local.com') + '/file?id=' + user.id
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
        const transaction = await sequelize.transaction();
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
            }, {transaction: transaction});

            // add Responsible assistant role to user
            await UserRepository.addRole(user.id, Role.partnerAssistId, transaction);

            // create user personal data row
            await UserPersonalData.create({
                userId: user.id,
                firstNameEn: '',
                firstNameRu: '',
                lastNameEn: '',
                lastNameRu: '',
                occupationEn: '',
                occupationRu: '',
                tel: '',
                mobile: ''
            }, {transaction: transaction});

            transaction.commit();
            
            event(new UserRegistered(user, req.body.password));
            const responseData = {
                userId: user.id,
                message: i18n.t('successCreatedPartner')
            };
            return ApiController.success(responseData, res);
        } catch(error) {
            transaction.rollback();
            exceptionHandler(error, res);
        }
    }

    // activation user process
    static activationProcess = async (req: Request, res: Response) => {
        const hash = req.body.hash;
        const transaction = await sequelize.transaction();
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
            // get activation user
            const user = await User.findByPk(hashModel.userId) || false;
            if (!user) {
                throw new BadActivationLink();
            }
            if (today > hashModel.expiredAt) {
                const secret: string = Config.get("ACTIVATION_SECRET", '123fds');
                const hash: string = CryptoJS.AES.encrypt(user.email, secret).toString();
                return res.status(412).json({
                    success:false, 
                    error:{message:i18n.t('activationLinkExpired')}, 
                    data: {
                        repeatHash: hash
                    }
                });
            }
            // activation process
            user.emailVerifiedAt = new Date();
            await user.save({transaction: transaction});
            await hashModel.destroy({transaction: transaction});
            transaction.commit();

            const responseData = {
                message: i18n.t('successUserActivation')
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
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
                const secret: string = Config.get("ACTIVATION_SECRET", '123fds');
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
                Config.get('JWT_SECRET', 'jwt_default'),
                { expiresIn: '24h'});
            
            event(new UserLoggedIn(user));

            const responseData = {
                token: token,
                message: i18n.t('userSuccessfulAuth')
            };
            
            ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static changeShowSeedFlag = async (req: Request, res: Response) => {
        try {
            if (req.user.showSeed) {
                req.user.showSeed = false;
                await req.user.save();
            }
    
            const responseData = {
                message: i18n.t('successChangeShowFeedFlag')
            }
    
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static setUserPersonalData = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try {
            for (var key in req.user.personalData.dataValues) {
                if (req.body[key]) {
                    req.user.personalData[key] = req.body[key];
                }
            }
            if (req.user.hasRole(Role.donorId)) {
                if (req.body.companyEn && req.body.companyRu) {
                    const donorsCompany = {
                        companyEn: req.body.companyEn,
                        companyRu: req.body.companyRu
                    }
                    await DonorRepository.saveDonorCompany(req.user.id, donorsCompany, transaction);
                } else {
                    throw new BadValidationException(400,129, i18n.t('emptyDonorsCompanyField'), 'Bad donor company fields');
                }
            }
            await req.user.personalData.save({transaction: transaction});
            transaction.commit();
            return ApiController.success({message: i18n.t('successUpdatingUserData')}, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }

    static getUserById = async (req: Request, res: Response) => {
        const userId: number = req.query.id;
        try {
            const user = await UserRepository.findUserById(userId);
            if (user === null) {
                throw new UserNotfind();
            }
            let responseData: any = {
                email: user.email,
                firstNameEn: user.personalData.firstNameEn,
                firstNameRu: user.personalData.firstNameRu,
                lastNameEn: user.personalData.lastNameEn,
                lastNameRu: user.personalData.lastNameRu,
                occupationEn: user.personalData.occupationEn,
                occupationRu: user.personalData.occupationRu,
                status: user.status,
                roles: user.roles,
                isAdmin: user.isAdmin,
                tel: user.personalData.tel,
                mobile: user.personalData.mobile,
                id: user.id,
                lastLogin: dateformat(user.lastLogin, 'yy-mm-dd HH:MM'),
                createdAt: dateformat(user.createdAt, 'yy-mm-dd HH:MM')
            }

            const isUserAssist = UserHelper.isRole(user.roles, Role.partnerAssistId);
            const isUserAuthorised = UserHelper.isRole(user.roles, Role.partnerAuthorisedId);
            const isUserDonor = UserHelper.isRole(user.roles, Role.donorId);
            if (isUserAssist || isUserAuthorised) {
                const company = await UserHelper.getUserPartner(user);
                responseData['company'] = company ? company.id : null;

            } else if (isUserDonor) {
                const donorCompany = await DonorRepository.getCompanyData(user.id);
                if (donorCompany) {
                    responseData['companyEn'] = donorCompany.companyEn;
                    responseData['companyRu'] = donorCompany.companyRu;
                }
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static setUserPassword = async (req: Request, res: Response) => {
        const setPasswordHash: string = req.body.hash;
        const newUserPassword: string = req.body.password;
        const transaction = await sequelize.transaction();
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
            await user.setPassword(newUserPassword, transaction);
            user.emailVerifiedAt = new Date();
            await user.save({transaction: transaction});

            event(new UserSetPassword(user, newUserPassword));

            await hashModel.destroy({transaction: transaction});
            SetPasswordHashRepository.deleteHashesByUserId(user.id);
            transaction.commit();

            const responseData = {
                message: i18n.t('successUserPasswordSet')
            }
            
            return ApiController.success(responseData, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
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

            await user.setPassword(newPassword);
            return ApiController.success({
                message: i18n.t('passwordSuccessfullyChanged')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static saveUserStepForm = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        const transaction = await sequelize.transaction();
        try {
            // work with user information
            putUserStepInformation(req, res, next);
            let userPersonalInformation = user.personalData;
            let reqUserData: any = UserHelper.getUserDataFromRequest(req.body.user);
            if (userPersonalInformation) {
                await userPersonalInformation.update(reqUserData, {transaction: transaction});
            } else {
                // create user personal data
                reqUserData['userId'] = user.id;
                userPersonalInformation = await UserPersonalData.create(reqUserData, {transaction: transaction});
            }

            if (user.hasRole(Role.donorId)) {
                const donorCompany = {
                    companyEn: req.body.user.companyEn,
                    companyRu: req.body.user.companyRu
                }
                await DonorRepository.saveDonorCompany(user.id, donorCompany, transaction);
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
                        userCompany = await Partner.create(partnerData, {transaction: transaction});
                        // working with authorised
                        let authoriserPerson: User = await AuthorisedUserHelper.createAuthorisedPerson(req.body.company.authorisedPerson, userCompany, transaction);
                        user.partnerId = userCompany.id;
                        await user.save({transaction: transaction});
                    } else {
                        // update user company information and update authorised data
                        await userCompany.update(partnerData, {transaction: transaction});
                        let authorisedPerson = await PartnerHelper.getPartnerAuthorised(userCompany);
                        if (authorisedPerson) {
                            // update authorised person
                            let authorisedData: any = UserHelper.getUserDataFromRequest(req.body.company.authorisedPerson);
                            authorisedPerson.personalData.update(authorisedData, {transaction: transaction});
                        } else {
                            authorisedPerson = await AuthorisedUserHelper.createAuthorisedPerson(req.body.company.authorisedPerson, userCompany, transaction);
                        }
                    }
                } else {
                    // this is authorised
                    if (userCompany == null) {
                        throw new Error('Authorised person(id:'+user.id+') without company')
                    }
                    await userCompany.update(partnerData, {transaction: transaction});
                }
                
                // working with company docs
                if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                    req.body.documents.forEach(async (element: any) => {
                        await DocumentHelper.transferDocumentFromTemp(element.id, element.title, userCompany, transaction);
                    });
                }

                userCompany.statusId = Partner.partnerStatusFilled;
                await userCompany.save({transaction: transaction});
            }
            user.showForm = false;
            await user.save({transaction: transaction});
            transaction.commit();
            return ApiController.success({message: i18n.t('userDataSavedSuccessfully')}, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
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

            if (user.isBlocked) {
                throw new BlockedUserException();
            }

            let mail = new ResetPasswordMail(user);
            mail.send();

            return ApiController.success({
                message: i18n.t('userResetPasswordSuccess')
            }, res)

        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static repeatActivationLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const repeatHash = req.body.repeatHash;
            const secret: string = Config.get("ACTIVATION_SECRET", '123fds');
            const userEmail = CryptoJS.AES.decrypt(repeatHash, secret).toString(CryptoJS.enc.Utf8);
    
            const user = await User.findOne({
                where: {
                    email: userEmail
                }
            })
    
            if (user == null) {
                throw new UserNotfind();
            }
            if (user.isBlocked) {
                throw new BlockedUserException();
            }
    
            // sending activation mail again
            let mail = new ActivationLinkMail(user);
            mail.send();
    
            return ApiController.success({
                message: i18n.t('activationLinkSent')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default UserController;